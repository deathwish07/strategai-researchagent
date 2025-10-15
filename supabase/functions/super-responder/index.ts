import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// ✅ Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://your-production-domain.com"
];
// ✅ Default CORS headers
const defaultCorsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
  "Vary": "Origin"
};
serve(async (req)=>{
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "http://localhost:5173";
  const corsHeaders = {
    ...defaultCorsHeaders,
    "Access-Control-Allow-Origin": allowedOrigin
  };
  // ✅ Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200
    });
  }
  try {
    const { companyName } = await req.json();
    console.log("🔍 AI researching:", companyName);
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY not configured");
    // 🧠 AI Prompt (self-research mode)
    const researchPrompt = `
You are a professional market research analyst. 
Research the company "${companyName}" using your knowledge and reasoning. 

Write a complete and factual report covering:
1. Company Overview — founding, location, products/services
2. Recent Developments — any known updates, expansions, or changes
3. Industry Standing — competitors, market position
4. Key Insights — strengths, challenges, and future outlook

If any detail is unknown, make a logical estimation but clearly state it.
Respond in well-formatted markdown text.
    `;
    // ✅ Call Azure OpenAI Responses API (gpt-5-mini)
    const aiResponse = await fetch("https://iit-internship2025-2.openai.azure.com/openai/responses?api-version=2025-04-01-preview", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content: "You are a professional business research assistant skilled at analyzing companies and writing structured reports."
          },
          {
            role: "user",
            content: researchPrompt
          }
        ],
        max_output_tokens: 800
      })
    });
    const aiResponseText = await aiResponse.text();
    if (!aiResponse.ok) {
      console.error("❌ AI API error:", aiResponse.status, aiResponseText);
      throw new Error(`AI API error: ${aiResponse.status}: ${aiResponseText}`);
    }
    let summary = "No summary generated";
    try {
      const aiData = JSON.parse(aiResponseText);
      summary = aiData.output_text ?? summary;
    } catch  {
      summary = aiResponseText;
    }
    // ✅ Supabase Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    // ✅ Save AI research result to Supabase
    const { data: report, error } = await supabase.from("reports").insert({
      user_id: user.id,
      company_name: companyName,
      summary
    }).select().single();
    if (error) throw error;
    console.log("✅ Report created successfully:", report.id);
    return new Response(JSON.stringify({
      success: true,
      report: {
        id: report.id,
        companyName,
        summary,
        createdAt: report.created_at
      }
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 200
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({
      error: err.message
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 500
    });
  }
});
