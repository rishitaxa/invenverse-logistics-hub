
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { handleCors } from "../_shared/cors.ts";
import { getUserFromRequest } from "../_shared/auth.ts";
import { createResponse, createErrorResponse } from "../_shared/response.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { user, supabase } = await getUserFromRequest(req);
    const method = req.method;
    const url = new URL(req.url);
    const zoneId = url.searchParams.get('id');

    switch (method) {
      case 'GET':
        if (zoneId) {
          // Get single zone
          const { data, error } = await supabase
            .from('warehouse_zones')
            .select('*')
            .eq('id', zoneId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          return createResponse(data);
        } else {
          // Get all zones
          const { data, error } = await supabase
            .from('warehouse_zones')
            .select('*')
            .eq('user_id', user.id)
            .order('zone_id');

          if (error) throw error;
          return createResponse(data);
        }

      case 'POST':
        const newZone = await req.json();
        
        if (!newZone.zone_id || !newZone.capacity) {
          return createErrorResponse('Missing required fields', 400);
        }

        const { data: zone, error: zoneError } = await supabase
          .from('warehouse_zones')
          .insert([{
            user_id: user.id,
            zone_id: newZone.zone_id,
            capacity: newZone.capacity,
            utilization: 0,
            status: 'Optimal'
          }])
          .select()
          .single();

        if (zoneError) throw zoneError;
        return createResponse(zone, 201);

      case 'PUT':
        if (!zoneId) {
          return createErrorResponse('Zone ID required', 400);
        }

        const updates = await req.json();
        const { data: updatedZone, error: updateError } = await supabase
          .from('warehouse_zones')
          .update(updates)
          .eq('id', zoneId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return createResponse(updatedZone);

      case 'DELETE':
        if (!zoneId) {
          return createErrorResponse('Zone ID required', 400);
        }

        // Check if zone has products
        const { data: products } = await supabase
          .from('products')
          .select('id')
          .eq('zone_id', zoneId)
          .eq('user_id', user.id);

        if (products && products.length > 0) {
          return createErrorResponse('Cannot delete zone with products', 400);
        }

        const { error: deleteError } = await supabase
          .from('warehouse_zones')
          .delete()
          .eq('id', zoneId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        return createResponse({ message: 'Zone deleted successfully' });

      default:
        return createErrorResponse('Method not allowed', 405);
    }

  } catch (error) {
    return createErrorResponse(error.message, error.message === 'Unauthorized' ? 401 : 500);
  }
});
