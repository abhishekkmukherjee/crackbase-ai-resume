'use client'

import { useState, useCallback, useRef } from 'react'
import ChatPanel from '../components/ChatPanel'
import ResumePanel from '../components/ResumePanel'
import { Message, RawData, ResumeOutput, Step } from '../lib/types'

// ─── Question definitions ────────────────────────────────────────────────────

const Q = {
  name:            { placeholder: 'e.g. Alexandra Chen' },
  email:           { placeholder: 'you@example.com' },
  phone_location:  { placeholder: '+1 (555) 234-5678  |  San Francisco, CA', hint: 'Phone and city — both will appear on your resume' },
  target_role:     { placeholder: 'e.g. Senior Product Manager, Full-Stack Engineer', hint: 'Shapes your summary and keyword optimization' },
  experience:      {
    placeholder: 'Company: Stripe  |  Role: Engineer  |  Mar 2021 – Present\n• Built payment API serving 2M+ requests/day\n• Cut deployment time 60% with CI/CD improvements',
    hint: 'Quantify impact where possible — numbers stand out',
    isTextarea: true,
  },
  more_experience: { placeholder: '' },
  education:       { placeholder: 'e.g. B.S. Computer Science, MIT, 2021', hint: 'Degree · Institution · Year' },
  skills:          { placeholder: 'Python, React, TypeScript, AWS, Team Leadership…', hint: 'Separate with commas — mix technical and soft skills' },
  extras:          { placeholder: 'AWS Certified Solutions Architect (2023)\nOpen-source project with 3k+ GitHub stars\n\nOr type skip', hint: 'Certifications, notable projects, awards', isTextarea: true },
  more_sections:   { placeholder: 'Or type any section name…', hint: 'Custom sections like Awards, Languages, Patents, Conferences…' },
  custom_section_content: { placeholder: 'One item per line\ne.g. Spanish (Fluent)\nFrench (Intermediate)', hint: 'Each line becomes a bullet point in this section', isTextarea: true },
} as const

type QKey = keyof typeof Q

function getBotMessage(step: Step, data: Partial<RawData>, expCount: number, pendingSectionTitle = ''): string {
  const first = data.name?.split(' ')[0] || ''
  switch (step) {
    case 'name':           return "Hi! I'll help you build a polished, ATS-friendly resume in just a few minutes.\n\nWhat's your full name?"
    case 'email':          return `Nice to meet you, ${first}! What's your email address?`
    case 'phone_location': return 'Your phone number and city?'
    case 'target_role':    return 'What role are you targeting? (or your current professional title)'
    case 'experience':     return expCount === 0
      ? "Tell me about your most recent work experience.\n\nInclude company, role, dates, and your key achievements — especially anything with measurable impact."
      : 'Great! Tell me about your next role. Same format works.'
    case 'more_experience': return 'Want to add another role?'
    case 'education':      return "What's your educational background?"
    case 'skills':         return 'List your top skills, separated by commas.'
    case 'extras':         return "Any certifications, notable projects, or awards to highlight?\n\nType skip if none."
    case 'more_sections':  return (data.customSections?.length ?? 0) > 0
      ? `"${data.customSections!.at(-1)!.title}" added! Want to add another section?`
      : 'Almost done! Want to add any extra sections? Pick one or type a custom name.'
    case 'custom_section_content': return `"${pendingSectionTitle}" — add your items, one per line.`
    case 'generating':     return `Give me a moment while I craft your resume, ${first}…`
    case 'complete':       return `Your resume is ready, ${first}! Download it as a PDF using the button on the right.`
    default:               return ''
  }
}

const STEP_ORDER: Step[] = [
  'name', 'email', 'phone_location', 'target_role',
  'experience', 'more_experience',
  'education', 'skills', 'extras',
  'more_sections', 'custom_section_content',
  'generating', 'complete',
]

function progressPct(step: Step, expCount: number): number {
  const base: Partial<Record<Step, number>> = {
    name: 5, email: 15, phone_location: 25, target_role: 35,
    experience: 45, more_experience: 55,
    education: 65, skills: 75, extras: 85,
    more_sections: 88, custom_section_content: 91,
    generating: 95, complete: 100,
  }
  let p = base[step] ?? 0
  if (step === 'experience' && expCount > 0) p = Math.min(55, 45 + expCount * 5)
  return p
}

// ─── Fallback resume builder (no AI) ────────────────────────────────────────

