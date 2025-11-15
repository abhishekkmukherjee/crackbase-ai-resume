// Tips Engine for ATS Resume Chatbot
// Provides contextual tips, suggestions, and guidance during resume building

import { Question } from './questionEngine';
import { UserProfile, ResumeSection } from './types';

export interface Tip {
  id: string;
  type: 'contextual' | 'ats' | 'example' | 'best_practice';
  title: string;
  content: string;
  icon?: string;
  priority: 'high' | 'medium' | 'low';
  showConditions?: {
    sections?: ResumeSection[];
    backgrounds?: ('tech' | 'non-tech')[];
    experiences?: ('fresher' | 'experienced')[];
    questionIds?: string[];
  };
}

export interface ActionVerb {
  category: string;
  verbs: string[];
}

export interface SkillSuggestion {
  category: string;
  skills: string[];
  background: 'tech' | 'non-tech' | 'both';
  experience: 'fresher' | 'experienced' | 'both';
}

// ============================================================================
// ACTION VERBS DATABASE
// ============================================================================

export const ACTION_VERBS: ActionVerb[] = [
  {
    category: 'Leadership',
    verbs: [
      'Led', 'Managed', 'Directed', 'Supervised', 'Coordinated', 'Guided',
      'Mentored', 'Facilitated', 'Orchestrated', 'Spearheaded', 'Championed'
    ]
  },
  {
    category: 'Achievement',
    verbs: [
      'Achieved', 'Accomplished', 'Delivered', 'Exceeded', 'Surpassed',
      'Attained', 'Completed', 'Realized', 'Secured', 'Won', 'Earned'
    ]
  },
  {
    category: 'Improvement',
    verbs: [
      'Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Upgraded',
      'Refined', 'Strengthened', 'Boosted', 'Increased', 'Maximized'
    ]
  },
  {
    category: 'Creation',
    verbs: [
      'Created', 'Developed', 'Built', 'Designed', 'Established',
      'Implemented', 'Launched', 'Initiated', 'Founded', 'Pioneered'
    ]
  },
  {
    category: 'Analysis',
    verbs: [
      'Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated',
      'Examined', 'Reviewed', 'Studied', 'Identified', 'Diagnosed'
    ]
  },
  {
    category: 'Communication',
    verbs: [
      'Communicated', 'Presented', 'Negotiated', 'Collaborated', 'Consulted',
      'Advised', 'Trained', 'Educated', 'Influenced', 'Persuaded'
    ]
  },
  {
    category: 'Technical',
    verbs: [
      'Programmed', 'Coded', 'Automated', 'Integrated', 'Deployed',
      'Configured', 'Maintained', 'Debugged', 'Tested', 'Architected'
    ]
  }
];

// ============================================================================
// SKILL SUGGESTIONS DATABASE
// ============================================================================

export const SKILL_SUGGESTIONS: SkillSuggestion[] = [
  // Tech Skills - Programming Languages
  {
    category: 'Programming Languages',
    skills: ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'],
    background: 'tech',
    experience: 'both'
  },
  // Tech Skills - Frontend
  {
    category: 'Frontend Development',
    skills: ['React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'Bootstrap', 'jQuery'],
    background: 'tech',
    experience: 'both'
  },
  // Tech Skills - Backend
  {
    category: 'Backend Development',
    skills: ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel', 'Ruby on Rails'],
    background: 'tech',
    experience: 'both'
  },
  // Tech Skills - Databases
  {
    category: 'Databases',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB'],
    background: 'tech',
    experience: 'both'
  },
  // Tech Skills - Cloud & DevOps
  {
    category: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'CI/CD', 'Terraform'],
    background: 'tech',
    experience: 'experienced'
  },
  // Non-Tech Skills - Business
  {
    category: 'Business Analysis',
    skills: ['Market Research', 'Data Analysis', 'Business Intelligence', 'Process Improvement', 'Strategic Planning'],
    background: 'non-tech',
    experience: 'both'
  },
  // Non-Tech Skills - Marketing
  {
    category: 'Digital Marketing',
    skills: ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Google Analytics'],
    background: 'non-tech',
    experience: 'both'
  },
  // Non-Tech Skills - Finance
  {
    category: 'Finance & Accounting',
    skills: ['Financial Analysis', 'Budgeting', 'Forecasting', 'Risk Management', 'Investment Analysis'],
    background: 'non-tech',
    experience: 'both'
  },
  // Universal Skills
  {
    category: 'Soft Skills',
    skills: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management'],
    background: 'both',
    experience: 'both'
  },
  // Tools - Tech
  {
    category: 'Development Tools',
    skills: ['VS Code', 'IntelliJ IDEA', 'Postman', 'Figma', 'Jira', 'Slack', 'Notion', 'GitHub'],
    background: 'tech',
    experience: 'both'
  },
  // Tools - Non-Tech
  {
    category: 'Business Tools',
    skills: ['Microsoft Office', 'Google Workspace', 'Salesforce', 'HubSpot', 'Tableau', 'Power BI', 'Slack'],
    background: 'non-tech',
    experience: 'both'
  }
];

