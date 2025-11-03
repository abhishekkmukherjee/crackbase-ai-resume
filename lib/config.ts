// Application configuration constants

export const APP_CONFIG = {
  name: 'CrackBase Resume AI',
  description: 'AI-Powered Resume Builder for Students and Freshers',
  domain: 'resume.crackbase.in',
  price: {
    amount: 4900, // ₹49 in paise
    currency: 'INR',
    display: '₹49'
  },
  ai: {
    model: 'gpt-4o-mini',
    maxTokens: 2000,
    temperature: 0.7
  },
  storage: {
    bucket: 'resume-files',
    maxFileSize: 5 * 1024 * 1024 // 5MB
  }
} as const

export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  api: {
    generateResume: '/api/generate-resume',
    createPayment: '/api/payment/create',
    webhook: '/api/payment/webhook',
    download: '/api/download'
  }
} as const