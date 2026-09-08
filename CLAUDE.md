# CLAUDE.md

## Overview

`task-demo` is a minimal demo Node.js website: an Express server that serves a
static single-page frontend and exposes one JSON health endpoint. There is no
database, no build step, no framework beyond Express, and no client-side
tooling — the browser loads hand-written HTML/CSS/JS directly.

## Architecture

```
server.js          Express app. Serves public/ as static, defines /api/status.
public/index.html  Single page: header, welcome card, API status card.
public/app.js      Click handler on #checkStatus -> fetch('/api/status') -> render into #statusOutput.
public/style.css   Dark theme, no CSS framework or preprocessor.
package.json       Deps + start/dev scripts. Sole dependency: express ^4.18.2.
```

Request flow: `express.static` resolves `public/` first, so `/` serves
`index.html`; anything not matched by a static file falls through to the
route table, where the only route is `/api/status`.

### HTTP surface (complete)

| Method | Path          | Response |
| ------ | ------------- | -------- |
| GET    | `/api/status` | `{ "status": "ok", "timestamp": "<ISO-8601>" }` |
| GET    | `/*`          | Static files from `public/` (`index.html`, `app.js`, `style.css`) |

That is the entire public API. There are no other routes, no MCP tools, no CLI
entry points, and no exported library modules.

## Commands

| Task    | Command         | Notes |
| ------- | --------------- | ----- |
| Install | `npm install`   | |
| Run     | `npm start`     | `node server.js`, listens on `$PORT` (default `3000`). |
| Dev     | `npm run dev`   | `node --watch server.js`, restarts on file change. |
| Build   | *none*          | No build step; nothing is compiled or bundled. |
| Test    | *none*          | No test script, no test runner, no test files. `npm test` fails. |
| Lint    | *none*          | No ESLint/Prettier config or dependency. |

Verified against Node v22 / npm v10.

## Conventions

- CommonJS (`require`), not ESM — `package.json` has no `"type": "module"`.
- Configuration comes from the environment; `PORT` is the only variable read.
- `.gitignore` covers `node_modules/` and `.env`. Never commit secrets.
- Frontend is dependency-free vanilla JS. Keep it that way unless a change
  genuinely warrants a build step.
- `public/` is served verbatim — any file added there becomes publicly reachable.

## Gaps to be aware of

There is no CI workflow (`.github/` does not exist), no test suite, and no
linter. Any change here is verified only by running the server by hand:

```bash
npm start &
curl -s localhost:3000/api/status
```

Adding a test runner and a CI workflow would be the highest-value next step.
