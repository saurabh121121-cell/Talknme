const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aipwsddemomhicymqjmp.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const MARTPAY_WEBHOOK_SECRET = process.env.MARTPAY_WEBHOOK_SECRET;
const ALLOWED_STATUSES = new Set([
  'NOT_FOUND',
  'IN_PROGRESS',
  'ACCEPTED_SETTLEMENT_IN_PROCESS',
  'COMPLETED',
  'CANCELED',
]);

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

async function recordWebhook(payload) {
  if (!SUPABASE_ANON_KEY) throw new Error('SUPABASE_ANON_KEY is not configured');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_martpay_webhook`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  if (!MARTPAY_WEBHOOK_SECRET) return res.status(500).send('Webhook secret is not configured');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const data = typeof body.data === 'string' ? body.data : '';
    const sign = typeof body.sign === 'string' ? body.sign : '';
    if (!data || !sign) return res.status(400).send('Invalid webhook');

    const calculatedSign = crypto
      .createHmac('sha256', MARTPAY_WEBHOOK_SECRET)
      .update(data)
      .digest('base64');

    if (!safeEqual(calculatedSign, sign)) return res.status(401).send('Invalid signature');

    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
    } catch {
      return res.status(400).send('Invalid webhook data');
    }

    const status = String(decoded.payment_status || '');
    const merchantOrderId = String(decoded.order_id || '');
    if (!merchantOrderId || !ALLOWED_STATUSES.has(status)) return res.status(400).send('Invalid payment data');

    const rows = await recordWebhook({
      p_merchant_order_id: merchantOrderId,
      p_status: status,
      p_martpay_id: decoded.id ? String(decoded.id) : null,
      p_customer_email: decoded.customer_email ? String(decoded.customer_email) : null,
      p_total_amount: decoded.total_amount == null ? null : Number(decoded.total_amount),
      p_currency_code: decoded.currency_code ? String(decoded.currency_code) : null,
    });

    if (!rows || (Array.isArray(rows) && !rows[0])) {
      console.error('MartPay webhook did not match a pending order', merchantOrderId);
      return res.status(409).send('Order not found or mismatched');
    }

    // MartPay requires HTTP 200 and the literal string OK.
    return res.status(200).send('OK');
  } catch (error) {
    console.error('martpay-webhook error', error);
    return res.status(500).send('Webhook processing failed');
  }
};
