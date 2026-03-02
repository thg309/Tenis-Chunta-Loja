import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Respond 200 fast — process async
  try {
    const body = await req.json();

    // Extract transaction ID: transactionId || _id.$oid
    const transactionId = body.transactionId || body._id?.$oid || "";
    const status = body.status || "";

    console.log(`Webhook received: txId=${transactionId}, status=${status}`);

    if (!transactionId) {
      // Still respond 200 to avoid retries
      return new Response(
        JSON.stringify({ ok: true, message: "No transactionId found, ignoring" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (status === "COMPLETED") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Idempotency: check if already processed
      const { data: existing } = await supabase
        .from("pix_transactions")
        .select("id, paid")
        .eq("transaction_id", transactionId)
        .single();

      if (existing && !existing.paid) {
        // Mark as paid
        await supabase
          .from("pix_transactions")
          .update({
            status: "COMPLETED",
            paid: true,
            processed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("transaction_id", transactionId);

        console.log(`Transaction ${transactionId} marked as COMPLETED`);
      } else if (existing?.paid) {
        console.log(`Transaction ${transactionId} already processed, skipping`);
      } else {
        // Transaction not found in DB — create it
        await supabase.from("pix_transactions").insert({
          transaction_id: transactionId,
          status: "COMPLETED",
          amount: body.amount || 0,
          paid: true,
          processed_at: new Date().toISOString(),
        });
        console.log(`Transaction ${transactionId} created as COMPLETED (webhook-first)`);
      }
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    // Always respond 200 to prevent retries
    return new Response(
      JSON.stringify({ ok: true, error: "processed with error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
