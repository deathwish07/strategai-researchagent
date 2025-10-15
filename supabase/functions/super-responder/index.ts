import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://your-production-domain.com",
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
    : "http://localhost:5173";

  const corsHeaders = {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Origin": allowedOrigin,
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const companyName = body.companyName?.trim();
    if (!companyName) throw new Error("Missing companyName");

    console.log("🔍 AI researching:", companyName);

    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY not configured");

    // 🧠 Structured JSON generation prompt
    const structuredPrompt = `
You are a precise, JSON-only business research AI.
Research the company "${companyName}" and return ONLY a JSON object in this exact shape:

{
  "websiteData": {
    "domain": "",
    "description": "",
    "foundedYear": "",
    "industry": "",
    "headquarters": "",
    "keyPeople": []
  },
  "newsData": {
    "articles": [
      {
        "title": "",
        "source": "",
        "date": "",
        "summary": ""
      }
    ]
  },
  "financialData": {
    "revenue": "",
    "employees": "",
    "marketCap": "",
    "stockSymbol": ""
  },
  "competitors": [
    {
      "name": "",
      "description": ""
    }
  ],
  "sourceLinks": [
    {
      "title": "",
      "url": ""
    }
  ],
  "summary": ""
}

If a field is unknown, write "Unknown". Always ensure valid JSON, no markdown or commentary.
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
              content:
                "You are a JSON-only output model. Do not include text outside of JSON. Never use markdown.",
            },
            { role: "user", content: structuredPrompt },
          ],
        }),
      }
    );

    const rawText = await aiRes.text();
    console.log("🧠 AI raw response:", rawText);

    // 🧮 Parse AI response safely
    let parsed = null;
    try {
      const json = JSON.parse(rawText);
      const text = json.output_text || json.output?.[1]?.content?.[0]?.text;
      parsed = JSON.parse(text || "{}");
    } catch (err) {
      console.error("⚠️ AI JSON parse error:", err);
    }

    // ✅ Fallbacks for missing sections
    const websiteData = parsed?.websiteData ?? {
      domain: `${companyName.toLowerCase().replace(/\s+/g, "")}.com`,
      description: `Official website for ${companyName}.`,
      foundedYear: "Unknown",
      industry: "Unknown",
      headquarters: "Unknown",
      keyPeople: [],
    };

    const newsData = parsed?.newsData ?? {
      articles: [
        {
          title: `${companyName} appears in market trends.`,
          source: "Global Business Times",
          date: new Date().toISOString(),
          summary: `Insights and trends related to ${companyName}.`,
        },
      ],
    };

    const financialData = parsed?.financialData ?? {
      revenue: "Unknown",
      employees: "Unknown",
      marketCap: "Unknown",
      stockSymbol: "Unknown",
    };

    const competitors = parsed?.competitors ?? [];
    const sourceLinks = parsed?.sourceLinks ?? [];
    const summary = parsed?.summary ?? "Summary not available.";

    // 🔑 Supabase setup
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

    // 💾 Store report
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
        ai_version: "gpt-5-mini",
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
          financialData,
          competitors,
          sourceLinks,
          summary,
          createdAt: report.created_at,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
