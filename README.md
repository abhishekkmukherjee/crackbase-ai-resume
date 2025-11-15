# ATS Resume Chatbot

A free, conversational resume builder that creates ATS-friendly resumes through an interactive chatbot interface. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Conversational Interface**: Build your resume through natural conversation with an AI chatbot
- **ATS-Optimized**: Creates resumes that pass Applicant Tracking Systems
- **Adaptive Questions**: Customizes questions based on your background (Tech/Non-Tech, Fresher/Experienced)
- **Real-time Preview**: See your resume update as you provide information
- **Client-side Storage**: All data stored locally for privacy (no account required during building)
- **PDF Download**: Generate and download professional PDF resumes
- **SEO Optimized**: Fully indexable by search engines for organic traffic
- **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: Tailwind CSS with custom chatbot themes
- **Database**: Supabase (minimal - only for email capture)
- **PDF Generation**: Client-side PDF generation
- **Analytics**: Vercel Analytics + Google Analytics
- **Deployment**: Vercel with custom domain support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for email capture)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ats-resume-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `NEXT_PUBLIC_GA_ID`: Your Google Analytics ID (optional)

4. Set up the database:
```bash
# Run the SQL schema in your Supabase dashboard
# File: supabase-schema.sql
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── capture-email/      # Email capture endpoint
│   │   ├── analytics/          # Analytics tracking
│   │   ├── sitemap/           # SEO sitemap
│   │   └── robots/            # SEO robots.txt
│   ├── components/
│   │   ├── chatbot/           # Chatbot interface components
│   │   └── resume/            # Resume preview components
│   ├── lib/
│   │   ├── chatbot/           # Chatbot logic and types
│   │   ├── config/            # Configuration files
│   │   ├── pdf/               # PDF generation
│   │   └── storage/           # localStorage management
│   ├── globals.css            # Global styles with chatbot themes
│   ├── layout.tsx             # Root layout with SEO
│   └── page.tsx               # Landing page
├── lib/                       # Existing utility functions
├── public/                    # Static assets
└── vercel.json               # Deployment configuration
```

## Chatbot Flow

1. **Classification**: Determines user background (Tech/Non-Tech) and experience level
2. **Basic Info**: Collects name, email, phone, location, headline, summary
3. **Education**: Gathers degree, institution, years, marks, specialization
4. **Experience/Projects**: Adaptive based on user classification
5. **Skills**: Background-specific skill collection
6. **Achievements**: Optional certifications and accomplishments
7. **Social Links**: LinkedIn, GitHub (for tech), personal website
8. **AI Upsell**: Optional interest capture for premium AI service
9. **Download**: Email capture and PDF generation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Configuration

### Chatbot Settings
Edit `app/lib/config/chatbot.ts` to customize:
- Question flow and validation rules
- PDF generation settings
- SEO metadata
- Analytics events

### Environment Variables
See `.env.example` for all available configuration options.

## SEO Features

- Server-side rendered landing pages
- Automatic sitemap generation
- Robots.txt configuration
- Open Graph and Twitter Card meta tags
- Structured data markup
- Core Web Vitals optimization

## Privacy & Security

- Client-side data storage (localStorage)
- No personal data transmission during building
- Email capture only at download
- GDPR compliant
- Security headers configured

## Deployment

Configured for Vercel deployment with:
- Automatic deployments on push
- Environment variable management
- Custom domain support
- Performance optimization
- Security headers

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test
npm run test -- chatbot.test.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.