// Question Engine for ATS Resume Chatbot
import { ResumeSection, UserProfile, ResumeData } from './types';

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select';
  field: string;
  section: ResumeSection;
  required: boolean;
  skipConditions?: SkipCondition[];
  validation?: ValidationRule[];
  followUp?: string[];
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface SkipCondition {
  field: string;
  value: any;
  operator: 'equals' | 'not_equals' | 'contains';
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

export interface SectionLogic {
  show: (profile: UserProfile) => boolean;
  required: boolean;
  order: number;
}

// ============================================================================
// QUESTION DATABASE
// ============================================================================

export const QUESTIONS: Question[] = [
  // Classification Questions
  {
    id: 'background',
    text: 'Hi! I\'m here to help you build an ATS-friendly resume. First, are you from a Tech background or Non-Tech background?',
    type: 'select',
    field: 'background',
    section: 'classification',
    required: true,
    options: ['Tech', 'Non-Tech'],
    helpText: 'This helps me customize the questions for your field'
  },
  {
    id: 'experience_level',
    text: 'Great! Are you a Fresher or do you have work Experience?',
    type: 'select',
    field: 'experience',
    section: 'classification',
    required: true,
    options: ['Fresher', 'Experienced'],
    helpText: 'This determines which sections we\'ll focus on'
  },

  // Basic Information Questions
  {
    id: 'full_name',
    text: 'Perfect! Let\'s start building your resume. What\'s your full name?',
    type: 'text',
    field: 'fullName',
    section: 'basic_info',
    required: true,
    validation: [
      { type: 'required', message: 'Full name is required' },
      { type: 'minLength', value: 2, message: 'Name must be at least 2 characters' }
    ],
    placeholder: 'e.g., John Smith'
  },
  {
    id: 'email',
    text: 'What\'s your email address?',
    type: 'email',
    field: 'email',
    section: 'basic_info',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' }
    ],
    placeholder: 'e.g., john.smith@email.com'
  },
  {
    id: 'phone',
    text: 'What\'s your phone number?',
    type: 'text',
    field: 'phone',
    section: 'basic_info',
    required: true,
    validation: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', value: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
    ],
    placeholder: 'e.g., +1234567890'
  },
  {
    id: 'location',
    text: 'What\'s your location? (Optional - you can skip this)',
    type: 'text',
    field: 'location',
    section: 'basic_info',
    required: false,
    placeholder: 'e.g., New York, NY'
  },
  {
    id: 'headline',
    text: 'Do you have a professional headline or title? (Optional)',
    type: 'text',
    field: 'headline',
    section: 'basic_info',
    required: false,
    placeholder: 'e.g., Software Engineer | Full Stack Developer'
  },
  {
    id: 'summary',
    text: 'Would you like to add a professional summary? (Optional)',
    type: 'textarea',
    field: 'summary',
    section: 'basic_info',
    required: false,
    placeholder: 'Brief summary of your professional background and goals...',
    helpText: 'A professional summary is 2-3 sentences highlighting your key skills, experience, and career goals. It should grab the recruiter\'s attention and make them want to read more.'
  },

  // Education Questions
  {
    id: 'education_degree',
    text: 'Let\'s add your education. What\'s your highest degree or current degree?',
    type: 'text',
    field: 'degree',
    section: 'education',
    required: true,
    validation: [
      { type: 'required', message: 'Degree is required' }
    ],
    placeholder: 'e.g., Bachelor of Science in Computer Science'
  },
  {
    id: 'education_institution',
    text: 'Which institution did you attend?',
    type: 'text',
    field: 'institution',
    section: 'education',
    required: true,
    validation: [
      { type: 'required', message: 'Institution is required' }
    ],
    placeholder: 'e.g., University of California, Berkeley'
  },
  {
    id: 'education_start_year',
    text: 'What year did you start? (Optional)',
    type: 'number',
    field: 'startYear',
    section: 'education',
    required: false,
    placeholder: 'e.g., 2020'
  },
  {
    id: 'education_end_year',
    text: 'What year did you graduate or expect to graduate?',
    type: 'number',
    field: 'endYear',
    section: 'education',
    required: true,
    validation: [
      { type: 'required', message: 'Graduation year is required' }
    ],
    placeholder: 'e.g., 2024'
  },
  {
    id: 'education_marks',
    text: 'What\'s your GPA or percentage? (Optional)',
    type: 'text',
    field: 'marks',
    section: 'education',
    required: false,
    placeholder: 'e.g., 3.8 GPA or 85%'
  },
  {
    id: 'education_specialization',
    text: 'Any specialization or major? (Optional)',
    type: 'text',
    field: 'specialization',
    section: 'education',
    required: false,
    placeholder: 'e.g., Machine Learning, Finance'
  },

  // Experience Questions (for Experienced users)
  {
    id: 'experience_company',
    text: 'Let\'s add your work experience. What\'s your current or most recent company?',
    type: 'text',
    field: 'companyName',
    section: 'experience',
    required: true,
    skipConditions: [
      { field: 'experience', value: 'fresher', operator: 'equals' }
    ],
    validation: [
      { type: 'required', message: 'Company name is required' }
    ],
    placeholder: 'e.g., Google, Microsoft, Acme Corp'
  },
  {
    id: 'experience_role',
    text: 'What\'s your job title or role?',
    type: 'text',
    field: 'role',
    section: 'experience',
    required: true,
    skipConditions: [
      { field: 'experience', value: 'fresher', operator: 'equals' }
    ],
    validation: [
      { type: 'required', message: 'Role is required' }
    ],
    placeholder: 'e.g., Software Engineer, Marketing Manager'
  },
  {
    id: 'experience_start_date',
    text: 'When did you start this role? (Optional)',
    type: 'text',
    field: 'startDate',
    section: 'experience',
    required: false,
    skipConditions: [
      { field: 'experience', value: 'fresher', operator: 'equals' }
    ],
    placeholder: 'e.g., January 2023'
  },
  {
    id: 'experience_end_date',
    text: 'When did you end this role? (Leave blank if current)',
    type: 'text',
    field: 'endDate',
    section: 'experience',
    required: false,
    skipConditions: [
      { field: 'experience', value: 'fresher', operator: 'equals' }
    ],
    placeholder: 'e.g., Present or December 2023'
  },
  {
    id: 'experience_achievements',
    text: 'Can you describe your key achievements or responsibilities? (One per line)',
    type: 'textarea',
    field: 'achievements',
    section: 'experience',
    required: false,
    skipConditions: [
      { field: 'experience', value: 'fresher', operator: 'equals' }
    ],
    placeholder: 'e.g., Increased sales by 25%\nLed a team of 5 developers\nImplemented new features',
    helpText: 'Focus on achievements rather than responsibilities. Use action verbs and quantify your impact with numbers, percentages, or metrics whenever possible.'
  },
  {
    id: 'experience_tools',
    text: 'What tools or technologies did you use? (Optional)',
    type: 'text',
    field: 'toolsUsed',
    section: 'experience',
    required: false,
    skipConditions: [
      { field: 'experience', value: 'fresher', operator: 'equals' }
    ],
    placeholder: 'e.g., React, Python, Salesforce, Excel'
  },

  // Project Questions (for Tech users or Freshers)
  {
    id: 'project_title',
    text: 'Let\'s add your projects. What\'s your most significant project?',
    type: 'text',
    field: 'title',
    section: 'projects',
    required: true,
    skipConditions: [
      { field: 'background', value: 'non-tech', operator: 'equals' },
      { field: 'experience', value: 'experienced', operator: 'equals' }
    ],
    validation: [
      { type: 'required', message: 'Project title is required' }
    ],
    placeholder: 'e.g., E-commerce Website, Mobile App'
  },
  {
    id: 'project_description',
    text: 'Can you describe what this project does? (Optional)',
    type: 'textarea',
    field: 'description',
    section: 'projects',
    required: false,
    skipConditions: [
      { field: 'background', value: 'non-tech', operator: 'equals' },
      { field: 'experience', value: 'experienced', operator: 'equals' }
    ],
    placeholder: 'Brief description of the project and its purpose...',
    helpText: 'Describe what problem your project solved, its key features, and any measurable impact. Focus on the value it provides to users or the business.'
  },
  {
    id: 'project_tech_stack',
    text: 'What technologies did you use? (Optional)',
    type: 'text',
    field: 'techStack',
    section: 'projects',
    required: false,
    skipConditions: [
      { field: 'background', value: 'non-tech', operator: 'equals' },
      { field: 'experience', value: 'experienced', operator: 'equals' }
    ],
    placeholder: 'e.g., React, Node.js, MongoDB, Python'
  },
  {
    id: 'project_link',
    text: 'Do you have a link to the project? (GitHub, live demo, etc.) (Optional)',
    type: 'text',
    field: 'link',
    section: 'projects',
    required: false,
    skipConditions: [
      { field: 'background', value: 'non-tech', operator: 'equals' },
      { field: 'experience', value: 'experienced', operator: 'equals' }
    ],
    placeholder: 'e.g., https://github.com/username/project'
  },
  {
    id: 'project_role',
    text: 'What was your role in this project? (Optional)',
    type: 'text',
    field: 'role',
    section: 'projects',
    required: false,
    skipConditions: [
      { field: 'background', value: 'non-tech', operator: 'equals' },
      { field: 'experience', value: 'experienced', operator: 'equals' }
    ],
    placeholder: 'e.g., Full Stack Developer, Team Lead'
  },

  // Skills Questions
  {
    id: 'skills_primary',
    text: 'What are your primary skills? (Comma separated)',
    type: 'text',
    field: 'primary',
    section: 'skills',
    required: true,
    validation: [
      { type: 'required', message: 'Primary skills are required' }
    ],
    placeholder: 'e.g., JavaScript, Python, Project Management'
  },
  {
    id: 'skills_secondary',
    text: 'Any secondary or additional skills? (Optional)',
    type: 'text',
    field: 'secondary',
    section: 'skills',
    required: false,
    placeholder: 'e.g., Communication, Leadership, Problem Solving'
  },
  {
    id: 'skills_tech_stack',
    text: 'What\'s your tech stack or programming languages? (Optional)',
    type: 'text',
    field: 'techStack',
    section: 'skills',
    required: false,
    skipConditions: [
      { field: 'background', value: 'non-tech', operator: 'equals' }
    ],
    placeholder: 'e.g., React, Node.js, Python, AWS, Docker'
  },
  {
    id: 'skills_business_tools',
    text: 'What business tools or software do you use? (Optional)',
    type: 'text',
    field: 'businessTools',
    section: 'skills',
    required: false,
    skipConditions: [
      { field: 'background', value: 'tech', operator: 'equals' }
    ],
    placeholder: 'e.g., Excel, Salesforce, PowerBI, SAP'
  },

  // Achievements Questions
  {
    id: 'achievements_certifications',
    text: 'Do you have any certifications? (Optional)',
    type: 'textarea',
    field: 'certifications',
    section: 'achievements',
    required: false,
    placeholder: 'e.g., AWS Certified Developer\nGoogle Analytics Certified'
  },
  {
    id: 'achievements_achievements',
    text: 'Any notable achievements or awards? (Optional)',
    type: 'textarea',
    field: 'achievements',
    section: 'achievements',
    required: false,
    placeholder: 'e.g., Employee of the Month\nHackathon Winner'
  },
  {
    id: 'achievements_extracurricular',
    text: 'Any extracurricular activities or volunteer work? (Optional)',
    type: 'textarea',
    field: 'extracurricular',
    section: 'achievements',
    required: false,
    placeholder: 'e.g., Volunteer at local shelter\nCaptain of debate team'
  },

  // Social Links Questions
  {
    id: 'social_linkedin',
    text: 'What\'s your LinkedIn profile URL?',
    type: 'text',
    field: 'linkedin',
    section: 'social_links',
    required: true,
    validation: [
      { type: 'required', message: 'LinkedIn profile is required' },
      { type: 'pattern', value: /linkedin\.com/, message: 'Please enter a valid LinkedIn URL' }
    ],
    placeholder: 'e.g., https://linkedin.com/in/yourname'
  },
  {
    id: 'social_github',
    text: 'What\'s your GitHub profile URL? (Optional for tech users)',
    type: 'text',
    field: 'github',
    section: 'social_links',
    required: false,
    skipConditions: [
      { field: 'background', value: 'non-tech', operator: 'equals' }
    ],
    placeholder: 'e.g., https://github.com/yourusername'
  },
  {
    id: 'social_website',
    text: 'Do you have a personal website or portfolio? (Optional)',
    type: 'text',
    field: 'website',
    section: 'social_links',
    required: false,
    placeholder: 'e.g., https://yourname.com'
  },

  // AI Upsell Questions
  {
    id: 'ai_interest',
    text: 'Great job! Your resume is ready. We\'re working on an AI resume service that will make your resume 10x better. Would you be interested in this?',
    type: 'select',
    field: 'aiInterest',
    section: 'ai_upsell',
    required: true,
    options: ['Yes, I\'m interested', 'No, thanks'],
    helpText: 'This is completely optional and won\'t affect your current resume'
  }
];

