const supabase = require('../config/supabase');

exports.getInventoryItems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('id, item_name, unit, quantity')
      .order('item_name');

    if (error) return res.status(500).json({ error });
    res.json({ data });
  } catch (err) {
    console.error('Get inventory items error', err);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
};

exports.getMovements = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select(`*, inventory:inventory_id (item_name, unit, quantity)`)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error });
    res.json({ data });
  } catch (err) {
    console.error('Get movements error', err);
    res.status(500).json({ error: 'Failed to fetch movements' });
  }
};

exports.createMovement = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.inventory_id || !payload.quantity) {
      return res.status(400).json({ error: 'Missing movement data' });
    }

    const quantity = parseInt(payload.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) return res.status(400).json({ error: 'Invalid quantity' });

    // Insert movement
    const { data, error } = await supabase.from('inventory_movements').insert([{ ...payload, quantity }]).select();
    if (error) return res.status(500).json({ error });

    // Update inventory quantity
    const movementType = (payload.movement_type || 'IN').toUpperCase();
    const adjust = movementType === 'IN' ? quantity : -quantity;

    const { error: updateErr } = await supabase
      .from('inventory')
      .update({ quantity: supabase.rpc ? null : undefined })
      .eq('id', payload.inventory_id);

    // Fallback: read current quantity and update
    const { data: itemData, error: itemErr } = await supabase.from('inventory').select('quantity').eq('id', payload.inventory_id).single();
    if (itemErr) console.warn('Could not read inventory quantity', itemErr);
    const currentQty = itemData?.quantity ?? 0;
    const newQty = currentQty + adjust;
    await supabase.from('inventory').update({ quantity: newQty }).eq('id', payload.inventory_id);

    res.status(201).json({ data: data[0] });
  } catch (err) {
    console.error('Create movement error', err);
    res.status(500).json({ error: 'Failed to create movement' });
  }
};
