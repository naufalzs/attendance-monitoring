# attendance-monitoring

Attendance monitoring system: NestJS `core-service` + `log-service`, two React apps, Postgres + RabbitMQ in Docker, Firebase Firestore for admin notifications.

## Running

Create the env files first, fill the firebase from credential given from email

```bash
cp services/core-service/.env.example services/core-service/.env   # then fill FIREBASE_*
cp services/log-service/.env.example services/log-service/.env
```

Everything in Docker:

```bash
docker compose up -d --build
```

Or infrastructure (DB & RabbitMQ) only, with the services run locally via `npm run start:dev`:

```bash
docker compose up -d postgres rabbitmq
```

In Docker, compose overrides `DATABASE_URL` / `RABBITMQ_URL` to use the `postgres` / `rabbitmq` hostnames; the `.env` files keep the `localhost` values for local runs. Uploaded photos live in `./uploads` (mounted into core-service).

| Service                    | URL                                                          |
| -------------------------- | ------------------------------------------------------------ |
| core-service API / Swagger | http://localhost:3003, http://localhost:3003/docs            |
| Postgres                   | `localhost:55432` (app / app), databases `main_db`, `log_db` |
| RabbitMQ AMQP              | `localhost:55672`                                            |
| RabbitMQ UI                | http://localhost:55673 (guest / guest)                       |
