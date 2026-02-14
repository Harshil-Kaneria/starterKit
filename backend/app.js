require('dotenv').config();

const path = require('path');
const express = require('express');
const multer = require('multer');

require('./src/config/database');

const { applySecurityMiddlewares } = require('./src/middleware/security');
const requestIdMiddleware = require('./src/middleware/requestId');
const httpLogger = require('./src/shared/logger/httpLogger');
const { metricsMiddleware, metricsHandler } = require('./src/shared/metrics');
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');
const { publicV1Router, protectedV1Router } = require('./src/routes');

const app = express();
const upload = multer();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(requestIdMiddleware);
app.use(httpLogger);
applySecurityMiddlewares(app);
app.use(metricsMiddleware);

app.use(upload.any());
app.use(express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/metrics', metricsHandler);

app.use('/api/v1', protectedV1Router);
app.use('/public/api/v1', publicV1Router);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
