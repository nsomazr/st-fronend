# Smart Travels by HL — Frontend

React + Vite frontend for the Smart Travels travel booking system.

## Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8094`

## Quick Start

```bash
cp .env.example .env
chmod +x start.sh
./start.sh
```

Or manually:

```bash
npm install
npm run dev
```

App available at `http://localhost:3094`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8094/api` |

For production, set `VITE_API_URL=https://api.st.nileagi.com/api` in `.env` before deploying.

## PM2 Production Deploy

Prerequisites: `npm install -g pm2`, `.env` with production `VITE_API_URL`.

```bash
cp .env.example .env
# Edit .env: VITE_API_URL=https://api.st.nileagi.com/api

chmod +x deploy.sh start.sh
./deploy.sh
```

This will:
1. Install npm dependencies
2. Build the production bundle (`dist/`)
3. Serve static files via PM2 using `serve` (`st-frontend` by default)

**PM2 commands:**
```bash
pm2 status st-frontend
pm2 logs st-frontend
pm2 restart st-frontend
pm2 stop st-frontend
```

**Environment variables** (in `.env`):
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | — | Production API URL (used at build time) |
| `PORT` | `3094` | Static server port |
| `PM2_APP_NAME` | `st-frontend` | PM2 process name |

## Build

```bash
npm run build
npm run preview
```

## Pages

- `/` — Landing page
- `/services` — Service listings
- `/book` — Multi-step booking form
- `/contact` — Contact form
- `/about` — About page
- `/admin/login` — Admin login
- `/admin/dashboard` — Admin dashboard
- `/admin/bookings` — Bookings management

## Logo Assets

Brand logo source: `public/smart.pdf`

Generated web assets (from PDF):
- `logo.png` — navbar, footer, admin UI
- `favicon.png` — browser tab icon
- `apple-touch-icon.png` — iOS home screen
- `logo-email.png` — HTML email templates

To regenerate after updating the PDF:

```bash
python3 scripts/generate-logos.py
```

Requires `pdftoppm` (poppler) and Pillow (`pip install Pillow`).

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion
- React Hook Form + Yup
- Axios
- React Router v6
- React Hot Toast
- Lucide React
