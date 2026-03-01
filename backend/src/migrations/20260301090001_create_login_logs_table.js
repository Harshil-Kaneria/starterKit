exports.up = function (knex) {
  return knex.schema.createTable('login_logs', function (table) {
    table.increments('id').primary().index();
    table.string('sessionId').nullable().index();
    table.string('secretId').nullable().index();
    table.string('loginType').nullable().index();
    table.string('event').notNullable().index();
    table.string('status').notNullable().index();
    table.string('ipAddress').nullable();
    table.text('userAgent').nullable();
    table.string('deviceInfo').nullable();
    table.jsonb('meta').nullable();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('login_logs');
};
