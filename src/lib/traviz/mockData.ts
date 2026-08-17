// Stand-in data for the Traviz backend while its endpoints are being built.
// Shapes match src/lib/traviz/types.ts exactly, so swapping to the live API
// is a change in client.ts only.

import type { BlogRequest, ChatTranscript } from './types';

export const mockBlogRequests: BlogRequest[] = [
  {
    id: 'req_001',
    chatId: 'chat_a1b2c3',
    userId: 'usr_8842',
    requestedByName: 'Ananya Mehta',
    topicPreview: 'Sunrise visit to the Taj Mahal — best time, ticket queues, and photo spots',
    createdAt: '2026-08-10T06:42:00.000Z',
    status: 'pending',
  },
  {
    id: 'req_002',
    chatId: 'chat_d4e5f6',
    userId: 'usr_1207',
    requestedByName: 'Rohit Nair',
    topicPreview: 'Two days in Agra with kids — Agra Fort, Mehtab Bagh and where to eat',
    createdAt: '2026-08-09T14:15:00.000Z',
    status: 'pending',
  },
  {
    id: 'req_003',
    chatId: 'chat_g7h8i9',
    userId: 'usr_3391',
    requestedByName: 'Sarah Whitfield',
    topicPreview: 'Fatehpur Sikri day trip from Agra — how to get there and what to skip',
    createdAt: '2026-08-08T09:03:00.000Z',
    status: 'in_progress',
  },
  {
    id: 'req_004',
    chatId: 'chat_j1k2l3',
    userId: 'usr_5518',
    requestedByName: 'Vikram Desai',
    topicPreview: 'Marble inlay workshops in Agra — where artisans still do pietra dura by hand',
    createdAt: '2026-08-05T18:27:00.000Z',
    status: 'published',
  },
  {
    id: 'req_005',
    chatId: 'chat_m4n5o6',
    userId: 'usr_7734',
    requestedByName: 'Priya Ramachandran',
    topicPreview: 'Monsoon in Agra — is it worth visiting in August?',
    createdAt: '2026-08-02T11:50:00.000Z',
    status: 'rejected',
  },
];