// ============================================================================
// SECTION LOGIC CONFIGURATION
// ============================================================================

export const SECTION_LOGIC: Record<ResumeSection, SectionLogic> = {
  classification: {
    show: () => true,
    required: true,
    order: 1
  },
  basic_info: {
    show: () => true,
    required: true,
    order: 2
  },
  education: {
    show: () => true,
    required: true,
    order: 3
  },
  experience: {
    show: (profile: UserProfile) => profile.experience === 'experienced',
    required: true,
    order: 4
  },
  projects: {
    show: (profile: UserProfile) => 
      profile.background === 'tech' || profile.experience === 'fresher',
    required: false,
    order: 5
  },
  skills: {
    show: () => true,
    required: true,
    order: 6
  },
  achievements: {
    show: () => true,
    required: false,
    order: 7
  },
  social_links: {
    show: () => true,
    required: true,
    order: 8
  },
  ai_upsell: {
    show: () => true,
    required: true,
    order: 9
  },
  complete: {
    show: () => true,
    required: false,
    order: 10
  }
};

// ============================================================================
// QUESTION ENGINE CLASS
// ============================================================================

export class QuestionEngine {
  private questions: Question[];
  private currentQuestionIndex: number = 0;
  private userProfile: UserProfile;
  private resumeData: Partial<ResumeData>;
  private currentSection: ResumeSection = 'classification';

