# dsaflo

dsaflo is a web app for tracking progress through data structures and algorithms study sheets.

It includes:

- Kunal Kushwaha's DSA curriculum
- Pratyush's DSA sheet
- A GATE CSE 2028 checklist with topic resources
- Progress tracking, bookmarks, revision tracking, and notes
- JSON export and import for local progress
- Optional GitHub sign-in and cloud sync
- Authenticated users can add personal questions to any sheet; these are stored per user in Supabase and are not shared.

## Stack

- Next.js and React
- Tailwind CSS
- Zustand
- Framer Motion
- Supabase and NextAuth for optional cloud features

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful commands:

```bash
npm run lint
npm run build
```

## Personal questions

Run [`supabase/custom_questions.sql`](./supabase/custom_questions.sql) in the Supabase SQL editor after the existing setup schema. When signed in, use **Add** beside a difficulty group to save a question to your account. The API derives ownership from the NextAuth session, so users only receive their own questions.

During `npm run dev`, GitHub sign-in is not required. Local questions use a separate `local-development-user` database identity and are never used as a logged-in user's questions. Production still requires authentication.
