import Link from 'next/link'

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5h14M3 10h9M3 15h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M15 14h2M16 13v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Conversational AI Builder',
    desc: 'Build your resume by answering simple questions in a natural chat interface — no blank forms, no overwhelm, no guessing what to write.',
    tag: 'Core',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 7h8M6 10h6M6 13h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'ATS-Optimized Output',
    desc: 'Single-column layout, standard section headers, zero tables or graphics — every resume is engineered to clear applicant tracking systems.',
    tag: 'ATS',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
    title: 'Live Preview',
    desc: 'Watch your resume build in real-time as you answer each question. Split-pane layout shows chat on the left, formatted resume on the right.',
    tag: 'UX',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v10M10 12l-3-3M10 12l3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'One-Click PDF Export',
    desc: 'Download a professionally formatted, print-ready PDF instantly. No watermarks, no premium gate — fully yours.',
    tag: 'Export',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L2 7l8 5 8-5-8-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M2 13l8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Flexible Custom Sections',
    desc: 'Add Languages, Projects, Publications, Volunteer Work — or any completely custom section. Smart positioning places each in the right spot.',
    tag: 'Flexible',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2c-1.5 2-5 4-7 4 0 7 3 10 7 12 4-2 7-5 7-12-2 0-5.5-2-7-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'AI-Enhanced Content',
    desc: 'Powered by Google Gemini — transforms your rough notes into polished, action-verb-driven bullet points that recruiters notice.',
    tag: 'AI',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Under 5 Minutes',
    desc: 'The entire flow — from first question to PDF download — is designed to be completed in a single focused session.',
    tag: 'Speed',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Z" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8 7.5C8 7.5 8 6 10 6s2 1.5 2 2c0 1.5-2 2-2 3v.5M10 13.5v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'No Sign-up. No Paywalls.',
    desc: 'Start building the moment you land. No account, no email, no credit card. The tool is completely free to use.',
    tag: 'Free',
  },
]

const steps = [
  {
    number: '01',
    title: 'Answer a few questions',
    desc: 'The AI guides you through your name, work experience, education, skills, and any extras — one question at a time, just like a conversation.',
    detail: 'Takes about 3–5 minutes',
  },
  {
    number: '02',
    title: 'Watch your resume form',
    desc: 'Every answer you give instantly updates the live preview on the right. Sections appear, bullets populate, and the layout formats itself automatically.',
    detail: 'Real-time preview, no lag',
  },
  {
    number: '03',
    title: 'Download and apply',
    desc: 'When you\'re done, click Download PDF. Your resume is exported as a clean, ATS-ready, single-column PDF — ready to upload anywhere.',
    detail: 'One-click PDF export',
  },
]

