// ATS Optimization System
// Provides comprehensive ATS scoring, keyword analysis, and optimization suggestions

import { ResumeData } from '@/app/lib/chatbot/types';

export interface ATSScore {
  overall: number;
  factors: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
  };
  suggestions: string[];
  keywordAnalysis: KeywordAnalysis;
  sectionOptimization: SectionOptimization;
}

export interface KeywordAnalysis {
  totalKeywords: number;
  actionVerbs: string[];
  technicalSkills: string[];
  missingKeywords: string[];
  keywordDensity: number;
  recommendations: string[];
  industryKeywords: string[];
  keywordStrength: 'weak' | 'moderate' | 'strong';
}

export interface SectionOptimization {
  sectionOrder: SectionOrderAnalysis;
  contentQuality: ContentQualityAnalysis;
  formatting: FormattingAnalysis;
}

export interface SectionOrderAnalysis {
  currentOrder: string[];
  recommendedOrder: string[];
  score: number;
  suggestions: string[];
}

export interface ContentQualityAnalysis {
  summaryQuality: number;
  experienceQuality: number;
  skillsQuality: number;
  educationQuality: number;
  suggestions: string[];
}

export interface FormattingAnalysis {
  consistency: number;
  readability: number;
  atsCompliance: number;
  suggestions: string[];
}

// Common action verbs for ATS optimization
const ACTION_VERBS = [
  'achieved', 'improved', 'increased', 'developed', 'managed', 'led', 'created', 
  'implemented', 'designed', 'built', 'optimized', 'streamlined', 'delivered',
  'coordinated', 'executed', 'established', 'launched', 'maintained', 'operated',
  'supervised', 'trained', 'collaborated', 'analyzed', 'researched', 'resolved',
  'enhanced', 'reduced', 'generated', 'facilitated', 'negotiated', 'presented',
  'accelerated', 'accomplished', 'administered', 'advised', 'allocated', 'approved',
  'assembled', 'assessed', 'assisted', 'automated', 'calculated', 'completed',
  'configured', 'consolidated', 'constructed', 'consulted', 'converted', 'customized',
  'demonstrated', 'deployed', 'directed', 'eliminated', 'engineered', 'evaluated',
  'expanded', 'expedited', 'formulated', 'guided', 'identified', 'initiated',
  'innovated', 'integrated', 'mentored', 'migrated', 'modernized', 'monitored',
  'orchestrated', 'organized', 'overhauled', 'pioneered', 'planned', 'produced',
  'programmed', 'promoted', 'recommended', 'redesigned', 'restructured', 'revamped',
  'scaled', 'spearheaded', 'standardized', 'strengthened', 'transformed', 'upgraded'
];

// Technical keywords by category
const TECHNICAL_KEYWORDS = {
  programming: ['javascript', 'python', 'java', 'react', 'node.js', 'typescript', 'html', 'css', 'php', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift', 'kotlin'],
  frameworks: ['react', 'angular', 'vue.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'next.js', 'nuxt.js'],
  databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'sql', 'sqlite', 'oracle', 'cassandra', 'elasticsearch'],
  cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'cloudformation', 'serverless'],
  tools: ['git', 'jenkins', 'jira', 'confluence', 'slack', 'webpack', 'babel', 'npm', 'yarn', 'gradle', 'maven'],
  methodologies: ['agile', 'scrum', 'devops', 'ci/cd', 'tdd', 'bdd', 'microservices', 'rest', 'graphql', 'api']
};

// Business keywords for non-tech roles
const BUSINESS_KEYWORDS = [
  'project management', 'stakeholder management', 'budget management', 'team leadership',
  'strategic planning', 'process improvement', 'client relations', 'sales', 'marketing',
  'analytics', 'reporting', 'compliance', 'risk management', 'quality assurance',
  'business development', 'customer service', 'operations', 'finance', 'accounting',
  'human resources', 'training', 'communication', 'negotiation', 'problem solving',
  'data analysis', 'market research', 'vendor management', 'contract negotiation'
];

