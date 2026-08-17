// Types for the EcoStory backend API (http://127.0.0.1:8000/api).
//
// BlogRequest mirrors the API response exactly — same field names, same casing,
// same nullability — so what you read here is what the endpoint actually returns.

/**
 * One item from GET /api/blog/requests.
 * Matches the backend's BlogRequestItem schema field for field.
 */
export interface BlogRequest {
  id: string;
  chat_id: string;
  chat_title: string | null;
  user_id: string;
  user_name: string | null;
  order_id: string | null;
  request_id: string | null;
  service_id: string | null;
  service_request_id: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * The generated draft, exactly as GET /api/blog/requests/{id} returns it.
 *
 * Note `content` is a markdown string, not Editor.js blocks — it is converted
 * by markdownToBlocks() before reaching the editor.
 */
export interface ApiDraft {
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  heroImage: string | null;
  /** Markdown. */
  content: string | null;
  mediaGallery: string[] | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  featured: boolean | null;
  status: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  keywords: string[] | null;
  readTime: number | null;
}

/** GET /api/blog/requests/{id} — a request plus its generated draft. */
export interface BlogRequestDetail extends BlogRequest {
  draft: ApiDraft | null;
  draft_error: string | null;
}

/** Pagination block returned alongside the data. */
export interface BlogRequestListMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

/** The envelope every endpoint on this backend wraps its payload in. */
export interface ApiEnvelope<T> {
  msg: {
    data: T;
    meta?: BlogRequestListMeta;
  };
  metadata?: {
    request_id?: string;
    success?: boolean;
  };
}

// ---------------------------------------------------------------------------
// Not implemented on the backend yet. Kept so the create/publish flow compiles
// and so the shapes are agreed before those endpoints are built.
// ---------------------------------------------------------------------------

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  text: string;
  createdAt: string;
}

export interface ChatTranscript {
  chatId: string;
  userId: string;
  messages: ChatMessage[];
}

/** An Editor.js block. Only types the public renderer supports are allowed. */
export interface EditorBlock {
  type: 'paragraph' | 'header' | 'list' | 'image' | 'quote' | 'embed';
  data: Record<string, any>;
}

export interface EditorContent {
  blocks: EditorBlock[];
}

/** What the AI prefill step hands to the create form. */
export interface GeneratedDraft {
  title: string;
  slug: string;
  excerpt: string;
  content: EditorContent;
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface PublishBlogPayload {
  requestId: string;
  chatId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: EditorContent;
  heroImage: string | null;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface PublishBlogResult {
  travizBlogId: string;
  ecostoryBlogId: string;
  requestStatus: string;
}
