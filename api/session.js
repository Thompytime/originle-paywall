import crypto from 'node:crypto';

function sign(value) {
  return crypto.createHmac('sha256', process.env.COOKIE_SECRET).update(value).digest('hex');
}

function parseCookies(cookieHeader = '') {
  const cookies = {};
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    cookies[trimmed.slice(0, index)] = decodeURIComponent(trimmed.slice(index + 1));
  }
  return cookies;
}

export default async function handler(req, res) {
  try {
    const cookies = parseCookies(req.headers.cookie || '');
    const raw = cookies.originle_paid;

    if (!raw || !raw.includes('.')) {
      return res.status(200).json({ paid: false });
    }

    const [encoded, signature] = raw.split('.');
    const valid = signature === sign(encoded);

    if (!valid) {
      return res.status(200).json({ paid: false });
    }

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return res.status(200).json({ paid: Boolean(payload?.paid) });
  } catch (error) {
    console.error('session error', error);
    return res.status(200).json({ paid: false });
  }
}
