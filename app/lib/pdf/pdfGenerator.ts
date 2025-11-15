import jsPDF from 'jspdf';
import { ResumeData } from '../chatbot/types';

// ============================================================================
// PDF GENERATOR TYPES
// ============================================================================

export interface PDFGeneratorOptions {
  template: 'ats-standard' | 'ats-modern' | 'ats-minimal';
  atsOptimized: boolean;
  includeATSScore: boolean;
  watermark?: string;
}

export interface PDFResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  atsScore?: ATSScore;
}

export interface ATSScore {
  overall: number;
  factors: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
  };
  suggestions: string[];
}

// ============================================================================
// PDF GENERATOR CLASS
// ============================================================================

export class PDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageWidth: number;
  private pageHeight: number;
  private margins = {
    left: 20,
    right: 20,
    top: 20,
    bottom: 20
  };

  constructor(private options: PDFGeneratorOptions = {
    template: 'ats-standard',
    atsOptimized: true,
    includeATSScore: false
  }) {
    // Initialize jsPDF with ATS-friendly settings
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  /**
   * Generate PDF from resume data
   */
  public async generatePDF(resumeData: ResumeData): Promise<PDFResult> {
    try {
      // Reset position
      this.currentY = this.margins.top;

      // Generate PDF content based on template
      switch (this.options.template) {
        case 'ats-standard':
          await this.generateATSStandardTemplate(resumeData);
          break;
        case 'ats-modern':
          await this.generateATSModernTemplate(resumeData);
          break;
        case 'ats-minimal':
          await this.generateATSMinimalTemplate(resumeData);
          break;
        default:
          await this.generateATSStandardTemplate(resumeData);
      }

      // Add watermark if specified
      if (this.options.watermark) {
        this.addWatermark(this.options.watermark);
      }

      // Generate blob
      const blob = new Blob([this.doc.output('blob')], { type: 'application/pdf' });

      // Calculate ATS score if requested
      let atsScore: ATSScore | undefined;
      if (this.options.includeATSScore) {
        atsScore = this.calculateATSScore(resumeData);
      }

      return {
        success: true,
        blob,
        atsScore
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate ATS Standard Template
   */
  private async generateATSStandardTemplate(resumeData: ResumeData): Promise<void> {
    // Header with contact information
    this.addHeader(resumeData.basicInfo);
    
    // Professional summary (if available)
    if (resumeData.basicInfo.summary) {
      this.addSection('PROFESSIONAL SUMMARY', resumeData.basicInfo.summary);
    }

    // Experience section (for experienced users)
    if (resumeData.metadata.experience === 'experienced' && resumeData.experience.length > 0) {
      this.addExperienceSection(resumeData.experience);
    }

    // Projects section (for tech/fresher users)
    if (resumeData.projects.length > 0) {
      this.addProjectsSection(resumeData.projects);
    }

    // Education section
    if (resumeData.education.length > 0) {
      this.addEducationSection(resumeData.education);
    }

    // Skills section
    this.addSkillsSection(resumeData.skills);

    // Achievements section (if available)
    if (this.hasAchievements(resumeData.achievements)) {
      this.addAchievementsSection(resumeData.achievements);
    }
  }

  /**
   * Generate ATS Modern Template (similar structure, different styling)
   */
  private async generateATSModernTemplate(resumeData: ResumeData): Promise<void> {
    // Use same structure as standard but with modern styling
    await this.generateATSStandardTemplate(resumeData);
  }

  /**
   * Generate ATS Minimal Template (condensed version)
   */
  private async generateATSMinimalTemplate(resumeData: ResumeData): Promise<void> {
    // Use same structure as standard but more condensed
    await this.generateATSStandardTemplate(resumeData);
  }

  /**
   * Add header with contact information
   */
  private addHeader(basicInfo: ResumeData['basicInfo']): void {
    // Name (larger font)
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(basicInfo.fullName, this.margins.left, this.currentY);
    this.currentY += 8;

    // Headline (if available)
    if (basicInfo.headline) {
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(basicInfo.headline, this.margins.left, this.currentY);
      this.currentY += 6;
    }

    // Contact information
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const contactInfo = [
      basicInfo.email,
      basicInfo.phone,
      basicInfo.location
    ].filter(Boolean).join(' | ');
    
    this.doc.text(contactInfo, this.margins.left, this.currentY);
    this.currentY += 10;

    // Add separator line
    this.doc.setDrawColor(0, 0, 0);
    (this.doc as any).line(this.margins.left, this.currentY, this.pageWidth - this.margins.right, this.currentY);
    this.currentY += 8;
  }

  /**
   * Add a section with title and content
   */
  private addSection(title: string, content: string): void {
    this.checkPageBreak(15);
    
    // Section title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margins.left, this.currentY);
    this.currentY += 6;

    // Section content
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    
    const lines = (this.doc as any).splitTextToSize(content, this.pageWidth - this.margins.left - this.margins.right);
    this.doc.text(lines, this.margins.left, this.currentY);
    this.currentY += lines.length * 4 + 6;
  }

  /**
   * Add experience section
   */
  private addExperienceSection(experiences: ResumeData['experience']): void {
    this.checkPageBreak(20);
    
    // Section title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PROFESSIONAL EXPERIENCE', this.margins.left, this.currentY);
    this.currentY += 8;

    experiences.forEach((exp, index) => {
      this.checkPageBreak(15);
      
      // Company and role
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${exp.role} - ${exp.companyName}`, this.margins.left, this.currentY);
      this.currentY += 5;

      // Dates
      if (exp.startDate || exp.endDate) {
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'italic');
        const dateRange = `${exp.startDate || ''} - ${exp.endDate || 'Present'}`;
        this.doc.text(dateRange, this.margins.left, this.currentY);
        this.currentY += 5;
      }

      // Achievements
      if (exp.achievements && exp.achievements.length > 0) {
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        
        exp.achievements.forEach(achievement => {
          this.checkPageBreak(5);
          const lines = (this.doc as any).splitTextToSize(`• ${achievement}`, this.pageWidth - this.margins.left - this.margins.right - 5);
          this.doc.text(lines, this.margins.left + 5, this.currentY);
          this.currentY += lines.length * 4;
        });
      }

      // Tools used
      if (exp.toolsUsed && exp.toolsUsed.length > 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.text(`Tools: ${exp.toolsUsed.join(', ')}`, this.margins.left, this.currentY);
        this.currentY += 4;
      }

      this.currentY += 4; // Space between experiences
    });
  }

  /**
   * Add projects section
   */
  private addProjectsSection(projects: ResumeData['projects']): void {
    this.checkPageBreak(20);
    
    // Section title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PROJECTS', this.margins.left, this.currentY);
    this.currentY += 8;

    projects.forEach((project, index) => {
      this.checkPageBreak(15);
      
      // Project title
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(project.title, this.margins.left, this.currentY);
      this.currentY += 5;

      // Project description
      if (project.description) {
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        const lines = (this.doc as any).splitTextToSize(project.description, this.pageWidth - this.margins.left - this.margins.right);
        this.doc.text(lines, this.margins.left, this.currentY);
        this.currentY += lines.length * 4;
      }

      // Tech stack
      if (project.techStack && project.techStack.length > 0) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'italic');
        this.doc.text(`Tech Stack: ${project.techStack.join(', ')}`, this.margins.left, this.currentY);
        this.currentY += 4;
      }

      // Project link
      if (project.link) {
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(`Link: ${project.link}`, this.margins.left, this.currentY);
        this.currentY += 4;
      }

      this.currentY += 4; // Space between projects
    });
  }

  /**
   * Add education section
   */
  private addEducationSection(education: ResumeData['education']): void {
    this.checkPageBreak(20);
    
    // Section title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EDUCATION', this.margins.left, this.currentY);
    this.currentY += 8;

    education.forEach((edu, index) => {
      this.checkPageBreak(10);
      
      // Degree and institution
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${edu.degree} - ${edu.institution}`, this.margins.left, this.currentY);
      this.currentY += 5;

      // Years and marks
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      
      const details = [];
      if (edu.startYear && edu.endYear) {
        details.push(`${edu.startYear} - ${edu.endYear}`);
      }
      if (edu.marks) {
        details.push(`Grade: ${edu.marks}`);
      }
      if (edu.specialization) {
        details.push(`Specialization: ${edu.specialization}`);
      }
      
      if (details.length > 0) {
        this.doc.text(details.join(' | '), this.margins.left, this.currentY);
        this.currentY += 5;
      }

      this.currentY += 3; // Space between education entries
    });
  }

  /**
   * Add skills section
   */
  private addSkillsSection(skills: ResumeData['skills']): void {
    this.checkPageBreak(15);
    
    // Section title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('SKILLS', this.margins.left, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    // Primary skills
    if (skills.primary && skills.primary.length > 0) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Core Skills: ', this.margins.left, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      const primaryText = skills.primary.join(', ');
      const lines = (this.doc as any).splitTextToSize(primaryText, this.pageWidth - this.margins.left - this.margins.right - 25);
      this.doc.text(lines, this.margins.left + 25, this.currentY);
      this.currentY += lines.length * 4 + 3;
    }

    // Secondary skills
    if (skills.secondary && skills.secondary.length > 0) {
      this.checkPageBreak(5);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Additional Skills: ', this.margins.left, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      const secondaryText = skills.secondary.join(', ');
      const lines = (this.doc as any).splitTextToSize(secondaryText, this.pageWidth - this.margins.left - this.margins.right - 35);
      this.doc.text(lines, this.margins.left + 35, this.currentY);
      this.currentY += lines.length * 4 + 3;
    }

    // Tech stack (for tech users)
    if (skills.techStack && skills.techStack.length > 0) {
      this.checkPageBreak(5);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Technologies: ', this.margins.left, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      const techText = skills.techStack.join(', ');
      const lines = (this.doc as any).splitTextToSize(techText, this.pageWidth - this.margins.left - this.margins.right - 30);
      this.doc.text(lines, this.margins.left + 30, this.currentY);
      this.currentY += lines.length * 4 + 3;
    }

    // Business tools (for non-tech users)
    if (skills.businessTools && skills.businessTools.length > 0) {
      this.checkPageBreak(5);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Tools: ', this.margins.left, this.currentY);
      this.doc.setFont('helvetica', 'normal');
      const toolsText = skills.businessTools.join(', ');
      const lines = (this.doc as any).splitTextToSize(toolsText, this.pageWidth - this.margins.left - this.margins.right - 15);
      this.doc.text(lines, this.margins.left + 15, this.currentY);
      this.currentY += lines.length * 4 + 3;
    }

    this.currentY += 5;
  }

  /**
   * Add achievements section
   */
  private addAchievementsSection(achievements: ResumeData['achievements']): void {
    this.checkPageBreak(15);
    
    // Section title
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ACHIEVEMENTS & CERTIFICATIONS', this.margins.left, this.currentY);
    this.currentY += 8;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    // Certifications
    if (achievements.certifications && achievements.certifications.length > 0) {
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Certifications:', this.margins.left, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      achievements.certifications.forEach(cert => {
        this.checkPageBreak(5);
        this.doc.text(`• ${cert}`, this.margins.left + 5, this.currentY);
        this.currentY += 4;
      });
      this.currentY += 3;
    }

    // Achievements
    if (achievements.achievements && achievements.achievements.length > 0) {
      this.checkPageBreak(5);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Achievements:', this.margins.left, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      achievements.achievements.forEach(achievement => {
        this.checkPageBreak(5);
        this.doc.text(`• ${achievement}`, this.margins.left + 5, this.currentY);
        this.currentY += 4;
      });
      this.currentY += 3;
    }

    // Extracurricular activities
    if (achievements.extracurricular && achievements.extracurricular.length > 0) {
      this.checkPageBreak(5);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Extracurricular Activities:', this.margins.left, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      achievements.extracurricular.forEach(activity => {
        this.checkPageBreak(5);
        this.doc.text(`• ${activity}`, this.margins.left + 5, this.currentY);
        this.currentY += 4;
      });
    }
  }

  /**
   * Check if we need a page break
   */
  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margins.bottom) {
      this.doc.addPage();
      this.currentY = this.margins.top;
    }
  }

  /**
   * Add watermark to the document
   */
  private addWatermark(text: string): void {
    const pageCount = (this.doc as any).getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(50);
      this.doc.setTextColor(200, 200, 200);
      this.doc.text(text, this.pageWidth / 2, this.pageHeight / 2, {
        angle: 45,
        align: 'center'
      } as any);
    }
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  /**
   * Check if achievements section has content
   */
  private hasAchievements(achievements: ResumeData['achievements']): boolean {
    return !!(
      (achievements.certifications && achievements.certifications.length > 0) ||
      (achievements.achievements && achievements.achievements.length > 0) ||
      (achievements.extracurricular && achievements.extracurricular.length > 0)
    );
  }

  /**
   * Calculate ATS score for the resume
   */
  private calculateATSScore(resumeData: ResumeData): ATSScore {
    let formattingScore = 85; // Base score for clean PDF format
    let keywordsScore = 0;
    let structureScore = 0;
    let readabilityScore = 80; // Base score for clean fonts and spacing
    
    const suggestions: string[] = [];

    // Calculate keywords score
    const totalSections = [
      resumeData.basicInfo.summary,
      resumeData.experience.length > 0 ? 'experience' : null,
      resumeData.projects.length > 0 ? 'projects' : null,
      resumeData.skills.primary.length > 0 ? 'skills' : null
    ].filter(Boolean).length;

    keywordsScore = Math.min(100, totalSections * 20);
    
    if (keywordsScore < 60) {
      suggestions.push('Add more relevant keywords in your experience and skills sections');
    }

    // Calculate structure score
    let structurePoints = 0;
    
    // Check for essential sections
    if (resumeData.basicInfo.fullName && resumeData.basicInfo.email && resumeData.basicInfo.phone) {
      structurePoints += 20;
    } else {
      suggestions.push('Ensure all contact information is complete');
    }
    
    if (resumeData.education.length > 0) {
      structurePoints += 20;
    }
    
    if (resumeData.experience.length > 0 || resumeData.projects.length > 0) {
      structurePoints += 30;
    } else {
      suggestions.push('Add work experience or projects to strengthen your resume');
    }
    
    if (resumeData.skills.primary.length > 0) {
      structurePoints += 20;
    } else {
      suggestions.push('Add relevant skills to improve ATS matching');
    }
    
    if (resumeData.basicInfo.summary) {
      structurePoints += 10;
    }
    
    structureScore = structurePoints;

    // Calculate overall score
    const overall = Math.round((formattingScore + keywordsScore + structureScore + readabilityScore) / 4);

    // Add general suggestions based on overall score
    if (overall < 70) {
      suggestions.push('Consider adding more detailed descriptions to your experience and projects');
    }
    if (overall >= 85) {
      suggestions.push('Great job! Your resume is well-optimized for ATS systems');
    }

    return {
      overall,
      factors: {
        formatting: formattingScore,
        keywords: keywordsScore,
        structure: structureScore,
        readability: readabilityScore
      },
      suggestions
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate PDF with default options
 */
export async function generateResumePDF(
  resumeData: ResumeData,
  options?: Partial<PDFGeneratorOptions>
): Promise<PDFResult> {
  const generator = new PDFGenerator({
    template: 'ats-standard',
    atsOptimized: true,
    includeATSScore: false,
    ...options
  });
  
  return generator.generatePDF(resumeData);
}

/**
 * Download PDF blob as file
 */
export function downloadPDF(blob: Blob, filename: string = 'resume.pdf'): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}