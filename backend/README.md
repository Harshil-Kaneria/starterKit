# Backend API

## What Changed

This backend is now refactored for better development speed, security, and scalability.

- Module-first architecture (`modules/admin`, `modules/user`, `modules/policy`)
- Controller -> Service -> Repository layering
- Request validation per module
- Centralized error handling
- Security middleware baseline (Helmet, CORS allowlist, rate limiting)
- Structured logs with `pino` + request IDs
- Prometheus metrics (`/metrics`)
- Redis-ready caching and rate-limit store
- Response encryption support (AES-256-GCM)
- Runtime env access only (no centralized env-schema file)

## Project Structure

```txt
src/
  config/
    env.js
    database.js
  middleware/
    apiAuth.js
    errorHandler.js
    notFound.js
    requestId.js
    security.js
  modules/
    admin/
    user/
    policy/
  routes/
    index.js
  shared/
    cache/
    http/
    logger/
    metrics/
  models/
  migrations/
  seeders/
```

## Required Environment Variables

```env
APP_NAME=NutriScan
SUPPORT_EMAIL=support@nutri-scan.com
APP_PORT=8000
DB_NAME=staterkit
DB_DIALECT=mysql
DB_PORT=3306
DB_HOST=localhost
DB_USER=root
DB_PASS=
JWT_SECRET=replace_with_strong_secret
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=
MAIL_PASS=
MAIL_SENDER=
CORS_ORIGINS=http://localhost:3000
REQUEST_BODY_LIMIT=1mb
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=120
REDIS_ENABLED=false
REDIS_URL=redis://127.0.0.1:6379
METRICS_ENABLED=true
LOG_LEVEL=info
RESPONSE_ENCRYPTION_ENABLED=true
RESPONSE_ENCRYPTION_KEY=replace_with_long_random_secret
PLAY_SUBSCRIPTION_CLIENT_EMAIL=
ANDROID_PACKAGE_NAME=
ANDROID_PRODUCT_ID=
```

Note:
- Variables are read at runtime (`process.env`) so AWS Secrets Manager injection works directly.

## Security Baseline

- `helmet` enabled
- CORS allowlist via `CORS_ORIGINS`
- Global rate limiter (Redis-backed when Redis enabled)
- JWT auth middleware with admin/user route protection
- Request ID propagated as `x-request-id`
- Uniform error responses

## Redis Caching

Enabled when:

```env
REDIS_ENABLED=true
REDIS_URL=redis://127.0.0.1:6379
```

Currently cached endpoints:

- Admin list
- Admin dashboard counts
- Policies list/by type

## Metrics & Logging

- Metrics endpoint: `GET /metrics`
- Health endpoint: `GET /health`
- Prometheus metrics include:
  - request duration histogram (p95 derivable)
  - error counters
  - DB query duration histogram
- Logs are structured JSON via `pino`

## API Base Routes

Public:

- `POST /public/api/v1/admin/login`
- `POST /public/api/v1/user/login-register`
- `POST /public/api/v1/user/verify-otp`
- `POST /public/api/v1/user/resend-otp`
- `POST /public/api/v1/user/delete-user`
- `POST /public/api/v1/user/delete-user-verify-otp`
- `POST /public/api/v1/policies`

Protected:

- `GET /api/v1/admin/get-profile`
- `GET /api/v1/admin/admin-list`
- `GET /api/v1/admin/dashboards`
- `POST /api/v1/admin/details`
- `POST /api/v1/admin/delete-admin`
- `POST /api/v1/admin/update-admin`
- `POST /api/v1/admin/register`
- `GET /api/v1/admin/get-policies`
- `POST /api/v1/admin/edit-policies`
- `GET /api/v1/admin/user-list`
- `POST /api/v1/admin/delete-user`
- `POST /api/v1/user/update-profile`
- `POST /api/v1/user/update-profile-photo`
- `POST /api/v1/user/update-fcm-timezone`
- `GET /api/v1/user/details`

## Setup

```bash
npm install
knex migrate:latest --env=staging
knex seed:run --env=staging
npm run dev
```
