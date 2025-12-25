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

const donationsController = require('../controllers/donationsController');

// Protected admin donations routes
router.get('/admin/donations', requireAuth, donationsController.getAllDonations);
router.put('/donations/:id', requireAuth, donationsController.updateDonation);

const childrenController = require('../controllers/childrenController');
const inventoryController = require('../controllers/inventoryController');

// Public: fetch children (list)
router.get('/children', childrenController.getChildren);

// Admin: create child
router.post('/children', requireAuth, childrenController.createChild);

// Admin: update child
router.put('/children/:id', requireAuth, childrenController.updateChild);

// Admin: delete child
router.delete('/children/:id', requireAuth, childrenController.deleteChild);

// Public: submit adoption application (delegates directly to DB for now)
router.post('/adoption_applications', async (req, res) => {
  try {
    const application = req.body;
    const { data, error } = await supabase.from('adoption_applications').insert([application]);
    if (error) return res.status(500).json({ error });

    if (application.child_id) {
      await supabase.from('children').update({ status: 'In Adoption Process' }).eq('id', application.child_id);
    }

    res.status(201).json({ data });
  } catch (err) {
    console.error('Create adoption application error', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Public: submit sponsorship
router.post('/sponsorships', async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from('sponsorships').insert([payload]);
    if (error) return res.status(500).json({ error });

    if (payload.child_id) {
      await supabase.from('children').update({ has_sponsor: true, sponsor_name: payload.sponsor_name }).eq('id', payload.child_id);
    }

    res.status(201).json({ data });
  } catch (err) {
    console.error('Create sponsorship error', err);
    res.status(500).json({ error: 'Failed to create sponsorship' });
  }
});

// Inventory routes (admin-protected for mutations)
// Get all inventory items
router.get('/inventory', requireAuth, inventoryController.getInventoryItems);

// Get movements
router.get('/inventory_movements', requireAuth, inventoryController.getMovements);

// Create movement (adjusts inventory quantity)
router.post('/inventory_movements', requireAuth, inventoryController.createMovement);

module.exports = router;


