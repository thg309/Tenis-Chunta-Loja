import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PixRequestBody {
  amount: number; // in cents
  customer: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
  items: {
    colorName: string;
    size: number;
    quantity: number;
    unitPrice: number;
  }[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FASTSOFT_CLIENT_ID = Deno.env.get("FASTSOFT_CLIENT_ID");
    const FASTSOFT_CLIENT_SECRET = Deno.env.get("FASTSOFT_CLIENT_SECRET");

    if (!FASTSOFT_CLIENT_ID || !FASTSOFT_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ error: "FastSoft credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PixRequestBody = await req.json();
    const { amount, customer, items } = body;

    if (!amount || !customer?.name || !customer?.cpf) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: amount, customer.name, customer.cpf" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Authenticate with FastSoft API
    const authResponse = await fetch("https://api.fastsoft.com.br/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: FASTSOFT_CLIENT_ID,
        client_secret: FASTSOFT_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!authResponse.ok) {
      const authError = await authResponse.text();
      console.error("FastSoft auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to authenticate with payment provider" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Create PIX charge
    const description = items
      .map((i) => `${i.quantity}x ${i.colorName} Tam.${i.size}`)
      .join(", ");

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    const pixResponse = await fetch("https://api.fastsoft.com.br/pix/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount,
        description: `World Tennis - ${description}`,
        customer: {
          name: customer.name,
          cpf: customer.cpf.replace(/\D/g, ""),
          email: customer.email,
          phone: customer.phone.replace(/\D/g, ""),
        },
        expiration_date: expirationDate.toISOString(),
      }),
    });

    if (!pixResponse.ok) {
      const pixError = await pixResponse.text();
      console.error("FastSoft PIX error:", pixError);
      return new Response(
        JSON.stringify({ error: "Failed to create PIX charge" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pixData = await pixResponse.json();

    return new Response(
      JSON.stringify({
        qrcode: pixData.qrcode || null,
        url: pixData.url || pixData.pix_url || null,
        expirationDate: expirationDate.toISOString(),
        amount,
        transactionId: pixData.transaction_id || pixData.id || "",
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
