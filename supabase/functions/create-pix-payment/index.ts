import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PixRequestBody {
  amount: number; // in cents
  customer: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    colorName: string;
    size: number;
    quantity: number;
    unitPrice: number; // in reais
  }[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FASTSOFT_API_TOKEN = Deno.env.get("FASTSOFT_API_TOKEN");

    if (!FASTSOFT_API_TOKEN) {
      console.error("FASTSOFT_API_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Credenciais de pagamento não configuradas" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PixRequestBody = await req.json();
    const { amount, customer, address, items } = body;

    if (!amount || !customer?.name || !customer?.cpf || !customer?.email) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: amount, customer.name, customer.cpf, customer.email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build Basic Auth header: base64("x:SECRET_KEY")
    const basicAuth = btoa(`x:${FASTSOFT_API_TOKEN}`);

    // Build request body per FastSoft API docs
    const transactionBody = {
      amount,
      currency: "BRL",
      paymentMethod: "PIX",
      pix: {
        expiresInDays: 1,
      },
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: {
          number: customer.cpf,
          type: "CPF",
        },
        address: {
          street: address.street,
          streetNumber: address.number,
          complement: address.complement || "",
          zipCode: address.zipCode,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          country: "BR",
        },
      },
      shipping: {
        fee: 0,
        address: {
          street: address.street,
          streetNumber: address.number,
          complement: address.complement || "",
          zipCode: address.zipCode,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          country: "BR",
        },
      },
      items: items.map((item) => ({
        title: `Carbon Marathon Chunta - ${item.colorName} Tam.${item.size}`,
        unitPrice: Math.round(item.unitPrice * 100),
        quantity: item.quantity,
        tangible: true,
      })),
    };

    console.log("Creating FastSoft PIX transaction:", JSON.stringify(transactionBody));

    const response = await fetch("https://api.fastsoftbrasil.com/api/user/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(transactionBody),
    });

    const responseText = await response.text();
    console.log("FastSoft response status:", response.status);
    console.log("FastSoft response body:", responseText);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Erro ao criar cobrança PIX", details: responseText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = JSON.parse(responseText);
    const txData = data.data || data;

    return new Response(
      JSON.stringify({
        qrcode: txData.pix?.qrcode || null,
        url: txData.pix?.url || null,
        expirationDate: txData.pix?.expirationDate || null,
        amount: txData.amount,
        transactionId: txData.id || "",
        status: txData.status,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
