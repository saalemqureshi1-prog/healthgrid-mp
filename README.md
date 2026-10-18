# HealthGrid MP

Madhya Pradesh (55 districts) ke liye District Health Rescue Engine prototype. **Simulated data**, static site, GitHub Pages par chalta hai.

Features: dispense karne par stock auto-kam, days-left alerts, Smart Resource Exchange (approve/reject), What-If simulator, Hindi/English copilot (rule-based), bed + doctor attendance, escalation.

## GitHub par deploy
1. GitHub par naya repo banao (jaise `healthgrid-mp`).
2. Is folder mein: `git init && git add . && git commit -m "HealthGrid MP" && git branch -M main`
3. `git remote add origin https://github.com/<username>/healthgrid-mp.git && git push -u origin main`
4. Repo → Settings → Pages → Source: **GitHub Actions**. Push ke baad site `https://<username>.github.io/healthgrid-mp/` par live hogi.

Local chalane ke liye: `python3 -m http.server` aur browser mein localhost:8000.

## Shared data + login
`config.js` mein Supabase keys daalne par login, roles (admin / govt viewer / staff) aur shared database chalu ho jata hai. Steps: `SETUP.md`. Keys khaali ho toh demo mode chalta hai.
