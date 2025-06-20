
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
    const productId = url.searchParams.get('id');

    switch (method) {
      case 'GET':
        if (productId) {
          // Get single product
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;
          return createResponse(data);
        } else {
          // Get all products
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return createResponse(data);
        }

      case 'POST':
        const newProduct = await req.json();
        
        // Validate required fields
        if (!newProduct.name || !newProduct.category || !newProduct.location || !newProduct.zone_id) {
          return createErrorResponse('Missing required fields', 400);
        }

        // Check zone capacity
        const { data: zone } = await supabase
          .from('warehouse_zones')
          .select('*')
          .eq('zone_id', newProduct.zone_id)
          .eq('user_id', user.id)
          .single();

        if (!zone) {
          return createErrorResponse('Invalid zone', 400);
        }

        const availableSpace = zone.capacity - zone.utilization;
        if (newProduct.quantity > availableSpace) {
          return createErrorResponse(`Not enough space in Zone ${newProduct.zone_id}. Available: ${availableSpace}`, 400);
        }

        // Insert product
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert([{
            user_id: user.id,
            ...newProduct
          }])
          .select()
          .single();

        if (productError) throw productError;

        // Update zone utilization
        const newUtilization = zone.utilization + newProduct.quantity;
        await supabase
          .from('warehouse_zones')
          .update({ 
            utilization: newUtilization,
            status: newUtilization > zone.capacity * 0.8 ? 'High' : 'Optimal'
          })
          .eq('id', zone.id);

        return createResponse(product, 201);

      case 'PUT':
        if (!productId) {
          return createErrorResponse('Product ID required', 400);
        }

        const updates = await req.json();
        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', productId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return createResponse(updatedProduct);

      case 'DELETE':
        if (!productId) {
          return createErrorResponse('Product ID required', 400);
        }

        // Get product details before deletion
        const { data: productToDelete } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('user_id', user.id)
          .single();

        if (!productToDelete) {
          return createErrorResponse('Product not found', 404);
        }

        // Delete product
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        // Update zone utilization if product was in a zone
        if (productToDelete.zone_id) {
          const { data: zone } = await supabase
            .from('warehouse_zones')
            .select('*')
            .eq('zone_id', productToDelete.zone_id)
            .eq('user_id', user.id)
            .single();

          if (zone) {
            const newUtilization = Math.max(0, zone.utilization - productToDelete.quantity);
            await supabase
              .from('warehouse_zones')
              .update({ 
                utilization: newUtilization,
                status: newUtilization > zone.capacity * 0.8 ? 'High' : 'Optimal'
              })
              .eq('id', zone.id);
          }
        }

        return createResponse({ message: 'Product deleted successfully' });

      default:
        return createErrorResponse('Method not allowed', 405);
    }

  } catch (error) {
    return createErrorResponse(error.message, error.message === 'Unauthorized' ? 401 : 500);
  }
});
