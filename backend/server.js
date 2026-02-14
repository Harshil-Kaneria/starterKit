require('dotenv').config();

const http = require('http');
const app = require('./app');
const logger = require('./src/shared/logger/logger');
const { getNumber } = require('./src/config/runtime');

const port = getNumber('APP_PORT', 8000);
const server = http.createServer(app);

server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    logger.error({ error, port }, `Port ${port} is already in use. Set APP_PORT to a free port or stop the current process.`);
    process.exit(1);
  }

  logger.error({ error }, 'Server error');
  process.exit(1);
});

server.listen(port, () => {
  logger.info({ port }, 'Backend server started');
});

process.on('unhandledRejection', (error) => {
  logger.error({ error }, 'Unhandled Rejection');
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
});
