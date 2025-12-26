const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