// ============================================================================
// CONTEXTUAL TIPS DATABASE
// ============================================================================

export const CONTEXTUAL_TIPS: Tip[] = [
  // Classification Tips
  {
    id: 'background_selection',
    type: 'contextual',
    title: 'Choose Your Background',
    content: 'Select "Tech" if you work in software, engineering, or IT. Choose "Non-Tech" for business, marketing, finance, or other fields.',
    icon: '🎯',
    priority: 'high',
    showConditions: {
      sections: ['classification'],
      questionIds: ['background']
    }
  },
  {
    id: 'experience_level',
    type: 'contextual',
    title: 'Experience Level',
    content: 'Choose "Fresher" if you have less than 1 year of work experience or are a recent graduate. Choose "Experienced" if you have 1+ years of professional work experience.',
    icon: '📊',
    priority: 'high',
    showConditions: {
      sections: ['classification'],
      questionIds: ['experience_level']
    }
  },

  // Basic Info Tips
  {
    id: 'professional_email',
    type: 'ats',
    title: 'Use a Professional Email',
    content: 'Use a professional email address like firstname.lastname@email.com. Avoid nicknames or unprofessional addresses.',
    icon: '📧',
    priority: 'high',
    showConditions: {
      sections: ['basic_info'],
      questionIds: ['email']
    }
  },
  {
    id: 'phone_format',
    type: 'ats',
    title: 'Phone Number Format',
    content: 'Use a standard format like +1-234-567-8900 or (234) 567-8900. Include country code for international applications.',
    icon: '📱',
    priority: 'medium',
    showConditions: {
      sections: ['basic_info'],
      questionIds: ['phone']
    }
  },
  {
    id: 'headline_power',
    type: 'best_practice',
    title: 'Craft a Powerful Headline',
    content: 'Your headline should be a brief, impactful statement that summarizes your professional identity. Example: "Full Stack Developer | React & Node.js Expert"',
    icon: '💡',
    priority: 'medium',
    showConditions: {
      sections: ['basic_info'],
      questionIds: ['headline']
    }
  },
  {
    id: 'summary_keywords',
    type: 'ats',
    title: 'Include Keywords in Summary',
    content: 'Your summary should include relevant keywords from job descriptions in your field. Keep it concise (2-3 sentences) and focus on your value proposition.',
    icon: '🔑',
    priority: 'high',
    showConditions: {
      sections: ['basic_info'],
      questionIds: ['summary']
    }
  },

  // Education Tips
  {
    id: 'education_relevance',
    type: 'best_practice',
    title: 'Highlight Relevant Coursework',
    content: 'If you\'re a recent graduate, mention relevant coursework, projects, or specializations that align with your target role.',
    icon: '🎓',
    priority: 'medium',
    showConditions: {
      sections: ['education'],
      experiences: ['fresher']
    }
  },
  {
    id: 'gpa_inclusion',
    type: 'best_practice',
    title: 'Include GPA if Strong',
    content: 'Include your GPA if it\'s 3.5 or higher (or equivalent percentage above 70%). Otherwise, you can leave it blank.',
    icon: '📈',
    priority: 'low',
    showConditions: {
      sections: ['education'],
      questionIds: ['education_marks']
    }
  },

  // Experience Tips
  {
    id: 'quantify_achievements',
    type: 'best_practice',
    title: 'Quantify Your Achievements',
    content: 'Use numbers, percentages, and metrics to demonstrate impact. Example: "Increased sales by 25%" instead of "Improved sales".',
    icon: '📊',
    priority: 'high',
    showConditions: {
      sections: ['experience'],
      questionIds: ['experience_achievements']
    }
  },
  {
    id: 'action_verbs',
    type: 'best_practice',
    title: 'Start with Action Verbs',
    content: 'Begin each achievement with a strong action verb like "Led", "Developed", "Improved", or "Achieved" to show impact.',
    icon: '⚡',
    priority: 'high',
    showConditions: {
      sections: ['experience'],
      questionIds: ['experience_achievements']
    }
  },

  // Projects Tips
  {
    id: 'project_impact',
    type: 'best_practice',
    title: 'Show Project Impact',
    content: 'Describe what problem your project solved and its impact. Include metrics if possible (users, performance improvements, etc.).',
    icon: '🚀',
    priority: 'high',
    showConditions: {
      sections: ['projects'],
      questionIds: ['project_description']
    }
  },
  {
    id: 'tech_stack_relevance',
    type: 'ats',
    title: 'Match Tech Stack to Jobs',
    content: 'Include technologies that are commonly requested in job postings for your target role. This helps with ATS keyword matching.',
    icon: '🔧',
    priority: 'high',
    showConditions: {
      sections: ['projects'],
      backgrounds: ['tech'],
      questionIds: ['project_tech_stack']
    }
  },

  // Skills Tips
  {
    id: 'skill_prioritization',
    type: 'ats',
    title: 'Prioritize Relevant Skills',
    content: 'List your most job-relevant skills first. Research job postings to identify the most in-demand skills in your field.',
    icon: '🎯',
    priority: 'high',
    showConditions: {
      sections: ['skills'],
      questionIds: ['skills_primary']
    }
  },
  {
    id: 'skill_categories',
    type: 'best_practice',
    title: 'Organize Skills by Category',
    content: 'Group similar skills together (e.g., Programming Languages, Frameworks, Tools) for better readability.',
    icon: '📋',
    priority: 'medium',
    showConditions: {
      sections: ['skills']
    }
  },

  // Social Links Tips
  {
    id: 'linkedin_optimization',
    type: 'ats',
    title: 'Optimize Your LinkedIn',
    content: 'Ensure your LinkedIn profile is complete and matches your resume. Use a professional photo and compelling headline.',
    icon: '💼',
    priority: 'high',
    showConditions: {
      sections: ['social_links'],
      questionIds: ['social_linkedin']
    }
  },
  {
    id: 'github_portfolio',
    type: 'best_practice',
    title: 'Showcase Your Code',
    content: 'Your GitHub should have clean, well-documented repositories that demonstrate your coding skills and project experience.',
    icon: '💻',
    priority: 'high',
    showConditions: {
      sections: ['social_links'],
      backgrounds: ['tech'],
      questionIds: ['social_github']
    }
  },

  // General ATS Tips
  {
    id: 'ats_formatting',
    type: 'ats',
    title: 'ATS-Friendly Formatting',
    content: 'Use standard section headings, avoid images/graphics, and use common fonts. Our template is already optimized for ATS systems.',
    icon: '🤖',
    priority: 'high'
  },
  {
    id: 'keyword_matching',
    type: 'ats',
    title: 'Match Job Keywords',
    content: 'Include relevant keywords from job descriptions throughout your resume, but avoid keyword stuffing. Use natural language.',
    icon: '🔍',
    priority: 'high'
  }
];

