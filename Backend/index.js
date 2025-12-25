const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { pool } = require('./config/db');
const motherRoutes = require('./routes/motherRoute');
const dbProxyRoutes = require('./routes/dbProxy');
const authRoutes = require('./routes/auth');
const childrenRoutes = require('./routes/childrenRoutes');
dotenv.config();

const app = express();
app.use(cors());

// parse cookies for auth middleware to use
app.use(cookieParser());

const PORT = process.env.PORT;



app.use(express.json());

app.use('/api/model', motherRoutes);
app.use('/api/db', dbProxyRoutes);
app.use('/api/auth', authRoutes);

// Expose children endpoints at /api/children for frontend convenience
app.use('/api/children', childrenRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// app.get("/", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()"); // Simple query to test connection
//     res.send(`PostgreSQL connected! Server time is ${result.rows[0].now}`);
//     server.listen(port, () => {
//       console.log(`Server running at http://localhost:${port}`);
//   });

//    // The reloader function to keep the server active
//   const url = process.env.B_LINK; // Replace with your Render URL
//   const interval = 30000; // Interval in milliseconds (30 seconds)

//   function reloadWebsite() {
//     axios.get(url)
//       .then(response => {
//         console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
//       })
//       .catch(error => {
//         console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
//       });
//   }

//   // Start the reloader function at the specified interval
//   setInterval(reloadWebsite, interval);
//   } catch (err) {
//     console.error("Error testing PostgreSQL connection:", err);
//     res.status(500).send("Internal Server Error");
//   }
  
// });