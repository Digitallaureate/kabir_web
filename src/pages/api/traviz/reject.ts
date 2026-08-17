import type { APIRoute } from 'astro';
import { rejectBlogRequest } from '../../../lib/traviz/client';

export const prerender = false;

// Rejecting runs server-side so the Traviz API key stays off the client.
export const POST: APIRoute = async ({ request }) => {
  try {
    const { id, reason } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Request id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await rejectBlogRequest(id, reason ?? '');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reject request';
    console.error('Reject blog request failed', error);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
