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
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("transactionId");

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: "Missing transactionId parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // First check local DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: localTx } = await supabase
      .from("pix_transactions")
      .select("status, paid, processed_at")
      .eq("transaction_id", transactionId)
      .single();

    // If already confirmed locally via webhook, return immediately
    if (localTx?.status === "COMPLETED" && localTx?.paid) {
      return new Response(
        JSON.stringify({
          status: "COMPLETED",
          paid: true,
          processedAt: localTx.processed_at,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: poll Duttyfy GET endpoint
    if (!DUTTYFY_URL) {
      return new Response(
        JSON.stringify({
          status: localTx?.status || "PENDING",
          paid: localTx?.paid || false,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const statusUrl = `${DUTTYFY_URL}?transactionId=${encodeURIComponent(transactionId)}`;
    const statusResponse = await fetch(statusUrl, { method: "GET" });
    const statusData = await statusResponse.json();

    const remoteStatus = statusData.status || "PENDING";
    const paidAt = statusData.paidAt || null;

    // If Duttyfy says COMPLETED, update local DB (idempotent)
    if (remoteStatus === "COMPLETED" && localTx && !localTx.paid) {
      await supabase
        .from("pix_transactions")
        .update({
          status: "COMPLETED",
          paid: true,
          processed_at: paidAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("transaction_id", transactionId);
    }

    return new Response(
      JSON.stringify({
        status: remoteStatus,
        paid: remoteStatus === "COMPLETED",
        paidAt: paidAt || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Status check error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
