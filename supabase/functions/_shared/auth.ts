
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const createAuthenticatedClient = (req: Request) => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );
};

export const getUserFromRequest = async (req: Request) => {
  const supabase = createAuthenticatedClient(req);
  
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  return { user, supabase };
};
