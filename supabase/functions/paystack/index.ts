import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET) {
      throw new Error("PAYSTACK_SECRET_KEY not configured");
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Initialize a transaction
    if (req.method === "POST" && action === "initialize") {
      const { email, amount, metadata, callback_url } = await req.json();

      if (!email || !amount) {
        return new Response(
          JSON.stringify({ error: "email and amount are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100), // Paystack expects kobo
          currency: "NGN",
          callback_url,
          metadata,
        }),
      });

      const data = await paystackRes.json();

      if (!data.status) {
        return new Response(
          JSON.stringify({ error: data.message || "Paystack initialization failed" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify a transaction
    if (req.method === "POST" && action === "verify") {
      const { reference } = await req.json();

      if (!reference) {
        return new Response(
          JSON.stringify({ error: "reference is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const paystackRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
          },
        }
      );

      const data = await paystackRes.json();

      // If payment is successful, update the order status
      if (data.status && data.data?.status === "success") {
        const orderId = data.data?.metadata?.order_id;
        if (orderId) {
          const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
          const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
          const supabase = createClient(supabaseUrl, supabaseKey);

          await supabase
            .from("orders")
            .update({ status: "confirmed" })
            .eq("id", orderId);
        }
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use ?action=initialize or ?action=verify" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
