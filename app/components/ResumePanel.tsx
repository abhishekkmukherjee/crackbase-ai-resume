'use client'

import { ResumeOutput, CustomSection } from '../lib/types'

interface ResumePanelProps {
  data: Partial<ResumeOutput>
  isComplete: boolean
  isGenerating: boolean
}

function sectionPos(title: string): 'after_experience' | 'after_skills' | 'end' {
  const t = title.toLowerCase()
  if (/project|publication|volunteer|portfolio|open.source/.test(t)) return 'after_experience'
  if (/language/.test(t)) return 'after_skills'
  return 'end'
}

function CustomSections({ sections, pos }: { sections: CustomSection[]; pos: 'after_experience' | 'after_skills' | 'end' }) {
  const filtered = sections.filter(s => sectionPos(s.title) === pos)
  if (!filtered.length) return null
  return (
    <>
      {filtered.map((s, i) => (
        <Section key={i} title={s.title}>
          <ul className="space-y-0.5">
            {s.items.map((item, j) => (
              <li key={j} className="text-[11.5px] text-[#333333] flex gap-2">
                <span className="text-[#AAAAAA] flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  )
}

export default function ResumePanel({ data, isComplete, isGenerating }: ResumePanelProps) {
  const hasContent = !!(data.personal?.fullName || data.personal?.email)

  const downloadPDF = async () => {
    if (!data || !data.personal) return
    const jspdfModule = await import('jspdf')
    const jsPDF = jspdfModule.default
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    const ml = 48, mr = 48
    const pw = doc.internal.pageSize.getWidth()
    const uw = pw - ml - mr
    let y = 52
    const lh = 14

    const addPage = () => {
      if (y > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage()
        y = 52
      }
    }

    const section = (title: string) => {
      addPage()
      y += 14
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(title.toUpperCase(), ml, y)
      y += 3
      doc.setDrawColor(210, 210, 210)
      doc.line(ml, y, ml + uw, y)
      y += lh
      doc.setTextColor(30, 30, 30)
    }

    // Name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(20, 20, 20)
    doc.text(data.personal.fullName || '', ml, y)
    y += 26

    // Contact
    const contact = [
      data.personal.email,
      data.personal.phone,
      data.personal.location,
      data.personal.linkedin,
    ].filter(Boolean).join('  ·  ')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(90, 90, 90)
    const cLines = doc.splitTextToSize(contact, uw)
    cLines.forEach((l: string) => { doc.text(l, ml, y); y += lh })
    y += 2

    // Summary
    if (data.summary) {
      section('Professional Summary')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(30, 30, 30)
      const lines = doc.splitTextToSize(data.summary, uw)
      lines.forEach((l: string) => { addPage(); doc.text(l, ml, y); y += lh })
    }

    // Experience
    if (data.experience?.length) {
      section('Experience')
      data.experience.forEach((exp) => {
        addPage()
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(20, 20, 20)
        doc.text(`${exp.title}`, ml, y)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(90, 90, 90)
        doc.text(exp.dates, pw - mr, y, { align: 'right' })
        y += lh - 2
        doc.setFontSize(9.5)
        doc.setTextColor(60, 60, 60)
        doc.text(exp.company, ml, y)
        y += lh
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(30, 30, 30)
        exp.bullets.forEach((b) => {
          const bLines = doc.splitTextToSize(`• ${b}`, uw - 8)
          bLines.forEach((bl: string, i: number) => {
            addPage()
            doc.text(i === 0 ? bl : `  ${bl}`, ml, y)
            y += lh
          })
        })
        y += 6
      })
    }

    // Education
    if (data.education?.length) {
      section('Education')
      data.education.forEach((edu) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(20, 20, 20)
        doc.text(edu.degree, ml, y)
        y += lh - 2
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.5)
        doc.setTextColor(70, 70, 70)
        doc.text(`${edu.institution}${edu.year ? `  ·  ${edu.year}` : ''}`, ml, y)
        y += lh + 4
      })
    }

    // Skills
    if (data.skills?.length) {
      section('Skills')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(30, 30, 30)
      const skillText = data.skills.join('  ·  ')
      const sLines = doc.splitTextToSize(skillText, uw)
      sLines.forEach((l: string) => { addPage(); doc.text(l, ml, y); y += lh })
    }

    // Certifications
    if (data.certifications?.length) {
      section('Certifications & Achievements')
      data.certifications.forEach((c) => {
        const cLines = doc.splitTextToSize(`• ${c}`, uw - 8)
        cLines.forEach((cl: string) => { addPage(); doc.text(cl, ml, y); y += lh })
      })
    }

    // Custom sections (all positions — PDF renders them at the end for simplicity)
    if (data.customSections?.length) {
      data.customSections.forEach((cs) => {
        section(cs.title)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(30, 30, 30)
        cs.items.forEach((item) => {
          const lines = doc.splitTextToSize(`• ${item}`, uw - 8)
          lines.forEach((l: string) => { addPage(); doc.text(l, ml, y); y += lh })
        })
      })
    }

    const fname = (data.personal.fullName || 'Resume').replace(/\s+/g, '_')
    doc.save(`${fname}_Resume.pdf`)
  }

  return (
    <div className="flex flex-col h-full bg-[#F7F6F3]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8E8E3] bg-white flex-shrink-0">
        <span className="text-xs font-medium text-[#8C8C8C] uppercase tracking-wider">Preview</span>
        <button
          onClick={downloadPDF}
          disabled={!isComplete}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isComplete
              ? 'bg-[#1C1C1C] text-white hover:bg-[#333] shadow-sm'
              : 'bg-[#EFEFEF] text-[#AAAAAA] cursor-not-allowed'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1V9M6.5 9L3.5 6M6.5 9L9.5 6M1.5 11H11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download PDF
        </button>
      </div>

      {/* Resume document */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-[#AAAAAA]">
            <svg className="spin w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#E5E5E5" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p className="text-sm">Crafting your resume…</p>
          </div>
        ) : !hasContent ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-16 border-2 border-dashed border-[#D4D4D4] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4h8l4 4v10H4V4Z" stroke="#CCCCCC" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 4v4h4" stroke="#CCCCCC" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M7 10h6M7 13h4" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm text-[#AAAAAA]">Your resume preview will appear here</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg mx-auto max-w-[640px] px-10 py-10 text-[#1C1C1C]" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            {/* Header */}
            <div className="mb-5">
              {data.personal?.fullName && (
                <h1 className="text-[22px] font-bold leading-tight tracking-tight text-[#111111]">
                  {data.personal.fullName}
                </h1>
              )}
              <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-[11px] text-[#666666]">
                {data.personal?.email && <span>{data.personal.email}</span>}
                {data.personal?.phone && <><span className="text-[#CCCCCC]">·</span><span>{data.personal.phone}</span></>}
                {data.personal?.location && <><span className="text-[#CCCCCC]">·</span><span>{data.personal.location}</span></>}
                {data.personal?.linkedin && <><span className="text-[#CCCCCC]">·</span><span className="text-[#555]">{data.personal.linkedin}</span></>}
              </div>
            </div>

            {/* Summary */}
            {data.summary && (
              <Section title="Summary">
                <p className="text-[12px] leading-relaxed text-[#333333]">{data.summary}</p>
              </Section>
            )}

            {/* Experience */}
            {!!data.experience?.length && (
              <Section title="Experience">
                {data.experience.map((exp, i) => (
                  <div key={i} className={i > 0 ? 'mt-4' : ''}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[12px] font-semibold text-[#111111]">{exp.title}</span>
                      <span className="text-[10px] text-[#888888]">{exp.dates}</span>
                    </div>
                    <div className="text-[11px] text-[#666666] mt-0.5">{exp.company}</div>
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-[11.5px] text-[#333333] leading-snug flex gap-2">
                          <span className="text-[#AAAAAA] flex-shrink-0 mt-0.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </Section>
            )}

            {/* Projects / Publications / Volunteer — after experience */}
            {!!data.customSections?.length && (
              <CustomSections sections={data.customSections} pos="after_experience" />
            )}

            {/* Education */}
            {!!data.education?.length && (
              <Section title="Education">
                {data.education.map((edu, i) => (
                  <div key={i} className={i > 0 ? 'mt-2' : ''}>
                    <span className="text-[12px] font-semibold text-[#111111]">{edu.degree}</span>
                    <div className="text-[11px] text-[#666666] mt-0.5">
                      {edu.institution}{edu.year ? ` · ${edu.year}` : ''}
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Skills */}
            {!!data.skills?.length && (
              <Section title="Skills">
                <p className="text-[11.5px] text-[#333333] leading-relaxed">
                  {data.skills.join('  ·  ')}
                </p>
              </Section>
            )}

            {/* Languages — after skills */}
            {!!data.customSections?.length && (
              <CustomSections sections={data.customSections} pos="after_skills" />
            )}

            {/* Certifications */}
            {!!data.certifications?.length && (
              <Section title="Certifications & Achievements">
                <ul className="space-y-0.5">
                  {data.certifications.map((c, i) => (
                    <li key={i} className="text-[11.5px] text-[#333333] flex gap-2">
                      <span className="text-[#AAAAAA]">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Everything else — at the end */}
            {!!data.customSections?.length && (
              <CustomSections sections={data.customSections} pos="end" />
            )}
          </div>
        )}
      </div>

      {/* ATS badge */}
      {isComplete && (
        <div className="px-5 py-2.5 border-t border-[#E8E8E3] bg-white flex items-center gap-2 flex-shrink-0">
          <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="text-xs text-[#666666]">ATS-optimized · Single column · Standard headers · No tables</span>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#888888]">{title}</span>
        <div className="flex-1 h-px bg-[#E8E8E8]" />
      </div>
      {children}
    </div>
  )
}
