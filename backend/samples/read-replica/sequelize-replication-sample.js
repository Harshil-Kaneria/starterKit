const { Sequelize } = require('sequelize');

// REVIEW SAMPLE ONLY
// Not used by production app yet.

const db = new Sequelize({
  dialect: 'mysql',
  replication: {
    write: {
      host: process.env.DB_WRITE_HOST,
      port: Number(process.env.DB_WRITE_PORT || 3306),
      username: process.env.DB_WRITE_USER,
      password: process.env.DB_WRITE_PASS,
      database: process.env.DB_NAME
    },
    read: [
      {
        host: process.env.DB_READ_HOST_1,
        port: Number(process.env.DB_READ_PORT_1 || 3306),
        username: process.env.DB_READ_USER_1,
        password: process.env.DB_READ_PASS_1,
        database: process.env.DB_NAME
      },
      {
        host: process.env.DB_READ_HOST_2,
        port: Number(process.env.DB_READ_PORT_2 || 3306),
        username: process.env.DB_READ_USER_2,
        password: process.env.DB_READ_PASS_2,
        database: process.env.DB_NAME
      }
    ]
  },
  pool: {
    max: 25,
    min: 5,
    acquire: 30000,
    idle: 10000
  },
  benchmark: true,
  logging: false
});

module.exports = db;
