// Converts the markdown string the backend generates into Editor.js blocks,
// which is what the create form and the public renderer both speak.
//
// Only emits block types blogs/[slug].astro can render — paragraph, header,
// list, quote, image. Anything it cannot map becomes a paragraph rather than
// being dropped, so no content is ever silently lost.

import type { EditorBlock } from './types';

/** Editor.js inline markup: a small, deliberate subset. */
function inline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g, '$1') // stray inline images → alt text
    .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/__([^_]+)__/g, '<b>$1</b>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .trim();
}

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)[^)]*\)$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const UNORDERED = /^[-*+]\s+(.*)$/;
const ORDERED = /^\d+[.)]\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const HR = /^(\s*[-*_]){3,}\s*$/;

export function markdownToBlocks(markdown: string): EditorBlock[] {
  if (!markdown?.trim()) return [];

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: EditorBlock[] = [];

  let paragraph: string[] = [];
  let list: { style: 'ordered' | 'unordered'; items: string[] } | null = null;
  let quote: string[] = [];
  let seenFirstHeading = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = inline(paragraph.join(' '));
    if (text) blocks.push({ type: 'paragraph', data: { text } });
    paragraph = [];
  };

  const flushList = () => {
    if (!list?.items.length) return;
    blocks.push({ type: 'list', data: { style: list.style, items: list.items } });
    list = null;
  };

  const flushQuote = () => {
    if (!quote.length) return;
    blocks.push({ type: 'quote', data: { text: inline(quote.join(' ')), caption: '' } });
    quote = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushAll();
      continue;
    }

    if (HR.test(line)) {
      flushAll();
      continue; // no renderer for a divider
    }

    const image = line.match(IMAGE_LINE);
    if (image) {
      flushAll();
      blocks.push({
        type: 'image',
        data: { file: { url: image[2] }, caption: image[1] ?? '' },
      });
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flushAll();

      const hashes = heading[1].length;
      const text = inline(heading[2]);

      // The post title is the page h1, so a leading markdown h1 is redundant.
      if (hashes === 1 && !seenFirstHeading && blocks.length === 0) {
        seenFirstHeading = true;
        continue;
      }
      seenFirstHeading = true;

      // Renderer supports levels 2-4 only.
      const level = Math.min(Math.max(hashes, 2), 4);
      if (text) blocks.push({ type: 'header', data: { text, level } });
      continue;
    }

    const quoted = line.match(QUOTE);
    if (quoted) {
      flushParagraph();
      flushList();
      quote.push(quoted[1]);
      continue;
    }

    const unordered = line.match(UNORDERED);
    if (unordered) {
      flushParagraph();
      flushQuote();
      if (list?.style !== 'unordered') {
        flushList();
        list = { style: 'unordered', items: [] };
      }
      list.items.push(inline(unordered[1]));
      continue;
    }

    const ordered = line.match(ORDERED);
    if (ordered) {
      flushParagraph();
      flushQuote();
      if (list?.style !== 'ordered') {
        flushList();
        list = { style: 'ordered', items: [] };
      }
      list.items.push(inline(ordered[1]));
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(line);
  }

  flushAll();
  return blocks;
}

/** Rough word count, used for the editor's read-time estimate. */
export function countWords(markdown: string): number {
  return markdown?.trim() ? markdown.trim().split(/\s+/).length : 0;
}
