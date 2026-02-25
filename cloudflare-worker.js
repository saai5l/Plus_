/**
 * ╔══════════════════════════════════════════════════════╗
 * ║   Plus Dev — Cloudflare Worker Proxy                 ║
 * ║                                                      ║
 * ║   طريقة الرفع:                                       ║
 * ║   1. روح https://dash.cloudflare.com                 ║
 * ║   2. Workers & Pages → Create Worker                 ║
 * ║   3. انسخ هذا الكود كله والصقه                       ║
 * ║   4. اضغط Deploy                                     ║
 * ║   5. انسخ الرابط مثل: https://plusdev.xxx.workers.dev║
 * ║   6. حطه في PROXY_URL بالأسفل في fivem-profile.js    ║
 * ╚══════════════════════════════════════════════════════╝
 */

const FIVEM_IP   = '147.189.171.57';
const FIVEM_PORT = 30120;
const API_KEY    = 'Seif_2025_Secure';
const ALLOWED_ORIGIN = '*';

export default {
  async fetch(request) {
    const url   = new URL(request.url);
    const path  = url.pathname;
    const query = url.search;

    if (request.method === 'OPTIONS') {
      return corsResponse('{}');
    }

    if (path !== '/player' && path !== '/online') {
      return corsResponse(JSON.stringify({ success: false, error: 'مسار غير معروف' }), 404);
    }

    const target = `http://${FIVEM_IP}:${FIVEM_PORT}${path}${query}`;

    try {
      const res = await fetch(target, {
        headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      const body = await res.text();
      return corsResponse(body, res.status);
    } catch (err) {
      const msg = err.message?.includes('timeout')
        ? 'انتهت مهلة الاتصال بالسيرفر'
        : 'السيرفر غير متاح حالياً';
      return corsResponse(JSON.stringify({ success: false, error: msg }), 503);
    }
  }
};

function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type'                : 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin' : ALLOWED_ORIGIN,
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control'               : 'no-cache',
    },
  });
}
