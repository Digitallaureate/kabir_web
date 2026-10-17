

import type {
  ApiEnvelope,
  BlogRequest,
  BlogRequestDetail,
  ChatTranscript,
  CreateBlogPayload,
} from './types';

const DEFAULT_API_BASE = 'https://ecostory-backend-36036911566.us-central1.run.app/api';

// import.meta.env only exists under Vite; optional chaining keeps this module
// importable from plain Node (scripts, tests) where only process.env is present.
export const API_BASE =
  import.meta.env?.TRAVIZ_API_BASE ?? process.env.TRAVIZ_API_BASE ?? DEFAULT_API_BASE;

const INTERNAL_API_KEY =
  import.meta.env?.INTERNAL_API_KEY ?? process.env.INTERNAL_API_KEY;

/** The backend's documented maximum page size. */
const PAGE_LIMIT = 100;

/**
 * Request logging. On by default in dev; set TRAVIZ_DEBUG=false to silence it,
 * or TRAVIZ_DEBUG=true to enable it in a production build.
 */
const DEBUG = (() => {
  const flag = import.meta.env?.TRAVIZ_DEBUG ?? process.env.TRAVIZ_DEBUG;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return Boolean(import.meta.env?.DEV);
})();

/** Never print a full secret — enough to confirm which key is in use, no more. */
function maskSecret(value: string): string {
  if (value.length <= 8) return `${'*'.repeat(value.length)} (${value.length} chars)`;
  return `${value.slice(0, 4)}…${value.slice(-4)} (${value.length} chars)`;
}

function logRequest(method: string, url: string, headers: Record<string, string>) {
  const shown = Object.entries(headers).map(([name, value]) =>
    `      ${name}: ${/key|authorization|token/i.test(name) ? maskSecret(value) : value}`
  );

  console.log(
    `\n[api] → ${method} ${url}\n    headers:\n${shown.join('\n')}` +
      (INTERNAL_API_KEY ? '' : '\n    (no API key configured)')
  );
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    accept: 'application/json',
    ...(init.headers as Record<string, string>),
  };

  // Every blog API call is authenticated with this header — the name the
  // backend's APIKeyHeader security scheme declares. Sent only when a key is
  // configured, so local development against an unsecured backend still works.
  if (INTERNAL_API_KEY) {
    headers['X-API-Key'] = INTERNAL_API_KEY;
  } else if (!API_BASE.includes('127.0.0.1') && !API_BASE.includes('localhost')) {
    console.warn(
      '[api] INTERNAL_API_KEY is not set — calling a non-local backend without authentication'
    );
  }

  const method = init.method || 'GET';
  const url = `${API_BASE}${path}`;

  if (DEBUG) logRequest(method, url, headers);

  const startedAt = Date.now();
  const response = await fetch(url, { ...init, headers });
  const elapsed = Date.now() - startedAt;

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    if (DEBUG) {
      console.log(`[api] ← ${response.status} ${response.statusText} in ${elapsed}ms`);
      console.log(`    body: ${body.slice(0, 300)}`);
    }
    throw new Error(`API ${method} ${path} failed: ${response.status} ${body}`);
  }

  if (DEBUG) console.log(`[api] ← ${response.status} in ${elapsed}ms`);

  return response.json() as Promise<T>;
}

/** Unwraps the { msg: { data, meta }, metadata: { success } } envelope. */
function unwrap<T>(payload: ApiEnvelope<T>, path: string): T {
  if (payload?.metadata?.success === false) {
    throw new Error(`API ${path} returned success: false`);
  }
  if (!payload?.msg || payload.msg.data === undefined) {
    throw new Error(`API ${path} returned an unexpected envelope`);
  }
  return payload.msg.data;
}

/**
 * GET /api/blog/requests
 *
 * Fetches every page and returns the requests newest first, exactly as the
 * backend models them. Status filtering is deliberately not applied — the
 * admin list currently shows everything.
 */
export async function getBlogRequests(): Promise<BlogRequest[]> {
  const collected: BlogRequest[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_LIMIT) });
    const path = `/blog/requests?${params}`;

    const payload = await apiFetch<ApiEnvelope<BlogRequest[]>>(path);
    collected.push(...unwrap(payload, path));

    totalPages = payload.msg.meta?.total_pages ?? 1;
    page += 1;
  } while (page <= totalPages);

  return collected.sort(
    (a, b) => Date.parse(b.created_at ?? '') - Date.parse(a.created_at ?? '')
  );
}

/**
 * GET /api/blog/requests/{id}
 *
 * Returns the request plus its generated draft. Note the envelope differs from
 * the list endpoint: `msg` IS the object here, with no `data` wrapper.
 *
 * The backend regenerates the draft on every call (currently ~7-8s), so this is
 * deliberately only called when the admin opens a request, never for the list.
 */
export async function getBlogRequestDetail(id: string): Promise<BlogRequestDetail | null> {
  try {
    const payload = await apiFetch<{ msg: BlogRequestDetail; metadata?: { success?: boolean } }>(
      `/blog/requests/${encodeURIComponent(id)}`
    );

    if (payload?.metadata?.success === false) {
      throw new Error('backend returned success: false');
    }
    if (!payload?.msg?.id) {
      throw new Error('unexpected envelope');
    }

    return payload.msg;
  } catch (error) {
    console.error('[api] could not load blog request detail', id, error);
    return null;
  }
}

/**
 * The chat transcript a draft would be written from.
 *
 * Not implemented on the backend yet — there is no GET for a single chat, only
 * POST /api/chat/get-or-create and /completions. Returns null on any failure so
 * the create form still opens with a blank editor rather than erroring.
 */
export async function getChat(chatId: string): Promise<ChatTranscript | null> {
  try {
    const payload = await apiFetch<ApiEnvelope<ChatTranscript>>(
      `/chat/${encodeURIComponent(chatId)}`
    );
    return unwrap(payload, 'chat');
  } catch (error) {
    console.warn('[api] chat transcript unavailable for', chatId, error);
    return null;
  }
}

/**
 * POST /api/blog/requests/{request_id}/blog
 *
 * Called after the post has been written to Firestore, so the backend has its
 * own record of the published blog and can close out the request.
 */
export async function createBlog(
  requestId: string,
  payload: CreateBlogPayload
): Promise<unknown> {
  return apiFetch(`/blog/requests/${encodeURIComponent(requestId)}/blog`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** Marks a request handled once its blog exists. Not implemented yet. */
export async function markRequestPublished(
  id: string,
  meta: { slug?: string; title?: string } = {}
): Promise<void> {
  await apiFetch(`/blog/requests/${encodeURIComponent(id)}/complete`, {
    method: 'POST',
    body: JSON.stringify(meta),
  });
}

/** Removes a request from the queue. Not implemented yet. */
export async function rejectBlogRequest(id: string, reason: string): Promise<void> {
  await apiFetch(`/blog/requests/${encodeURIComponent(id)}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}
