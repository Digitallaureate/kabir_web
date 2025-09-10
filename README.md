# EcoStory - Cultural Heritage Web Application

Digital platform showcasing Agra's historical monuments.

## 🏛️ Project Overview

**EcoStory** is an Astro-based cultural heritage application that provides interactive exploration of Agra's historical monuments including the Taj Mahal, Agra Fort, and Fatehpur Sikri through maps, 3D models, and educational content.

## 🛠️ Technology Stack

- **Frontend**: Astro 5.7.10 with React integration
- **Backend**: Firebase (Firestore, Auth, Functions, Storage)
- **Maps**: Google Maps API & Leaflet
- **3D Models**: Model-viewer for monument displays
- **Styling**: Custom CSS with responsive design
- **Content**: EditorJS for rich text editing

## 📁 Project Structure

```
/
├── public/                     # Static assets and favicon files
├── functions/                  # Firebase Cloud Functions
├── src/
│   ├── components/
│   │   ├── admin/             # Admin panel components
│   │   ├── auth/              # Authentication components  
│   │   ├── layout/            # Layout components (Header, Footer, Navbar)
│   │   ├── map/               # Interactive map components
│   │   └── ui/                # Reusable UI components
│   ├── data/
│   │   ├── collections/       # Data models for monuments/tours
│   │   └── schemas/           # TypeScript validation schemas
│   ├── lib/                   # Authentication client and stores
│   ├── pages/
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API endpoints
│   │   ├── auth/              # Authentication pages
│   │   └── blogs/             # Blog system pages
│   ├── scripts/               # Client-side JavaScript
│   ├── styles/                # Global CSS styles
│   └── utils/                # Firebase config and helpers
├── astro.config.mjs           # Astro configuration with Node adapter
├── firebase.json              # Firebase hosting and functions config
└── package.json               # Dependencies and scripts
```

## 🗂️ Main Files

| File | Description |
|------|-------------|
| `astro.config.mjs` | Astro framework configuration setup |
| `firebase.json` | Firebase hosting and functions configuration |
| `src/utils/firebase.js` | Firebase initialization and helper functions |
| `src/lib/auth-client.js` | Authentication client for user management |
| `src/pages/index.astro` | Homepage with monument showcases |
| `src/pages/map.astro` | Interactive historical maps interface |
| `src/pages/admin/index.astro` | Main admin dashboard page |
| `src/components/layout/Header.astro` | Site navigation and branding |
| `src/components/map/MapControls.astro` | Map interaction and drawing tools |
| `src/data/collections/monuments.js` | Monument data models and schemas |

## 🚀 Commands

| Command | Action |
|---------|--------|
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server |
| `npm run build` | Build production site |
| `npm run preview` | Preview build locally |
| `firebase deploy` | Deploy to Firebase hosting |

## 🌐 Live Site

Visit: [https://ecostory-site.web.app](https://ecostory-site.web.app)

## 📱 Features

- **Monument Exploration**: Interactive timelines and showcases
- **3D Models**: Immersive monument viewing experience  
- **Historical Maps**: Integration with historical mapping services
- **Admin Panel**: Content and user management
- **Blog System**: Cultural stories and articles
- **Responsive Design**: Mobile-first with app promotion