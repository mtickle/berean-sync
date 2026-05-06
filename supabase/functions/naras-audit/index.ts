import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Standard Supabase CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
// Note: Using Gemini 2.0 Flash as 2.5 is not yet a standard endpoint in mid-2026 production, 
// but the logic remains identical for your targeted model.
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

serve(async (req) => {
  // 1. BULLETPROOF PREFLIGHT: Return 204 No Content
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }

  try {
    const { entityName, entityType } = await req.json()

    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY secret in Supabase Dashboard.");
    }

    const prompt = {
      contents: [{
        parts: [{
          text: `You are a theological research assistant for Berean Sync. 
          Perform a high-precision audit on the musical ${entityType}: "${entityName}".
          
          Analyze for NAR Associations, Doctrinal Markers, and Sources.

          CRITICAL: RETURN ONLY A PURE JSON OBJECT. NO MARKDOWN, NO BACKTICKS.
          Structure:
          {
            "verdict": "Green" | "Amber" | "Red",
            "confidence_score": 85,
            "association_notes": { "details": [] },
            "doctrinal_notes": { "details": [] },
            "summary": "Summary text",
            "sources": []
          }`
        }]
      }]
    }

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt)
    })

    const result = await response.json()
    if (!response.ok) {
      console.error("Gemini API returned error:", result);
      throw new Error(result.error?.message || "Gemini API Error");
    }

    let rawContent = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawContent) throw new Error("Empty response from AI")

    // --- REFINEMENT: STRIKE OUT MARKDOWN & CONVERSATIONAL FLUFF ---
    // This regex looks for the first '{' and the last '}' to isolate the JSON block,
    // effectively ignoring backticks or "Sure, here is your audit" text.
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON structure found in AI response:", rawContent);
      throw new Error("AI response was not in a valid format.");
    }
    
    const cleanJson = jsonMatch[0];

    try {
      const narasData = JSON.parse(cleanJson);

      // SUCCESS: Return the data
      return new Response(JSON.stringify(narasData), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (parseError) {
      console.error("JSON Parse Failure. Raw Content:", rawContent);
      throw new Error("Failed to parse the AI's theological report.");
    }

  } catch (error) {
    console.error("Edge Function Audit Error:", error.message)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Check Supabase Edge Function logs for the raw AI output." 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})