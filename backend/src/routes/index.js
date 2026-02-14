const express = require('express');
const apiAuth = require('../middleware/apiAuth');

const { publicRouter: adminPublicRouter, protectedRouter: adminProtectedRouter } = require('../modules/admin/admin.routes');
const { publicRouter: userPublicRouter, protectedRouter: userProtectedRouter } = require('../modules/user/user.routes');
const { publicRouter: policyPublicRouter, protectedRouter: policyProtectedRouter } = require('../modules/policy/policy.routes');

const publicV1Router = express.Router();
const protectedV1Router = express.Router();

publicV1Router.use(adminPublicRouter);
publicV1Router.use(userPublicRouter);
publicV1Router.use(policyPublicRouter);

protectedV1Router.use(apiAuth);
protectedV1Router.use(adminProtectedRouter);
protectedV1Router.use(userProtectedRouter);
protectedV1Router.use(policyProtectedRouter);

module.exports = {
  publicV1Router,
  protectedV1Router
};