function buildFallback(raw: Partial<RawData>): ResumeOutput {
  const parseExp = (text: string) => {
    const lines = text.split('\n').filter(Boolean)
    const header = lines[0] || ''
    const bullets = lines.slice(1).map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
    const compM = header.match(/company:\s*(.+?)(?:\s*\|)/i)
    const roleM = header.match(/role:\s*(.+?)(?:\s*\|)/i)
    const dateM = header.match(/\|\s*([^|]+)$/)
    return {
      title: roleM?.[1]?.trim() || raw.targetRole || 'Professional',
      company: compM?.[1]?.trim() || 'Company',
      dates: dateM?.[1]?.trim() || '',
      bullets: bullets.length ? bullets : [header],
    }
  }

  const eduParts = (raw.education || '').split(',').map(p => p.trim())
  const skills = (raw.skills || '').split(',').map(s => s.trim()).filter(Boolean)
  const certs = raw.extras && raw.extras.toLowerCase() !== 'skip'
    ? raw.extras.split('\n').map(l => l.trim()).filter(Boolean) : []

  return {
    personal: {
      fullName: raw.name || '',
      email: raw.email || '',
      phone: raw.phone || '',
      location: raw.location || '',
      linkedin: raw.linkedin || '',
    },
    targetRole: raw.targetRole || '',
    summary: `${raw.targetRole || 'Professional'} with experience in ${skills.slice(0, 3).join(', ')}. Skilled at delivering results in collaborative, fast-paced environments.`,
    experience: (raw.experiences || []).map(parseExp),
    education: [{
      degree: eduParts[0] || raw.education || '',
      institution: eduParts[1] || '',
      year: eduParts[eduParts.length - 1] || '',
    }],
    skills,
    certifications: certs,
    customSections: (raw.customSections || []).map(s => ({
      title: s.title,
      items: s.content.split('\n').map(l => l.trim()).filter(Boolean),
    })),
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'bot',
    content: getBotMessage('name', {}, 0),
  }])
  const [step, setStep] = useState<Step>('name')
  const [expCount, setExpCount] = useState(0)
  const [rawData, setRawData] = useState<Partial<RawData>>({ experiences: [], customSections: [] })
  const pendingSectionTitleRef = useRef('')
  const [resume, setResume] = useState<Partial<ResumeOutput>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat')

  const push = useCallback((msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: String(Date.now() + Math.random()) }])
  }, [])

  const generate = useCallback(async (data: Partial<RawData>) => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawData: data }),
      })
      const json = await res.json()
      if (json.success) {
        const enhanced: ResumeOutput = {
          personal: {
            fullName: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            linkedin: data.linkedin || '',
          },
          targetRole: data.targetRole || '',
          ...json.data,
          customSections: (data.customSections || []).map(s => ({
            title: s.title,
            items: s.content.split('\n').map(l => l.trim()).filter(Boolean),
          })),
        }
        setResume(enhanced)
      } else {
        setResume(buildFallback(data))
      }
    } catch {
      setResume(buildFallback(data))
    }
    setIsGenerating(false)
    setStep('complete')
    push({ role: 'bot', content: getBotMessage('complete', data, 0) })
  }, [push])

  const handleAnswer = useCallback((answer: string, choiceValue?: string) => {
    const val = (choiceValue || answer).trim()
    if (!val) return

    push({ role: 'user', content: answer })

    // Compute new state directly — do NOT use functional updater form so that
    // React StrictMode's double-invocation of updaters cannot fire side effects twice.
    const d = { ...rawData }
    let next: Step = step
    let nextExpCount = expCount

    switch (step) {
      case 'name':           d.name = val; next = 'email'; break
      case 'email':          d.email = val; next = 'phone_location'; break
      case 'phone_location': {
        const parts = val.split(/[|,]/).map(p => p.trim())
        d.phone = parts[0] || val
        d.location = parts[1] || ''
        next = 'target_role'
        break
      }
      case 'target_role':    d.targetRole = val; next = 'experience'; break
      case 'experience': {
        d.experiences = [...(d.experiences || []), val]
        nextExpCount = expCount + 1
        next = nextExpCount < 3 ? 'more_experience' : 'education'
        break
      }
      case 'more_experience':
        next = val === 'yes' ? 'experience' : 'education'
        break
      case 'education':      d.education = val; next = 'skills'; break
      case 'skills':         d.skills = val; next = 'extras'; break
      case 'extras':         d.extras = val; next = 'more_sections'; break
      case 'more_sections':
        if (val === '__done__') {
          next = 'generating'
        } else {
          pendingSectionTitleRef.current = val
          next = 'custom_section_content'
        }
        break
      case 'custom_section_content': {
        const newSec = { title: pendingSectionTitleRef.current, content: val }
        d.customSections = [...(d.customSections || []), newSec]
        next = 'more_sections'
        break
      }
    }

    // Update state outside any updater — no risk of double side-effects
    setRawData(d)
    setStep(next)
    if (step === 'experience') setExpCount(nextExpCount)

    // Update live preview
    if (next !== 'generating' && next !== 'complete') {
      setResume({
        personal: {
          fullName: d.name || '',
          email: d.email || '',
          phone: d.phone || '',
          location: d.location || '',
          linkedin: d.linkedin || '',
        },
        targetRole: d.targetRole || '',
        summary: '',
        experience: (d.experiences || []).map(raw => {
          const lines = raw.split('\n').filter(Boolean)
          const bullets = lines.slice(1).map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
          return { title: d.targetRole || '', company: lines[0] || '', dates: '', bullets }
        }),
        education: d.education ? [{ degree: d.education, institution: '', year: '' }] : [],
        skills: d.skills ? d.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        certifications: [],
        customSections: (d.customSections || []).map(s => ({
          title: s.title,
          items: s.content.split('\n').map(l => l.trim()).filter(Boolean),
        })),
      })
    }

    // Side effects — run once, safely outside any state updater
    if (next === 'generating') {
      setTimeout(() => generate(d), 200)
    } else {
      setTimeout(() => {
        const qKey = next as QKey
        if (Q[qKey] !== undefined) {
          const msg: Omit<Message, 'id'> = {
            role: 'bot',
            content: getBotMessage(next, d, nextExpCount, pendingSectionTitleRef.current),
          }
          if (next === 'more_experience') {
            msg.choices = [
              { label: 'Add another', value: 'yes' },
              { label: 'Continue', value: 'no' },
            ]
          }
          if (next === 'more_sections') {
            msg.choices = [
              { label: 'Languages', value: 'Languages' },
              { label: 'Projects', value: 'Projects' },
              { label: 'Publications', value: 'Publications' },
              { label: 'Volunteer', value: 'Volunteer' },
              { label: "I'm done", value: '__done__' },
            ]
          }
          push(msg)
        }
      }, 320)
    }
  }, [step, expCount, rawData, push, generate])

  const currentQuestion = (step !== 'generating' && step !== 'complete' && step !== 'more_experience')
    ? Q[step as QKey] ?? null
    : null

  const progress = progressPct(step, expCount)

  return (
    <div className="h-screen flex flex-col bg-[#F7F6F3]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 h-13 border-b border-[#E8E8E3] bg-white flex-shrink-0" style={{ height: '52px' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#1C1C1C] rounded-[6px] flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 3h9M2 6.5h6M2 10h7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-[#1C1C1C]">Resume Builder</span>
        </div>

        <div className="flex items-center gap-3">
          {step !== 'complete' ? (
            <div className="flex items-center gap-2">
              <div className="w-28 h-1 bg-[#EBEBEB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1C1C1C] rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] text-[#AAAAAA] tabular-nums w-7">{progress}%</span>
            </div>
          ) : (
            <span className="text-[11px] font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
              ✓ Complete
            </span>
          )}

          {/* Mobile toggle */}
          <div className="sm:hidden flex rounded-md border border-[#E8E8E3] overflow-hidden text-[11px]">
            {(['chat', 'preview'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`px-2.5 py-1 capitalize ${mobileTab === tab ? 'bg-[#1C1C1C] text-white' : 'bg-white text-[#888]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Panels */}
      <div className="flex-1 overflow-hidden flex">
        {/* Chat */}
        <div className={`${mobileTab === 'preview' ? 'hidden' : 'flex'} sm:flex flex-col w-full sm:w-[44%] lg:w-[38%] border-r border-[#E8E8E3] bg-white`}>
          <ChatPanel
            messages={messages}
            currentQuestion={currentQuestion}
            isGenerating={isGenerating}
            step={step}
            onAnswer={handleAnswer}
          />
        </div>

        {/* Resume preview */}
        <div className={`${mobileTab === 'chat' ? 'hidden' : 'flex'} sm:flex flex-1 flex-col overflow-hidden`}>
          <ResumePanel
            data={resume}
            isComplete={step === 'complete'}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  )
}
