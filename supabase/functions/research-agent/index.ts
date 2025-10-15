import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://your-production-domain.com", // update this when you deploy
];

const defaultCorsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
  "Vary": "Origin",
};

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : "http://localhost:5173";
  const corsHeaders = {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Origin": allowedOrigin,
  };

  // ✅ Respond early to preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const { companyName } = await req.json();
    console.log("Generating research for:", companyName);

      const AI_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!AI_API_KEY) throw new Error("AI_API_KEY not configured");

    // Fake web + news data
    const websiteData = {
      domain: `${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      description: `Official website and company information for ${companyName}`,
      foundedYear: "2020",
      industry: "Technology",
    };

    const newsData = {
      articles: [
        {
          title: `${companyName} Announces Major Expansion`,
          source: "Tech News Daily",
          date: new Date().toISOString(),
          summary: `${companyName} reveals plans for significant growth in the coming quarter.`,
        },
        {
          title: `Industry Leaders React to ${companyName}'s Latest Innovation`,
          source: "Business Insider",
          date: new Date(Date.now() - 86400000).toISOString(),
          summary: `${companyName} continues to push boundaries in their sector.`,
        },
      ],
    };

    // ✅ AI summary
    const summaryPrompt = `You are a professional research analyst. Create a comprehensive executive summary for ${companyName} based on the following information:

Website Data: ${JSON.stringify(websiteData, null, 2)}
Recent News: ${JSON.stringify(newsData, null, 2)}

Provide a well-structured summary covering:
1. Company Overview
2. Recent Developments
3. Industry Position
4. Key Insights`;

      const aiResponse = await fetch(
        "https://iit-internship2025-2.openai.azure.com/openai/responses?api-version=2025-04-01-preview",
      {
        method: "POST",
        headers: {
            Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are a professional research analyst creating executive summaries for companies.",
            },
            { role: "user", content: summaryPrompt },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      const text = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, text);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices?.[0]?.message?.content ?? "No summary generated";

    // ✅ Supabase auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        company_name: companyName,
        website_data: websiteData,
        news_data: newsData,
        summary,
      })
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Report created successfully:", report.id);

    return new Response(
      JSON.stringify({
        success: true,
        report: {
          id: report.id,
          companyName,
          websiteData,
          newsData,
          summary,
          createdAt: report.created_at,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
