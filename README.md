# Tiberiu Ungurianu — software engineering portfolio

Personal SWE portfolio for recruiters and engineers: projects, experience, research and a moderated guestbook.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 with design tokens in `src/app/globals.css`
- Structured content in `src/content/`
- Guestbook: local/dev JSON file store on the server (`data/guestbook.json`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4327](http://127.0.0.1:4327).

```bash
npm run lint
npm run build
```

## Guestbook configuration

The guestbook is a **labelled local/dev implementation**:

- Persists approved/pending/rejected notes in `data/guestbook.json` (server filesystem).
- Public `POST /api/guestbook` validates input and rate-limits submissions.
- Only **approved** notes are shown.
- Moderation uses `GUESTBOOK_MODERATION_SECRET` (Bearer token), not a hidden URL alone.

Copy `.env.example` to `.env.local` and set a secret:

```bash
cp .env.example .env.local
```

List all notes (including pending):

```bash
curl -H "Authorization: Bearer $GUESTBOOK_MODERATION_SECRET" \
  http://127.0.0.1:4327/api/guestbook/moderate
```

Approve or reject:

```bash
curl -X POST \
  -H "Authorization: Bearer $GUESTBOOK_MODERATION_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"id":"<message-id>","status":"approved"}' \
  http://127.0.0.1:4327/api/guestbook/moderate
```

For production hosting, replace the file store with a shared database and keep validation, moderation and rate limiting server-side. Do not use browser `localStorage` as shared storage.

## Content

Edit:

- `src/content/profile.ts`
- `src/content/projects.ts`
- `src/content/experience.ts`

Branding asset: `public/tu-monogram.svg` (also used as favicon).

## Notes

- British English throughout.
- Production domain is not set; sitemap uses a placeholder host until one is chosen.
- Public email and CV download are intentionally omitted until real destinations exist.
- This site is separate from tiberiu.online.
