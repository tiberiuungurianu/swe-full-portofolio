# Deployment privacy rules

This file is the policy. `npm run build` enforces it: Next.js production build, then `scripts/harden-deploy-output.mjs`, then `scripts/verify-deploy.mjs`. A failed check exits non-zero.

This is build hardening, not anonymisation. Anything the browser receives can still be inspected. Development source in `src/` stays readable. These rules do not rewrite git history, obfuscate JavaScript, or block browser tools.

## Visibility of this file

`internal/deployment-privacy-rules.md` is committed with the repository. Anyone with repository access can read it. If the repository is public, this file is not confidential. It must not be copied into `public/` or into the production output that Next serves.

## What a deployment may contain

Next.js serves a Node server. The production output is:

- `.next/` — compiled server and client assets from `next build`, excluding `.next/dev` and `.next/cache`
- `public/` — static files Next serves as-is
- the installed dependencies required to run `npm start` (`next start`)

`npm start` is unchanged. Do not point a host's document root at the repository checkout.

## Rules

1. Deploy only the production output directory. Do not publish the repository root, `src/`, or `.next/dev`.
2. Minify production JavaScript and CSS with the Next.js compiler (SWC). Minification is on by default and is not customised with `swcMinify` (removed in Next.js 15). Server minification stays enabled (`experimental.serverMinification`). Next.js also emits its own server module `[turbopack]_runtime.js`. That file is framework code, not application source, and it is not a browser asset. Verification does not fail the build because of it.
3. Do not ship source maps. `productionBrowserSourceMaps` and `experimental.serverSourceMaps` are false. `enablePrerenderSourceMaps` is false so the build does not rely on maps. The harden step deletes `*.map` files under `.next/server` and `.next/static` and strips `sourceMappingURL` comments. Verification fails if any remain.
4. Do not publish source directories, Git metadata, this document, tests, logs, local configuration, or environment files. Verification rejects those names inside `.next/server`, `.next/static`, and `public/`.
5. Strip development `console.*` calls from application code in production, except `console.error`, so error handling stays. Do not remove server-side error responses.
6. Never embed private credentials in frontend assets. A value is not secret once it is bundled into client JavaScript. Public client configuration is allowed and is listed below. Server code may keep `process.env.GUESTBOOK_MODERATION_SECRET` as a runtime lookup. The secret value must not appear in any generated asset.
7. Verification scans generated browser assets for absolute local filesystem paths, development URLs (`http://localhost`, `http://127.0.0.1`, `http://0.0.0.0`), and internal notes that should not ship. The bare word `localhost` inside the framework URL parser is not a violation.
8. Keep intentional portfolio content: name, public GitHub and LinkedIn links, project descriptions, research citation, and institution names.
9. Keep dependency licence and attribution notices. Do not delete `node_modules` licence text.
10. Do not block devtools and do not add aggressive JavaScript obfuscation.

## Public client configuration

No `NEXT_PUBLIC_` variables are defined. The browser is expected to receive:

- the name Tiberiu Ungurianu and the public profile copy
- GitHub `https://github.com/tiberiuungurianu`
- LinkedIn `https://www.linkedin.com/in/tiberiu-septimiu-ungurianu`
- the IEEE DOI `https://doi.org/10.1109/SNAMS67467.2025.11391157`
- project descriptions, education, and logos in `public/`
- the live site origin `https://tiberiuungurianu.com`

Server-only, not public client configuration:

- `GUESTBOOK_MODERATION_SECRET`
- `GUESTBOOK_DATA_PATH`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_URL`
- `data/guestbook.json`

The guestbook sign-in asks Google for `openid` and `profile` only. The stored note keeps the first name. Email is not requested and is not written to `data/guestbook.json`.

`.next/required-server-files.json` records the build machine path (`outputFileTracingRoot`, `appDir`) for the Node server. That file is not served to the browser. Verification does not treat those server fields as a browser leak. The same absolute path inside `.next/static` or `public/` is a failure.

## Hosting

The git remote is Cursor Origin (`origin.cursor.com`). That is a git host, not an application host. This repository has no Vercel, Netlify, GitHub Actions, Docker, or other deploy pipeline.

When a host is connected, set its build command to `npm run build` so a failed check prevents publication. A build command of plain `next build` skips hardening and verification. Leave the start command as `npm start`.

Publishing is not automatic until that host setting is in place and has been confirmed.
