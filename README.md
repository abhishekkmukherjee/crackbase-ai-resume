# CrackBase Resume AI

AI-powered resume builder designed specifically for students and freshers. Generate professional, recruiter-ready resumes with AI assistance for just ₹49.

## Features

- AI-powered resume content generation
- Professional resume templates
- Secure payment processing with Razorpay
- DOCX file generation and download
- Mobile-responsive design
- Preview before purchase

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4o-mini
- **Payments**: Razorpay
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.local` and fill in your API keys:
   - Supabase URL and keys
   - OpenAI API key
   - Razorpay keys

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
WEBHOOK_SECRET=your_webhook_secret
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   ├── config.ts         # App configuration
│   ├── supabase.ts       # Supabase client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Deployment

This project is designed to be deployed on Vercel with the custom domain `resume.crackbase.in`.

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy with automatic builds on push to main branch
