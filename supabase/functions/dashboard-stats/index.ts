
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleCors } from "../_shared/cors.ts";
import { getUserFromRequest } from "../_shared/auth.ts";
import { createResponse, createErrorResponse } from "../_shared/response.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { user, supabase } = await getUserFromRequest(req);

    // Get quick dashboard statistics
    const [productsCount, ordersCount, shipmentsCount, zonesData] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('orders').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('shipments').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('warehouse_zones').select('utilization, capacity').eq('user_id', user.id)
    ]);

    const totalZoneCapacity = zonesData.data?.reduce((sum, zone) => sum + zone.capacity, 0) || 0;
    const totalZoneUtilization = zonesData.data?.reduce((sum, zone) => sum + zone.utilization, 0) || 0;
    const overallUtilization = totalZoneCapacity > 0 ? (totalZoneUtilization / totalZoneCapacity) * 100 : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentProducts, recentOrders, recentShipments] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('orders').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', sevenDaysAgo.toISOString()),
      supabase.from('shipments').select('id', { count: 'exact' }).eq('user_id', user.id).gte('created_at', sevenDaysAgo.toISOString())
    ]);

    const stats = {
      totals: {
        products: productsCount.count || 0,
        orders: ordersCount.count || 0,
        shipments: shipmentsCount.count || 0,
        zones: zonesData.data?.length || 0
      },
      utilization: {
        overall: overallUtilization,
        totalCapacity: totalZoneCapacity,
        totalUsed: totalZoneUtilization
      },
      recentActivity: {
        newProducts: recentProducts.count || 0,
        newOrders: recentOrders.count || 0,
        newShipments: recentShipments.count || 0
      },
      timestamp: new Date().toISOString()
    };

    return createResponse(stats);

  } catch (error) {
    return createErrorResponse(error.message, error.message === 'Unauthorized' ? 401 : 500);
  }
});
