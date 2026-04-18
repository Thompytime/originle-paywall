import Stripe from 'stripe';
import crypto from 'node:crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function sign(value) {
  return crypto.createHmac('sha256', process.env.COOKIE_SECRET).update(value).digest('hex');
}

export default async function handler(req, res) {
  const { session_id: sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).send('Missing session_id');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(403).send('Payment not completed');
    }

    const payload = JSON.stringify({
      paid: true,
      sessionId: session.id,
      paidAt: Date.now(),
    });
    const encoded = Buffer.from(payload).toString('base64url');
    const signature = sign(encoded);

    res.setHeader(
      'Set-Cookie',
      `originle_paid=${encoded}.${signature}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
    );

    return res.writeHead(302, { Location: '/play' }).end();
  } catch (error) {
    console.error('confirm-session error', error);
    return res.status(500).send('Could not verify payment');
  }
}
