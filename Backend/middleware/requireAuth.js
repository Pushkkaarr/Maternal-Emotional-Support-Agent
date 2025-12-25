const supabase = require('../config/supabase');

// Simple middleware to verify bearer token with Supabase
module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth middleware error', err);
    res.status(500).json({ error: 'Auth verification failed' });
  }
};
