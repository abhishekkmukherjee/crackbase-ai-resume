// Type definitions for the application

export interface ResumeFormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    github?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    duration: string;
    link?: string;
  }>;
  achievements: string[];
}

export interface User {
  id: string;
  email: string;
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