const express = require('express');
const controller = require('./auth.controller');

const publicRouter = express.Router();
const protectedRouter = express.Router();

publicRouter.post('/auth/refresh', controller.refreshSession);
publicRouter.post('/auth/logout', controller.logout);
protectedRouter.post('/auth/logout-all', controller.logoutAll);

module.exports = {
  publicRouter,
  protectedRouter
};
