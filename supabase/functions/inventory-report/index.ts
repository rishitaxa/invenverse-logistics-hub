
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleCors } from "../_shared/cors.ts";
import { getUserFromRequest } from "../_shared/auth.ts";
import { createErrorResponse } from "../_shared/response.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { user, supabase } = await getUserFromRequest(req);

    // Generate comprehensive inventory report
    const [productsResult, zonesResult, ordersResult, shipmentsResult] = await Promise.all([
      supabase.from('products').select('*').eq('user_id', user.id),
      supabase.from('warehouse_zones').select('*').eq('user_id', user.id),
      supabase.from('orders').select('*').eq('user_id', user.id),
      supabase.from('shipments').select('*').eq('user_id', user.id)
    ]);

    const products = productsResult.data || [];
    const zones = zonesResult.data || [];
    const orders = ordersResult.data || [];
    const shipments = shipmentsResult.data || [];

    // Python-style data processing
    const reportData = {
      timestamp: new Date().toISOString(),
      user_id: user.id,
      products: products,
      zones: zones,
      orders: orders,
      shipments: shipments,
      summary: {
        total_products: products.length,
        total_value: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        categories: [...new Set(products.map(p => p.category))],
        zone_status: zones.map(z => ({
          zone: z.zone_id,
          utilization_percent: (z.utilization / z.capacity) * 100,
          status: z.status,
          available_space: z.capacity - z.utilization
        })),
        order_summary: {
          total_orders: orders.length,
          pending_orders: orders.filter(o => o.status === 'Processing').length,
          completed_orders: orders.filter(o => o.status === 'Completed').length
        },
        shipment_summary: {
          total_shipments: shipments.length,
          in_transit: shipments.filter(s => s.status === 'In Transit').length,
          delivered: shipments.filter(s => s.status === 'Delivered').length
        }
      }
    };

    // Enhanced Python-style report with comprehensive data
    const pythonStyleReport = `#!/usr/bin/env python3
"""
Inventory Management System Report
Generated: ${reportData.timestamp}
User: ${reportData.user_id}
"""

import json
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any

# ==========================================
# INVENTORY DATA EXPORT
# ==========================================

inventory_data = ${JSON.stringify(reportData, null, 2)}

# ==========================================
# ANALYTICS FUNCTIONS
# ==========================================

def analyze_inventory_summary():
    """Generate comprehensive inventory summary"""
    summary = inventory_data['summary']
    print("=== INVENTORY MANAGEMENT SYSTEM ===")
    print(f"Report Generated: {inventory_data['timestamp']}")
    print(f"User ID: {inventory_data['user_id']}")
    print("-" * 50)
    
    print("📦 PRODUCT OVERVIEW:")
    print(f"  Total Products: {summary['total_products']}")
    print(f"  Total Inventory Value: ${summary['total_value']:.2f}")
    print(f"  Unique Categories: {len(summary['categories'])}")
    print(f"  Categories: {', '.join(summary['categories'])}")
    print()

def analyze_warehouse_zones():
    """Analyze warehouse zone utilization"""
    zones = inventory_data['summary']['zone_status']
    print("🏭 WAREHOUSE ZONE ANALYSIS:")
    
    for zone in zones:
        utilization = zone['utilization_percent']
        status_emoji = "🔴" if utilization > 80 else "🟡" if utilization > 60 else "🟢"
        print(f"  {status_emoji} Zone {zone['zone']}: {utilization:.1f}% utilized - {zone['status']}")
        print(f"    Available Space: {zone['available_space']} units")
    
    avg_utilization = sum(zone['utilization_percent'] for zone in zones) / len(zones) if zones else 0
    print(f"  📊 Average Utilization: {avg_utilization:.1f}%")
    print()

def analyze_orders():
    """Analyze order status and trends"""
    order_summary = inventory_data['summary']['order_summary']
    print("📋 ORDER ANALYSIS:")
    print(f"  Total Orders: {order_summary['total_orders']}")
    print(f"  Pending Orders: {order_summary['pending_orders']}")
    print(f"  Completed Orders: {order_summary['completed_orders']}")
    
    if order_summary['total_orders'] > 0:
        completion_rate = (order_summary['completed_orders'] / order_summary['total_orders']) * 100
        print(f"  Completion Rate: {completion_rate:.1f}%")
    print()

def analyze_shipments():
    """Analyze shipment status and logistics"""
    shipment_summary = inventory_data['summary']['shipment_summary']
    print("🚛 SHIPMENT ANALYSIS:")
    print(f"  Total Shipments: {shipment_summary['total_shipments']}")
    print(f"  In Transit: {shipment_summary['in_transit']}")
    print(f"  Delivered: {shipment_summary['delivered']}")
    print()

def check_low_stock_alerts():
    """Check for low stock items and generate alerts"""
    products = inventory_data['products']
    low_stock = [p for p in products if p['quantity'] < 10]
    
    print("⚠️  LOW STOCK ALERTS:")
    if low_stock:
        print(f"  {len(low_stock)} items below 10 units:")
        for item in low_stock:
            print(f"    - {item['name']} ({item['category']}): {item['quantity']} units")
            print(f"      Location: {item['location']}, Zone: {item.get('zone_id', 'N/A')}")
    else:
        print("  ✅ No low stock items")
    print()

def generate_zone_recommendations():
    """Generate recommendations for zone optimization"""
    zones = inventory_data['summary']['zone_status']
    print("💡 ZONE OPTIMIZATION RECOMMENDATIONS:")
    
    for zone in zones:
        utilization = zone['utilization_percent']
        if utilization > 90:
            print(f"  🔴 Zone {zone['zone']}: CRITICAL - Consider expanding capacity")
        elif utilization > 80:
            print(f"  🟡 Zone {zone['zone']}: HIGH - Monitor closely, plan for expansion")
        elif utilization < 30:
            print(f"  🔵 Zone {zone['zone']}: UNDERUTILIZED - Consider consolidation")
        else:
            print(f"  🟢 Zone {zone['zone']}: OPTIMAL - Well balanced")
    print()

def export_to_csv():
    """Export data to CSV format for further analysis"""
    print("📊 DATA EXPORT RECOMMENDATIONS:")
    print("  Use pandas to export data:")
    print("  - pd.DataFrame(inventory_data['products']).to_csv('products.csv')")
    print("  - pd.DataFrame(inventory_data['orders']).to_csv('orders.csv')")
    print("  - pd.DataFrame(inventory_data['shipments']).to_csv('shipments.csv')")
    print()

# ==========================================
# MAIN EXECUTION
# ==========================================

if __name__ == "__main__":
    try:
        analyze_inventory_summary()
        analyze_warehouse_zones()
        analyze_orders()
        analyze_shipments()
        check_low_stock_alerts()
        generate_zone_recommendations()
        export_to_csv()
        
        print("=" * 50)
        print("✅ Report generated successfully!")
        print(f"📅 Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
    except Exception as e:
        print(f"❌ Error generating report: {e}")
        
# ==========================================
# END OF REPORT
# ==========================================
`;

    return new Response(
      pythonStyleReport,
      { 
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename="inventory_management_report.py"'
        } 
      }
    );

  } catch (error) {
    return createErrorResponse(error.message, error.message === 'Unauthorized' ? 401 : 500);
  }
});
