export interface Message {
  id: string
  role: 'bot' | 'user'
  content: string
  choices?: Array<{ label: string; value: string }>
  isTyping?: boolean
}

export interface RawData {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  targetRole: string
  experiences: string[]
  education: string
  skills: string
  extras: string
  customSections?: Array<{ title: string; content: string }>
}

export interface ExperienceItem {
  title: string
  company: string
  dates: string
  bullets: string[]
}

export interface EducationItem {
  degree: string
  institution: string
  year: string
}

export interface CustomSection {
  title: string
  items: string[]
}

export interface ResumeOutput {
  personal: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
  }
  targetRole: string
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  certifications: string[]
  customSections?: CustomSection[]
}

export type Step =
  | 'name' | 'email' | 'phone_location' | 'target_role'
  | 'experience' | 'more_experience'
  | 'education' | 'skills' | 'extras'
  | 'more_sections' | 'custom_section_content'
  | 'generating' | 'complete'
