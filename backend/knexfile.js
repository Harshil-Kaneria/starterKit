require('dotenv').config();

const knexBaseConfig = {
    client: 'pg',
    connection: {
        database: process.env.DB_NAME || 'nutriscan',
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        password: process.env.DB_PASS || '',
        ssl: String(process.env.DB_SSL_ENABLED || 'false').toLowerCase() === 'true'
            ? {
                rejectUnauthorized: String(process.env.DB_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() === 'true'
            }
            : false
    },
    pool: {
        min: Number(process.env.DB_POOL_MIN || 2),
        max: Number(process.env.DB_POOL_MAX || 20)
    },
    migrations: {
        directory: './src/migrations',
    },
    seeds: {
        directory: './src/seeders'
    }
};

module.exports = {
    development: {
        ...knexBaseConfig
    },

    staging: {
        ...knexBaseConfig
    },
};
