const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Signup - creates a new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error });
    res.status(201).json({ data });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login - returns session and sets HttpOnly cookie
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error });

    const accessToken = data?.session?.access_token;
    if (accessToken) {
      // Set secure HttpOnly cookie
      res.cookie('supabase_session', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      });
    }

    res.json({ data });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout - clears cookie
router.post('/logout', (req, res) => {
  res.clearCookie('supabase_session');
  res.json({ ok: true });
});

// Session - validate token from cookie or Authorization header
router.get('/session', async (req, res) => {
  try {
    const token = req.cookies?.supabase_session || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(200).json({ user: null });

    const { data, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ user: null, error });
    res.json({ user: data.user });
  } catch (err) {
    console.error('Session error', err);
    res.status(500).json({ error: 'Session check failed' });
  }
});

module.exports = router;