// Industry-specific keywords
const INDUSTRY_KEYWORDS = {
  software: ['software', 'full stack', 'frontend', 'backend', 'mobile', 'web', 'api', 'development', 'applications', 'scalable', 'microservices', 'architecture'],
  finance: ['financial', 'investment', 'portfolio', 'risk', 'modeling', 'compliance', 'budget', 'revenue', 'analysis'],
  healthcare: ['patient', 'medical', 'healthcare', 'clinical', 'research', 'devices', 'treatment', 'diagnosis'],
  marketing: ['digital', 'content', 'seo', 'social media', 'brand', 'campaign', 'engagement', 'conversion', 'analytics'],
  sales: ['lead', 'customer', 'sales', 'crm', 'account', 'revenue', 'growth', 'acquisition', 'retention'],
  consulting: ['consulting', 'business', 'strategy', 'change', 'optimization', 'analysis', 'advisory', 'transformation'],
  education: ['curriculum', 'student', 'educational', 'assessment', 'learning', 'teaching', 'training', 'instruction'],
  manufacturing: ['production', 'quality', 'supply chain', 'lean', 'manufacturing', 'process', 'operations', 'efficiency']
};

export class ATSOptimizer {
  
  /**
   * Calculate comprehensive ATS score for a resume
   */
  static calculateATSScore(resumeData: ResumeData): ATSScore {
    const factors = {
      formatting: this.calculateFormattingScore(resumeData),
      keywords: this.calculateKeywordScore(resumeData),
      structure: this.calculateStructureScore(resumeData),
      readability: this.calculateReadabilityScore(resumeData)
    };

    const overall = Math.round(
      (factors.formatting * 0.25 + factors.keywords * 0.35 + factors.structure * 0.25 + factors.readability * 0.15)
    );

    const keywordAnalysis = this.analyzeKeywords(resumeData);
    const sectionOptimization = this.analyzeSectionOptimization(resumeData);
    const suggestions = this.generateComprehensiveSuggestions(resumeData, factors, keywordAnalysis, sectionOptimization);

    return {
      overall,
      factors,
      suggestions,
      keywordAnalysis,
      sectionOptimization
    };
  }

