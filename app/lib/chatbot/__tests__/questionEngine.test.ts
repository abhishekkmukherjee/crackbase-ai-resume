// Tests for Question Engine
import { QuestionEngine, QUESTIONS, SECTION_LOGIC } from '../questionEngine';
import { UserProfile } from '../types';

describe('QuestionEngine', () => {
  let engine: QuestionEngine;

  beforeEach(() => {
    engine = new QuestionEngine();
  });

  describe('initialization', () => {
    it('should initialize with first question', () => {
      const firstQuestion = engine.getCurrentQuestion();
      expect(firstQuestion).toBeTruthy();
      expect(firstQuestion?.section).toBe('classification');
      expect(firstQuestion?.field).toBe('background');
    });

    it('should have correct initial user profile', () => {
      const profile = engine.getUserProfile();
      expect(profile.background).toBe('tech');
      expect(profile.experience).toBe('fresher');
    });
  });

  describe('question flow', () => {
    it('should process classification questions correctly', () => {
      // Answer background question
      const result1 = engine.processAnswer('Tech');
      expect(result1.success).toBe(true);
      expect(result1.nextQuestion?.field).toBe('experience');

      // Answer experience question
      const result2 = engine.processAnswer('Experienced');
      expect(result2.success).toBe(true);
      expect(result2.nextQuestion?.section).toBe('basic_info');

      // Check user profile was updated
      const profile = engine.getUserProfile();
      expect(profile.background).toBe('tech');
      expect(profile.experience).toBe('experienced');
    });

    it('should skip questions based on conditions', () => {
      // Set up as non-tech fresher
      engine.processAnswer('Non-Tech');
      engine.processAnswer('Fresher');

      // Get available questions
      const availableQuestions = engine.getAvailableQuestions();
      
      // Should not include experience questions (fresher)
      const experienceQuestions = availableQuestions.filter(q => q.section === 'experience');
      expect(experienceQuestions).toHaveLength(0);

      // Should not include tech-specific questions (non-tech)
      const techStackQuestions = availableQuestions.filter(q => q.field === 'techStack');
      expect(techStackQuestions).toHaveLength(0);
    });
  });

  describe('validation', () => {
    it('should validate required fields', () => {
      // Move to name question
      engine.processAnswer('Tech');
      engine.processAnswer('Fresher');
      
      const nameQuestion = engine.getCurrentQuestion();
      expect(nameQuestion?.field).toBe('fullName');

      // Test empty answer
      const validation = engine.validateAnswer(nameQuestion!, '');
      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('required');
    });

    it('should validate email format', () => {
      // Navigate to email question
      engine.processAnswer('Tech');
      engine.processAnswer('Fresher');
      engine.processAnswer('John Smith');
      
      const emailQuestion = engine.getCurrentQuestion();
      expect(emailQuestion?.field).toBe('email');

      // Test invalid email
      const validation1 = engine.validateAnswer(emailQuestion!, 'invalid-email');
      expect(validation1.isValid).toBe(false);

      // Test valid email
      const validation2 = engine.validateAnswer(emailQuestion!, 'john@example.com');
      expect(validation2.isValid).toBe(true);
    });
  });

  describe('progress tracking', () => {
    it('should track progress correctly', () => {
      const initialProgress = engine.getProgress();
      expect(initialProgress.current).toBe(0);
      expect(initialProgress.section).toBe('classification');

      // Answer first question
      engine.processAnswer('Tech');
      const progress1 = engine.getProgress();
      expect(progress1.current).toBe(1);

      // Answer second question
      engine.processAnswer('Experienced');
      const progress2 = engine.getProgress();
      expect(progress2.current).toBe(2);
      expect(progress2.section).toBe('basic_info');
    });

    it('should calculate percentage correctly', () => {
      // Answer first few questions with valid answers
      engine.processAnswer('Tech');
      engine.processAnswer('Experienced');
      engine.processAnswer('John Smith');
      engine.processAnswer('john@example.com');
      engine.processAnswer('+1234567890');

      const progress = engine.getProgress();
      expect(progress.percentage).toBeGreaterThan(10);
      expect(progress.percentage).toBeLessThan(100);
      expect(progress.current).toBe(5);
    });
  });

  describe('navigation', () => {
    it('should allow going back', () => {
      // Answer a few questions
      engine.processAnswer('Tech');
      engine.processAnswer('Experienced');
      engine.processAnswer('John Smith');

      const currentProgress = engine.getProgress().current;
      
      // Go back
      const previousQuestion = engine.goBack();
      expect(previousQuestion).toBeTruthy();
      expect(engine.getProgress().current).toBe(currentProgress - 1);
    });

    it('should not go back beyond first question', () => {
      const previousQuestion = engine.goBack();
      expect(previousQuestion).toBeNull();
    });

    it('should allow skipping optional questions', () => {
      // Navigate to an optional question (location)
      engine.processAnswer('Tech');
      engine.processAnswer('Fresher');
      engine.processAnswer('John Smith');
      engine.processAnswer('john@example.com');
      engine.processAnswer('+1234567890');

      const locationQuestion = engine.getCurrentQuestion();
      expect(locationQuestion?.field).toBe('location');
      expect(locationQuestion?.required).toBe(false);

      // Skip the question
      const result = engine.skipQuestion();
      expect(result.success).toBe(true);
      expect(result.nextQuestion?.field).not.toBe('location');
    });
  });

  describe('section logic', () => {
    it('should show correct sections for tech experienced user', () => {
      const profile: UserProfile = {
        background: 'tech',
        experience: 'experienced',
        preferences: { skipOptional: false, fastMode: false }
      };

      const sections = Object.entries(SECTION_LOGIC)
        .filter(([_, logic]) => logic.show(profile))
        .map(([section]) => section);

      expect(sections).toContain('experience');
      expect(sections).toContain('projects');
      expect(sections).toContain('skills');
    });

    it('should show correct sections for non-tech fresher', () => {
      const profile: UserProfile = {
        background: 'non-tech',
        experience: 'fresher',
        preferences: { skipOptional: false, fastMode: false }
      };

      const sections = Object.entries(SECTION_LOGIC)
        .filter(([_, logic]) => logic.show(profile))
        .map(([section]) => section);

      expect(sections).not.toContain('experience');
      expect(sections).toContain('projects');
      expect(sections).toContain('skills');
    });
  });

  describe('completion', () => {
    it('should detect when questionnaire is complete', () => {
      expect(engine.isComplete()).toBe(false);

      // Answer questions with proper validation
      const answers = [
        'Tech', 'Experienced', 'John Smith', 'john@example.com', '+1234567890',
        'New York', 'Software Engineer', 'Experienced developer',
        'Bachelor of Science', 'MIT', '2020', '2024', '3.8 GPA', 'Computer Science',
        'Google', 'Senior Engineer', 'Jan 2022', 'Present', 'Led team projects', 'React, Node.js',
        'JavaScript, Python', 'Leadership', 'React, Node.js', 
        'AWS Certified', 'Employee of the Month', 'Volunteer work',
        'https://linkedin.com/in/john', 'https://github.com/john', 'https://john.dev',
        'Yes, I\'m interested'
      ];

      let answerIndex = 0;
      while (!engine.isComplete() && answerIndex < answers.length) {
        const question = engine.getCurrentQuestion();
        if (question) {
          const result = engine.processAnswer(answers[answerIndex]);
          if (result.success) {
            answerIndex++;
          } else {
            // Skip if validation fails
            engine.skipQuestion();
            answerIndex++;
          }
        } else {
          break;
        }
      }

      expect(engine.isComplete()).toBe(true);
    });
  });

  describe('data storage', () => {
    it('should store answers in correct data structure', () => {
      // Answer classification questions
      engine.processAnswer('Tech');
      engine.processAnswer('Experienced');

      const profile = engine.getUserProfile();
      expect(profile.background).toBe('tech');
      expect(profile.experience).toBe('experienced');

      // Answer basic info questions
      engine.processAnswer('John Smith');
      engine.processAnswer('john@example.com');
      engine.processAnswer('+1234567890');

      const resumeData = engine.getResumeData();
      expect(resumeData.basicInfo?.fullName).toBe('John Smith');
      expect(resumeData.basicInfo?.email).toBe('john@example.com');
      expect(resumeData.basicInfo?.phone).toBe('+1234567890');
    });

    it('should handle array fields correctly', () => {
      // Navigate to skills section (this would require answering many questions)
      // For testing, we'll directly test the processing logic
      const skillsQuestion = QUESTIONS.find(q => q.field === 'primary');
      if (skillsQuestion) {
        const processedValue = engine['processAnswerValue'](skillsQuestion, 'JavaScript, Python, React');
        expect(Array.isArray(processedValue)).toBe(true);
        expect(processedValue).toEqual(['JavaScript', 'Python', 'React']);
      }
    });
  });
});