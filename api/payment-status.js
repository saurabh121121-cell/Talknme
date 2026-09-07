const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aipwsddemomhicymqjmp.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_gQiJEwyU9WNajNAFd9CGCQ_HrUqEYcO';

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const merchantOrderId = String((req.query && req.query.order_id) || '');
  if (!merchantOrderId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(merchantOrderId)) return res.status(400).json({ error: 'Invalid order_id' });
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_payment_status`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_merchant_order_id: merchantOrderId }),
    });
    if (!r.ok) return res.status(502).json({ error: 'Unable to read payment status' });
    const rows = await r.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) return res.status(404).json({ error: 'Payment not found' });
    return res.status(200).json(row);
  } catch (error) {
    console.error('payment-status error', error);
    return res.status(500).json({ error: 'Unable to read payment status' });
  }
};
