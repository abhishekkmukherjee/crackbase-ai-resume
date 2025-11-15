// Progress tracking utilities for the chatbot conversation
import { ResumeSection, UserProfile } from './types';

export interface ProgressStep {
  section: ResumeSection;
  name: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isAvailable: boolean;
  order: number;
}

export interface ProgressInfo {
  steps: ProgressStep[];
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  percentage: number;
  currentSection: ResumeSection;
  estimatedTimeRemaining: number; // in minutes
}

export class ProgressTracker {
  private static readonly SECTION_INFO = {
    classification: {
      name: 'Getting Started',
      description: 'Understanding your background',
      estimatedTime: 1
    },
    basic_info: {
      name: 'Basic Information',
      description: 'Contact details and headline',
      estimatedTime: 2
    },
    education: {
      name: 'Education',
      description: 'Academic background',
      estimatedTime: 2
    },
    experience: {
      name: 'Work Experience',
      description: 'Professional history',
      estimatedTime: 4
    },
    projects: {
      name: 'Projects',
      description: 'Significant projects',
      estimatedTime: 3
    },
    skills: {
      name: 'Skills',
      description: 'Technical and soft skills',
      estimatedTime: 2
    },
    achievements: {
      name: 'Achievements',
      description: 'Certifications and awards',
      estimatedTime: 2
    },
    social_links: {
      name: 'Professional Links',
      description: 'LinkedIn and portfolio',
      estimatedTime: 1
    },
    ai_upsell: {
      name: 'AI Enhancement',
      description: 'Optional upgrade offer',
      estimatedTime: 1
    },
    complete: {
      name: 'Complete',
      description: 'Resume ready!',
      estimatedTime: 0
    }
  };

  /**
   * Calculate progress information based on current state
   */
  static calculateProgress(
    currentSection: ResumeSection,
    currentStep: number,
    totalSteps: number,
    availableSections: ResumeSection[],
    userProfile?: UserProfile
  ): ProgressInfo {
    const steps = this.generateProgressSteps(availableSections, currentSection);
    const completedSteps = steps.filter(step => step.isCompleted).length;
    const percentage = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;
    const estimatedTimeRemaining = this.calculateEstimatedTime(steps, userProfile);

    return {
      steps,
      currentStep,
      totalSteps,
      completedSteps,
      percentage,
      currentSection,
      estimatedTimeRemaining
    };
  }

  /**
   * Generate progress steps based on available sections
   */
  private static generateProgressSteps(
    availableSections: ResumeSection[],
    currentSection: ResumeSection
  ): ProgressStep[] {
    const currentIndex = availableSections.indexOf(currentSection);
    
    return availableSections.map((section, index) => {
      const sectionInfo = this.SECTION_INFO[section];
      
      return {
        section,
        name: sectionInfo.name,
        description: sectionInfo.description,
        isCompleted: index < currentIndex,
        isCurrent: index === currentIndex,
        isAvailable: index <= currentIndex + 1, // Current and next section are available
        order: index + 1
      };
    });
  }

  /**
   * Calculate estimated time remaining
   */
  private static calculateEstimatedTime(
    steps: ProgressStep[],
    userProfile?: UserProfile
  ): number {
    const remainingSteps = steps.filter(step => !step.isCompleted);
    let totalTime = 0;

    remainingSteps.forEach(step => {
      const sectionInfo = this.SECTION_INFO[step.section];
      let timeMultiplier = 1;

      // Adjust time based on user profile
      if (userProfile) {
        if (step.section === 'experience' && userProfile.experience === 'fresher') {
          timeMultiplier = 0.5; // Freshers skip experience section
        }
        if (step.section === 'projects' && userProfile.background === 'non-tech') {
          timeMultiplier = 0.5; // Non-tech users have simpler project questions
        }
      }

      totalTime += sectionInfo.estimatedTime * timeMultiplier;
    });

    return Math.ceil(totalTime);
  }

  /**
   * Get section progress details
   */
  static getSectionProgress(
    section: ResumeSection,
    questionsInSection: number,
    answeredInSection: number
  ): {
    section: ResumeSection;
    name: string;
    progress: number;
    questionsTotal: number;
    questionsAnswered: number;
    isComplete: boolean;
  } {
    const sectionInfo = this.SECTION_INFO[section];
    const progress = questionsInSection > 0 ? (answeredInSection / questionsInSection) * 100 : 0;

    return {
      section,
      name: sectionInfo.name,
      progress: Math.round(progress),
      questionsTotal: questionsInSection,
      questionsAnswered: answeredInSection,
      isComplete: answeredInSection >= questionsInSection
    };
  }

