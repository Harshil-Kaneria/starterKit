# Backend Structure (Implemented)

The backend now follows module-first layering:

- Controller: HTTP request/response mapping only
- Service: business logic
- Repository: DB access
- Validator: Joi schemas for each module

## Current module layout

- `src/modules/admin`
- `src/modules/user`
- `src/modules/policy`

Each module has:

- `*.controller.js`
- `*.service.js`
- `*.repository.js`
- `*.validator.js`
- `*.routes.js`

## Shared platform layers

- `src/shared/http`: response + app errors
- `src/shared/logger`: pino + pino-http
- `src/shared/metrics`: Prometheus metrics and DB timing metrics
- `src/shared/cache`: Redis client + cache service

## Middleware stack

- Request ID middleware
- Structured HTTP logger middleware
- Security middleware (Helmet, CORS, payload limits, rate limiter)
- Metrics middleware
- Auth middleware
- Not-found middleware
- Error middleware

## Scalability notes

- Enable Redis to share cache and rate-limit state across instances.
- Use `/metrics` with Prometheus + Grafana for p95 latency and error monitoring.
- All heavy operations should stay in services and be moved to queues if needed.
