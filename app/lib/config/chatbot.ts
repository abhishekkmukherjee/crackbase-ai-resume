// Chatbot configuration for ATS Resume Chatbot

export const chatbotConfig = {
  // Basic configuration
  name: process.env.NEXT_PUBLIC_CHATBOT_NAME || 'ATS Resume Chatbot',
  maxResumeSections: parseInt(process.env.NEXT_PUBLIC_MAX_RESUME_SECTIONS || '10'),
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  
  // PDF configuration
  pdf: {
    maxSizeMB: parseInt(process.env.NEXT_PUBLIC_PDF_MAX_SIZE_MB || '5'),
    enableWatermark: process.env.NEXT_PUBLIC_ENABLE_PDF_WATERMARK === 'true',
    templates: ['ats-standard', 'ats-modern', 'ats-minimal'],
  },
  
  // Chatbot behavior
  behavior: {
    typingDelay: 1000, // ms
    messageDelay: 500, // ms
    maxRetries: 3,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
  
  // Validation rules
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    minNameLength: 2,
    maxNameLength: 50,
    maxSummaryLength: 500,
  },
  
  // SEO configuration
  seo: {
    title: 'Free ATS Resume Builder | Create Professional Resume Online',
    description: 'Build ATS-friendly resumes with our free chatbot interface. Get hired faster with optimized resume templates and instant PDF download.',
    keywords: [
      'ATS resume builder',
      'free resume maker',
      'resume chatbot',
      'ATS friendly resume',
      'professional resume',
      'resume templates',
      'job application',
      'career tools'
    ],
  },
  
  // Analytics events
  analytics: {
    events: {
      chatbotStarted: 'chatbot_started',
      sectionCompleted: 'section_completed',
      resumeCompleted: 'resume_completed',
      emailCaptured: 'email_captured',
      pdfDownloaded: 'pdf_downloaded',
      aiInterestExpressed: 'ai_interest_expressed',
    }
  }
};

export default chatbotConfig;