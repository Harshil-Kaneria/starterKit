const client = require('prom-client');
const { getBoolean } = require('../../config/runtime');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request duration in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [25, 50, 100, 200, 400, 800, 1200, 2000],
  registers: [register]
});

const httpRequestErrorsTotal = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total HTTP 4xx/5xx responses',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const dbQueryDurationMs = new client.Histogram({
  name: 'db_query_duration_ms',
  help: 'DB query duration in ms',
  labelNames: ['model'],
  buckets: [5, 10, 20, 50, 100, 250, 500, 1000],
  registers: [register]
});

const metricsMiddleware = (req, res, next) => {
  if (!getBoolean('METRICS_ENABLED', true)) {
    return next();
  }

  const end = httpRequestDurationMs.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.path || 'unknown';
    const statusCode = String(res.statusCode);

    end({ method: req.method, route, status_code: statusCode });

    if (res.statusCode >= 400) {
      httpRequestErrorsTotal.inc({ method: req.method, route, status_code: statusCode });
    }
  });

  next();
};

const metricsHandler = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

module.exports = {
  register,
  metricsMiddleware,
  metricsHandler,
  dbQueryDurationMs
};
