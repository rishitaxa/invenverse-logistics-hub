
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleCors } from "../_shared/cors.ts";
import { getUserFromRequest } from "../_shared/auth.ts";
import { createResponse, createErrorResponse } from "../_shared/response.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { user, supabase } = await getUserFromRequest(req);

    // Fetch comprehensive analytics data
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

    // Calculate comprehensive analytics
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockItems = products.filter(product => product.quantity < 10).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Processing').length;
    const totalShipments = shipments.length;
    const inTransitShipments = shipments.filter(ship => ship.status === 'In Transit').length;
    
    const zoneUtilization = zones.map(zone => ({
      zone_id: zone.zone_id,
      utilization: zone.utilization,
      capacity: zone.capacity,
      percentage: (zone.utilization / zone.capacity) * 100,
      status: zone.status
    }));

    const averageUtilization = zoneUtilization.length > 0 
      ? zoneUtilization.reduce((sum, zone) => sum + zone.percentage, 0) / zoneUtilization.length 
      : 0;

    // Category analysis
    const categoryAnalysis = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.quantity;
      return acc;
    }, {} as Record<string, number>);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentProducts = products.filter(p => new Date(p.created_at) > sixMonthsAgo);
    const recentOrders = orders.filter(o => new Date(o.created_at) > sixMonthsAgo);

    const analytics = {
      overview: {
        totalProducts,
        totalValue,
        lowStockItems,
        totalOrders,
        pendingOrders,
        totalShipments,
        inTransitShipments
      },
      zones: {
        zoneUtilization,
        averageUtilization,
        totalZones: zones.length,
        highUtilizationZones: zoneUtilization.filter(z => z.percentage > 80).length
      },
      categories: categoryAnalysis,
      trends: {
        newProductsLast6Months: recentProducts.length,
        newOrdersLast6Months: recentOrders.length,
        growthRate: recentProducts.length / Math.max(totalProducts - recentProducts.length, 1)
      },
      alerts: {
        lowStock: products.filter(p => p.quantity < 10),
        overutilizedZones: zoneUtilization.filter(z => z.percentage > 90),
        pendingOrders: orders.filter(o => o.status === 'Processing')
      }
    };

    return createResponse(analytics);

  } catch (error) {
    return createErrorResponse(error.message, error.message === 'Unauthorized' ? 401 : 500);
  }
});
