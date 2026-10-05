# Guddu Kumar — MERN Portfolio

A React portfolio inspired by the Squarespace Adri template, with a pastel palette, serif typography, a portrait hero, subtle 3D card interactions, and a Node.js/Express API that saves contact messages to MongoDB through Mongoose. Projects, skills, education, services, resume, and social links use Guddu's portfolio content.

## Run locally

Requires **Node.js 22.12+** and **MongoDB** (a running local server or an Atlas connection).

```sh
npm install
```

Configure `.env` in the project root using the variables below. The file is gitignored; create it when setting up a fresh checkout. Set `MONGODB_URI` to your connection string, such as `mongodb://127.0.0.1:27017/guddu_portfolio` for a local database. Setting this value does not install or start MongoDB. Do not put credentials in `VITE_` variables, which are bundled into the browser.

```sh
npm run dev
```

Open **http://localhost:5173**. This command starts Vite and the API together. The API runs on port 3001 by default; Vite proxies `/api` to it. If port 5173 is occupied, Vite prints the chosen URL; add that origin to `CLIENT_ORIGIN` when using a separately hosted API.

To preview just the frontend without a database:

```sh
npm run dev:client
```

The portfolio and visual interactions work independently. Contact submissions show an error and retain the visitor's text while the API or database is unavailable. The backend requires MongoDB at startup and exits with a clear error if it cannot connect.

## Features

- Adri-inspired cream, lavender, pink, and mustard sections with a dimensional portrait and subtle card tilt.
- Project preview carousel, compact keyboard-accessible Education tabs, and service accordions.
- Shared motion control, reduced-motion support, mouse-only card tilt, and animation pausing for offscreen sections and hidden tabs.
- Responsive navigation and accessible contact form with loading, success, and error states.
- Validated contact messages stored in MongoDB's `contactmessages` collection with timestamps.
- ID/email and password login at `/admin` for viewing and deleting contact messages.
- Admin content editor for the CV link, skill cards, projects, and education; saved content is served from MongoDB.
- JSON API errors, 32 KB request limit, honeypot, origin checks, Helmet headers, and five submissions per IP per 15 minutes.
- One Node server can serve the production frontend and API.

The form stores messages in MongoDB; it does **not** send email notifications. Read messages using MongoDB Compass or Atlas. There is intentionally no public endpoint that exposes submitted messages.

## Configuration

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Required server-only MongoDB URI. |
| `ADMIN_EMAIL` | Admin login ID/email; keep it server-only. |
| `ADMIN_PASSWORD` | Admin login password; keep it server-only and restart the API after changing credentials. |
| `PORT` | API port; defaults to `3001`. |
| `CLIENT_ORIGIN` | Comma-separated allowed frontend origins. Same-origin requests are also accepted. |
| `VITE_API_URL` | Leave empty for the development proxy or Express hosting. For a separately hosted static frontend only, set to the backend origin (without `/api`) before building. |
| `VITE_BASE_PATH` | Frontend asset path; defaults to `/`. |
| `BASE_PATH` | Express frontend mount path; match `VITE_BASE_PATH` if serving below a subpath. |
| `TRUST_PROXY` | Trusted proxy hop count; default `0`. Configure to match your host when using a reverse proxy. |
| `TEST_MONGODB_URI` | Optional isolated test database for the live persistence test. |

The in-memory rate limiter is intended for a single API instance. A multi-instance deployment needs a shared limiter store.

## API

`GET /api/health` returns HTTP 200 when connected to MongoDB and HTTP 503 when disconnected.

`POST /api/contact` accepts JSON:

```json
{
  "name": "Your name",
  "email": "you@example.com",
  "subject": "A project idea",
  "message": "I would like to discuss a new website."
}
```

Name: 2–80 characters; email: up to 254; optional subject: up to 120; message: 10–5000. Strings are trimmed and email is lowercased. Only approved fields are stored. HTTP 201 is returned after MongoDB acknowledges the write. Invalid fields return 400; failed storage returns 503; throttled submissions return 429.

The private admin dashboard is available at `/admin`. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, restart the server, then sign in with those credentials. The dashboard uses the returned session token to access protected admin endpoints.

`GET /api/content` returns the saved public portfolio content. `PUT /api/admin/content` updates the CV link, skills, projects, and education after admin authentication. The homepage lock icon opens the dashboard.

In **Edit content → CV**, select a PDF, DOC, or DOCX file (maximum 5 MB), choose **Upload CV**, then **Save changes**. Uploads are stored as versioned MongoDB documents, so deployment does not depend on a local uploads folder. The portfolio download preserves the original filename and format. Uploading alone does not change the published CV link. Old versions remain stored.

The Skills, Projects, and Education tabs include **Add** and **Remove** controls. Changes are drafts until **Save changes** is selected. New education entries have an editable short tab label. Limits: 20 skill cards, 30 projects, and 20 education entries. Known skills retain their icons; other skill names use a code icon.

`POST /api/admin/resume?filename=CV.pdf` accepts authenticated binary uploads with `Content-Type: application/octet-stream`. `GET /api/resume/:id` downloads an uploaded CV as an attachment. File extensions, format signatures and size are checked before storage.

## Production

```sh
npm run build
npm start
```

Open **http://localhost:3001** (or your configured port). `npm start` sets production mode across Windows/macOS/Linux and serves `dist` with the API. Configure environment variables on your Node hosting provider and give that server access to MongoDB. Use HTTPS on your hosting provider. No deployment is performed by these commands.

GitHub Pages can host only the frontend. The existing `npm run deploy` command builds with `/My_Portfolio/` and publishes the static files. To make contact submissions work there, deploy the API to a Node host, set `VITE_API_URL` before building, and allow `https://gkguddu.github.io` in the API's `CLIENT_ORIGIN`.

## Checks

```sh
npm run lint
npm test
npm run build
```

API tests use injected persistence to check validation, success, failures, origin restrictions, throttling, and static routing. The MongoDB integration test is skipped unless `TEST_MONGODB_URI` is set (including in `.env`). It writes and reads back a message in a uniquely named test collection, then removes only that collection. Use a disposable test database.

## Structure

```text
src/components/        React sections, contact form, and shared motion controls
src/adri.css           Responsive Adri-inspired visual theme
src/constants/         Existing portfolio content and links
server/app.js          Express API and production static hosting
server/index.js        Database connection and server lifecycle
server/models/         Mongoose contact schema
server/*.test.js       API and optional live database tests
scripts/start.js       Cross-platform production launcher
public/                Profile, project image, and resume
```

API and database behavior follows the [Express documentation](https://expressjs.com/en/api/) and [Mongoose connection documentation](https://mongoosejs.com/docs/connections.html).
