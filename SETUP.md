# Real data ke saath setup (15 minute)

GitHub Pages sirf static site chalata hai, isliye shared data ke liye free **Supabase** database use hota hai.

1. supabase.com par free project banao.
2. **SQL Editor** mein `supabase/schema.sql` ka poora code paste karke Run karo.
3. **Authentication → Users → Add user** se users banao (Auto-confirm ON): 1 admin, 1 government viewer, aur kuch staff.
4. SQL Editor mein unhe role do (schema.sql ke neeche comments mein examples hain):
   - `admin`: sab dekh aur approve kar sakta hai, data seed kar sakta hai
   - `viewer`: government officer, poora MP data **sirf dekh** sakta hai
   - `staff`: sirf apne `facility_id` (jaise `Indore-1`) ka data update kar sakta hai
5. **Project Settings → API** se `Project URL` aur `anon public key` copy karke `config.js` mein daalo. (anon key public hoti hai; suraksha RLS rules se hoti hai. `service_role` key kabhi mat daalo.)
6. Push karo (README ke deploy steps). Admin se login karke "MP ka demo data load karein" dabao.

Facility ids ka format: `<District>-<0..3>`, 0 = CHC, 1-3 = PHC (jaise `Bhopal-0`, `Rewa-2`).

Note: yeh prototype hai. Real deployment mein patient data, audit, backups aur government security guidelines alag se chahiye.