  /**
   * Calculate formatting score based on ATS-friendly formatting rules
   */
  private static calculateFormattingScore(resumeData: ResumeData): number {
    let score = 100;
    
    // Essential contact information
    if (!resumeData.basicInfo.fullName) score -= 25;
    if (!resumeData.basicInfo.email) score -= 20;
    if (!resumeData.basicInfo.phone) score -= 15;
    
    // Email format validation
    if (resumeData.basicInfo.email && !this.isValidEmail(resumeData.basicInfo.email)) {
      score -= 10;
    }
    
    // Phone format validation
    if (resumeData.basicInfo.phone && !this.isValidPhone(resumeData.basicInfo.phone)) {
      score -= 5;
    }
    
    // Bonus for complete contact info
    if (resumeData.basicInfo.location) score += 5;
    if (resumeData.socialLinks.linkedin) score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate keyword score based on relevant keywords and action verbs
   */
  private static calculateKeywordScore(resumeData: ResumeData): number {
    let score = 50; // Base score
    
    const keywordAnalysis = this.analyzeKeywords(resumeData);
    
    // Points for action verbs
    score += Math.min(20, keywordAnalysis.actionVerbs.length * 2);
    
    // Points for technical skills
    score += Math.min(15, keywordAnalysis.technicalSkills.length);
    
    // Points for keyword density
    if (keywordAnalysis.keywordDensity > 0.02 && keywordAnalysis.keywordDensity < 0.08) {
      score += 10; // Optimal keyword density
    } else if (keywordAnalysis.keywordDensity > 0.08) {
      score -= 5; // Keyword stuffing penalty
    }
    
    // Points for skills variety
    const totalSkills = resumeData.skills.primary.length + 
                       (resumeData.skills.secondary?.length || 0) +
                       (resumeData.skills.techStack?.length || 0);
    score += Math.min(15, totalSkills);
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate structure score based on section presence and organization
   */
  private static calculateStructureScore(resumeData: ResumeData): number {
    let score = 60; // Base score
    
    // Essential sections
    if (resumeData.basicInfo.fullName && resumeData.basicInfo.email) score += 15;
    if (resumeData.education.length > 0) score += 10;
    if (resumeData.experience.length > 0 || resumeData.projects.length > 0) score += 15;
    
    // Optional but valuable sections
    if (resumeData.basicInfo.summary && resumeData.basicInfo.summary.length > 50) score += 5;
    if (resumeData.skills.primary.length > 0) score += 5;
    
    // Section quality bonuses
    if (resumeData.experience.length > 0) {
      const hasQuantifiedAchievements = resumeData.experience.some(exp => 
        exp.achievements?.some(achievement => /\d+/.test(achievement))
      );
      if (hasQuantifiedAchievements) score += 5;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate readability score based on content quality and length
   */
  private static calculateReadabilityScore(resumeData: ResumeData): number {
    let score = 80; // Base score
    
    // Summary quality
    if (resumeData.basicInfo.summary) {
      const summaryLength = resumeData.basicInfo.summary.length;
      if (summaryLength >= 100 && summaryLength <= 300) {
        score += 10;
      } else if (summaryLength > 300) {
        score -= 5;
      }
    }
    
    // Experience descriptions quality
    resumeData.experience.forEach(exp => {
      exp.achievements?.forEach(achievement => {
        if (achievement.length > 250) score -= 2; // Too long
        if (achievement.length < 30) score -= 1; // Too short
        if (/\d+/.test(achievement)) score += 1; // Quantified
      });
    });
    
    // Skills organization
    if (resumeData.skills.primary.length > 10) score -= 5; // Too many primary skills
    if (resumeData.skills.primary.length < 3) score -= 5; // Too few skills
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Analyze keywords in the resume
   */
  private static analyzeKeywords(resumeData: ResumeData): KeywordAnalysis {
    const allText = this.extractAllText(resumeData).toLowerCase();
    const words = allText.split(/\s+/);
    
    // Find action verbs
    const actionVerbs = ACTION_VERBS.filter(verb => 
      allText.includes(verb.toLowerCase())
    );
    
    // Find technical skills
    const technicalSkills: string[] = [];
    Object.values(TECHNICAL_KEYWORDS).flat().forEach(keyword => {
      if (allText.includes(keyword.toLowerCase())) {
        technicalSkills.push(keyword);
      }
    });
    
    // Find industry keywords
    const industryKeywords: string[] = [];
    Object.values(INDUSTRY_KEYWORDS).flat().forEach(keyword => {
      if (allText.includes(keyword.toLowerCase())) {
        industryKeywords.push(keyword);
      }
    });
    
    // Calculate keyword density
    const totalKeywords = actionVerbs.length + technicalSkills.length + industryKeywords.length;
    const keywordDensity = totalKeywords / words.length;
    
    // Determine keyword strength
    const keywordStrength = this.determineKeywordStrength(totalKeywords, actionVerbs.length, technicalSkills.length);
    
    // Suggest missing keywords based on background
    const missingKeywords = this.suggestMissingKeywords(resumeData, technicalSkills, actionVerbs);
    
    const recommendations = this.generateKeywordRecommendations(
      resumeData, actionVerbs, technicalSkills, keywordDensity
    );
    
    return {
      totalKeywords,
      actionVerbs,
      technicalSkills,
      missingKeywords,
      keywordDensity,
      recommendations,
      industryKeywords,
      keywordStrength
    };
  }

  /**
   * Analyze section optimization opportunities
   */
  private static analyzeSectionOptimization(resumeData: ResumeData): SectionOptimization {
    const sectionOrder = this.analyzeSectionOrder(resumeData);
    const contentQuality = this.analyzeContentQuality(resumeData);
    const formatting = this.analyzeFormatting(resumeData);
    
    return {
      sectionOrder,
      contentQuality,
      formatting
    };
  }

  /**
   * Analyze section ordering
   */
  private static analyzeSectionOrder(resumeData: ResumeData): SectionOrderAnalysis {
    const currentOrder = this.getCurrentSectionOrder(resumeData);
    const recommendedOrder = this.getRecommendedSectionOrder(resumeData);
    
    // Calculate score based on how close current order is to recommended
    let score = 100;
    const orderDifference = this.calculateOrderDifference(currentOrder, recommendedOrder);
    score -= orderDifference * 10;
    
    const suggestions = this.generateOrderSuggestions(currentOrder, recommendedOrder);
    
    return {
      currentOrder,
      recommendedOrder,
      score: Math.max(0, score),
      suggestions
    };
  }

  /**
   * Analyze content quality across sections
   */
  private static analyzeContentQuality(resumeData: ResumeData): ContentQualityAnalysis {
    const summaryQuality = this.analyzeSummaryQuality(resumeData.basicInfo.summary);
    const experienceQuality = this.analyzeExperienceQuality(resumeData.experience);
    const skillsQuality = this.analyzeSkillsQuality(resumeData.skills);
    const educationQuality = this.analyzeEducationQuality(resumeData.education);
    
    const suggestions = this.generateContentQualitySuggestions(
      summaryQuality, experienceQuality, skillsQuality, educationQuality
    );
    
    return {
      summaryQuality,
      experienceQuality,
      skillsQuality,
      educationQuality,
      suggestions
    };
  }

  /**
   * Analyze formatting consistency and ATS compliance
   */
  private static analyzeFormatting(resumeData: ResumeData): FormattingAnalysis {
    let consistency = 100;
    let readability = 100;
    let atsCompliance = 100;
    
    // Check date formatting consistency
    const dateFormats = this.extractDateFormats(resumeData);
    if (dateFormats.length > 1) consistency -= 20;
    
    // Check for ATS-unfriendly elements
    if (this.hasComplexFormatting(resumeData)) atsCompliance -= 15;
    
    const suggestions = this.generateFormattingSuggestions(consistency, readability, atsCompliance);
    
    return {
      consistency: Math.max(0, consistency),
      readability: Math.max(0, readability),
      atsCompliance: Math.max(0, atsCompliance),
      suggestions
    };
  }

  // Helper methods
  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    return /^\+?[\d\s\-\(\)]{10,}$/.test(phone);
  }

  private static extractAllText(resumeData: ResumeData): string {
    let text = '';
    
    // Basic info
    text += `${resumeData.basicInfo.fullName} ${resumeData.basicInfo.headline || ''} ${resumeData.basicInfo.summary || ''} `;
    
    // Experience
    resumeData.experience.forEach(exp => {
      text += `${exp.role} ${exp.companyName} `;
      exp.achievements?.forEach(achievement => text += `${achievement} `);
      exp.toolsUsed?.forEach(tool => text += `${tool} `);
    });
    
    // Projects
    resumeData.projects.forEach(project => {
      text += `${project.title} ${project.description || ''} `;
      project.techStack?.forEach(tech => text += `${tech} `);
    });
    
    // Skills
    text += resumeData.skills.primary.join(' ') + ' ';
    text += (resumeData.skills.secondary || []).join(' ') + ' ';
    text += (resumeData.skills.techStack || []).join(' ') + ' ';
    
    return text;
  }

  private static suggestMissingKeywords(
    resumeData: ResumeData, 
    foundTechnical: string[], 
    foundActionVerbs: string[]
  ): string[] {
    const missing: string[] = [];
    
    if (resumeData.metadata.background === 'tech') {
      // Suggest missing technical keywords
      const commonTech = ['javascript', 'python', 'react', 'git', 'sql'];
      commonTech.forEach(tech => {
        if (!foundTechnical.includes(tech)) {
          missing.push(tech);
        }
      });
    } else {
      // Suggest missing business keywords
      const commonBusiness = ['project management', 'team leadership', 'client relations'];
      commonBusiness.forEach(keyword => {
        if (!this.extractAllText(resumeData).toLowerCase().includes(keyword)) {
          missing.push(keyword);
        }
      });
    }
    
    // Suggest missing action verbs
    const essentialVerbs = ['managed', 'developed', 'improved', 'led'];
    essentialVerbs.forEach(verb => {
      if (!foundActionVerbs.includes(verb)) {
        missing.push(verb);
      }
    });
    
    return missing.slice(0, 5); // Limit to top 5 suggestions
  }

  private static generateKeywordRecommendations(
    resumeData: ResumeData,
    actionVerbs: string[],
    technicalSkills: string[],
    keywordDensity: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (actionVerbs.length < 5) {
      recommendations.push('Add more action verbs to your experience descriptions');
    }
    
    if (technicalSkills.length < 3 && resumeData.metadata.background === 'tech') {
      recommendations.push('Include more technical skills relevant to your field');
    }
    
    if (keywordDensity < 0.02) {
      recommendations.push('Increase keyword usage throughout your resume');
    } else if (keywordDensity > 0.08) {
      recommendations.push('Reduce keyword density to avoid appearing as keyword stuffing');
    }
    
    return recommendations;
  }

  private static getCurrentSectionOrder(resumeData: ResumeData): string[] {
    const order: string[] = ['contact'];
    
    if (resumeData.basicInfo.summary) order.push('summary');
    if (resumeData.experience.length > 0) order.push('experience');
    if (resumeData.projects.length > 0) order.push('projects');
    if (resumeData.education.length > 0) order.push('education');
    if (resumeData.skills.primary.length > 0) order.push('skills');
    if (resumeData.achievements.certifications?.length || resumeData.achievements.achievements?.length) {
      order.push('achievements');
    }
    
    return order;
  }

  private static getRecommendedSectionOrder(resumeData: ResumeData): string[] {
    const order = ['contact'];
    
    if (resumeData.basicInfo.summary) order.push('summary');
    
    // For experienced professionals, experience comes first
    if (resumeData.metadata.experience === 'experienced') {
      if (resumeData.experience.length > 0) order.push('experience');
      if (resumeData.projects.length > 0) order.push('projects');
    } else {
      // For freshers, projects come first (especially for tech)
      if (resumeData.projects.length > 0) order.push('projects');
      if (resumeData.experience.length > 0) order.push('experience');
    }
    
    if (resumeData.education.length > 0) order.push('education');
    if (resumeData.skills.primary.length > 0) order.push('skills');
    if (resumeData.achievements.certifications?.length || resumeData.achievements.achievements?.length) {
      order.push('achievements');
    }
    
    return order;
  }

  private static calculateOrderDifference(current: string[], recommended: string[]): number {
    let differences = 0;
    for (let i = 0; i < Math.min(current.length, recommended.length); i++) {
      if (current[i] !== recommended[i]) differences++;
    }
    return differences;
  }

  private static generateOrderSuggestions(current: string[], recommended: string[]): string[] {
    const suggestions: string[] = [];
    
    if (current.join(',') !== recommended.join(',')) {
      suggestions.push(`Consider reordering sections: ${recommended.join(' → ')}`);
    }
    
    return suggestions;
  }

  private static analyzeSummaryQuality(summary?: string): number {
    if (!summary) return 0;
    
    let score = 50;
    
    if (summary.length >= 100 && summary.length <= 300) score += 30;
    if (summary.includes('experience') || summary.includes('skilled')) score += 10;
    if (/\d+/.test(summary)) score += 10; // Contains numbers
    
    return Math.min(100, score);
  }

  private static analyzeExperienceQuality(experience: any[]): number {
    if (experience.length === 0) return 0;
    
    let score = 50;
    
    experience.forEach(exp => {
      if (exp.achievements && exp.achievements.length > 0) score += 10;
      if (exp.achievements?.some((a: string) => /\d+/.test(a))) score += 10;
      if (exp.toolsUsed && exp.toolsUsed.length > 0) score += 5;
    });
    
    return Math.min(100, score);
  }

  private static analyzeSkillsQuality(skills: any): number {
    let score = 50;
    
    if (skills.primary.length >= 5) score += 20;
    if (skills.secondary && skills.secondary.length > 0) score += 10;
    if (skills.techStack && skills.techStack.length > 0) score += 10;
    if (skills.businessTools && skills.businessTools.length > 0) score += 10;
    
    return Math.min(100, score);
  }

  private static analyzeEducationQuality(education: any[]): number {
    if (education.length === 0) return 0;
    
    let score = 70;
    
    education.forEach(edu => {
      if (edu.specialization) score += 10;
      if (edu.marks) score += 10;
      if (edu.startYear && edu.endYear) score += 10;
    });
    
    return Math.min(100, score);
  }

  private static generateContentQualitySuggestions(
    summary: number, experience: number, skills: number, education: number
  ): string[] {
    const suggestions: string[] = [];
    
    if (summary < 70) suggestions.push('Improve your professional summary with specific achievements');
    if (experience < 70) suggestions.push('Add more quantified achievements to your experience');
    if (skills < 70) suggestions.push('Expand your skills section with relevant technologies');
    if (education < 70) suggestions.push('Include more details about your education');
    
    return suggestions;
  }

  private static extractDateFormats(resumeData: ResumeData): string[] {
    const formats = new Set<string>();
    
    resumeData.experience.forEach(exp => {
      if (exp.startDate) formats.add(this.getDateFormat(exp.startDate));
      if (exp.endDate) formats.add(this.getDateFormat(exp.endDate));
    });
    
    return Array.from(formats);
  }

  private static getDateFormat(date: string): string {
    if (/^\d{4}$/.test(date)) return 'YYYY';
    if (/^\d{2}\/\d{4}$/.test(date)) return 'MM/YYYY';
    if (/^\w+ \d{4}$/.test(date)) return 'Month YYYY';
    return 'other';
  }

  private static hasComplexFormatting(resumeData: ResumeData): boolean {
    // Check for potentially ATS-unfriendly formatting
    const allText = this.extractAllText(resumeData);
    return /[^\w\s\-\.\,\(\)@]/.test(allText); // Special characters that might cause issues
  }

  private static generateFormattingSuggestions(
    consistency: number, readability: number, atsCompliance: number
  ): string[] {
    const suggestions: string[] = [];
    
    if (consistency < 80) suggestions.push('Use consistent date formatting throughout');
    if (readability < 80) suggestions.push('Improve text readability with shorter sentences');
    if (atsCompliance < 80) suggestions.push('Remove complex formatting that may not be ATS-friendly');
    
    return suggestions;
  }

  private static determineKeywordStrength(totalKeywords: number, actionVerbs: number, technicalSkills: number): 'weak' | 'moderate' | 'strong' {
    if (totalKeywords >= 15 && actionVerbs >= 5 && technicalSkills >= 5) {
      return 'strong';
    } else if (totalKeywords >= 8 && actionVerbs >= 3 && technicalSkills >= 3) {
      return 'moderate';
    } else {
      return 'weak';
    }
  }

  private static generateComprehensiveSuggestions(
    resumeData: ResumeData,
    factors: ATSScore['factors'],
    keywordAnalysis: KeywordAnalysis,
    sectionOptimization: SectionOptimization
  ): string[] {
    const suggestions: string[] = [];
    
    // Priority suggestions based on lowest scores
    const factorEntries = Object.entries(factors).sort(([,a], [,b]) => a - b);
    
    factorEntries.forEach(([factor, score]) => {
      if (score < 70) {
        switch (factor) {
          case 'formatting':
            suggestions.push('Improve contact information formatting and completeness');
            break;
          case 'keywords':
            suggestions.push('Add more relevant keywords and action verbs');
            break;
          case 'structure':
            suggestions.push('Enhance resume structure with missing essential sections');
            break;
          case 'readability':
            suggestions.push('Improve content readability and quantify achievements');
            break;
        }
      }
    });
    
    // Add keyword strength suggestions
    if (keywordAnalysis.keywordStrength === 'weak') {
      suggestions.push('Significantly increase keyword usage throughout your resume');
    } else if (keywordAnalysis.keywordStrength === 'moderate') {
      suggestions.push('Add more industry-specific keywords to strengthen your resume');
    }
    
    // Add specific recommendations
    suggestions.push(...keywordAnalysis.recommendations.slice(0, 2));
    suggestions.push(...sectionOptimization.contentQuality.suggestions.slice(0, 2));
    suggestions.push(...sectionOptimization.formatting.suggestions.slice(0, 1));
    
    return suggestions.slice(0, 6); // Limit to top 6 suggestions
  }
}