const supabase = require('../config/supabase');

exports.getAllDonations = async (req, res) => {
  try {
    const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error });
    res.json({ data });
  } catch (err) {
    console.error('Get donations error', err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const { data, error } = await supabase.from('donations').update(payload).eq('id', id).select();
    if (error) return res.status(500).json({ error });

    res.json({ data: data[0] });
  } catch (err) {
    console.error('Update donation error', err);
    res.status(500).json({ error: 'Failed to update donation' });
  }
};
