# NagarBondhu (নগর বন্ধু) — Frontend

React + Vite + Tailwind + Framer Motion + React Router + react-i18next. Mock data only; Supabase comes later.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:5173

## The one full demo (about 2 minutes)
Use the **Demo mode** buttons on `/login` — no password needed. Switch roles by logging out and picking another.

1. **Citizen** → `Report a problem` → fill the form (photo optional) → submit. (Logged-out visitors can open the form but cannot submit.)
2. **Admin** → Admin Dashboard → *Reports* → **Confirm** the new report.
3. **Admin** → on the confirmed report click **Create campaign** (date, time, meeting point, volunteers needed). This "calls" all volunteers.
4. **Worker** → Worker Dashboard shows the call → **Join this campaign**. On the day press **Mark my part done**. (Try a second worker: sign up as Worker, or use the seeded ones.)
5. **Admin** → *Campaigns* → see volunteers who finished → **Mark campaign as completed**.
6. **Citizen** → Profile → the report shows **Cleaned** with a full green progress bar.

Report status flow: `pending → confirmed → campaign → cleaned` (or `rejected`).
Campaign status flow: `open → completed`.

Demo accounts (password `demo1234`): citizen@demo.com · worker@demo.com · admin@demo.com
Reset all demo data: run `localStorage.clear()` in the browser console and reload.

## Folder guide
- `src/services/` — **all data access**. `mockDb.js` is the fake database (localStorage). Replace functions in `authService`, `userService`, `wasteReportService`, `campaignService` with Supabase calls; keep the `{ data, error }` return shape and nothing else needs to change.
- `src/lib/supabaseClient.js` — commented placeholder. `.env.example` has the two variables.
- `src/roles/{admin,worker,user}` — role-specific pages and components. `src/layouts/DashboardLayout.jsx` is the shared sidebar shell.
- `src/components/landing` — landing sections. `src/components/common` — shared pieces.
- `src/locales/en.json`, `bn.json` — all text. `scripts/generate_locales.py` created both; `node scripts/checkLocales.js` checks that bn has every en key. Untranslated bn values currently repeat the English text as placeholders — edit `bn.json` directly.
- `src/routes/ProtectedRoute.jsx` — login + role guard.

## Notes
- No reference images were attached, so the Hero and Features use original designs in the brand palette. The Bangladesh map is a stylised outline, not survey-accurate.
- The "How it works" opposite sides and the Projects gallery are placeholders ready for your images.
- Social login buttons are UI only.
