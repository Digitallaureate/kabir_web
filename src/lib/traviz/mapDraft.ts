// Maps the backend's draft object onto what the create form needs.
//
// The backend uses flat SEO keys (seoTitle / metaDescription / keywords) and a
// markdown content string; the form wants nested seo.* and Editor.js blocks.

import type { ApiDraft, EditorBlock, EditorContent } from './types';
import { markdownToBlocks } from './markdownToBlocks';

/** Block types blogs/[slug].astro can actually render. */
const RENDERABLE = new Set(['paragraph', 'header', 'list', 'image', 'quote', 'embed']);

/**
 * Keeps only blocks the public page can display, and clamps header levels to
 * the 2-4 range the renderer handles. Anything unsupported that carries text is
 * demoted to a paragraph rather than dropped, so no content is silently lost.
 */
function sanitiseBlocks(blocks: unknown): EditorBlock[] {
  if (!Array.isArray(blocks)) return [];

  const kept: EditorBlock[] = [];

  for (const block of blocks) {
    if (!block || typeof block !== 'object' || typeof (block as any).type !== 'string') continue;

    const { type, data } = block as EditorBlock;
    if (!data || typeof data !== 'object') continue;

    if (RENDERABLE.has(type)) {
      if (type === 'header') {
        const level = Number(data.level);
        kept.push({
          ...(block as EditorBlock),
          data: { ...data, level: Number.isFinite(level) ? Math.min(Math.max(level, 2), 4) : 2 },
        });
      } else {
        kept.push(block as EditorBlock);
      }
      continue;
    }

    const text = typeof data.text === 'string' ? data.text : '';
    if (text) {
      console.warn(`[draft] block type "${type}" is not renderable — kept as a paragraph`);
      kept.push({ type: 'paragraph', data: { text } });
    } else {
      console.warn(`[draft] dropped unrenderable block type "${type}"`);
    }
  }

  return kept;
}

/**
 * The backend has sent `content` as markdown and, more recently, as a
 * stringified Editor.js document. Accept either, plus an already-parsed object.
 */
export function parseContent(content: unknown): EditorBlock[] {
  if (!content) return [];

  // Already an Editor.js document or a bare block array.
  if (typeof content === 'object') {
    const blocks = Array.isArray(content) ? content : (content as EditorContent).blocks;
    return sanitiseBlocks(blocks);
  }

  if (typeof content !== 'string') return [];

  const trimmed = content.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      const blocks = Array.isArray(parsed) ? parsed : parsed?.blocks;

      if (Array.isArray(blocks)) {
        return sanitiseBlocks(blocks);
      }
    } catch {
      // Looked like JSON but was not — fall through to markdown.
    }
  }

  return markdownToBlocks(trimmed);
}

export interface FormDraft {
  title: string;
  slug: string;
  excerpt: string;
  content: EditorContent;
  tags: string[];
  /** Byline. Empty when the backend has not resolved a name. */
  author: string;
  heroImage: string;
  /** Deduplicated, images only. */
  mediaGallery: string[];
  featured: boolean;
  status: 'draft' | 'published';
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|bmp|svg)(\?|$)/i;

/**
 * The gallery renders <img> tags, so non-image assets must not reach it —
 * the backend currently includes an .mp3 among the image URLs. Firebase
 * download URLs put the filename before the query string, so the extension
 * check runs against the decoded path.
 */
export function keepImagesOnly(urls: string[]): string[] {
  const seen = new Set<string>();

  return urls.filter((url) => {
    if (typeof url !== 'string' || !url.trim()) return false;

    let path = url;
    try {
      path = decodeURIComponent(new URL(url).pathname);
    } catch {
      // Not an absolute URL — fall back to testing the raw string.
    }

    if (!IMAGE_EXTENSIONS.test(path)) return false;

    // The same asset can appear more than once in the gallery.
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function mapDraft(draft: ApiDraft): FormDraft {
  const title = draft.title?.trim() ?? '';
  const excerpt = draft.excerpt?.trim() ?? '';

  return {
    title,
    slug: draft.slug?.trim() || slugify(title),
    excerpt,
    content: { blocks: parseContent(draft.content) },
    tags: draft.tags ?? [],
    author: draft.author?.trim() ?? '',
    heroImage: draft.heroImage ?? '',
    mediaGallery: keepImagesOnly(draft.mediaGallery ?? []),
    featured: draft.featured ?? false,
    status: draft.status === 'published' ? 'published' : 'draft',
    seo: {
      title: draft.seoTitle?.trim() || title,
      description: draft.metaDescription?.trim() || excerpt,
      keywords: draft.keywords ?? [],
    },
  };
}
