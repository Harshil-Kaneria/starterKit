exports.up = function (knex) {
  return knex.schema.createTable('auth_sessions', function (table) {
    table.increments('id').primary().index();
    table.string('sessionId').notNullable().unique().index();
    table.string('secretId').notNullable().index();
    table.string('loginType').notNullable().index();
    table.string('refreshTokenHash').notNullable();
    table.string('ipAddress').nullable();
    table.text('userAgent').nullable();
    table.string('deviceInfo').nullable();
    table.boolean('isRevoked').notNullable().defaultTo(false).index();
    table.timestamp('lastUsedAt').nullable();
    table.timestamp('expiresAt').notNullable().index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('auth_sessions');
};
