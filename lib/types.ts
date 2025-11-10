// Type definitions for the application

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  relevantCoursework?: string[];
  current: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  link?: string;
  github?: string;
  highlights: string[];
  current: boolean;
}

export interface Skills {
  technical: {
    category: string;
    skills: string[];
  }[];
  soft: string[];
  languages?: {
    language: string;
    proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native';
  }[];
}

export interface ResumeFormData {
  personalInfo: PersonalInfo;
  education: Education[];
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  achievements: string[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }[];
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  form_data: ResumeFormData;
  ai_generated_text: string;
  file_url?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
}


export interface AILog {
  id: string;
  user_id: string;
  resume_id: string;
  model_name: string;
  tokens_used?: number;
  cost_usd?: number;
  request_type: 'generation' | 'revision';
  created_at: string;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | FormErrors | FormErrors[];
}

export interface FormState {
  data: ResumeFormData;
  errors: FormErrors;
  isValid: boolean;
  isDirty: boolean;
}

// UI State types
export interface ResumeGenerationState {
  status: 'idle' | 'generating' | 'success' | 'error';
  progress: number;
  message?: string;
  generatedResume?: string;
}

export interface PaymentState {
  status: 'idle' | 'processing' | 'success' | 'failed';
  orderId?: string;
  paymentId?: string;
  error?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerateResumeResponse {
  resumeId: string;
  generatedText: string;
  tokensUsed: number;
  cost: number;
}

export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

// Resume template types
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  isPremium: boolean;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
}

// File generation types
export interface DocumentOptions {
  template: string;
  fontSize: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  colorScheme: 'blue' | 'green' | 'purple' | 'black' | 'red';
  includePhoto: boolean;
}

// Analytics types
export interface UserAnalytics {
  userId: string;
  resumesGenerated: number;
  paymentsCompleted: number;
  lastActivity: string;
  conversionRate: number;
}