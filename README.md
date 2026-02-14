# Starter Kit (Secure + Scalable)

This project now ships with:

- Secure module-first backend
- Feature-first admin frontend
- Response encryption support
- Redis-ready caching and rate limiting
- Structured logs + metrics

## Backend quick start

```bash
cd backend
npm install
knex migrate:latest --env=staging
knex seed:run --env=staging
npm run dev
```

## Admin quick start

```bash
cd admin
npm install
npm run dev
```

## Encryption contract

Backend `.env`:

```env
RESPONSE_ENCRYPTION_ENABLED=true
RESPONSE_ENCRYPTION_KEY=your_shared_secret
```

Admin `.env`:

```env
NEXT_PUBLIC_RESPONSE_ENCRYPTION_ENABLED=true
NEXT_PUBLIC_RESPONSE_ENCRYPTION_KEY=your_shared_secret
```

## Observability

- Health: `GET /health`
- Metrics: `GET /metrics`
- Request IDs: `x-request-id` in request/response

## Redis options

Backend `.env`:

```env
REDIS_ENABLED=true
REDIS_URL=redis://127.0.0.1:6379
```

When enabled:

- API rate limiting uses Redis store
- Frequent API responses are cached via Redis
