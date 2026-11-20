// Sagoappen's own server: the built app, and the story narration it used to
// fetch from a Supabase edge function in Lovable Cloud.
//
// POST /api/story-narration {"text": "..."} -> audio/mpeg, read by ElevenLabs
// with the same voice and settings the edge function used. The key stays here
// (ELEVENLABS_API_KEY); the browser never sees it.
//
// No dependencies: Node's own http, fs and zlib.
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createGzip } from 'node:zlib';
import { Readable } from 'node:stream';

const PORT = Number(process.env.PORT) || 8080;
const ROOT = process.env.STATIC_DIR || '/app/dist';
const API_KEY = process.env.ELEVENLABS_API_KEY || '';
// "Charlotte": warm and suited to children's stories.
const VOICE = process.env.ELEVENLABS_VOICE_ID || 'XB0fDUnXU5powFXDhCwa';
const MODEL = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
// ElevenLabs bills per character, and the endpoint is open to anyone who can
// load the app: a story is a few hundred words, so cap the text and the rate.
const MAX_CHARS = Number(process.env.NARRATION_MAX_CHARS) || 5000;
const PER_WINDOW = Number(process.env.NARRATION_PER_10_MIN) || 40;
const WINDOW_MS = 10 * 60 * 1000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
};
const COMPRESS = new Set(['.html', '.js', '.css', '.json', '.svg', '.webmanifest', '.txt']);

// Requests per address in the current window. Behind the hotel's Caddy the
// address is in X-Real-IP; run alone, it is the socket's.
const seen = new Map();
function allowed(ip) {
  const now = Date.now();
  const entry = seen.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    seen.set(ip, { start: now, n: 1 });
    if (seen.size > 10000) for (const [k, v] of seen) if (now - v.start > WINDOW_MS) seen.delete(k);
    return true;
  }
  entry.n += 1;
  return entry.n <= PER_WINDOW;
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readJson(req, limit = 64 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('Texten är för lång'), { status: 413 });
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
  catch { throw Object.assign(new Error('Ogiltig förfrågan'), { status: 400 }); }
}

async function narrate(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Använd POST' });
  const ip = String(req.headers['x-real-ip'] || req.socket.remoteAddress || '');
  if (!allowed(ip)) return json(res, 429, { error: 'Många uppläsningar på kort tid. Vänta en stund och försök igen.' });
  if (!API_KEY) return json(res, 503, { error: 'Uppläsningen är inte påslagen här (ELEVENLABS_API_KEY saknas)' });

  let text;
  try { ({ text } = await readJson(req)); }
  catch (err) { return json(res, err.status || 400, { error: err.message }); }
  text = typeof text === 'string' ? text.trim() : '';
  if (!text) return json(res, 400, { error: 'Det finns ingen text att läsa upp' });
  if (text.length > MAX_CHARS) return json(res, 413, { error: `Texten är för lång för uppläsning (högst ${MAX_CHARS} tecken)` });

  let upstream;
  try {
    upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/stream`, {
      method: 'POST',
      headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0.4, use_speaker_boost: true },
      }),
      signal: AbortSignal.timeout(60000),
    });
  } catch (err) {
    console.error('narration: ElevenLabs unreachable:', err.message);
    return json(res, 502, { error: 'Kunde inte nå uppläsningstjänsten' });
  }
  if (!upstream.ok) {
    // ElevenLabs says why (quota, voice, key) in detail; log it, and tell the
    // child's screen only that it did not work.
    const detail = await upstream.text().catch(() => '');
    console.error(`narration: ElevenLabs ${upstream.status}: ${detail.slice(0, 300)}`);
    return json(res, upstream.status === 401 || upstream.status === 429 ? 503 : 502, { error: 'Uppläsningen fungerar inte just nu' });
  }
  console.log(`narration: ${text.length} chars`);
  res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' });
  Readable.fromWeb(upstream.body).on('error', () => res.destroy()).pipe(res);
}

function serveFile(req, res, path, cache) {
  const type = TYPES[extname(path).toLowerCase()] || 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Cache-Control': cache, 'X-Content-Type-Options': 'nosniff' };
  const gzip = COMPRESS.has(extname(path).toLowerCase()) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  if (gzip) headers['Content-Encoding'] = 'gzip';
  headers.Vary = 'Accept-Encoding';
  res.writeHead(200, headers);
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(path);
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
}

function isFile(path) {
  try { return statSync(path).isFile(); } catch { return false; }
}

function staticFile(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Method not allowed' });
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { pathname = '/'; }
  const file = normalize(join(ROOT, pathname));
  if (file !== ROOT && !file.startsWith(ROOT + '/')) return json(res, 400, { error: 'Bad path' });
  // Hashed build output never changes under its name; everything else, and
  // the page itself, is checked on every load so a deploy shows at once.
  if (pathname.startsWith('/assets/')) {
    return isFile(file) ? serveFile(req, res, file, 'public, max-age=31536000, immutable') : json(res, 404, { error: 'Not found' });
  }
  if (pathname !== '/' && isFile(file)) return serveFile(req, res, file, 'no-cache');
  // A route of the app itself: the page, and React Router takes it from there.
  return serveFile(req, res, join(ROOT, 'index.html'), 'no-cache');
}

createServer((req, res) => {
  const path = (req.url || '/').split('?')[0];
  if (path === '/api/story-narration') return narrate(req, res).catch(err => {
    console.error('narration:', err);
    if (!res.headersSent) json(res, 500, { error: 'Något gick fel' });
  });
  if (path === '/healthz') return json(res, 200, { ok: true, narration: Boolean(API_KEY) });
  return staticFile(req, res);
}).listen(PORT, () => console.log(`sagoappen on :${PORT}, narration ${API_KEY ? 'on' : 'off (no ELEVENLABS_API_KEY)'}`));
