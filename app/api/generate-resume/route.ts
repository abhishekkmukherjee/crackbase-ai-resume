import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { rawData } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'No API key' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert resume writer. Transform the raw resume data below into a polished, ATS-optimized resume.

Return ONLY valid JSON — no markdown, no code fences, no extra text. Use this exact structure:
{
  "summary": "2-3 sentence professional summary",
  "experience": [
    { "title": "...", "company": "...", "dates": "...", "bullets": ["...", "..."] }
  ],
  "education": [
    { "degree": "...", "institution": "...", "year": "..." }
  ],
  "skills": ["skill1", "skill2"],
  "certifications": ["cert1"]
}

Rules:
- Summary: open with the target role, mention years of experience if clear, 2-3 key strengths
- Bullets: start every bullet with a strong action verb; quantify impact if numbers exist; max 2 lines each
- Parse education from free text (e.g. "B.S. CS, MIT, 2021" → degree/institution/year)
- Parse each experience from the raw text block; infer title/company/dates from headers
- skills: flat string array, no duplicates
- certifications: empty array [] if none

Raw data:
${JSON.stringify(rawData, null, 2)}`

    const result = await model.generateContent(prompt)
    let text = result.response.text().trim()

    // Strip markdown code blocks if present
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

    const enhanced = JSON.parse(text)
    return NextResponse.json({ success: true, data: enhanced })
  } catch (err) {
    console.error('generate-resume error:', err)
    return NextResponse.json({ success: false, error: 'Generation failed' }, { status: 500 })
  }
}
