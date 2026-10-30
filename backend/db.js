// MySQL account storage is kept to show the original implementation.
// It is unused in this portfolio version because a shared database needs
// a separate server, such as the old Railway service. Favorites stay in the browser.
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export function mysqlHost() {
  return process.env.MYSQLHOST || process.env.DB_HOST || '';
}

export function hasMysqlConfig() {
  return Boolean(mysqlHost());
}

export function createMysqlConnection() {
  return mysql.createConnection({
    host: mysqlHost(),
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
    connectTimeout: 4000,
  });
}
