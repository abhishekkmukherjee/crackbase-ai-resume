// Type definitions for ATS Resume Chatbot

// ============================================================================
// CHAT MESSAGE TYPES
// ============================================================================

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  metadata?: {
    field?: string;
    section?: string;
    isRequired?: boolean;
    inputType?: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select';
    options?: string[];
    questionId?: string;
    validationError?: string;
  };
}

export interface ChatbotState {
  messages: ChatMessage[];
  currentSection: ResumeSection;
  userProfile: UserProfile;
  resumeData: ResumeData;
  isComplete: boolean;
}

export interface UserProfile {
  background: 'tech' | 'non-tech';
  experience: 'fresher' | 'experienced';
  preferences: {
    skipOptional: boolean;
    fastMode: boolean;
  };
}

export interface ResumeData {
  basicInfo: {
    fullName: string;
    email: string;
    phone: string;
    location?: string;
    headline?: string;
    summary?: string;
  };
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: {
    primary: string[];
    secondary?: string[];
    techStack?: string[];
    businessTools?: string[];
  };
  achievements: {
    certifications?: string[];
    achievements?: string[];
    extracurricular?: string[];
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  metadata: {
    background: 'tech' | 'non-tech';
    experience: 'fresher' | 'experienced';
    completedSections: ResumeSection[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface EducationEntry {
  degree: string;
  institution: string;
  startYear?: number;
  endYear?: number;
  marks?: string;
  specialization?: string;
}

export interface ExperienceEntry {
  companyName: string;
  role: string;
  startDate?: string;
  endDate?: string;
  achievements?: string[];
  toolsUsed?: string[];
}

export interface ProjectEntry {
  title: string;
  description?: string;
  techStack?: string[];
  link?: string;
  role?: string;
}

export type ResumeSection = 
  | 'classification'
  | 'basic_info'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'achievements'
  | 'social_links'
  | 'ai_upsell'
  | 'complete';