import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// Supabase Edge Function: ai-chat
// Deploy:  supabase functions deploy ai-chat
// Key:     supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// (JWT verification default on hai, yaani sirf logged-in users chat kar sakte hain.)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const MODEL = 'claude-haiku-5-5';

// ---- Yahi "training" hai: chatbot ko app ke rules aur uski bhumika yahan sikhayi jati hai. Zarurat ke hisaab se badlein. ----
const SYSTEM = `You are the HealthGrid MP AI assistant, built into a prototype dashboard for Madhya Pradesh district health administrators, government viewers and facility staff.

ABOUT THE APP
- 55 districts, about 220 facilities (CHC and PHC). Data is SIMULATED demo data, not real hospital records.
- Tracks 8 medicines (Paracetamol, ORS, Amoxicillin, Metformin, Iron-Folic Acid, Insulin, Anti-Malarial ACT, Tetanus Toxoid), bed occupancy and doctor attendance.
- Modules: Predictive Crisis Radar (alerts), Smart Resource Exchange (transfer recommendations), District ranking, What-If Simulator, Staff Portal (dispensing, stock received, beds, doctor check-in).

RULES USED BY THE APP (explain them when asked)
- Days of stock = current stock / daily use. Under 3 days = High risk. Under 7 days = Review.
- Bed occupancy >= 85% = High, >= 70% = Review.
- No doctor present = High.
- Alert deadlines: High = 24 hours, Review = 72 hours. After the deadline an alert auto-escalates to the State Commissioner.
- Transfers: a donor must have at least 15 days of stock and keeps a 10-day reserve; the target is 14 days of stock for the receiving facility. Only an Admin can approve or reject a transfer.
- Roles: Admin (can act), Govt Viewer (read-only), Facility Staff (own facility only).

HOW TO ANSWER
- Use ONLY the LIVE DATA JSON below plus the rules above. Never invent facilities, numbers or medicines. If the data does not contain the answer, say so plainly.
- You may give simple forecasts or priorities, but label them clearly as estimates based on current stock and daily use, and show the arithmetic briefly.
- Be concise: short paragraphs or a few bullet points. Mention facility and district names. Suggest practical next steps (who to contact, what to transfer, what to escalate).
- You advise only. Final approval and decisions always belong to the administrator. Do not claim you performed any action.
- This is not medical advice; do not discuss treating individual patients.
- Reply in the language requested by the user's interface setting (Hindi in Devanagari, or English). If the user clearly writes in the other language, follow the user.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  const json = (obj: unknown, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
  try {
    const key = Deno.env.get('ANTHROPIC_API_KEY');
    if (!key) return json({ error: 'ANTHROPIC_API_KEY not set' }, 500);

    const { messages, lang, context } = await req.json();
    if (!Array.isArray(messages) || !messages.length) return json({ error: 'messages required' }, 400);

    // Clean history: last 10, string content only, alternating roles, starting with user.
    const clean: { role: string; content: string }[] = [];
    for (const m of messages.slice(-10)) {
      if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') continue;
      const content = m.content.slice(0, 2000);
      const last = clean[clean.length - 1];
      if (last && last.role === m.role) last.content += '\n' + content;
      else clean.push({ role: m.role, content });
    }
    while (clean.length && clean[0].role !== 'user') clean.shift();
    if (!clean.length) return json({ error: 'no user message' }, 400);

    const system =
      SYSTEM +
      `\n\nINTERFACE LANGUAGE: ${lang === 'en' ? 'English' : 'Hindi (Devanagari)'}` +
      `\n\nLIVE DATA (JSON, from the user's current dashboard view):\n` +
      JSON.stringify(context ?? {}).slice(0, 30000);

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: MODEL, max_tokens: 700, system, messages: clean }),
    });
    if (!r.ok) return json({ error: 'upstream ' + r.status }, 502);
    const data = await r.json();
    const reply = (data.content ?? []).filter((b: { type: string }) => b.type === 'text').map((b: { text: string }) => b.text).join('\n');
    return json({ reply });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
