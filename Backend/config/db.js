// // src/models/db.js
// const { Pool } = require('pg');
// const dotenv = require('dotenv');

// // Load environment variables from .env file
// dotenv.config();

// // Configure the connection pool
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || '5432'),
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: true,
//     ca: process.env.DB_SSL_CA,  // SSL certificate from the environment variable
//   },
// });

// // Test the PostgreSQL connection when the app starts
// pool.connect()
//   .then(() => {
//     console.log('PostgreSQL connected successfully!');
//   })
//   .catch(err => {
//     console.error('Error connecting to PostgreSQL:', err);
//   });

// // Query function for interacting with the database
// const query = async (text, params = []) => {
//   try {
//     return await pool.query(text, params);
//   } catch (err) {
//     console.error('Error executing query', err);
//     throw err;  // Re-throw error after logging
//   }
// };

// module.exports = { query, pool };
