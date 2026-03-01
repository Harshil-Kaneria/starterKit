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
DB_DIALECT=postgres
DB_PORT=5432
DB_HOST=localhost
DB_USER=postgres
DB_PASS=
DB_SSL_ENABLED=false
DB_SSL_REJECT_UNAUTHORIZED=true
DB_POOL_MIN=2
DB_POOL_MAX=20
DB_POOL_ACQUIRE_MS=30000
DB_POOL_IDLE_MS=10000
DB_POOL_EVICT_MS=1000
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
JWT_KEY_ID=main
JWT_PUBLIC_KEYS_JSON={"main":"-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----"}
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d
JWT_TOKEN_ENCRYPTION_KEY=replace_with_long_random_secret
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=lax
AUTH_COOKIE_DOMAIN=
FILE_STORAGE_DRIVER=s3
LOCAL_UPLOAD_DIR=uploads
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_BASE_URL=
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
CRON_ENABLED=true
CRON_EXPRESSION=*/5 * * * *
CRON_EXPRESSION_10_MIN=*/10 * * * *
```

Note:
- Variables are read at runtime (`process.env`) so AWS Secrets Manager injection works directly.

## Security Baseline

- `helmet` enabled
- CORS allowlist via `CORS_ORIGINS`
- Global rate limiter (Redis-backed when Redis enabled)
- CSRF protection (`x-csrf-token` must match `csrf_token` cookie for state-changing authenticated requests)
- JWT auth middleware with admin/user route protection
- Request ID propagated as `x-request-id`
- Uniform error responses
- No global multipart parser; file URLs are expected from external storage (S3 flow)

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
- `POST /public/api/v1/auth/refresh`
- `POST /public/api/v1/auth/logout`

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
- `POST /api/v1/auth/logout-all`

## Setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