  /**
   * Get next section information
   */
  static getNextSection(
    availableSections: ResumeSection[],
    currentSection: ResumeSection
  ): { section: ResumeSection; name: string; description: string } | null {
    const currentIndex = availableSections.indexOf(currentSection);
    const nextSection = availableSections[currentIndex + 1];

    if (!nextSection) return null;

    const sectionInfo = this.SECTION_INFO[nextSection];
    return {
      section: nextSection,
      name: sectionInfo.name,
      description: sectionInfo.description
    };
  }

  /**
   * Get previous section information
   */
  static getPreviousSection(
    availableSections: ResumeSection[],
    currentSection: ResumeSection
  ): { section: ResumeSection; name: string; description: string } | null {
    const currentIndex = availableSections.indexOf(currentSection);
    const previousSection = availableSections[currentIndex - 1];

    if (!previousSection) return null;

    const sectionInfo = this.SECTION_INFO[previousSection];
    return {
      section: previousSection,
      name: sectionInfo.name,
      description: sectionInfo.description
    };
  }

  /**
   * Format time remaining as human-readable string
   */
  static formatTimeRemaining(minutes: number): string {
    if (minutes <= 0) return 'Almost done!';
    if (minutes === 1) return '1 minute remaining';
    if (minutes < 60) return `${minutes} minutes remaining`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 1 && remainingMinutes === 0) return '1 hour remaining';
    if (hours === 1) return `1 hour ${remainingMinutes} minutes remaining`;
    if (remainingMinutes === 0) return `${hours} hours remaining`;
    
    return `${hours} hours ${remainingMinutes} minutes remaining`;
  }

  /**
   * Get progress milestone messages
   */
  static getMilestoneMessage(percentage: number): string | null {
    const milestones = {
      25: "Great start! You're 25% done with your resume.",
      50: "Halfway there! Your resume is taking shape.",
      75: "Almost finished! Just a few more questions.",
      90: "You're almost done! Just the final touches.",
      100: "Congratulations! Your resume is complete!"
    };

    // Find the milestone that was just reached
    const milestoneKeys = Object.keys(milestones).map(Number).sort((a, b) => a - b);
    
    for (const milestone of milestoneKeys) {
      if (percentage >= milestone) {
        return milestones[milestone as keyof typeof milestones];
      }
    }

    return null;
  }

  /**
   * Get section completion celebration message
   */
  static getSectionCompletionMessage(section: ResumeSection): string {
    const messages = {
      classification: "Perfect! I now understand your background.",
      basic_info: "Great! Your contact information is all set.",
      education: "Excellent! Your education section looks good.",
      experience: "Fantastic! Your work experience is well documented.",
      projects: "Amazing! Your projects showcase your skills nicely.",
      skills: "Perfect! Your skills section is comprehensive.",
      achievements: "Great! Your achievements add great value.",
      social_links: "Excellent! Your professional links are ready.",
      ai_upsell: "Thank you for your feedback!",
      complete: "Congratulations! Your resume is complete!"
    };

    return messages[section] || "Great job completing this section!";
  }

  /**
   * Calculate overall completion score
   */
  static calculateCompletionScore(
    requiredSectionsCompleted: number,
    totalRequiredSections: number,
    optionalSectionsCompleted: number,
    totalOptionalSections: number
  ): {
    score: number;
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
    message: string;
  } {
    const requiredScore = (requiredSectionsCompleted / totalRequiredSections) * 80;
    const optionalScore = totalOptionalSections > 0 
      ? (optionalSectionsCompleted / totalOptionalSections) * 20 
      : 20;
    
    const totalScore = Math.round(requiredScore + optionalScore);

    let grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
    let message: string;

    if (totalScore >= 95) {
      grade = 'A+';
      message = 'Outstanding! Your resume is comprehensive and complete.';
    } else if (totalScore >= 90) {
      grade = 'A';
      message = 'Excellent! Your resume covers all important areas.';
    } else if (totalScore >= 85) {
      grade = 'B+';
      message = 'Very good! Your resume is well-rounded.';
    } else if (totalScore >= 80) {
      grade = 'B';
      message = 'Good! Your resume covers the essentials.';
    } else if (totalScore >= 70) {
      grade = 'C+';
      message = 'Fair! Consider adding more optional sections.';
    } else if (totalScore >= 60) {
      grade = 'C';
      message = 'Basic! Your resume needs more information.';
    } else {
      grade = 'D';
      message = 'Incomplete! Please complete the required sections.';
    }

    return { score: totalScore, grade, message };
  }
}