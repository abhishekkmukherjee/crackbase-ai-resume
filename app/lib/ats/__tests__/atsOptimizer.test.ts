import { ATSOptimizer } from '../atsOptimizer';
import { ResumeData } from '../../chatbot/types';

describe('ATSOptimizer', () => {
  const mockResumeData: ResumeData = {
    basicInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-123-4567',
      location: 'New York, NY',
      headline: 'Software Engineer',
      summary: 'Experienced software engineer with 5+ years of experience in developing web applications using modern technologies.'
    },
    education: [{
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      startYear: 2015,
      endYear: 2019,
      marks: '3.8 GPA',
      specialization: 'Software Engineering'
    }],
    experience: [{
      companyName: 'Tech Corp',
      role: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: '2023-12',
      achievements: [
        'Developed and maintained 5+ web applications using React and Node.js',
        'Improved application performance by 40% through code optimization',
        'Led a team of 3 developers on critical projects'
      ],
      toolsUsed: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB']
    }],
    projects: [{
      title: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform with React frontend and Node.js backend',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
      link: 'https://github.com/johndoe/ecommerce',
      role: 'Full Stack Developer'
    }],
    skills: {
      primary: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
      secondary: ['MongoDB', 'PostgreSQL', 'Docker'],
      techStack: ['React', 'Vue.js', 'Angular', 'Express', 'FastAPI'],
      businessTools: []
    },
    achievements: {
      certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
      achievements: ['Employee of the Month - March 2022', 'Led successful product launch'],
      extracurricular: ['Tech Meetup Organizer', 'Open Source Contributor']
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      website: 'https://johndoe.dev'
    },
    metadata: {
      background: 'tech',
      experience: 'experienced',
      completedSections: ['basic_info', 'education', 'experience', 'projects', 'skills', 'achievements', 'social_links'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  describe('calculateATSScore', () => {
    it('should calculate ATS score for complete resume', () => {
      const result = ATSOptimizer.calculateATSScore(mockResumeData);
      
      expect(result.overall).toBeGreaterThan(0);
      expect(result.overall).toBeLessThanOrEqual(100);
      expect(result.factors.formatting).toBeGreaterThan(0);
      expect(result.factors.keywords).toBeGreaterThan(0);
      expect(result.factors.structure).toBeGreaterThan(0);
      expect(result.factors.readability).toBeGreaterThan(0);
    });

    it('should provide keyword analysis', () => {
      const result = ATSOptimizer.calculateATSScore(mockResumeData);
      
      expect(result.keywordAnalysis).toBeDefined();
      expect(result.keywordAnalysis.totalKeywords).toBeGreaterThan(0);
      expect(Array.isArray(result.keywordAnalysis.actionVerbs)).toBe(true);
      expect(Array.isArray(result.keywordAnalysis.technicalSkills)).toBe(true);
      expect(Array.isArray(result.keywordAnalysis.missingKeywords)).toBe(true);
      expect(typeof result.keywordAnalysis.keywordDensity).toBe('number');
    });

    it('should provide section optimization analysis', () => {
      const result = ATSOptimizer.calculateATSScore(mockResumeData);
      
      expect(result.sectionOptimization).toBeDefined();
      expect(result.sectionOptimization.sectionOrder).toBeDefined();
      expect(result.sectionOptimization.contentQuality).toBeDefined();
      expect(result.sectionOptimization.formatting).toBeDefined();
    });

    it('should generate suggestions', () => {
      const result = ATSOptimizer.calculateATSScore(mockResumeData);
      
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty resume data', () => {
      const emptyResumeData: ResumeData = {
        basicInfo: {
          fullName: '',
          email: '',
          phone: ''
        },
        education: [],
        experience: [],
        projects: [],
        skills: {
          primary: []
        },
        achievements: {},
        socialLinks: {},
        metadata: {
          background: 'tech',
          experience: 'fresher',
          completedSections: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const result = ATSOptimizer.calculateATSScore(emptyResumeData);
      
      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
    });

    it('should handle resume with minimal data', () => {
      const minimalResumeData: ResumeData = {
        basicInfo: {
          fullName: 'Jane Smith',
          email: 'jane@email.com',
          phone: '555-1234'
        },
        education: [],
        experience: [],
        projects: [],
        skills: {
          primary: ['JavaScript']
        },
        achievements: {},
        socialLinks: {},
        metadata: {
          background: 'tech',
          experience: 'fresher',
          completedSections: ['basic_info'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const result = ATSOptimizer.calculateATSScore(minimalResumeData);
      
      expect(result.overall).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });
});