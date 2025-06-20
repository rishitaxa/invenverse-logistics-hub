
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate Python-style inventory report
    const { data: products } = await supabaseClient
      .from('products')
      .select('*')
      .eq('user_id', user.id)

    const { data: zones } = await supabaseClient
      .from('warehouse_zones')
      .select('*')
      .eq('user_id', user.id)

    // Python-like data processing
    const reportData = {
      timestamp: new Date().toISOString(),
      user_id: user.id,
      products: products || [],
      zones: zones || [],
      summary: {
        total_products: products?.length || 0,
        total_value: products?.reduce((sum, p) => sum + (p.price * p.quantity), 0) || 0,
        categories: [...new Set(products?.map(p => p.category) || [])],
        zone_status: zones?.map(z => ({
          zone: z.zone_id,
          utilization_percent: (z.utilization / z.capacity) * 100,
          status: z.status
        })) || []
      }
    }

    // Python-style output format
    const pythonStyleReport = `
# Inventory Management Report
# Generated: ${reportData.timestamp}
# User: ${reportData.user_id}

import json
from datetime import datetime

# Inventory Data
inventory_data = ${JSON.stringify(reportData, null, 2)}

# Summary Statistics
total_products = ${reportData.summary.total_products}
total_inventory_value = ${reportData.summary.total_value}
unique_categories = ${reportData.summary.categories.length}

# Zone Analysis
def analyze_zones():
    zones = inventory_data['zones']
    for zone in zones:
        utilization = (zone['utilization'] / zone['capacity']) * 100
        print(f"Zone {zone['zone_id']}: {utilization:.1f}% utilized - {zone['status']}")

# Low Stock Alert
def check_low_stock():
    products = inventory_data['products']
    low_stock = [p for p in products if p['quantity'] < 10]
    return low_stock

if __name__ == "__main__":
    print("=== INVENTORY MANAGEMENT SYSTEM ===")
    print(f"Total Products: {total_products}")
    print(f"Total Value: ${total_inventory_value:.2f}")
    print(f"Categories: {unique_categories}")
    print("\\nZone Analysis:")
    analyze_zones()
    
    low_stock = check_low_stock()
    if low_stock:
        print(f"\\nLOW STOCK ALERT: {len(low_stock)} items below 10 units")
`

    return new Response(
      pythonStyleReport,
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename="inventory_report.py"'
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
