
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get user from JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Fetch user's inventory analytics
    const { data: products } = await supabaseClient
      .from('products')
      .select('*')
      .eq('user_id', user.id)

    const { data: zones } = await supabaseClient
      .from('warehouse_zones')
      .select('*')
      .eq('user_id', user.id)

    // Calculate analytics
    const totalProducts = products?.length || 0
    const totalValue = products?.reduce((sum, product) => sum + (product.price * product.quantity), 0) || 0
    const lowStockItems = products?.filter(product => product.quantity < 10).length || 0
    
    const zoneUtilization = zones?.map(zone => ({
      zone_id: zone.zone_id,
      utilization: zone.utilization,
      capacity: zone.capacity,
      percentage: (zone.utilization / zone.capacity) * 100
    })) || []

    const analytics = {
      totalProducts,
      totalValue,
      lowStockItems,
      zoneUtilization,
      averageUtilization: zoneUtilization.reduce((sum, zone) => sum + zone.percentage, 0) / zoneUtilization.length || 0
    }

    return new Response(
      JSON.stringify(analytics),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
