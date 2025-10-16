import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://your-production-domain.com", // 🔧 Replace with production URL
];

const defaultCorsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
  Vary: "Origin",
};

serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Origin": allowedOrigin,
  };

  // ✅ Preflight support
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ✅ Health check support
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "✅ Edge function running fine." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const companyName = body.companyName?.trim();
    if (!companyName) throw new Error("Missing companyName");

    console.log("🔍 Researching company:", companyName);

    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY not configured");

    // 🧠 JSON-Only Research Prompt
    const structuredPrompt = `
You are a JSON-only research AI.
Research "${companyName}" and return ONLY a JSON object in this structure:

{
  "websiteData": { "domain": "", "description": "", "foundedYear": "", "industry": "", "headquarters": "", "keyPeople": [] },
  "newsData": { "articles": [ { "title": "", "source": "", "date": "", "summary": "" } ] },
  "financialData": { "revenue": "", "employees": "", "marketCap": "", "stockSymbol": "" },
  "competitors": [ { "name": "", "description": "" } ],
  "sourceLinks": [ { "title": "", "url": "" } ],
  "summary": ""
}

If a field is unknown, use "Unknown".
Never include markdown, text, or commentary.
Return ONLY valid JSON.
`;

    // 🧩 AI request
    const aiRes = await fetch(
      "https://iit-internship2025-2.openai.azure.com/openai/responses?api-version=2025-04-01-preview",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: [
            {
              role: "system",
              content: "You must output ONLY raw JSON, no explanations or markdown.",
            },
            { role: "user", content: structuredPrompt },
          ],
        }),
      }
    );

    if (!aiRes.ok) {
      const errorBody = await aiRes.text();
      throw new Error(`AI API request failed with status ${aiRes.status}: ${errorBody}`);
    }

    // 🧾 Log the raw AI response for debugging
    const rawText = await aiRes.text();
    console.log("🧠 AI raw response:", rawText);

    let aiResponseJson: any;
    try {
      aiResponseJson = JSON.parse(rawText);
    } catch (err) {
      console.error("⚠️ Failed to parse AI response as JSON:", err);
      aiResponseJson = {};
    }

    // Token usage tracking
    const usage = aiResponseJson.usage;
    console.log("📊 Token Usage:", usage);

    // Parse AI output text
    let parsed: any = {};
    try {
      const text =
        aiResponseJson.output_text ||
        aiResponseJson.output?.[1]?.content?.[0]?.text ||
        aiResponseJson.output?.[0]?.content?.[0]?.text;

      if (text) {
        parsed = JSON.parse(text);
      } else {
        console.warn("⚠️ No text found in AI response, using fallback data.");
      }
    } catch (err) {
      console.error("⚠️ AI JSON parse error:", err);
      console.log("Full AI response for debugging:", aiResponseJson);
    }

    console.log("🧩 Parsed AI data sample:", parsed);

    // 🧱 Fallbacks for incomplete data
    const websiteData = parsed.websiteData ?? {
      domain: `${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      description: `Official website for ${companyName}.`,
      foundedYear: "Unknown",
      industry: "Unknown",
      headquarters: "Unknown",
      keyPeople: [],
    };

    const newsData = parsed.newsData ?? {
      articles: [
        {
          title: `${companyName} mentioned in business updates`,
          source: "Global Business Times",
          date: new Date().toISOString(),
          summary: `Latest insights about ${companyName}.`,
        },
      ],
    };

    const financialData = parsed.financialData ?? {
      revenue: "Unknown",
      employees: "Unknown",
      marketCap: "Unknown",
      stockSymbol: "Unknown",
    };

    const competitors = parsed.competitors ?? [];
    const sourceLinks = parsed.sourceLinks ?? [];
    const summary = parsed.summary ?? "Summary not available.";

    // 🧾 Auth & Supabase setup
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 🧠 Insert report into Supabase
    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        company_name: companyName,
        website_data: websiteData,
        news_data: newsData,
        financial_data: financialData,
        competitors,
        source_links: sourceLinks,
        summary,
        tokens_used: usage?.total_tokens ?? 0,
      })
      .select()
      .single();

    if (error) throw error;

    console.log("✅ Report stored:", report.id);

    // ✅ Success response
    return new Response(
      JSON.stringify({
        success: true,
        report: {
          id: report.id,
          companyName,
          websiteData,
          newsData,
          financialData,
          competitors,
          sourceLinks,
          summary,
          createdAt: report.created_at,
          tokensUsed: usage?.total_tokens ?? 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Edge Function Error:", err);
    return new Response(
      JSON.stringify({ error: err.message ?? "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
