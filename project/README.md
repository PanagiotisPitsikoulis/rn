# CN6035 Theatre Booking

Mobile theatre reservation app built with Expo React Native, Express, MariaDB, Bun, and Turborepo.

Users can sign up, browse theatres and shows, choose showtimes, reserve seats, and view booking history. The API can run with MariaDB or with seeded in-memory data for demos.

## Demo

[![Mobile app demo](docs/media/demo-poster.webp)](docs/media/demo.mp4)

## Screenshots

![App screenshot 1](docs/media/screen-01.webp)

<p>
  <img src="docs/media/screen-02.webp" alt="App screenshot 2" width="32%">
  <img src="docs/media/screen-03.webp" alt="App screenshot 3" width="32%">
  <img src="docs/media/screen-04.webp" alt="App screenshot 4" width="32%">
</p>
<p>
  <img src="docs/media/screen-05.webp" alt="App screenshot 5" width="32%">
  <img src="docs/media/screen-06.webp" alt="App screenshot 6" width="32%">
  <img src="docs/media/screen-07.webp" alt="App screenshot 7" width="32%">
</p>
<p>
  <img src="docs/media/screen-08.webp" alt="App screenshot 8" width="32%">
  <img src="docs/media/screen-09.webp" alt="App screenshot 9" width="32%">
  <img src="docs/media/screen-10.webp" alt="App screenshot 10" width="32%">
</p>
<p>
  <img src="docs/media/screen-11.webp" alt="App screenshot 11" width="32%">
</p>

## Stack

| Layer | Technology |
|---|---|
| Mobile | Expo React Native, Expo Router, React Query |
| API | Express, JWT auth, bcryptjs |
| Data | MariaDB or in-memory demo store |
| Workspace | Bun workspaces, Turborepo |

## Quick Start

Install dependencies:

```bash
bun install
```

Create local environment config:

```bash
cp .env.example .env
```

Start the API server:

```bash
bun run dev:server
```

Start the mobile app in another terminal:

```bash
bun run dev:mobile
```

The API runs on `http://localhost:4000` by default. For a physical device, set the API base URL to your machine LAN IP:

```text
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.20:4000
```

## MariaDB Mode

The server works without MariaDB when `DATABASE_URL` is empty. To use the database-backed path, apply the schema and set a connection string:

```bash
bun run db:schema
```

```text
DATABASE_URL=mysql://cn6035:<password>@localhost:3306/cn6035_theatre
```

## Workspace

| Path | Purpose |
|---|---|
| `apps/mobile` | Expo React Native app |
| `apps/server` | Express API, auth, catalog, reservations, tests |
| `packages/core/airbnb` | Shared domain/data logic used by the app |
| `packages/headless/airbnb` | Headless providers and client sync logic |
| `packages/native/ui` | Local Pitsi UI native component library |
| `packages/shared` | Shared endpoint constants |
| `db/schema.sql` | MariaDB schema |

## API

Protected routes require:

```text
Authorization: Bearer <token>
```

| Route group | Endpoints |
|---|---|
| Auth | `POST /register`, `POST /login`, `POST /api/auth/sign-up/email`, `POST /api/auth/sign-in/email` |
| Catalog | `GET /theatres`, `GET /shows`, `GET /showtimes`, `GET /seats` |
| Native catalog | `GET /api/theatres`, `GET /api/shows`, `GET /api/showtimes`, `GET /api/seats` |
| Reservations | `POST /reservations`, `PATCH /reservations/:id`, `DELETE /reservations/:id`, `GET /user/reservations` |
| Native reservations | `GET/POST /api/theatre-reservations`, `PATCH/DELETE /api/theatre-reservations/:id` |

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Starts Turborepo dev tasks |
| `bun run dev:server` | Runs the Express API |
| `bun run dev:mobile` | Runs the Expo mobile app |
| `bun run test` | Runs workspace tests |
| `bun run typecheck` | Type-checks the workspace |
| `bun run build` | Runs Turborepo build tasks |
| `bun run db:schema` | Runs the server database schema task |
