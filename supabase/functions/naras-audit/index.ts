import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Standard Supabase CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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
    if (!response.ok) throw new Error(result.error?.message || "Gemini Error")

    let rawContent = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawContent) throw new Error("Empty response from AI")

    rawContent = rawContent.replace(/```json|```/g, "").trim()
    const narasData = JSON.parse(rawContent)

    // 2. SUCCESS RESPONSE (Must include CORS headers)
    return new Response(JSON.stringify(narasData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Audit Error:", error.message)
    // 3. ERROR RESPONSE (Must also include CORS headers)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})