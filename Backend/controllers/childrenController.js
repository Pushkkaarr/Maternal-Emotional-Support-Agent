const supabase = require('../config/supabase');

exports.getChildren = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error });
    res.json({ data });
  } catch (err) {
    console.error('Get children error', err);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
};

exports.createChild = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) return res.status(400).json({ error: 'Missing child data' });

    const { data, error } = await supabase.from('children').insert([payload]).select();
    if (error) return res.status(500).json({ error });

    res.status(201).json({ data: data[0] });
  } catch (err) {
    console.error('Create child error', err);
    res.status(500).json({ error: 'Failed to create child' });
  }
};

exports.updateChild = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    if (!id || !payload) return res.status(400).json({ error: 'Missing parameters' });

    const { data, error } = await supabase.from('children').update(payload).eq('id', id).select();
    if (error) return res.status(500).json({ error });

    res.json({ data: data[0] });
  } catch (err) {
    console.error('Update child error', err);
    res.status(500).json({ error: 'Failed to update child' });
  }
};

exports.deleteChild = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const { error } = await supabase.from('children').delete().eq('id', id);
    if (error) return res.status(500).json({ error });

    res.json({ ok: true });
  } catch (err) {
    console.error('Delete child error', err);
    res.status(500).json({ error: 'Failed to delete child' });
  }
};
