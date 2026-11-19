# attendance-monitoring

Attendance monitoring system: NestJS `core-service` + `log-service`, two React apps, Postgres + RabbitMQ in Docker, Firebase Firestore for admin notifications.

## Running

Create the env files first, fill the firebase from credential given from email

```bash
cp services/core-service/.env.example services/core-service/.env   # then fill FIREBASE_*
cp services/log-service/.env.example services/log-service/.env
cp apps/admin-web/.env.example apps/admin-web/.env                  # then fill VITE_FIREBASE_*
```

### Admin notifications (Firestore)

core-service writes a document to the `notifications` collection whenever an employee changes their phone, photo or password. admin-web listens to it live (bell icon in the header).

The browser reads Firestore directly, so access is locked down by `firestore.rules`: admin-web gets a Firebase custom token from `GET /auth/firebase-token` (admins only), signs in with it, and the rules only allow reads when the token's `role` claim is `ADMIN`. One-time setup in the Firebase project:

1. Project settings → Your apps → add a **Web app**; copy its config into `apps/admin-web/.env`.
2. **Authentication** → Get started (custom-token sign-in needs no provider enabled).
3. Deploy the rules: `npx firebase-tools deploy --only firestore:rules --project <project-id>`.

Everything in Docker:

```bash
docker compose up -d --build
```

Or infrastructure (DB & RabbitMQ) only, with the services run locally via `npm run start:dev`:

```bash
docker compose up -d postgres rabbitmq
```

In Docker, compose overrides `DATABASE_URL` / `RABBITMQ_URL` to use the `postgres` / `rabbitmq` hostnames; the `.env` files keep the `localhost` values for local runs. Uploaded photos live in `./uploads` (mounted into core-service).

The web apps are built into static files served by nginx. Vite bakes `VITE_*` values in at build time from each app's `.env`, so rebuild after changing them: `docker compose up -d --build employee-web admin-web`.

In VS Code, `.vscode/launch.json` has a launch config per service and app, plus `Backend (core + log)`, `Frontend (employee + admin)` and `Full stack` compounds.

| Service                    | URL                                                          |
| -------------------------- | ------------------------------------------------------------ |
| core-service API / Swagger | http://localhost:3003, http://localhost:3003/docs            |
| employee-web               | http://localhost:8080 (Docker), http://localhost:5173 (dev)  |
| admin-web                  | http://localhost:8081 (Docker), http://localhost:5174 (dev)  |
| Postgres                   | `localhost:55432` (app / app), databases `main_db`, `log_db` |
| RabbitMQ AMQP              | `localhost:55672`                                            |
| RabbitMQ UI                | http://localhost:55673 (guest / guest)                       |

## Seed data

The admin account is created automatically on the first start of core-service, from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `services/core-service/.env`.

Demo employees and attendance are optional. Load them once the stack is running:

```bash
# Docker
docker compose exec core-service node dist/seed

# or locally
cd services/core-service && npm run seed
```

| Email              | Role     | Password                   |
| ------------------ | -------- | -------------------------- |
| `admin@company.com` | ADMIN    | `ADMIN_PASSWORD` from `.env` |
| `naufal@company.com` | EMPLOYEE | `password123`              |
| `dewa@company.com` | EMPLOYEE | `password123`              |
| `fauzan@company.com` | EMPLOYEE | `password123`              |

Each employee gets attendance for the last 10 weekdays before today (Jakarta time), with one day missing a clock-out. Today is left empty so clock-in can be tried. Running the seed again is safe: existing employees and days are skipped.