const techStack = [
  { name: 'Next.js 16', desc: 'App Router + Server Components' },
  { name: 'React 19', desc: 'Concurrent features & hooks' },
  { name: 'TypeScript', desc: 'Full type safety' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling' },
  { name: 'Google Gemini', desc: 'AI content generation' },
  { name: 'Supabase', desc: 'Database & analytics' },
  { name: 'jsPDF', desc: 'Client-side PDF generation' },
]

const faqs = [
  {
    q: 'Is it really free?',
    a: 'Yes, completely. No hidden tiers, no watermarks, no email required. Build and download as many resumes as you want.',
  },
  {
    q: 'Does my data get stored?',
    a: 'Your resume data is only used during your session to generate the resume. Supabase is used for anonymous analytics only.',
  },
  {
    q: 'Can I self-host this?',
    a: 'Absolutely — it\'s MIT licensed. Clone the repo, add your Gemini API key, and deploy to Vercel or any Node.js host in minutes.',
  },
  {
    q: 'What makes it ATS-friendly?',
    a: 'The output uses a single-column layout with standard section names (Experience, Education, Skills), no tables, no text boxes, no graphics — the exact format ATS parsers expect.',
  },
  {
    q: 'Can I edit the resume after generating?',
    a: 'The current version generates a PDF you can download. Manual editing support is on the roadmap — contributions welcome.',
  },
  {
    q: 'Which AI model powers it?',
    a: 'Google Gemini 1.5 Flash by default. You can swap to any Gemini model or adapt the API route for OpenAI/Anthropic.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1C]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#E8E8E3] bg-[#FAFAF9]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#1C1C1C] rounded-[7px] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M2 7h7M2 10.5h8.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">CrackBase Resume</span>
            <span className="hidden sm:inline-block text-[10px] font-medium bg-[#1C1C1C] text-white px-2 py-0.5 rounded-full ml-1">Open Source</span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#555555]">
            <a href="#features" className="hover:text-[#1C1C1C] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#1C1C1C] transition-colors">How it works</a>
            <a href="#tech" className="hover:text-[#1C1C1C] transition-colors">Tech stack</a>
            <a href="#faq" className="hover:text-[#1C1C1C] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[13px] text-[#555555] hover:text-[#1C1C1C] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F0F0EE]"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1C3.91 1 1 3.91 1 7.5c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.3v-1.05c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-0.95-.72-.95-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.53.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.72 0 0 .55-.18 1.8.67a6.27 6.27 0 0 1 3.26 0c1.25-.85 1.8-.67 1.8-.67.35.9.13 1.56.06 1.72.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.59.44 1.19v1.77c0 .17.11.37.44.3C10.64 12.8 12.5 10.37 12.5 7.5 12.5 3.91 10.09 1 7.5 1Z" fill="currentColor"/>
              </svg>
              GitHub
            </a>
            <Link
              href="/builder"
              className="flex items-center gap-1.5 bg-[#1C1C1C] text-white text-[13px] font-medium px-4 py-1.5 rounded-lg hover:bg-[#333] transition-colors"
            >
              Launch Builder
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#E8E8E3 1px, transparent 1px), linear-gradient(90deg, #E8E8E3 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.35,
        }} />
        {/* Radial fade over grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #FAFAF9 0%, transparent 70%)',
        }} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-[#E8E8E3] bg-white text-[12px] text-[#555555] px-3.5 py-1.5 rounded-full mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            MIT Licensed · Free Forever · No Sign-up
          </div>

          {/* Headline */}
          <h1 className="text-[48px] sm:text-[60px] lg:text-[72px] font-bold tracking-tight leading-[1.05] text-[#111111] mb-6">
            Your resume,<br />
            <span style={{ background: 'linear-gradient(135deg, #1C1C1C 0%, #555555 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              built by conversation.
            </span>
          </h1>

          {/* Sub */}
          <p className="text-[18px] sm:text-[20px] text-[#666666] max-w-2xl mx-auto leading-relaxed mb-10">
            Answer a few questions. Get a polished, ATS-optimized resume in minutes.
            Free, open source, and no account required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/builder"
              className="flex items-center gap-2 bg-[#1C1C1C] text-white text-[15px] font-medium px-7 py-3.5 rounded-xl hover:bg-[#333] transition-all shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5"
            >
              Build my resume — it&apos;s free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 4l4 3-4 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#E8E8E3] bg-white text-[#1C1C1C] text-[15px] font-medium px-7 py-3.5 rounded-xl hover:bg-[#F5F5F3] transition-all shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1C3.91 1 1 3.91 1 7.5c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.3v-1.05c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-0.95-.72-.95-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.53.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.72 0 0 .55-.18 1.8.67a6.27 6.27 0 0 1 3.26 0c1.25-.85 1.8-.67 1.8-.67.35.9.13 1.56.06 1.72.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.59.44 1.19v1.77c0 .17.11.37.44.3C10.64 12.8 12.5 10.37 12.5 7.5 12.5 3.91 10.09 1 7.5 1Z" fill="currentColor"/>
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-[#888888]">
            {['100% Free', 'No sign-up', 'ATS-optimized', 'PDF export', 'Open source'].map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Mockup ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-[#E8E8E3] shadow-2xl shadow-black/8 overflow-hidden bg-white">
            {/* Browser chrome */}
            <div className="bg-[#F5F5F3] border-b border-[#E8E8E3] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white border border-[#E8E8E3] rounded-md px-3 py-1 text-[11px] text-[#888888] flex items-center gap-2 max-w-xs mx-auto">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#BBBBBB" strokeWidth="1.2"/><path d="M5 3v2l1.5 1" stroke="#BBBBBB" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  crackbase.io/builder
                </div>
              </div>
            </div>

            {/* App content mock */}
            <div className="flex h-[420px] sm:h-[480px]">
              {/* Chat side */}
              <div className="w-[42%] border-r border-[#E8E8E3] flex flex-col bg-white">
                <div className="flex-1 p-4 space-y-3 overflow-hidden">
                  {/* Bot message */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5H11L8.25 6.75L9.25 10.5L6 8.5L2.75 10.5L3.75 6.75L1 4.5H4.5L6 1Z" fill="white"/></svg>
                    </div>
                    <div className="bg-[#F7F6F3] border border-[#EBEBEB] rounded-2xl rounded-bl-sm px-3 py-2 text-[11px] text-[#1C1C1C] max-w-[85%]">
                      Hi! I&apos;ll help you build a polished, ATS-friendly resume in just a few minutes.<br /><br />
                      What&apos;s your full name?
                    </div>
                  </div>
                  {/* User reply */}
                  <div className="flex justify-end">
                    <div className="bg-[#1C1C1C] text-white rounded-2xl rounded-br-sm px-3 py-2 text-[11px] max-w-[80%]">
                      Alexandra Chen
                    </div>
                  </div>
                  {/* Bot */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5H11L8.25 6.75L9.25 10.5L6 8.5L2.75 10.5L3.75 6.75L1 4.5H4.5L6 1Z" fill="white"/></svg>
                    </div>
                    <div className="bg-[#F7F6F3] border border-[#EBEBEB] rounded-2xl rounded-bl-sm px-3 py-2 text-[11px] text-[#1C1C1C] max-w-[85%]">
                      Nice to meet you, Alexandra! What role are you targeting?
                    </div>
                  </div>
                  {/* User */}
                  <div className="flex justify-end">
                    <div className="bg-[#1C1C1C] text-white rounded-2xl rounded-br-sm px-3 py-2 text-[11px] max-w-[80%]">
                      Senior Product Manager
                    </div>
                  </div>
                  {/* Bot */}
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1C] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5H11L8.25 6.75L9.25 10.5L6 8.5L2.75 10.5L3.75 6.75L1 4.5H4.5L6 1Z" fill="white"/></svg>
                    </div>
                    <div className="bg-[#F7F6F3] border border-[#EBEBEB] rounded-2xl rounded-bl-sm px-3 py-2 text-[11px] text-[#1C1C1C] max-w-[85%]">
                      Tell me about your most recent work experience — company, role, dates, and key achievements.
                    </div>
                  </div>
                </div>
                {/* Input */}
                <div className="border-t border-[#EBEBEB] p-3">
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 bg-[#F7F6F3] rounded-lg px-3 py-2 text-[11px] text-[#AAAAAA]">
                      Type your answer…
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#1C1C1C] flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume preview side */}
              <div className="flex-1 bg-[#F7F6F3] overflow-hidden p-5">
                <div className="bg-white rounded-lg shadow-sm p-5 h-full overflow-hidden text-[#1C1C1C]">
                  <div className="mb-3">
                    <div className="text-[16px] font-bold text-[#111111]">Alexandra Chen</div>
                    <div className="text-[9px] text-[#888888] mt-0.5">alex.chen@email.com · +1 (415) 555-0192 · San Francisco, CA</div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[7px] font-semibold uppercase tracking-widest text-[#888888]">Summary</span>
                      <div className="flex-1 h-px bg-[#EEEEEE]" />
                    </div>
                    <p className="text-[9px] text-[#444444] leading-relaxed">Senior Product Manager with 6+ years driving product strategy at high-growth SaaS companies. Expert at translating user insights into roadmap decisions that ship.</p>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[7px] font-semibold uppercase tracking-widest text-[#888888]">Experience</span>
                      <div className="flex-1 h-px bg-[#EEEEEE]" />
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9px] font-semibold text-[#111111]">Senior Product Manager</span>
                        <span className="text-[8px] text-[#888888]">2021–Present</span>
                      </div>
                      <div className="text-[8px] text-[#666666] mb-1">Stripe</div>
                      <div className="space-y-0.5">
                        {['Led 0→1 launch of Stripe Tax, reaching $2M ARR in 90 days', 'Reduced checkout abandonment by 22% through A/B-tested redesign', 'Managed cross-functional team of 12 engineers, designers & analysts'].map((b, i) => (
                          <div key={i} className="text-[8px] text-[#444444] flex gap-1.5">
                            <span className="text-[#BBBBBB] flex-shrink-0">•</span>
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[7px] font-semibold uppercase tracking-widest text-[#888888]">Skills</span>
                      <div className="flex-1 h-px bg-[#EEEEEE]" />
                    </div>
                    <p className="text-[8.5px] text-[#444444]">Product Strategy · Roadmapping · SQL · Figma · A/B Testing · Agile · Stakeholder Management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-[12px] text-[#AAAAAA] mt-4">Real output — no templates, no stock content. This is what the AI generates from your answers.</p>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-20 border-t border-[#E8E8E3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#888888] mb-3">Features</p>
            <h2 className="text-[36px] sm:text-[44px] font-bold tracking-tight text-[#111111] mb-4">
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
            <p className="text-[17px] text-[#666666] max-w-xl mx-auto">
              Built by job seekers, for job seekers. Every feature ships because someone actually needed it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="group bg-white border border-[#E8E8E3] rounded-xl p-5 hover:border-[#CCCCCC] hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#F5F5F3] flex items-center justify-center text-[#444444] group-hover:bg-[#1C1C1C] group-hover:text-white transition-all duration-200">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-medium text-[#888888] bg-[#F5F5F3] px-2 py-0.5 rounded-full">{f.tag}</span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#111111] mb-2 leading-snug">{f.title}</h3>
                <p className="text-[12.5px] text-[#777777] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-20 bg-[#111111] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#666666] mb-3">How it works</p>
            <h2 className="text-[36px] sm:text-[44px] font-bold tracking-tight mb-4">
              Three steps.<br />One great resume.
            </h2>
            <p className="text-[17px] text-[#888888] max-w-xl mx-auto">
              No blank page anxiety. No trying to remember exact dates. Just answer naturally — the AI handles the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px border-t border-dashed border-[#333333] z-0" style={{ width: 'calc(100% - 24px)', left: 'calc(100% - 12px)' }} />
                )}
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 hover:border-[#3A3A3A] transition-colors relative z-10">
                  <div className="text-[42px] font-black text-[#2A2A2A] mb-4 leading-none">{s.number}</div>
                  <h3 className="text-[17px] font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-[#888888] leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#555555]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="#444" strokeWidth="1.2"/><path d="M5 3v2l1.5 1" stroke="#444" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    {s.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 bg-white text-[#111111] text-[15px] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#EEEEEE] transition-colors"
            >
              Try it now — takes 5 minutes
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 4l4 3-4 3" stroke="#111111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ─────────────────────────────────────────────────── */}
      <section id="tech" className="px-6 py-20 border-b border-[#E8E8E3]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#888888] mb-3">Tech Stack</p>
            <h2 className="text-[36px] sm:text-[44px] font-bold tracking-tight text-[#111111] mb-4">
              Built on modern, open tech.
            </h2>
            <p className="text-[17px] text-[#666666] max-w-xl mx-auto">
              No black boxes. Every dependency is open source, well-maintained, and replaceable if you fork this project.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {techStack.map((t, i) => (
              <div key={i} className="bg-white border border-[#E8E8E3] rounded-xl p-4 text-center hover:border-[#CCCCCC] hover:shadow-sm transition-all">
                <div className="text-[13px] font-semibold text-[#111111] mb-1">{t.name}</div>
                <div className="text-[10px] text-[#888888] leading-tight">{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Architecture note */}
          <div className="mt-10 bg-white border border-[#E8E8E3] rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">Frontend</div>
                <div className="text-[13px] text-[#444444]">Next.js 16 App Router, React 19, Tailwind CSS, TypeScript — zero client-side JS for static sections</div>
              </div>
              <div className="border-x border-[#F0F0EE]">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">AI Layer</div>
                <div className="text-[13px] text-[#444444]">Google Gemini 1.5 Flash via a Next.js API route. Swap in any LLM by editing a single file.</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#888888] mb-2">PDF & Storage</div>
                <div className="text-[13px] text-[#444444]">jsPDF runs entirely in-browser. Supabase handles analytics. No resume data is ever persisted.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Source ────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111111] rounded-2xl p-10 sm:p-14 text-center text-white relative overflow-hidden">
            {/* Background dots */}
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 border border-[#333333] text-[12px] text-[#888888] px-3.5 py-1.5 rounded-full mb-6">
                <svg width="13" height="13" viewBox="0 0 15 15" fill="none"><path d="M7.5 1C3.91 1 1 3.91 1 7.5c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.3v-1.05c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-0.95-.72-.95-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.53.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.72 0 0 .55-.18 1.8.67a6.27 6.27 0 0 1 3.26 0c1.25-.85 1.8-.67 1.8-.67.35.9.13 1.56.06 1.72.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.59.44 1.19v1.77c0 .17.11.37.44.3C10.64 12.8 12.5 10.37 12.5 7.5 12.5 3.91 10.09 1 7.5 1Z" fill="currentColor"/></svg>
                Open Source · MIT License
              </div>
              <h2 className="text-[36px] sm:text-[44px] font-bold tracking-tight mb-5">
                Fork it. Own it.<br />Make it yours.
              </h2>
              <p className="text-[16px] text-[#888888] max-w-xl mx-auto mb-10 leading-relaxed">
                Every line of code is public. Self-host on Vercel in under a minute, swap the AI provider,
                add your own templates, white-label it — the MIT license gives you full freedom.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto text-left">
                {[
                  { label: 'Self-host in minutes', desc: 'Clone, add env vars, deploy to Vercel. Done.' },
                  { label: 'Swap the AI provider', desc: 'One API route. Works with OpenAI, Anthropic, or any LLM.' },
                  { label: 'Extend freely', desc: 'Add templates, custom sections, branding — it\'s your codebase.' },
                ].map((item, i) => (
                  <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
                    <div className="text-[13px] font-semibold text-white mb-1">{item.label}</div>
                    <div className="text-[11.5px] text-[#666666]">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-[#111111] text-[14px] font-semibold px-6 py-3 rounded-xl hover:bg-[#EEEEEE] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 15 15" fill="none"><path d="M7.5 1C3.91 1 1 3.91 1 7.5c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.3v-1.05c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-0.95-.72-.95-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.53.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.72 0 0 .55-.18 1.8.67a6.27 6.27 0 0 1 3.26 0c1.25-.85 1.8-.67 1.8-.67.35.9.13 1.56.06 1.72.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.59.44 1.19v1.77c0 .17.11.37.44.3C10.64 12.8 12.5 10.37 12.5 7.5 12.5 3.91 10.09 1 7.5 1Z" fill="currentColor"/></svg>
                  Star on GitHub
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-[#333333] text-white text-[14px] font-medium px-6 py-3 rounded-xl hover:bg-[#1A1A1A] transition-colors"
                >
                  Read the docs
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" className="px-6 py-20 border-t border-[#E8E8E3]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#888888] mb-3">FAQ</p>
            <h2 className="text-[36px] sm:text-[40px] font-bold tracking-tight text-[#111111]">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-[#E8E8E3] rounded-xl overflow-hidden">
                <div className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <span className="text-[13px] font-semibold text-[#CCCCCC] mt-0.5 flex-shrink-0">Q{i + 1}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#111111] mb-1.5">{faq.q}</p>
                      <p className="text-[13px] text-[#666666] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#E8E8E3]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-[40px] sm:text-[52px] font-bold tracking-tight text-[#111111] mb-5">
            Ready to build?
          </h2>
          <p className="text-[18px] text-[#666666] mb-10">
            No account. No credit card. No templates to fill in.
            Just a conversation and a polished PDF at the end.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 bg-[#1C1C1C] text-white text-[16px] font-semibold px-9 py-4 rounded-xl hover:bg-[#333] transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5"
          >
            Build my resume — free
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 4l4 3-4 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p className="mt-4 text-[12px] text-[#AAAAAA]">Takes less than 5 minutes · ATS-ready PDF · Open source</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E8E8E3] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#1C1C1C] rounded-[5px] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M2 7h7M2 10.5h8.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-[#1C1C1C]">CrackBase Resume</span>
            <span className="text-[12px] text-[#AAAAAA]">— MIT License</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-[#888888]">
            <Link href="/builder" className="hover:text-[#1C1C1C] transition-colors">Builder</Link>
            <a href="#features" className="hover:text-[#1C1C1C] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#1C1C1C] transition-colors">How it works</a>
            <a href="#faq" className="hover:text-[#1C1C1C] transition-colors">FAQ</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1C1C1C] transition-colors">GitHub</a>
          </nav>

          <p className="text-[12px] text-[#AAAAAA]">
            Built by{' '}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-[#1C1C1C] transition-colors">
              Abhishek Mukherjee
            </a>
            {' '}· {new Date().getFullYear()}
          </p>
        </div>
      </footer>

    </div>
  )
}
