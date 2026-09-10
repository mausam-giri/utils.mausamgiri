const COUNT_KEY = 'visit_count';
const VISITOR_COOKIE = 'visit_counted';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function teamQuery() {
  const teamId = process.env.VERCEL_TEAM_ID || process.env.VERCEL_ORG_ID;
  return teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
}

function restToken() {
  return process.env.VERCEL_API_TOKEN || process.env.VERCEL_TOKEN || '';
}

function configId() {
  if (process.env.GLOBAL_CONFIG_ID) return process.env.GLOBAL_CONFIG_ID;
  const connection = process.env.GLOBAL_CONFIG;
  if (!connection) return '';
  try {
    const url = new URL(connection);
    return url.pathname.replace(/^\//, '').split('/')[0];
  } catch {
    return '';
  }
}

function parseCookie(header, name) {
  if (!header) return '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

function toCount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

async function readCount(id, token) {
  const response = await fetch(
    `https://api.vercel.com/v1/global-config/${id}/item/${COUNT_KEY}${teamQuery()}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (response.status === 404) return 0;
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`read_failed:${response.status}:${detail}`);
  }

  const data = await response.json();
  return toCount(data && Object.prototype.hasOwnProperty.call(data, 'value') ? data.value : data);
}

async function writeCount(id, token, count) {
  const response = await fetch(
    `https://api.vercel.com/v1/global-config/${id}/items${teamQuery()}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ operation: 'upsert', key: COUNT_KEY, value: count }],
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`write_failed:${response.status}:${detail}`);
  }
}

function setVisitorCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${VISITOR_COOKIE}=1; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax; Secure; HttpOnly`,
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'method_not_allowed' });
  }

  const token = restToken();
  const id = configId();
  if (!token || !id) {
    return json(res, 500, { error: 'visits_not_configured' });
  }

  try {
    const alreadyCounted = parseCookie(req.headers.cookie, VISITOR_COOKIE) === '1';
    let count = await readCount(id, token);

    if (req.method === 'POST' && !alreadyCounted) {
      count += 1;
      await writeCount(id, token, count);
      setVisitorCookie(res);
    } else if (alreadyCounted) {
      setVisitorCookie(res);
    }

    return json(res, 200, { count });
  } catch (error) {
    return json(res, 502, { error: 'visits_unavailable' });
  }
};
