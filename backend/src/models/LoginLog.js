module.exports = (sequelize, DataTypes) => {
  const LoginLog = sequelize.define(
    'LoginLog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      secretId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      loginType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      event: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
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
      meta: {
        type: DataTypes.JSONB,
        allowNull: true
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
      tableName: 'login_logs',
      timestamps: true
    }
  );

  return LoginLog;
};
