import { ResumeData } from '../chatbot/types';

// ============================================================================
// PDF TEMPLATE CONFIGURATIONS
// ============================================================================

export interface TemplateConfig {
  name: string;
  description: string;
  fonts: {
    primary: string;
    secondary: string;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  spacing: {
    sectionGap: number;
    lineHeight: number;
    paragraphGap: number;
  };
  layout: {
    headerHeight: number;
    sectionTitleSize: number;
    bodyTextSize: number;
    smallTextSize: number;
  };
}

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

export const ATS_STANDARD_TEMPLATE: TemplateConfig = {
  name: 'ATS Standard',
  description: 'Clean, professional format optimized for ATS systems',
  fonts: {
    primary: 'helvetica',
    secondary: 'helvetica'
  },
  colors: {
    primary: '#000000',
    secondary: '#333333',
    text: '#000000'
  },
  spacing: {
    sectionGap: 8,
    lineHeight: 4,
    paragraphGap: 6
  },
  layout: {
    headerHeight: 25,
    sectionTitleSize: 12,
    bodyTextSize: 10,
    smallTextSize: 9
  }
};

export const ATS_MODERN_TEMPLATE: TemplateConfig = {
  name: 'ATS Modern',
  description: 'Contemporary design while maintaining ATS compatibility',
  fonts: {
    primary: 'helvetica',
    secondary: 'helvetica'
  },
  colors: {
    primary: '#2c3e50',
    secondary: '#34495e',
    text: '#2c3e50'
  },
  spacing: {
    sectionGap: 10,
    lineHeight: 4.5,
    paragraphGap: 7
  },
  layout: {
    headerHeight: 30,
    sectionTitleSize: 13,
    bodyTextSize: 10,
    smallTextSize: 9
  }
};

export const ATS_MINIMAL_TEMPLATE: TemplateConfig = {
  name: 'ATS Minimal',
  description: 'Ultra-clean, minimal design for maximum ATS compatibility',
  fonts: {
    primary: 'helvetica',
    secondary: 'helvetica'
  },
  colors: {
    primary: '#000000',
    secondary: '#000000',
    text: '#000000'
  },
  spacing: {
    sectionGap: 6,
    lineHeight: 3.5,
    paragraphGap: 5
  },
  layout: {
    headerHeight: 20,
    sectionTitleSize: 11,
    bodyTextSize: 10,
    smallTextSize: 8
  }
};

// ============================================================================
// TEMPLATE UTILITIES
// ============================================================================

export function getTemplateConfig(templateName: string): TemplateConfig {
  switch (templateName) {
    case 'ats-modern':
      return ATS_MODERN_TEMPLATE;
    case 'ats-minimal':
      return ATS_MINIMAL_TEMPLATE;
    case 'ats-standard':
    default:
      return ATS_STANDARD_TEMPLATE;
  }
}

export function getAvailableTemplates(): TemplateConfig[] {
  return [
    ATS_STANDARD_TEMPLATE,
    ATS_MODERN_TEMPLATE,
    ATS_MINIMAL_TEMPLATE
  ];
}

// ============================================================================
// SECTION ORDERING UTILITIES
// ============================================================================

export interface SectionOrder {
  section: string;
  priority: number;
  required: boolean;
}

export function getOptimalSectionOrder(resumeData: ResumeData): SectionOrder[] {
  const baseOrder: SectionOrder[] = [
    { section: 'header', priority: 1, required: true },
    { section: 'summary', priority: 2, required: false },
  ];

  // Add experience or projects based on user profile
  if (resumeData.metadata.experience === 'experienced' && resumeData.experience.length > 0) {
    baseOrder.push({ section: 'experience', priority: 3, required: true });
    if (resumeData.projects.length > 0) {
      baseOrder.push({ section: 'projects', priority: 4, required: false });
    }
  } else {
    if (resumeData.projects.length > 0) {
      baseOrder.push({ section: 'projects', priority: 3, required: true });
    }
    if (resumeData.experience.length > 0) {
      baseOrder.push({ section: 'experience', priority: 4, required: false });
    }
  }

  // Add remaining sections
  baseOrder.push(
    { section: 'education', priority: 5, required: true },
    { section: 'skills', priority: 6, required: true },
    { section: 'achievements', priority: 7, required: false }
  );

  return baseOrder.sort((a, b) => a.priority - b.priority);
}

// ============================================================================
// ATS OPTIMIZATION UTILITIES
// ============================================================================

export interface ATSOptimizationRules {
  maxLineLength: number;
  preferredFonts: string[];
  avoidedElements: string[];
  requiredSections: string[];
  keywordDensityTarget: number;
}

export const ATS_OPTIMIZATION_RULES: ATSOptimizationRules = {
  maxLineLength: 80,
  preferredFonts: ['helvetica', 'arial', 'calibri', 'times'],
  avoidedElements: ['tables', 'columns', 'text-boxes', 'headers-footers'],
  requiredSections: ['contact', 'experience-or-projects', 'education', 'skills'],
  keywordDensityTarget: 0.02 // 2% keyword density
};

export function validateATSCompliance(resumeData: ResumeData): {
  isCompliant: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check required sections
  if (!resumeData.basicInfo.fullName || !resumeData.basicInfo.email || !resumeData.basicInfo.phone) {
    issues.push('Missing required contact information');
    suggestions.push('Ensure name, email, and phone number are provided');
  }

  if (resumeData.experience.length === 0 && resumeData.projects.length === 0) {
    issues.push('No work experience or projects found');
    suggestions.push('Add either work experience or project details');
  }

  if (resumeData.education.length === 0) {
    issues.push('No education information found');
    suggestions.push('Add your educational background');
  }

  if (resumeData.skills.primary.length === 0) {
    issues.push('No skills listed');
    suggestions.push('Add relevant skills for your field');
  }

  // Check content quality
  if (!resumeData.basicInfo.summary) {
    suggestions.push('Consider adding a professional summary');
  }

  if (resumeData.experience.some(exp => !exp.achievements || exp.achievements.length === 0)) {
    suggestions.push('Add specific achievements and quantifiable results to your experience');
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    suggestions
  };
}