
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
    const shipmentId = url.searchParams.get('id');

    switch (method) {
      case 'GET':
        if (shipmentId) {
          const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('id', shipmentId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          return createResponse(data);
        } else {
          const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return createResponse(data);
        }

      case 'POST':
        const newShipment = await req.json();
        
        if (!newShipment.type) {
          return createErrorResponse('Shipment type is required', 400);
        }

        const shipmentNumber = `SHIP-${Date.now()}`;
        const { data: shipment, error: shipmentError } = await supabase
          .from('shipments')
          .insert([{
            user_id: user.id,
            shipment_number: shipmentNumber,
            ...newShipment
          }])
          .select()
          .single();

        if (shipmentError) throw shipmentError;
        return createResponse(shipment, 201);

      case 'PUT':
        if (!shipmentId) {
          return createErrorResponse('Shipment ID required', 400);
        }

        const updates = await req.json();
        const { data: updatedShipment, error: updateError } = await supabase
          .from('shipments')
          .update(updates)
          .eq('id', shipmentId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return createResponse(updatedShipment);

      case 'DELETE':
        if (!shipmentId) {
          return createErrorResponse('Shipment ID required', 400);
        }

        const { error: deleteError } = await supabase
          .from('shipments')
          .delete()
          .eq('id', shipmentId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        return createResponse({ message: 'Shipment deleted successfully' });

      default:
        return createErrorResponse('Method not allowed', 405);
    }

  } catch (error) {
    return createErrorResponse(error.message, error.message === 'Unauthorized' ? 401 : 500);
  }
});
