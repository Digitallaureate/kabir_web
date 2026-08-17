// Contract shared with the Traviz backend.
// These types mirror the agreed API payloads exactly — when the real endpoints
// go live, only src/lib/traviz/client.ts changes, not the pages that consume it.

export type BlogRequestStatus = 'pending' | 'in_progress' | 'published' | 'rejected';

/** One row from GET /blog-requests */
export interface BlogRequest {
  id: string;
  chatId: string;
  userId: string;
  /** Display name of the app user who asked for the blog. */
  requestedByName: string;
  /** Human-readable summary so the admin knows what they are picking. */
  topicPreview: string;
  createdAt: string;
  status: BlogRequestStatus;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  text: string;
  createdAt: string;
}

/** Response of GET /chats/{chatId} */
export interface ChatTranscript {
  chatId: string;
  userId: string;
  messages: ChatMessage[];
}

/** An Editor.js block. Only the types the public renderer supports are allowed. */
export interface EditorBlock {
  type: 'paragraph' | 'header' | 'list' | 'image' | 'quote' | 'embed';
  data: Record<string, any>;
}

export interface EditorContent {
  blocks: EditorBlock[];
}

/** Body of POST /blogs */
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

/** Response of POST /blogs */
export interface PublishBlogResult {
  travizBlogId: string;
  ecostoryBlogId: string;
  requestStatus: BlogRequestStatus;
}

/** What the AI prefill step hands back to the create form. */
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
