
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
    const orderId = url.searchParams.get('id');

    switch (method) {
      case 'GET':
        if (orderId) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          return createResponse(data);
        } else {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return createResponse(data);
        }

      case 'POST':
        const newOrder = await req.json();
        
        if (!newOrder.customer_name) {
          return createErrorResponse('Customer name is required', 400);
        }

        const orderNumber = `ORD-${Date.now()}`;
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([{
            user_id: user.id,
            order_number: orderNumber,
            ...newOrder
          }])
          .select()
          .single();

        if (orderError) throw orderError;
        return createResponse(order, 201);

      case 'PUT':
        if (!orderId) {
          return createErrorResponse('Order ID required', 400);
        }

        const updates = await req.json();
        const { data: updatedOrder, error: updateError } = await supabase
          .from('orders')
          .update(updates)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return createResponse(updatedOrder);

      case 'DELETE':
        if (!orderId) {
          return createErrorResponse('Order ID required', 400);
        }

        const { error: deleteError } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
        return createResponse({ message: 'Order deleted successfully' });

      default:
        return createErrorResponse('Method not allowed', 405);
    }

  } catch (error) {
    return createErrorResponse(error.message, error.message === 'Unauthorized' ? 401 : 500);
  }
});
