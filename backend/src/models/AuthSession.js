module.exports = (sequelize, DataTypes) => {
  const AuthSession = sequelize.define(
    'AuthSession',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      secretId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      loginType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      refreshTokenHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      deviceInfo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'auth_sessions',
      timestamps: true
    }
  );

  return AuthSession;
};