export const mockChats: Record<string, ChatTranscript> = {
  chat_a1b2c3: {
    chatId: 'chat_a1b2c3',
    userId: 'usr_8842',
    messages: [
      {
        role: 'user',
        text: "I'm in Agra next week. Is it worth getting up for sunrise at the Taj Mahal?",
        createdAt: '2026-08-10T06:20:00.000Z',
      },
      {
        role: 'assistant',
        text: "Yes — sunrise is the single best time to see it. The gates open 30 minutes before sunrise, which in August is around 5:50am. Two reasons it's worth the alarm: the marble shifts from pink to pale gold in the first hour, and the crowds are a fraction of what they are by 9am.",
        createdAt: '2026-08-10T06:21:00.000Z',
      },
      {
        role: 'user',
        text: 'How early should I actually be in the queue? And which gate?',
        createdAt: '2026-08-10T06:24:00.000Z',
      },
      {
        role: 'assistant',
        text: "Be at the gate by 5:15am. Use the East gate — it's consistently the shortest queue; West gets tour buses and South is the slowest. Buy tickets online beforehand, there's a separate faster line for e-tickets. Bring your passport, they check ID against the booking.",
        createdAt: '2026-08-10T06:25:00.000Z',
      },
      {
        role: 'user',
        text: 'Where do I stand for the classic photo without fifty people in it?',
        createdAt: '2026-08-10T06:31:00.000Z',
      },
      {
        role: 'assistant',
        text: "The Diana bench gets mobbed immediately. Better options: the raised platform just inside the Great Gate before you walk down, which gives you the full reflecting pool; the mosque on the west side, where you get the dome framed by red sandstone arches and almost nobody goes; and the far corners of the Charbagh gardens for a diagonal view. Also — tripods are not allowed inside, so plan on handheld.",
        createdAt: '2026-08-10T06:33:00.000Z',
      },
      {
        role: 'user',
        text: 'This is really useful. Can you turn this into a blog post for the site?',
        createdAt: '2026-08-10T06:41:00.000Z',
      },
    ],
  },
  chat_d4e5f6: {
    chatId: 'chat_d4e5f6',
    userId: 'usr_1207',
    messages: [
      {
        role: 'user',
        text: 'Travelling to Agra with a 6 and 9 year old. Two days. What actually works with kids?',
        createdAt: '2026-08-09T13:40:00.000Z',
      },
      {
        role: 'assistant',
        text: "Agra Fort is the winner with that age group — it reads like a real castle, with ramparts, gates and courtyards they can walk through rather than just look at. Budget two hours. The Taj is better done early and short; kids tend to fade after 45 minutes in the heat.",
        createdAt: '2026-08-09T13:42:00.000Z',
      },
      {
        role: 'user',
        text: 'Anything for the afternoon when it gets too hot?',
        createdAt: '2026-08-09T13:49:00.000Z',
      },
      {
        role: 'assistant',
        text: "Mehtab Bagh across the river is best at sunset, not midday. For the hot hours, the Taj Museum inside the complex is small and air-conditioned, and Itimad-ud-Daulah — the 'Baby Taj' — has shaded gardens and is far quieter than the main sites. Sheroes Hangout cafe is a good lunch stop and the kids can handle the menu.",
        createdAt: '2026-08-09T13:51:00.000Z',
      },
      {
        role: 'user',
        text: 'Perfect. Please write this up as a blog.',
        createdAt: '2026-08-09T14:14:00.000Z',
      },
    ],
  },
  chat_g7h8i9: {
    chatId: 'chat_g7h8i9',
    userId: 'usr_3391',
    messages: [
      {
        role: 'user',
        text: 'Is Fatehpur Sikri doable as a day trip from Agra?',
        createdAt: '2026-08-08T08:30:00.000Z',
      },
      {
        role: 'assistant',
        text: "Easily — it's about 40km, roughly an hour by car on the Agra–Jaipur road. Go early; by noon the sandstone radiates heat and there's very little shade. A hired car for the day is the practical option, buses drop you a walk away from the entrance.",
        createdAt: '2026-08-08T08:32:00.000Z',
      },
      {
        role: 'user',
        text: 'What do I actually need to see there, and what can I skip?',
        createdAt: '2026-08-08T08:40:00.000Z',
      },
      {
        role: 'assistant',
        text: "Don't miss the Diwan-i-Khas with its extraordinary central pillar, Panch Mahal for the views, and the Jama Masjid courtyard with the Buland Darwaza — it's genuinely enormous. You can skip the Hiran Minar unless you're a completist. Be firm with unofficial guides at the gate; the ASI-licensed ones wear ID badges.",
        createdAt: '2026-08-08T08:43:00.000Z',
      },
      {
        role: 'user',
        text: 'Great, can this become a blog post?',
        createdAt: '2026-08-08T09:02:00.000Z',
      },
    ],
  },
  chat_j1k2l3: {
    chatId: 'chat_j1k2l3',
    userId: 'usr_5518',
    messages: [
      {
        role: 'user',
        text: 'Where can I see real marble inlay work being done in Agra, not a tourist trap?',
        createdAt: '2026-08-05T18:02:00.000Z',
      },
      {
        role: 'assistant',
        text: "The craft is pietra dura — locally called parchin kari — and it's been passed down since the Taj was built. The workshops in the Gokulpura area are where families still cut and set stone by hand. Ask to see the grinding wheel and the stone-setting, not just the showroom.",
        createdAt: '2026-08-05T18:05:00.000Z',
      },
      {
        role: 'user',
        text: 'Write this up as a blog please.',
        createdAt: '2026-08-05T18:26:00.000Z',
      },
    ],
  },
  chat_m4n5o6: {
    chatId: 'chat_m4n5o6',
    userId: 'usr_7734',
    messages: [
      {
        role: 'user',
        text: 'Is August a bad time to visit Agra?',
        createdAt: '2026-08-02T11:30:00.000Z',
      },
      {
        role: 'assistant',
        text: "It's humid and there will be rain, but it has real advantages: the crowds thin out noticeably, the gardens are green rather than parched, and storm light on white marble is spectacular. Go early in the day and keep the afternoon flexible.",
        createdAt: '2026-08-02T11:33:00.000Z',
      },
      {
        role: 'user',
        text: 'Make this a blog post.',
        createdAt: '2026-08-02T11:49:00.000Z',
      },
    ],
  },
};