// ============================================================================
// TIPS ENGINE CLASS
// ============================================================================

export class TipsEngine {
  private tips: Tip[];
  private actionVerbs: ActionVerb[];
  private skillSuggestions: SkillSuggestion[];

  constructor() {
    this.tips = CONTEXTUAL_TIPS;
    this.actionVerbs = ACTION_VERBS;
    this.skillSuggestions = SKILL_SUGGESTIONS;
  }

  // Get contextual tips for current question
  getContextualTips(question: Question, userProfile: UserProfile): Tip[] {
    return this.tips.filter(tip => {
      if (!tip.showConditions) return false;

      const conditions = tip.showConditions;

      // Check section conditions
      if (conditions.sections && !conditions.sections.includes(question.section)) {
        return false;
      }

      // Check background conditions
      if (conditions.backgrounds && !conditions.backgrounds.includes(userProfile.background)) {
        return false;
      }

      // Check experience conditions
      if (conditions.experiences && !conditions.experiences.includes(userProfile.experience)) {
        return false;
      }

      // Check question ID conditions
      if (conditions.questionIds && !conditions.questionIds.includes(question.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by priority: high > medium > low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Get action verb suggestions for achievements/experience
  getActionVerbSuggestions(category?: string): string[] {
    if (category) {
      const categoryData = this.actionVerbs.find(av => av.category.toLowerCase() === category.toLowerCase());
      return categoryData ? categoryData.verbs : [];
    }

    // Return all action verbs grouped by category
    return this.actionVerbs.flatMap(av => av.verbs);
  }

  // Get action verb categories
  getActionVerbCategories(): string[] {
    return this.actionVerbs.map(av => av.category);
  }

  // Get skill suggestions based on user profile
  getSkillSuggestions(userProfile: UserProfile, category?: string): SkillSuggestion[] {
    return this.skillSuggestions.filter(suggestion => {
      // Check background match
      if (suggestion.background !== 'both' && suggestion.background !== userProfile.background) {
        return false;
      }

      // Check experience match
      if (suggestion.experience !== 'both' && suggestion.experience !== userProfile.experience) {
        return false;
      }

      // Check category filter
      if (category && suggestion.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      return true;
    });
  }

  // Get skill categories for user profile
  getSkillCategories(userProfile: UserProfile): string[] {
    const suggestions = this.getSkillSuggestions(userProfile);
    return [...new Set(suggestions.map(s => s.category))];
  }

  // Get ATS optimization tips
  getATSOptimizationTips(): Tip[] {
    return this.tips.filter(tip => tip.type === 'ats');
  }

  // Get best practice tips
  getBestPracticeTips(): Tip[] {
    return this.tips.filter(tip => tip.type === 'best_practice');
  }

  // Get example suggestions for a specific field
  getExampleSuggestions(questionId: string, userProfile: UserProfile): string[] {
    const examples: Record<string, Record<string, string[]>> = {
      headline: {
        tech: [
          'Full Stack Developer | React & Node.js Expert',
          'Software Engineer | Python & Machine Learning',
          'Frontend Developer | UI/UX Enthusiast',
          'DevOps Engineer | AWS & Kubernetes Specialist',
          'Data Scientist | AI & Analytics Expert'
        ],
        'non-tech': [
          'Marketing Manager | Digital Strategy Expert',
          'Business Analyst | Process Improvement Specialist',
          'Project Manager | Agile & Scrum Certified',
          'Sales Professional | B2B Relationship Builder',
          'HR Specialist | Talent Acquisition Expert'
        ]
      },
      summary: {
        tech: [
          'Passionate software developer with 3+ years of experience building scalable web applications using React and Node.js. Proven track record of delivering high-quality solutions that improve user experience and business outcomes.',
          'Results-driven data scientist with expertise in machine learning and statistical analysis. Successfully implemented predictive models that increased business efficiency by 25%.'
        ],
        'non-tech': [
          'Strategic marketing professional with 5+ years of experience driving brand growth and customer engagement. Proven ability to develop and execute campaigns that increase revenue by 30%.',
          'Detail-oriented business analyst with expertise in process optimization and data-driven decision making. Successfully led initiatives that reduced operational costs by 20%.'
        ]
      },
      experience_achievements: {
        tech: [
          'Developed and deployed 5+ web applications using React and Node.js, serving 10,000+ users',
          'Improved application performance by 40% through code optimization and caching strategies',
          'Led a team of 3 developers in building a microservices architecture',
          'Implemented CI/CD pipeline that reduced deployment time by 60%'
        ],
        'non-tech': [
          'Increased sales revenue by 25% through strategic client relationship management',
          'Led cross-functional team of 8 members to deliver project 2 weeks ahead of schedule',
          'Reduced operational costs by 15% through process optimization initiatives',
          'Managed budget of $500K+ and delivered projects within 95% of allocated resources'
        ]
      }
    };

    const questionExamples = examples[questionId];
    if (!questionExamples) return [];

    return questionExamples[userProfile.background] || [];
  }

  // Generate achievement suggestions with action verbs
  generateAchievementSuggestions(userProfile: UserProfile): string[] {
    const suggestions: string[] = [];
    const verbs = this.getActionVerbSuggestions();

    if (userProfile.background === 'tech') {
      suggestions.push(
        `${verbs[0]} and deployed scalable web applications serving X+ users`,
        `${verbs[1]} application performance by X% through optimization`,
        `${verbs[2]} automated testing suite reducing bugs by X%`,
        `${verbs[3]} cross-functional team of X developers`,
        `${verbs[4]} CI/CD pipeline reducing deployment time by X%`
      );
    } else {
      suggestions.push(
        `${verbs[0]} sales revenue by X% through strategic initiatives`,
        `${verbs[1]} team of X members to deliver projects on time`,
        `${verbs[2]} operational efficiency by X% through process improvement`,
        `${verbs[3]} budget of $X+ with 95%+ accuracy`,
        `${verbs[4]} client satisfaction scores by X points`
      );
    }

    return suggestions;
  }

  // Get tips by type
  getTipsByType(type: Tip['type']): Tip[] {
    return this.tips.filter(tip => tip.type === type);
  }

  // Get high priority tips
  getHighPriorityTips(): Tip[] {
    return this.tips.filter(tip => tip.priority === 'high');
  }

  // Search tips by content
  searchTips(query: string): Tip[] {
    const lowercaseQuery = query.toLowerCase();
    return this.tips.filter(tip => 
      tip.title.toLowerCase().includes(lowercaseQuery) ||
      tip.content.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Export singleton instance
export const tipsEngine = new TipsEngine();