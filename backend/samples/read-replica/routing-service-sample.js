// REVIEW SAMPLE ONLY
// Demonstrates read/write routing style in service layer.

const { QueryTypes } = require('sequelize');
const db = require('./sequelize-replication-sample');

const UserSampleService = {
  // Read-heavy list: prefer replica (useMaster: false)
  async listUsers({ limit = 20, offset = 0 }) {
    return db.query(
      'SELECT id, secretId, name, email FROM users WHERE isDeleted = 0 ORDER BY id DESC LIMIT :limit OFFSET :offset',
      {
        replacements: { limit, offset },
        type: QueryTypes.SELECT,
        useMaster: false
      }
    );
  },

  // Read-after-write sensitive read: force writer (useMaster: true)
  async getUserForImmediateConsistency(secretId) {
    const rows = await db.query(
      'SELECT id, secretId, name, email FROM users WHERE secretId = :secretId LIMIT 1',
      {
        replacements: { secretId },
        type: QueryTypes.SELECT,
        useMaster: true
      }
    );
    return rows[0] || null;
  },

  // All writes always go to writer
  async softDeleteUser(secretId) {
    await db.query(
      'UPDATE users SET isDeleted = 1, updatedAt = NOW() WHERE secretId = :secretId AND isDeleted = 0',
      {
        replacements: { secretId },
        type: QueryTypes.UPDATE,
        useMaster: true
      }
    );
  }
};

module.exports = UserSampleService;
