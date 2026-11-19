# attendance-monitoring

Attendance monitoring system: employees clock in/out and manage their profile, admins manage employees, review attendance and get live notifications when an employee changes their profile.

## Architecture

- **Frontend** (employee-web, admin-web) uses React, Vite, TypeScript, Tailwind CSS and shadcn/ui.
- **Backend** (core-service, log-service) uses NestJS, TypeORM and PostgreSQL, with JWT login and Swagger docs.
- **Message queue** uses RabbitMQ: core-service sends an event when an employee changes their phone, photo or password, and log-service saves it as an audit log.
- **Notification** uses Firebase Firestore: core-service writes the same change to Firestore, and admin-web shows it live.
- **Infra** uses Docker Compose for everything, and nginx to serve the built web apps.

## Running

### 1. Env files

Every service and app has a `.env.example` with placeholders:

```bash
cp services/core-service/.env.example services/core-service/.env   # fill FIREBASE_* and ADMIN_PASSWORD
cp services/log-service/.env.example  services/log-service/.env
cp apps/employee-web/.env.example     apps/employee-web/.env
cp apps/admin-web/.env.example        apps/admin-web/.env           # fill VITE_FIREBASE_*
```

The Firebase keys are provided in the file attached to the submission email: copy the `FIREBASE_*` values into `services/core-service/.env` and the `VITE_FIREBASE_*` values into `apps/admin-web/.env`.

### 2. Start

Choose one: run everything with Docker, or run each service with its launch config in the VS Code debugger.

**Docker**

```bash
docker compose up -d --build
```

**VS Code debugger**: `.vscode/launch.json` has a launch config per service and app, plus `Backend (core + log)`, `Frontend (employee + admin)` and `Full stack` compounds. Start the infrastructure first with `docker compose up -d main-db log-db rabbitmq`.

| Service                    | URL                                                         |
| -------------------------- | ----------------------------------------------------------- |
| employee-web               | http://localhost:8080 (Docker), http://localhost:5173 (dev) |
| admin-web                  | http://localhost:8081 (Docker), http://localhost:5174 (dev) |
| core-service API / Swagger | http://localhost:3003, http://localhost:3003/docs           |
| Postgres `main_db`         | `localhost:5432` (app / app_pw)                             |
| Postgres `log_db`          | `localhost:5433` (app / app_pw)                             |
| RabbitMQ AMQP              | `localhost:5672`                                            |
| RabbitMQ UI                | http://localhost:15672 (guest / guest)                      |

**Run locally** without the debugger: infrastructure in Docker, services and apps from a terminal each:

```bash
docker compose up -d main-db log-db rabbitmq
cd services/core-service && npm ci && npm run start:dev
cd services/log-service  && npm ci && npm run start:dev
cd apps/employee-web     && npm ci && npm run dev -- --port 5173
cd apps/admin-web        && npm ci && npm run dev -- --port 5174
```

### 3. Seed data

Seed data are provided for demo purposes. To use them, run the seed in core-service once the stack is running:

```bash
cd services/core-service && npm run seed
```

The admin account doesn't need the seed: core-service creates it on first start from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `services/core-service/.env`.

| Email                | Role     | Password                     |
| -------------------- | -------- | ---------------------------- |
| `admin@company.com`  | ADMIN    | `ADMIN_PASSWORD` from `.env` |
| `naufal@company.com` | EMPLOYEE | `password123`                |
| `dewa@company.com`   | EMPLOYEE | `password123`                |
| `fauzan@company.com` | EMPLOYEE | `password123`                |

Each employee gets attendance for the last 10 weekdays before today (Jakarta time), with one day missing a clock-out. Today is left empty so clock-in can be tried. Running the seed again is safe: existing employees and days are skipped.

## API

A Postman collection with the happy paths and error cases is in `postman/`. Import it, set `adminPassword` to your `ADMIN_PASSWORD`, and run it from the repo root so the photo fixtures in `postman/fixtures/` resolve.

Full, interactive docs at http://localhost:3003/docs. All routes need `Authorization: Bearer <token>` except login.

| Method | Path                    | Who      | Purpose                                                   |
| ------ | ----------------------- | -------- | --------------------------------------------------------- |
| POST   | `/auth/login`           | public   | Email + password → JWT                                    |
| GET    | `/auth/firebase-token`  | admin    | Firebase custom token for the notification listener       |
| GET    | `/profile/me`           | any user | Own profile                                               |
| PATCH  | `/profile/me/phone`     | any user | Change phone                                              |
| PATCH  | `/profile/me/password`  | any user | Change password (needs the current one)                   |
| PATCH  | `/profile/me/photo`     | any user | Upload photo (multipart `photo`, JPG/PNG/WebP, max 2 MB)  |
| POST   | `/attendance/clock-in`  | any user | Clock in for today (Asia/Jakarta)                         |
| POST   | `/attendance/clock-out` | any user | Clock out for today                                       |
| GET    | `/attendance/me`        | any user | Own attendance, `from` / `to` (YYYY-MM-DD)                |
| GET    | `/attendance`           | admin    | All attendance, `from` / `to` / `employeeId` / pagination |
| GET    | `/employees`            | admin    | List employees                                            |
| GET    | `/employees/:id`        | admin    | One employee                                              |
| POST   | `/employees`            | admin    | Create employee                                           |
| PATCH  | `/employees/:id`        | admin    | Update employee, including a new password                 |

## Possible improvements

- **S3 / MinIO for photos** instead of the local `./uploads` volume, which doesn't work across several core-service instances.
- **Migrations instead of TypeORM `synchronize: true`**, which can drop or alter columns on startup and isn't safe for production data.
- **Tests**: unit tests for the services, e2e tests for the API, and component tests for the web apps. Today the API is covered by the Postman collection only.
- **Revoke sessions on password change.** JWTs are only checked for signature and expiry, so a token issued before a password reset stays valid until it expires (1 day).
