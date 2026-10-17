import type { APIRoute } from 'astro';
import { createBlog } from '../../../lib/traviz/client';
import type { CreateBlogPayload } from '../../../lib/traviz/types';

export const prerender = false;

/**
 * Records a published blog against its originating request.
 *
 * The browser calls this after writing the post to Firestore; it runs
 * server-side so INTERNAL_API_KEY never reaches the client.
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { requestId, ...payload } = body as { requestId?: string } & CreateBlogPayload;

    if (!requestId) {
      return json({ error: 'requestId is required' }, 400);
    }

    const missing = (['uid', 'blogUrl', 'chatId', 'chatName', 'title'] as const).filter(
      (field) => !payload[field]
    );

    if (missing.length) {
      return json({ error: `Missing required field(s): ${missing.join(', ')}` }, 400);
    }

    const result = await createBlog(requestId, payload);

    return json({ success: true, result }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to record the blog';
    console.error('[api] createBlog failed', error);
    return json({ error: message }, 502);
  }
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
