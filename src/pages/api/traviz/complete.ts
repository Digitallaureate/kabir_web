import type { APIRoute } from 'astro';
import { markRequestPublished } from '../../../lib/traviz/client';

export const prerender = false;

/**
 * Marks a blog request as handled once the admin has created its post.
 *
 * Phase 1 note: when the live Traviz API is wired up, POST /blogs handles this
 * itself and this route can go away — the status flip is part of that response.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { requestId, slug, title } = await request.json();

    if (!requestId) {
      return new Response(JSON.stringify({ error: 'requestId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await markRequestPublished(requestId, { slug, title });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update request';
    console.error('Complete blog request failed', error);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
