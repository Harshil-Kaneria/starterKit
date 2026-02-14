const { Op } = require('sequelize');
const { User } = require('../../models');

const findUserByEmail = (email) => User.findOne({ where: { email, isDeleted: false } });
const findUserBySecretId = (secretId) => User.findOne({ where: { secretId, isDeleted: false } });
const findUserById = (id) => User.findOne({ where: { id, isDeleted: false } });

const findOrCreateUserByEmail = async (email, defaults) => {
  return User.findOrCreate({
    where: { email, isDeleted: false },
    defaults
  });
};

const updateUserById = (id, payload) => User.update(payload, { where: { id } });

const clearDuplicateFcmTokens = (currentUserId, fcmToken) =>
  User.update(
    { fcmToken: null },
    {
      where: {
        id: { [Op.ne]: currentUserId },
        fcmToken
      }
    }
  );

module.exports = {
  findUserByEmail,
  findUserBySecretId,
  findUserById,
  findOrCreateUserByEmail,
  updateUserById,
  clearDuplicateFcmTokens
};
