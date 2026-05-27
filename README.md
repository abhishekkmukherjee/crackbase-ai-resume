# CrackBase AI Resume

A free, open-source ATS resume builder powered by a conversational AI chatbot. Answer a few questions and get a professionally formatted, ATS-optimized PDF resume — no account required.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abhishekkmukherjee/crackbase-ai-resume)

---

## Features

- **Conversational builder** — guided chatbot collects your details through natural dialogue
- **ATS-optimized output** — clean, parseable PDF layouts that pass Applicant Tracking Systems
- **Adaptive flow** — tailors questions for tech vs. non-tech and fresher vs. experienced profiles
- **Live preview** — resume updates in real time as you answer questions
- **Client-side privacy** — all data stays in your browser (localStorage); nothing is sent until you download
- **PDF generation** — fully client-side via jsPDF, no server round-trip
- **No login required** — start building immediately; email is only requested at download

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| AI | Google Gemini API |
| PDF | jsPDF |
| Database | Supabase (email capture only) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier is fine — used only for email capture)
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### Installation

```bash
git clone https://github.com/abhishekkmukherjee/crackbase-ai-resume.git
cd crackbase-ai-resume
npm install
```

### Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |

### Database setup

Run the schema in your Supabase SQL editor:

```bash
# Copy the contents of supabase-schema.sql and run it in your Supabase dashboard
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── analytics/          # Analytics event tracking
│   │   ├── capture-email/      # Email capture at download
│   │   ├── generate-resume/    # AI resume generation endpoint
│   │   ├── robots/             # robots.txt
│   │   └── sitemap/            # sitemap.xml
│   ├── components/
│   │   ├── ats/                # ATS score panel
│   │   ├── chatbot/            # Chat UI components
│   │   ├── pdf/                # PDF preview and download flow
│   │   └── resume/             # Resume preview components
│   ├── lib/
│   │   ├── ats/                # ATS scoring logic
│   │   ├── chatbot/            # Conversation engine, question flow, types
│   │   ├── config/             # App-wide configuration
│   │   ├── pdf/                # PDF generation and templates
│   │   └── storage/            # localStorage management
│   ├── builder/                # Resume builder page
│   ├── ats-demo/               # ATS score demo page
│   ├── chatbot-demo/           # Chatbot demo page
│   ├── pdf-demo/               # PDF generation demo page
│   └── page.tsx                # Landing page
├── lib/                        # Shared utilities (config, types, validation)
├── supabase-schema.sql         # Database schema
└── vercel.json                 # Vercel deployment config
```

## Chatbot Flow

```
Classification → Basic Info → Education → Experience / Projects → Skills → Achievements → Social Links → Download
```

The flow adapts based on:
- **Tech / Non-Tech** — different skill sets, project sections, and link prompts
- **Fresher / Experienced** — work experience questions for experienced; project emphasis for freshers

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check (no emit)
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

## Deployment

One-click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abhishekkmukherjee/crackbase-ai-resume)

Set the environment variables in the Vercel dashboard after cloning.

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please open an issue first for significant changes so we can discuss the approach.

## License

MIT — see [LICENSE](LICENSE) for details.
