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
- Visitors sign in with Google. The public note stores their first name only. The email scope is not requested, and email is never written to the store.
- Public `POST /api/guestbook` requires the signed-in session, validates the message, and rate-limits submissions. A name sent in the request body is ignored.
- Only **approved** notes are shown.
- Moderation uses `GUESTBOOK_MODERATION_SECRET` (Bearer token), not a hidden URL alone.

Copy `.env.example` to `.env.local` and set a moderation secret plus Google OAuth:

```bash
cp .env.example .env.local
```

Google Cloud needs an OAuth client of type Web application. Add both redirect URIs: `http://localhost:4327/api/auth/google/callback` for local development and `https://tiberiuungurianu.com/api/auth/google/callback` for the deployed site. Set `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET`. The app chooses the origin from the deploy variant. Set `AUTH_URL` only when the live origin should be something other than `https://tiberiuungurianu.com`.

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

## Cloudflare Workers

This app deploys with OpenNext on Cloudflare Workers. The Worker name in `wrangler.jsonc` is `swe-full-portofolio`, matching the Cloudflare project. Keep Next.js on `16.3.8` until `@opennextjs/cloudflare` supports `16.4` (`preview-props.json` otherwise crashes the Worker with Error 1101).

In Workers Builds set:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`npm run build` already runs Next.js, hardening, verify, and the OpenNext Worker bundle under `.open-next/`.

Add the server secrets as Cloudflare Worker secrets or Build variables: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `GUESTBOOK_MODERATION_SECRET`.

## Content

Edit:

- `src/content/profile.ts`
- `src/content/projects.ts`
- `src/content/experience.ts`

Branding asset: `public/tu-monogram.svg` (also used as favicon).

## Notes

- British English throughout.
- The live site origin is `https://tiberiuungurianu.com`. Local development uses the dev server origin.
- Public email and CV download are intentionally omitted until real destinations exist.
- This site is separate from tiberiu.online.