  constructor() {
    this.questions = QUESTIONS;
    this.userProfile = {
      background: 'tech',
      experience: 'fresher',
      preferences: {
        skipOptional: false,
        fastMode: false
      }
    };
    this.resumeData = {};
  }

  // Get the current question
  getCurrentQuestion(): Question | null {
    const availableQuestions = this.getAvailableQuestions();
    if (this.currentQuestionIndex >= availableQuestions.length) {
      return null;
    }
    return availableQuestions[this.currentQuestionIndex];
  }

  // Get all questions that should be shown based on user profile
  getAvailableQuestions(): Question[] {
    return this.questions.filter(question => {
      // Check if the section should be shown
      const sectionLogic = SECTION_LOGIC[question.section];
      if (!sectionLogic.show(this.userProfile)) {
        return false;
      }

      // Check skip conditions
      if (question.skipConditions) {
        for (const condition of question.skipConditions) {
          if (this.evaluateSkipCondition(condition)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  // Evaluate a skip condition
  private evaluateSkipCondition(condition: SkipCondition): boolean {
    const value = this.getFieldValue(condition.field);
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'contains':
        return Array.isArray(value) ? value.includes(condition.value) : 
               String(value).includes(String(condition.value));
      default:
        return false;
    }
  }

  // Get field value from user profile or resume data
  private getFieldValue(field: string): any {
    // Check user profile first
    if (field === 'background') return this.userProfile.background;
    if (field === 'experience') return this.userProfile.experience;
    
    // Check resume data
    return this.getNestedValue(this.resumeData, field);
  }

  // Helper to get nested values from objects
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Process user answer and move to next question
  processAnswer(answer: string): { success: boolean; error?: string; nextQuestion?: Question | null } {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      return { success: false, error: 'No current question' };
    }

    // Validate the answer
    const validation = this.validateAnswer(currentQuestion, answer);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Store the answer
    this.storeAnswer(currentQuestion, answer);

    // Move to next question
    this.currentQuestionIndex++;
    const nextQuestion = this.getCurrentQuestion();

    // Update current section if we've moved to a new section
    if (nextQuestion && nextQuestion.section !== this.currentSection) {
      this.currentSection = nextQuestion.section;
    }

    return { success: true, nextQuestion };
  }

  // Validate user answer
  validateAnswer(question: Question, answer: string): { isValid: boolean; error?: string } {
    // Skip validation for optional questions with empty answers
    if (!question.required && (!answer || answer.trim() === '')) {
      return { isValid: true };
    }

    // Validate required fields
    if (question.required && (!answer || answer.trim() === '')) {
      return { isValid: false, error: `${question.field} is required` };
    }

    // Validate select questions
    if (question.type === 'select' && question.options) {
      const validOptions = question.options.map(opt => opt.toLowerCase());
      if (!validOptions.includes(answer.toLowerCase())) {
        return { 
          isValid: false, 
          error: `Please choose one of: ${question.options.join(', ')}` 
        };
      }
    }

    // Check validation rules
    if (question.validation) {
      for (const rule of question.validation) {
        const result = this.validateRule(rule, answer);
        if (!result.isValid) {
          return result;
        }
      }
    }

    return { isValid: true };
  }

  // Validate individual rule
  private validateRule(rule: ValidationRule, answer: string): { isValid: boolean; error?: string } {
    switch (rule.type) {
      case 'required':
        if (!answer || answer.trim() === '') {
          return { isValid: false, error: rule.message };
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(answer)) {
          return { isValid: false, error: rule.message };
        }
        break;
      case 'minLength':
        if (answer.length < rule.value) {
          return { isValid: false, error: rule.message };
        }
        break;
      case 'maxLength':
        if (answer.length > rule.value) {
          return { isValid: false, error: rule.message };
        }
        break;
      case 'pattern':
        if (!rule.value.test(answer)) {
          return { isValid: false, error: rule.message };
        }
        break;
    }
    return { isValid: true };
  }

  // Store answer in appropriate data structure
  private storeAnswer(question: Question, answer: string): void {
    // Handle classification questions (update user profile)
    if (question.section === 'classification') {
      if (question.field === 'background') {
        this.userProfile.background = answer.toLowerCase() as 'tech' | 'non-tech';
      } else if (question.field === 'experience') {
        this.userProfile.experience = answer.toLowerCase() as 'fresher' | 'experienced';
      }
      return;
    }

    // Initialize nested objects if they don't exist
    if (!this.resumeData.basicInfo) this.resumeData.basicInfo = {} as any;
    if (!this.resumeData.skills) this.resumeData.skills = {} as any;
    if (!this.resumeData.achievements) this.resumeData.achievements = {} as any;
    if (!this.resumeData.socialLinks) this.resumeData.socialLinks = {} as any;
    if (!this.resumeData.education) this.resumeData.education = [];
    if (!this.resumeData.experience) this.resumeData.experience = [];
    if (!this.resumeData.projects) this.resumeData.projects = [];

    // Handle resume data
    this.setNestedValue(this.resumeData, question.field, this.processAnswerValue(question, answer));
  }

  // Process answer value based on question type
  private processAnswerValue(question: Question, answer: string): any {
    if (!answer || answer.trim() === '') return undefined;

    switch (question.type) {
      case 'number':
        return parseInt(answer, 10);
      case 'textarea':
        // For arrays (like achievements), split by newlines
        if (question.field === 'achievements' || question.field === 'certifications' || question.field === 'extracurricular') {
          return answer.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        }
        return answer;
      case 'text':
        // For comma-separated values (like skills)
        if (question.field === 'primary' || question.field === 'secondary' || 
            question.field === 'techStack' || question.field === 'businessTools' || 
            question.field === 'toolsUsed') {
          return answer.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
        return answer;
      default:
        return answer;
    }
  }

  // Helper to set nested values in objects
  private setNestedValue(obj: any, path: string, value: any): void {
    // Handle basic info fields directly
    const basicInfoFields = ['fullName', 'email', 'phone', 'location', 'headline', 'summary'];
    if (basicInfoFields.includes(path)) {
      if (!obj.basicInfo) obj.basicInfo = {};
      obj.basicInfo[path] = value;
      return;
    }

    // Handle skills fields
    const skillsFields = ['primary', 'secondary', 'techStack', 'businessTools'];
    if (skillsFields.includes(path)) {
      if (!obj.skills) obj.skills = {};
      obj.skills[path] = value;
      return;
    }

    // Handle achievements fields
    const achievementsFields = ['certifications', 'achievements', 'extracurricular'];
    if (achievementsFields.includes(path)) {
      if (!obj.achievements) obj.achievements = {};
      obj.achievements[path] = value;
      return;
    }

    // Handle social links fields
    const socialFields = ['linkedin', 'github', 'website'];
    if (socialFields.includes(path)) {
      if (!obj.socialLinks) obj.socialLinks = {};
      obj.socialLinks[path] = value;
      return;
    }

    // Handle education and experience arrays (would need more complex logic for multiple entries)
    const educationFields = ['degree', 'institution', 'startYear', 'endYear', 'marks', 'specialization'];
    if (educationFields.includes(path)) {
      if (!obj.education) obj.education = [];
      if (obj.education.length === 0) obj.education.push({});
      const currentEntry = obj.education[obj.education.length - 1];
      currentEntry[path] = value;
      return;
    }

    const experienceFields = ['companyName', 'role', 'startDate', 'endDate', 'achievements', 'toolsUsed'];
    if (experienceFields.includes(path)) {
      if (!obj.experience) obj.experience = [];
      if (obj.experience.length === 0) obj.experience.push({});
      const currentEntry = obj.experience[obj.experience.length - 1];
      currentEntry[path] = value;
      return;
    }

    const projectFields = ['title', 'description', 'techStack', 'link', 'role'];
    if (projectFields.includes(path)) {
      if (!obj.projects) obj.projects = [];
      if (obj.projects.length === 0) obj.projects.push({});
      const currentEntry = obj.projects[obj.projects.length - 1];
      currentEntry[path] = value;
      return;
    }

    // Fallback to original nested logic
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  // Get sections that should be shown for current user profile
  getAvailableSections(): ResumeSection[] {
    return Object.entries(SECTION_LOGIC)
      .filter(([_, logic]) => logic.show(this.userProfile))
      .sort((a, b) => a[1].order - b[1].order)
      .map(([section]) => section as ResumeSection);
  }

  // Get progress information
  getProgress(): { current: number; total: number; section: ResumeSection; percentage: number } {
    const availableQuestions = this.getAvailableQuestions();
    const total = availableQuestions.length;
    const current = Math.min(this.currentQuestionIndex, total);
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return {
      current,
      total,
      section: this.currentSection,
      percentage
    };
  }

  // Check if questionnaire is complete
  isComplete(): boolean {
    const availableQuestions = this.getAvailableQuestions();
    return this.currentQuestionIndex >= availableQuestions.length;
  }

  // Get current user profile
  getUserProfile(): UserProfile {
    return { ...this.userProfile };
  }

  // Get current resume data
  getResumeData(): Partial<ResumeData> {
    return { ...this.resumeData };
  }

  // Reset the engine
  reset(): void {
    this.currentQuestionIndex = 0;
    this.currentSection = 'classification';
    this.userProfile = {
      background: 'tech',
      experience: 'fresher',
      preferences: {
        skipOptional: false,
        fastMode: false
      }
    };
    this.resumeData = {};
  }

  // Go back to previous question
  goBack(): Question | null {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      const question = this.getCurrentQuestion();
      if (question && question.section !== this.currentSection) {
        this.currentSection = question.section;
      }
      return question;
    }
    return null;
  }

  // Skip current question (if optional)
  skipQuestion(): { success: boolean; error?: string; nextQuestion?: Question | null } {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      return { success: false, error: 'No current question' };
    }

    if (currentQuestion.required) {
      return { success: false, error: 'This question is required and cannot be skipped' };
    }

    // Move to next question without storing answer
    this.currentQuestionIndex++;
    const nextQuestion = this.getCurrentQuestion();

    // Update current section if we've moved to a new section
    if (nextQuestion && nextQuestion.section !== this.currentSection) {
      this.currentSection = nextQuestion.section;
    }

    return { success: true, nextQuestion };
  }
}