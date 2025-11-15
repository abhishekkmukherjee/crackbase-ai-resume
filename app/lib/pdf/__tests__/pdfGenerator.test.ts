import { PDFGenerator, generateResumePDF } from '../pdfGenerator';
import { ResumeData } from '../../chatbot/types';

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297
      }
    },
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    text: jest.fn(),
    line: jest.fn(),
    setDrawColor: jest.fn(),
    setTextColor: jest.fn(),
    splitTextToSize: jest.fn().mockReturnValue(['line 1', 'line 2']),
    addPage: jest.fn(),
    getNumberOfPages: jest.fn().mockReturnValue(1),
    setPage: jest.fn(),
    output: jest.fn().mockReturnValue(new ArrayBuffer(8))
  }));
});

describe('PDFGenerator', () => {
  let mockResumeData: ResumeData;

  beforeEach(() => {
    mockResumeData = {
      basicInfo: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        location: 'New York, NY',
        headline: 'Software Developer',
        summary: 'Experienced software developer with 5 years of experience in web development.'
      },
      education: [
        {
          degree: 'Bachelor of Computer Science',
          institution: 'University of Technology',
          startYear: 2018,
          endYear: 2022,
          marks: '3.8 GPA',
          specialization: 'Software Engineering'
        }
      ],
      experience: [
        {
          companyName: 'Tech Corp',
          role: 'Senior Developer',
          startDate: '2022-01',
          endDate: '2024-01',
          achievements: [
            'Led development of microservices architecture',
            'Improved system performance by 40%'
          ],
          toolsUsed: ['React', 'Node.js', 'PostgreSQL']
        }
      ],
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React and Node.js',
          techStack: ['React', 'Node.js', 'MongoDB'],
          link: 'https://github.com/johndoe/ecommerce',
          role: 'Full Stack Developer'
        }
      ],
      skills: {
        primary: ['JavaScript', 'React', 'Node.js'],
        secondary: ['Python', 'Docker'],
        techStack: ['React', 'Node.js', 'PostgreSQL', 'MongoDB'],
        businessTools: []
      },
      achievements: {
        certifications: ['AWS Certified Developer'],
        achievements: ['Employee of the Month - March 2023'],
        extracurricular: ['Volunteer at local coding bootcamp']
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        website: 'https://johndoe.dev'
      },
      metadata: {
        background: 'tech',
        experience: 'experienced',
        completedSections: ['basic_info', 'education', 'experience', 'projects', 'skills'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };
  });

  describe('PDFGenerator class', () => {
    it('should create a PDF generator instance with default options', () => {
      const generator = new PDFGenerator();
      expect(generator).toBeInstanceOf(PDFGenerator);
    });

    it('should create a PDF generator with custom options', () => {
      const options = {
        template: 'ats-modern' as const,
        atsOptimized: true,
        includeATSScore: true,
        watermark: 'DRAFT'
      };
      const generator = new PDFGenerator(options);
      expect(generator).toBeInstanceOf(PDFGenerator);
    });

    it('should generate PDF successfully', async () => {
      const generator = new PDFGenerator();
      const result = await generator.generatePDF(mockResumeData);
      
      expect(result.success).toBe(true);
      expect(result.blob).toBeInstanceOf(Blob);
      expect(result.error).toBeUndefined();
    });

    it('should include ATS score when requested', async () => {
      const generator = new PDFGenerator({
        template: 'ats-standard',
        atsOptimized: true,
        includeATSScore: true
      });
      
      const result = await generator.generatePDF(mockResumeData);
      
      expect(result.success).toBe(true);
      expect(result.atsScore).toBeDefined();
      expect(result.atsScore?.overall).toBeGreaterThan(0);
      expect(result.atsScore?.factors).toBeDefined();
      expect(result.atsScore?.suggestions).toBeInstanceOf(Array);
    });

    it('should handle errors gracefully', async () => {
      const generator = new PDFGenerator();
      
      // Mock an error in PDF generation
      const originalGenerateATSStandardTemplate = (generator as any).generateATSStandardTemplate;
      (generator as any).generateATSStandardTemplate = jest.fn().mockRejectedValue(new Error('PDF generation failed'));
      
      const result = await generator.generatePDF(mockResumeData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('PDF generation failed');
      expect(result.blob).toBeUndefined();
      
      // Restore original method
      (generator as any).generateATSStandardTemplate = originalGenerateATSStandardTemplate;
    });
  });

  describe('generateResumePDF utility function', () => {
    it('should generate PDF with default options', async () => {
      const result = await generateResumePDF(mockResumeData);
      
      expect(result.success).toBe(true);
      expect(result.blob).toBeInstanceOf(Blob);
    });

    it('should generate PDF with custom options', async () => {
      const options = {
        template: 'ats-minimal' as const,
        includeATSScore: true
      };
      
      const result = await generateResumePDF(mockResumeData, options);
      
      expect(result.success).toBe(true);
      expect(result.atsScore).toBeDefined();
    });
  });

  describe('ATS Score calculation', () => {
    it('should calculate ATS score correctly for complete resume', async () => {
      const generator = new PDFGenerator({ includeATSScore: true });
      const result = await generator.generatePDF(mockResumeData);
      
      expect(result.atsScore?.overall).toBeGreaterThan(70);
      expect(result.atsScore?.factors.formatting).toBeGreaterThan(0);
      expect(result.atsScore?.factors.structure).toBeGreaterThan(0);
      expect(result.atsScore?.factors.readability).toBeGreaterThan(0);
    });

    it('should provide suggestions for incomplete resume', async () => {
      const incompleteResumeData = {
        ...mockResumeData,
        experience: [],
        projects: [],
        skills: { primary: [], secondary: [], techStack: [], businessTools: [] }
      };
      
      const generator = new PDFGenerator({ includeATSScore: true });
      const result = await generator.generatePDF(incompleteResumeData);
      
      expect(result.atsScore?.suggestions.length).toBeGreaterThan(0);
      expect(result.atsScore?.overall).toBeLessThan(70);
    });
  });

  describe('Template handling', () => {
    it('should handle different template types', async () => {
      const templates = ['ats-standard', 'ats-modern', 'ats-minimal'] as const;
      
      for (const template of templates) {
        const generator = new PDFGenerator({ template });
        const result = await generator.generatePDF(mockResumeData);
        
        expect(result.success).toBe(true);
        expect(result.blob).toBeInstanceOf(Blob);
      }
    });
  });

  describe('Content sections', () => {
    it('should handle resume with only basic info', async () => {
      const minimalResumeData = {
        ...mockResumeData,
        education: [],
        experience: [],
        projects: [],
        achievements: { certifications: [], achievements: [], extracurricular: [] }
      };
      
      const generator = new PDFGenerator();
      const result = await generator.generatePDF(minimalResumeData);
      
      expect(result.success).toBe(true);
    });

    it('should handle fresher profile with projects', async () => {
      const fresherResumeData = {
        ...mockResumeData,
        experience: [],
        metadata: {
          ...mockResumeData.metadata,
          experience: 'fresher' as const
        }
      };
      
      const generator = new PDFGenerator();
      const result = await generator.generatePDF(fresherResumeData);
      
      expect(result.success).toBe(true);
    });

    it('should handle non-tech profile', async () => {
      const nonTechResumeData = {
        ...mockResumeData,
        skills: {
          primary: ['Project Management', 'Communication'],
          secondary: ['Leadership'],
          techStack: [],
          businessTools: ['Microsoft Office', 'Salesforce']
        },
        metadata: {
          ...mockResumeData.metadata,
          background: 'non-tech' as const
        }
      };
      
      const generator = new PDFGenerator();
      const result = await generator.generatePDF(nonTechResumeData);
      
      expect(result.success).toBe(true);
    });
  });
});