
// Supabase ka URL aur anon key yahan daalein (SETUP.md dekhein).
// Khaali chhodne par app "demo mode" mein chalta hai (data sirf us browser mein).
window.HG_CONFIG = {
  url: '',
  key: '',
  // Optional: agar Supabase use nahi kar rahe (ya apna alag AI endpoint hai) to uska URL yahan daalein.
  // Khaali + Supabase login on = supabase function "ai-chat" use hota hai.
  // Dono nahi = chatbot rule-based jawab deta hai.
  aiUrl: ''
};
