import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DUTTYFY_URL = Deno.env.get("DUTTYFY_PIX_URL") || "";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!DUTTYFY_URL) {
      return new Response(
        JSON.stringify({ error: "DUTTYFY_PIX_URL not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { amount, customer, items, description, utm } = body;

    if (!amount || !customer?.name || !customer?.cpf) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: amount, customer.name, customer.cpf" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build payload for Duttyfy
    const pixPayload: Record<string, unknown> = {
      amount,
      paymentMethod: "PIX",
      customer: {
        name: customer.name,
        CPF: customer.cpf.replace(/\D/g, ""),
        email: customer.email || "",
        phone: customer.phone ? customer.phone.replace(/\D/g, "") : "",
      },
      item: description || "World Tennis - Pagamento PIX",
    };

    if (utm) pixPayload.utm = utm;

    // Call Duttyfy API
    const pixResponse = await fetch(DUTTYFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pixPayload),
    });

    const pixData = await pixResponse.json();

    if (!pixResponse.ok) {
      console.error("Duttyfy error:", JSON.stringify(pixData));
      return new Response(
        JSON.stringify({ error: "Failed to create PIX charge", details: pixData }),
        { status: pixResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract transaction ID from response
    const transactionId = pixData.transactionId || pixData._id?.$oid || pixData.id || "";
    const pixCode = pixData.pixCode || pixData.qrcode || pixData.pix_code || pixData.copiaECola || "";

    // Persist to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("pix_transactions").insert({
      transaction_id: transactionId,
      status: "PENDING",
      amount,
      customer_name: customer.name,
      customer_cpf: customer.cpf.replace(/\D/g, ""),
      customer_email: customer.email || null,
      customer_phone: customer.phone ? customer.phone.replace(/\D/g, "") : null,
      description: pixPayload.description,
      pix_code: pixCode,
    });

    return new Response(
      JSON.stringify({
        pixCode,
        transactionId,
        status: "PENDING",
        raw: pixData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
