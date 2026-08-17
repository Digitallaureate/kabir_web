// Single access point for everything that comes from (or goes to) the Traviz backend.
//
// While TRAVIZ_API_BASE / TRAVIZ_API_KEY are unset this runs entirely on the mock
// data in ./mockData. Setting both env vars switches every call to the live API —
// no page or component needs to change.
//
// Server-side only. The API key must never reach the browser, so pages should call
// these through an Astro API route or from frontmatter, never from a <script>.

import type {
  BlogRequest,
  BlogRequestStatus,
  ChatTranscript,
  PublishBlogPayload,
  PublishBlogResult,
} from './types';
import { mockBlogRequests, mockChats } from './mockData';

const API_BASE = import.meta.env.TRAVIZ_API_BASE;
const API_KEY = import.meta.env.TRAVIZ_API_KEY;

/** Mock mode is the default until both env vars are provided. */
export const USE_MOCK =
  import.meta.env.TRAVIZ_USE_MOCK === 'true' || !API_BASE || !API_KEY;

/**
 * Status changes made during a mock session, keyed by request id.
 * Lets the create-blog flow be exercised end to end before Traviz exists.
 * Process memory only — resets on server restart, which is fine for dev.
 */
const mockStatusOverrides = new Map<string, BlogRequestStatus>();

async function travizFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Traviz ${init.method || 'GET'} ${path} failed: ${response.status} ${body}`);
  }

  return response.json() as Promise<T>;
}

/**
 * GET /blog-requests
 * Returns newest first. Pass a status to filter, or omit for everything.
 */
export async function getBlogRequests(status?: BlogRequestStatus): Promise<BlogRequest[]> {
  if (USE_MOCK) {
    const requests = mockBlogRequests
      .map((request) => ({
        ...request,
        status: mockStatusOverrides.get(request.id) ?? request.status,
      }))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return status ? requests.filter((request) => request.status === status) : requests;
  }

  const path = status ? `/blog-requests?status=${encodeURIComponent(status)}` : '/blog-requests';
  return travizFetch<BlogRequest[]>(path);
}

/** Convenience lookup for the create-blog prefill. */
export async function getBlogRequest(id: string): Promise<BlogRequest | null> {
  const requests = await getBlogRequests();
  return requests.find((request) => request.id === id) ?? null;
}

/** GET /chats/{chatId} — the transcript the AI prefill summarises. */
export async function getChat(chatId: string): Promise<ChatTranscript | null> {
  if (USE_MOCK) {
    return mockChats[chatId] ?? null;
  }

  try {
    return await travizFetch<ChatTranscript>(`/chats/${encodeURIComponent(chatId)}`);
  } catch (error) {
    console.error('Failed to load Traviz chat', chatId, error);
    return null;
  }
}

/**
 * POST /blogs
 * Traviz creates the blog, writes it to its own database and mirrors it into the
 * EcoStory database, then reports both ids back.
 */
export async function publishBlog(payload: PublishBlogPayload): Promise<PublishBlogResult> {
  if (USE_MOCK) {
    mockStatusOverrides.set(payload.requestId, 'published');
    console.info('[traviz:mock] publishBlog', payload.slug);

    return {
      travizBlogId: `mock_traviz_${payload.requestId}`,
      ecostoryBlogId: `mock_ecostory_${payload.requestId}`,
      requestStatus: 'published',
    };
  }

  return travizFetch<PublishBlogResult>('/blogs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Marks a request as handled after its blog has been created.
 *
 * Phase 1: the live POST /blogs response reports the new status, so this
 * becomes unnecessary once Traviz owns the write.
 */
export async function markRequestPublished(
  id: string,
  meta: { slug?: string; title?: string } = {}
): Promise<void> {
  if (USE_MOCK) {
    mockStatusOverrides.set(id, 'published');
    console.info('[traviz:mock] markRequestPublished', id, meta.slug);
    return;
  }

  await travizFetch(`/blog-requests/${encodeURIComponent(id)}/complete`, {
    method: 'POST',
    body: JSON.stringify(meta),
  });
}

/** Marks a request as rejected so it leaves the admin queue. */
export async function rejectBlogRequest(id: string, reason: string): Promise<void> {
  if (USE_MOCK) {
    mockStatusOverrides.set(id, 'rejected');
    console.info('[traviz:mock] rejectBlogRequest', id, reason);
    return;
  }

  await travizFetch(`/blog-requests/${encodeURIComponent(id)}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

/** Count used for the sidebar badge. */
export async function getPendingRequestCount(): Promise<number> {
  try {
    const requests = await getBlogRequests();
    return requests.filter((request) => request.status === 'pending').length;
  } catch (error) {
    console.error('Failed to count pending blog requests', error);
    return 0;
  }
}
