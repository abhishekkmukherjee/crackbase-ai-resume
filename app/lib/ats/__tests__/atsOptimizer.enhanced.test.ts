import { ATSOptimizer } from '../atsOptimizer';
import { ResumeData } from '../../chatbot/types';

describe('ATSOptimizer Enhanced Features', () => {
  const techResumeData: ResumeData = {
    basicInfo: {
      fullName: 'Alex Developer',
      email: 'alex@email.com',
      phone: '+1-555-123-4567',
      location: 'San Francisco, CA',
      headline: 'Senior Software Engineer',
      summary: 'Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and cloud technologies. Led teams and improved performance by 40%.'
    },
    education: [{
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Tech University',
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
        'Improved application performance by 40% through optimization',
        'Led a team of 3 developers and managed project delivery',
        'Implemented automated testing that reduced bugs by 60%'
      ],
      toolsUsed: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'AWS', 'Docker']
    }],
    projects: [{
      title: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform with microservices architecture',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Docker', 'Kubernetes'],
      link: 'https://github.com/alex/ecommerce',
      role: 'Full Stack Developer'
    }],
    skills: {
      primary: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
      secondary: ['MongoDB', 'PostgreSQL', 'Docker'],
      techStack: ['React', 'Vue.js', 'Angular', 'Express', 'FastAPI', 'AWS', 'Kubernetes'],
      businessTools: []
    },
    achievements: {
      certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
      achievements: ['Employee of the Month - March 2022', 'Led successful product launch'],
      extracurricular: ['Tech Meetup Organizer', 'Open Source Contributor']
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexdev',
      github: 'https://github.com/alexdev',
      website: 'https://alexdev.com'
    },
    metadata: {
      background: 'tech',
      experience: 'experienced',
      completedSections: ['basic_info', 'education', 'experience', 'projects', 'skills', 'achievements', 'social_links'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  describe('Enhanced Keyword Analysis', () => {
    it('should identify industry keywords', () => {
      const result = ATSOptimizer.calculateATSScore(techResumeData);
      
      expect(result.keywordAnalysis.industryKeywords).toBeDefined();
      expect(Array.isArray(result.keywordAnalysis.industryKeywords)).toBe(true);
      expect(result.keywordAnalysis.industryKeywords.length).toBeGreaterThan(0);
    });

    it('should determine keyword strength', () => {
      const result = ATSOptimizer.calculateATSScore(techResumeData);
      
      expect(result.keywordAnalysis.keywordStrength).toBeDefined();
      expect(['weak', 'moderate', 'strong']).toContain(result.keywordAnalysis.keywordStrength);
    });

    it('should find technical keywords from expanded list', () => {
      const result = ATSOptimizer.calculateATSScore(techResumeData);
      
      expect(result.keywordAnalysis.technicalSkills).toContain('react');
      expect(result.keywordAnalysis.technicalSkills).toContain('node.js');
      expect(result.keywordAnalysis.technicalSkills).toContain('javascript');
      expect(result.keywordAnalysis.technicalSkills).toContain('docker');
      expect(result.keywordAnalysis.technicalSkills).toContain('kubernetes');
    });

    it('should find action verbs from expanded list', () => {
      const result = ATSOptimizer.calculateATSScore(techResumeData);
      
      expect(result.keywordAnalysis.actionVerbs.length).toBeGreaterThan(3);
      expect(result.keywordAnalysis.actionVerbs).toContain('developed');
      expect(result.keywordAnalysis.actionVerbs).toContain('improved');
      expect(result.keywordAnalysis.actionVerbs).toContain('led');
      expect(result.keywordAnalysis.actionVerbs).toContain('implemented');
    });
  });

  describe('Business Resume Analysis', () => {
    const businessResumeData: ResumeData = {
      basicInfo: {
        fullName: 'Sarah Manager',
        email: 'sarah@email.com',
        phone: '+1-555-987-6543',
        location: 'New York, NY',
        headline: 'Project Manager',
        summary: 'Experienced project manager with 4+ years managing cross-functional teams and delivering projects on time. Skilled in stakeholder management and process improvement.'
      },
      education: [{
        degree: 'MBA in Business Administration',
        institution: 'Business School',
        startYear: 2016,
        endYear: 2018,
        marks: '3.7 GPA',
        specialization: 'Project Management'
      }],
      experience: [{
        companyName: 'Business Corp',
        role: 'Senior Project Manager',
        startDate: '2019-01',
        endDate: 'Present',
        achievements: [
          'Managed 10+ cross-functional projects with budgets exceeding $2M',
          'Improved project delivery time by 25% through process optimization',
          'Led stakeholder management for 5+ major client accounts',
          'Coordinated teams of 15+ members across multiple departments'
        ],
        toolsUsed: ['Jira', 'Confluence', 'Microsoft Project', 'Slack', 'Excel']
      }],
      projects: [],
      skills: {
        primary: ['Project Management', 'Team Leadership', 'Stakeholder Management', 'Process Improvement'],
        secondary: ['Budget Management', 'Risk Management', 'Quality Assurance'],
        techStack: [],
        businessTools: ['Jira', 'Confluence', 'Microsoft Project', 'Excel', 'PowerPoint']
      },
      achievements: {
        certifications: ['PMP Certified', 'Agile Certified Practitioner'],
        achievements: ['Project Manager of the Year 2022', 'Successfully delivered 95% of projects on time'],
        extracurricular: ['PMI Chapter Member', 'Business Networking Group Leader']
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahmanager'
      },
      metadata: {
        background: 'non-tech',
        experience: 'experienced',
        completedSections: ['basic_info', 'education', 'experience', 'skills', 'achievements', 'social_links'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    it('should analyze business keywords for non-tech roles', () => {
      const result = ATSOptimizer.calculateATSScore(businessResumeData);
      
      expect(result.keywordAnalysis.totalKeywords).toBeGreaterThan(0);
      expect(result.keywordAnalysis.actionVerbs).toContain('managed');
      expect(result.keywordAnalysis.actionVerbs).toContain('improved');
      expect(result.keywordAnalysis.actionVerbs).toContain('led');
      expect(result.keywordAnalysis.actionVerbs).toContain('coordinated');
    });

    it('should provide appropriate suggestions for business roles', () => {
      const result = ATSOptimizer.calculateATSScore(businessResumeData);
      
      expect(result.suggestions).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('Keyword Strength Assessment', () => {
    it('should classify strong keyword usage', () => {
      const result = ATSOptimizer.calculateATSScore(techResumeData);
      
      // This resume should have strong keyword usage
      expect(['moderate', 'strong']).toContain(result.keywordAnalysis.keywordStrength);
    });

    it('should handle minimal keyword usage', () => {
      const minimalResumeData: ResumeData = {
        basicInfo: {
          fullName: 'John Minimal',
          email: 'john@email.com',
          phone: '555-1234'
        },
        education: [],
        experience: [],
        projects: [],
        skills: {
          primary: ['Basic Skills']
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
      expect(result.keywordAnalysis.keywordStrength).toBe('weak');
    });
  });

  describe('Comprehensive Scoring', () => {
    it('should provide detailed factor analysis', () => {
      const result = ATSOptimizer.calculateATSScore(techResumeData);
      
      expect(result.factors.formatting).toBeGreaterThan(70);
      expect(result.factors.keywords).toBeGreaterThan(60);
      expect(result.factors.structure).toBeGreaterThan(70);
      expect(result.factors.readability).toBeGreaterThan(60);
    });

    it('should generate contextual suggestions', () => {
      const result = ATSOptimizer.calculateATSScore(techResumeData);
      
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeLessThanOrEqual(6);
    });
  });
});