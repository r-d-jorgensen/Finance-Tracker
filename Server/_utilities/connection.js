import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

export default connectionPool;