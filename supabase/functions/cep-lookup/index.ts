import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const cep = url.searchParams.get("cep")?.replace(/\D/g, "");

    if (!cep || cep.length !== 8) {
      return new Response(JSON.stringify({ error: "CEP inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use brasilapi which allows server-side requests
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ erro: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map to same format as viacep for compatibility
    return new Response(JSON.stringify({
      cep: data.cep,
      logradouro: data.street || "",
      bairro: data.neighborhood || "",
      localidade: data.city || "",
      uf: data.state || "",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CEP lookup error:", error);
    return new Response(JSON.stringify({ error: "Erro ao consultar CEP" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
