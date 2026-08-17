// Turns a Traviz chat transcript into a blog draft for the create form.
//
// With OPENAI_API_KEY set this calls OpenAI. Without it, it falls back to a
// deterministic draft built from the transcript, so the whole flow is testable
// before any key exists. Same return shape either way.

import type { ChatTranscript, EditorBlock, GeneratedDraft } from './types';

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const OPENAI_MODEL = import.meta.env.OPENAI_MODEL || 'gpt-4o-mini';

export const AI_ENABLED = Boolean(OPENAI_API_KEY);

/**
 * Block types the public renderer in blogs/[slug].astro can actually display.
 * Generating anything outside this list produces content that silently vanishes
 * on the live site, so both the prompt and the fallback stay inside it.
 */
const ALLOWED_BLOCKS = ['header', 'paragraph', 'list', 'quote'] as const;

export function slugify(input: string): string {
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

const SYSTEM_PROMPT = `You are an editor for EcoStory, a cultural-heritage publication about Agra and its monuments.
You turn a traveller's chat transcript into a publishable blog draft.

Rules:
- Write in an informative, warm, specific voice. No marketing fluff.
- Keep every practical detail from the transcript (times, gates, prices, names).
- Do not invent facts that are not in the transcript.
- Respond with JSON only, matching this shape:
{
  "title": string,
  "excerpt": string (max 200 chars),
  "tags": string[] (3-6 items),
  "seoTitle": string (max 60 chars),
  "seoDescription": string (max 160 chars),
  "keywords": string[] (3-6 items),
  "blocks": [
    { "type": "header", "data": { "text": string, "level": 2 } },
    { "type": "paragraph", "data": { "text": string } },
    { "type": "list", "data": { "style": "unordered" | "ordered", "items": string[] } },
    { "type": "quote", "data": { "text": string, "caption": string } }
  ]
}
Only the four block types above are permitted. Aim for 6-12 blocks.`;

function transcriptToText(chat: ChatTranscript): string {
  return chat.messages
    .map((message) => `${message.role === 'user' ? 'Traveller' : 'Guide'}: ${message.text}`)
    .join('\n\n');
}

function sanitiseBlocks(blocks: unknown): EditorBlock[] {
  if (!Array.isArray(blocks)) return [];

  return blocks.filter(
    (block): block is EditorBlock =>
      Boolean(block) &&
      typeof block === 'object' &&
      ALLOWED_BLOCKS.includes((block as EditorBlock).type as any) &&
      typeof (block as EditorBlock).data === 'object'
  );
}

async function generateWithOpenAI(
  chat: ChatTranscript,
  topic: string
): Promise<GeneratedDraft> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Requested topic: ${topic}\n\nTranscript:\n\n${transcriptToText(chat)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`OpenAI request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const parsed = JSON.parse(payload.choices[0].message.content);
  const blocks = sanitiseBlocks(parsed.blocks);

  if (blocks.length === 0) {
    throw new Error('OpenAI returned no usable blocks');
  }

  const title = parsed.title || topic;

  return {
    title,
    slug: slugify(title),
    excerpt: parsed.excerpt || '',
    content: { blocks },
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    seo: {
      title: parsed.seoTitle || title,
      description: parsed.seoDescription || parsed.excerpt || '',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
    },
  };
}

/**
 * Transcript-derived draft used when no OpenAI key is configured.
 * Pairs each traveller question with the guide's answer as a section.
 */
function generateFallback(chat: ChatTranscript, topic: string): GeneratedDraft {
  const title = topic.replace(/\s+—\s+/, ': ');
  const blocks: EditorBlock[] = [];

  const firstAnswer = chat.messages.find((message) => message.role === 'assistant');
  const excerpt = (firstAnswer?.text ?? topic).slice(0, 197).trim();

  blocks.push({
    type: 'paragraph',
    data: { text: excerpt + (firstAnswer && firstAnswer.text.length > 197 ? '…' : '') },
  });

  chat.messages.forEach((message, index) => {
    if (message.role !== 'user') return;

    // Skip the closing "turn this into a blog" style instruction.
    if (/blog/i.test(message.text) && index >= chat.messages.length - 2) return;

    const answer = chat.messages[index + 1];
    if (!answer || answer.role !== 'assistant') return;

    blocks.push({
      type: 'header',
      data: { text: message.text.replace(/\?$/, ''), level: 2 },
    });
    blocks.push({ type: 'paragraph', data: { text: answer.text } });
  });

  const tags = ['Agra', 'Travel Tips'];

  return {
    title,
    slug: slugify(title),
    excerpt,
    content: { blocks },
    tags,
    seo: {
      title: title.slice(0, 60),
      description: excerpt.slice(0, 160),
      keywords: tags,
    },
  };
}

/**
 * Main entry point. Never throws — on any AI failure it returns the
 * transcript-derived draft so the admin always gets a usable starting point.
 */
export async function generateDraft(
  chat: ChatTranscript,
  topic: string
): Promise<{ draft: GeneratedDraft; usedAI: boolean }> {
  if (!AI_ENABLED) {
    return { draft: generateFallback(chat, topic), usedAI: false };
  }

  try {
    return { draft: await generateWithOpenAI(chat, topic), usedAI: true };
  } catch (error) {
    console.error('AI draft generation failed, falling back to transcript draft', error);
    return { draft: generateFallback(chat, topic), usedAI: false };
  }
}
