# COGNIVOLT

**Learn Together. Build Anything.** · By Students, For Students.

A human-centered, gamified learning preview for Electronics and Telecommunication students. This repository is a **frontend demo**: progress lives in the browser, AI replies are templates, and role toggles are not security.

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` type-checks and bundles. `npm test` runs gate, lab, mission, and XP unit tests.

## What is real in the demo

- Searchable learning hub, scripted mentor, circuit games with truth-table scoring
- Virtual lab digital-logic evaluation (AND family, wiring, truth table)
- Five Logic Rookie challenges with hints, expected-vs-actual, one-time XP
- Smart Streetlight mission with a faulty threshold and a live test table
- Community, creator publishing, and admin moderation **in local demo state**

## What is simulated

Auth, email, MFA, file uploads, live models, persistence to a server, faculty/admin authorization, and hardware/SPICE.

Do not store real passwords. Do not treat the Creator or Admin toggles as production access control.
