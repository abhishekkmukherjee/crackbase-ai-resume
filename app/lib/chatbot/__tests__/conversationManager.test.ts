// Tests for Conversation Manager
import { ConversationManager } from '../conversationManager';

describe('ConversationManager', () => {
  let manager: ConversationManager;

  beforeEach(() => {
    manager = new ConversationManager();
  });

  describe('initialization', () => {
    it('should start conversation successfully', () => {
      const response = manager.startConversation();
      
      expect(response.success).toBe(true);
      expect(response.nextQuestion).toBeTruthy();
      expect(response.nextQuestion?.section).toBe('classification');
      expect(response.message).toBeTruthy();
      expect(response.flow).toBeTruthy();
    });
  });

  describe('user input processing', () => {
    it('should process valid input correctly', () => {
      manager.startConversation();
      
      const response = manager.processUserInput('Tech');
      
      expect(response.success).toBe(true);
      expect(response.nextQuestion).toBeTruthy();
      expect(response.flow).toBeTruthy();
    });

    it('should handle invalid input gracefully', () => {
      manager.startConversation();
      
      const response = manager.processUserInput('');
      
      expect(response.success).toBe(false);
      expect(response.error).toBeTruthy();
    });

    it('should provide suggestions for invalid input', () => {
      manager.startConversation();
      
      const response = manager.processUserInput('InvalidOption');
      
      expect(response.success).toBe(false);
      expect(response.suggestions).toBeTruthy();
      expect(response.suggestions!.length).toBeGreaterThan(0);
    });
  });

  describe('navigation', () => {
    it('should allow skipping optional questions', () => {
      manager.startConversation();
      
      // Navigate to an optional question
      manager.processUserInput('Tech');
      manager.processUserInput('Fresher');
      manager.processUserInput('John Smith');
      manager.processUserInput('john@example.com');
      manager.processUserInput('+1234567890');
      
      // Location is optional
      const skipResponse = manager.skipCurrentQuestion();
      expect(skipResponse.success).toBe(true);
    });

    it('should allow going back', () => {
      manager.startConversation();
      manager.processUserInput('Tech');
      
      const backResponse = manager.goToPreviousQuestion();
      expect(backResponse.success).toBe(true);
      expect(backResponse.nextQuestion?.field).toBe('background');
    });
  });

  describe('flow information', () => {
    it('should provide accurate flow information', () => {
      manager.startConversation();
      
      const flow = manager.getCurrentFlow();
      
      expect(flow.currentStep).toBe(0);
      expect(flow.totalSteps).toBeGreaterThan(0);
      expect(flow.currentSection).toBe('classification');
      expect(flow.availableSections).toContain('classification');
      expect(flow.canGoBack).toBe(false);
    });

    it('should update flow information as conversation progresses', () => {
      manager.startConversation();
      manager.processUserInput('Tech');
      
      const flow = manager.getCurrentFlow();
      
      expect(flow.currentStep).toBe(1);
      expect(flow.canGoBack).toBe(true);
    });
  });

  describe('completion', () => {
    it('should detect conversation completion', () => {
      expect(manager.isComplete()).toBe(false);
      
      // This would require answering all questions
      // For now, just test the method exists and returns boolean
      expect(typeof manager.isComplete()).toBe('boolean');
    });
  });

  describe('reset functionality', () => {
    it('should reset conversation successfully', () => {
      manager.startConversation();
      manager.processUserInput('Tech');
      manager.processUserInput('Experienced');
      
      const resetResponse = manager.resetConversation();
      
      expect(resetResponse.success).toBe(true);
      expect(resetResponse.nextQuestion?.section).toBe('classification');
      
      const flow = manager.getCurrentFlow();
      expect(flow.currentStep).toBe(0);
    });
  });

  describe('utility methods', () => {
    it('should provide current question', () => {
      manager.startConversation();
      
      const question = manager.getCurrentQuestion();
      expect(question).toBeTruthy();
      expect(question?.section).toBe('classification');
    });

    it('should provide user profile', () => {
      manager.startConversation();
      
      const profile = manager.getUserProfile();
      expect(profile).toBeTruthy();
      expect(profile.background).toBeDefined();
      expect(profile.experience).toBeDefined();
    });

    it('should provide resume data', () => {
      manager.startConversation();
      
      const resumeData = manager.getResumeData();
      expect(resumeData).toBeTruthy();
    });

    it('should provide help text', () => {
      manager.startConversation();
      
      const helpText = manager.getHelpText();
      expect(typeof helpText).toBe('string');
    });

    it('should provide example responses', () => {
      manager.startConversation();
      
      const examples = manager.getExampleResponses();
      expect(Array.isArray(examples)).toBe(true);
    });
  });
});