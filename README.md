# 🖼️ BG Remover

> AI-powered image background removal tool. Free, fast, and no signup required.

![Demo](https://via.placeholder.com/800x400?text=BG+Remover+Demo)

## Features

- ⚡ **Fast Processing** - Remove backgrounds in seconds
- 🎨 **High Quality** - AI-powered background removal
- 📱 **Responsive** - Works on desktop and mobile
- 🔒 **Privacy First** - Images are processed in memory, never stored
- 💚 **Free to Use** - Daily free credits

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Cloudflare Workers (API)
- **Image Processing**: Remove.bg API
- **Deployment**: Cloudflare Pages + Cloudflare Workers

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)
- Remove.bg API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/hangang7778/image-background-remover.git
cd image-background-remover
```

2. Install dependencies
```bash
npm install
```

3. Copy environment variables
```bash
cp .env.example .env.local
```

4. Add your Remove.bg API key to `.env.local`
```
REMOVE_BG_API_KEY=your_api_key_here
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Frontend (Cloudflare Pages)

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variable: `REMOVE_BG_API_KEY`

### Backend (Cloudflare Worker)

```bash
cd worker
npx wrangler secret put REMOVE_BG_API_KEY
npx wrangler deploy
```

## Project Structure

```
image-background-remover/
├── app/
│   ├── api/remove-bg/    # API route
│   ├── page.tsx          # Main page
│   └── layout.tsx        # Root layout
├── components/           # React components
├── worker/               # Cloudflare Worker
├── public/               # Static assets
└── package.json
```

## API

### POST /api/remove-bg

Remove background from an image.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "resultUrl": "data:image/png;base64,..."
}
```

## License

MIT
