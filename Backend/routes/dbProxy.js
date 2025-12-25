const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/requireAuth');

// Public: get wishlist items (used by Donation page)
router.get('/wishlist', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inventory_requests')
      .select('*')
      .eq('display_on_wishlist', true)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error });
    res.json({ data });
  } catch (err) {
    console.error('Wishlist error', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Public: create donation record
router.post('/donations', async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from('donations').insert([payload]);
    if (error) return res.status(500).json({ error });
    res.status(201).json({ data });
  } catch (err) {
    console.error('Create donation error', err);
    res.status(500).json({ error: 'Failed to create donation' });
  }
});

// Public: create donation pledge
router.post('/donation_pledges', async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from('donation_pledges').insert([payload]);
    if (error) return res.status(500).json({ error });
    res.status(201).json({ data });
  } catch (err) {
    console.error('Create pledge error', err);
    res.status(500).json({ error: 'Failed to create pledge' });
  }
});

// Example protected admin route: list all donations
router.get('/admin/donations', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error });
    res.json({ data });
  } catch (err) {
    console.error('Admin donations error', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

module.exports = router;
