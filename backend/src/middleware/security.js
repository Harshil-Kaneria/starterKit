const express = require('express');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const cors = require('cors');
const helmet = require('helmet');
const { getString, getNumber } = require('../config/runtime');
const redisClient = require('../shared/cache/redisClient');

const corsOrigins = getString('CORS_ORIGINS', 'http://localhost:3000')
  .split(',')
  .map((item) => item.trim());

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS blocked'));
  },
  credentials: true
});

const limiter = rateLimit({
  windowMs: getNumber('RATE_LIMIT_WINDOW_MS', 60000),
  max: getNumber('RATE_LIMIT_MAX', 120),
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
      })
    : undefined
});

const applySecurityMiddlewares = (app) => {
  app.use(helmet());
  app.use(corsMiddleware);
  const requestLimit = getString('REQUEST_BODY_LIMIT', '1mb');
  app.use(express.json({ limit: requestLimit }));
  app.use(express.urlencoded({ extended: true, limit: requestLimit }));
  app.use(limiter);
};

module.exports = {
  applySecurityMiddlewares
};
