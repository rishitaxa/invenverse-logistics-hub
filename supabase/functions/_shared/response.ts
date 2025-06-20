
import { corsHeaders } from './cors.ts';

export const createResponse = (data: any, status = 200) => {
  return new Response(
    JSON.stringify(data),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  );
};

export const createErrorResponse = (message: string, status = 500) => {
  console.error('API Error:', message);
  return createResponse({ error: message }, status);
};
