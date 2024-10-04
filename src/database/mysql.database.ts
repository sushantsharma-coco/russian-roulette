import { config } from "dotenv";
import { createPool, PoolOptions } from "mysql2/promise";

config({
  path: ".env",
});

const mysqlConfig: PoolOptions = {
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = createPool(mysqlConfig);

export const mysqlConnect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL");

    // Execute database creation (if not exists)
    await pool.query(`CREATE DATABASE IF NOT EXISTS Games`);
    console.log("Database 'scoreboard' created successfully");

    // Release the connection back to the pool
  } catch (error) {
    console.error(
      "Error occurred during MySQL connection:",
      error,
      ", ended db connection"
    );
    await pool.end();
  }
};
