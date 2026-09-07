const PLANS = Object.freeze({
  '10': { minutes: 10, amount: '6.00' },
  '20': { minutes: 20, amount: '32.00' },
  '30': { minutes: 30, amount: '45.00' },
  '60': { minutes: 60, amount: '84.00' },
});

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aipwsddemomhicymqjmp.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_gQiJEwyU9WNajNAFd9CGCQ_HrUqEYcO';
const MARTPAY_API_KEY = process.env.MARTPAY_API_KEY;
const BASE_URL = process.env.TALKNME_BASE_URL || 'https://talknme.com';

const MARTPAY_URL = 'https://api.martpay.net/api/mc/payment';

async function supabaseRpc(name, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

function findPaymentUrl(value) {
  const preferred = new Set(['payment_url', 'paymentUrl', 'checkout_url', 'checkoutUrl', 'redirect_url', 'redirectUrl', 'payment_link', 'paymentLink', 'url', 'link']);
  const seen = new Set();
  function walk(node) {
    if (!node || typeof node !== 'object' || seen.has(node)) return null;
    seen.add(node);
    for (const key of preferred) {
      if (typeof node[key] === 'string' && /^https?:\/\//i.test(node[key])) return node[key];
    }
    for (const key of Object.keys(node)) {
      const hit = walk(node[key]);
      if (hit) return hit;
    }
    return null;
  }
  return walk(value);
}

function safeMartPayError(data, text) {
  if (data && typeof data === 'object') {
    const sanitize = (value, depth = 0) => {
      if (depth > 4) return '[truncated]';
      if (Array.isArray(value)) return value.slice(0, 20).map(v => sanitize(v, depth + 1));
      if (!value || typeof value !== 'object') return value;
      const out = {};
      for (const [key, value2] of Object.entries(value)) {
        if (/api.?key|secret|token|authorization|password/i.test(key)) continue;
        out[key] = sanitize(value2, depth + 1);
      }
      return out;
    };
    return sanitize(data);
  }
  return { message: String(text || 'Unknown MartPay error').slice(0, 1000) };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!MARTPAY_API_KEY) return res.status(500).json({ error: 'MartPay API key is not configured' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const planId = String(body.plan_id || '');
    const plan = PLANS[planId];
    if (!plan) return res.status(400).json({ error: 'Invalid plan' });

    const merchantOrderId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
    const currency = 'EUR';
    const returnUrl = new URL('/', BASE_URL);
    returnUrl.searchParams.set('payment_order', merchantOrderId);

    await supabaseRpc('create_payment_order', {
      p_merchant_order_id: merchantOrderId,
      p_plan_id: planId,
      p_minutes: plan.minutes,
      p_amount: Number(plan.amount),
      p_currency: currency,
    });

    // MartPay expects these exact field names for the payment-creation request.
    // Do not put the API key in this payload or in logs.
    const paymentPayload = {
      order_id: merchantOrderId,
      amount: Number(plan.amount),
      currency,
      redirect_url: returnUrl.toString(),
    };

    console.log('MartPay POST request payload', paymentPayload);

    const paymentResponse = await fetch(MARTPAY_URL, {
      method: 'POST',
      headers: {
        'x-api-key': MARTPAY_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    const text = await paymentResponse.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!paymentResponse.ok) {
      console.error('MartPay create payment failed', paymentResponse.status, data, {
        sent_payload: paymentPayload,
      });
      return res.status(502).json({
        error: 'MartPay could not create the payment link',
        martpay_status: paymentResponse.status,
        martpay_error: safeMartPayError(data, text),
        sent_fields: Object.keys(paymentPayload),
      });
    }

    const paymentUrl = findPaymentUrl(data);
    if (!paymentUrl) {
      console.error('MartPay response did not contain a recognizable payment URL', data);
      return res.status(502).json({ error: 'MartPay returned no payment URL' });
    }

    return res.status(200).json({ merchant_order_id: merchantOrderId, payment_url: paymentUrl, minutes: plan.minutes, amount: plan.amount, currency });
  } catch (error) {
    console.error('create-payment error', error);
    return res.status(500).json({ error: 'Unable to start payment' });
  }
};
