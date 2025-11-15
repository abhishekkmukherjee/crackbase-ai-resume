// Conversation Manager for ATS Resume Chatbot
import { ChatMessage, ResumeSection, UserProfile } from './types';
import { Question, QuestionEngine } from './questionEngine';

export interface ConversationFlow {
  currentStep: number;
  totalSteps: number;
  currentSection: ResumeSection;
  availableSections: ResumeSection[];
  canGoBack: boolean;
  canSkip: boolean;
}

export interface ConversationResponse {
  success: boolean;
  message?: string;
  nextQuestion?: Question | null;
  flow?: ConversationFlow;
  error?: string;
  suggestions?: string[];
}

export class ConversationManager {
  private questionEngine: QuestionEngine;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.questionEngine = new QuestionEngine();
  }

  // ============================================================================
  // CONVERSATION FLOW MANAGEMENT
  // ============================================================================

  /**
   * Start a new conversation
   */
  startConversation(): ConversationResponse {
    const firstQuestion = this.questionEngine.getCurrentQuestion();
    
    if (!firstQuestion) {
      return {
        success: false,
        error: 'Failed to initialize conversation'
      };
    }

    return {
      success: true,
      nextQuestion: firstQuestion,
      flow: this.getCurrentFlow(),
      message: this.getWelcomeMessage()
    };
  }

  /**
   * Process user input and get next step
   */
  processUserInput(input: string): ConversationResponse {
    const currentQuestion = this.questionEngine.getCurrentQuestion();
    
    if (!currentQuestion) {
      return {
        success: false,
        error: 'No active question to process'
      };
    }

    // Validate and process the answer
    const result = this.questionEngine.processAnswer(input);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        suggestions: this.getInputSuggestions(currentQuestion, input)
      };
    }

    // Check if conversation is complete
    if (this.questionEngine.isComplete()) {
      return {
        success: true,
        message: this.getCompletionMessage(),
        flow: this.getCurrentFlow()
      };
    }

    // Get next question
    return {
      success: true,
      nextQuestion: result.nextQuestion,
      flow: this.getCurrentFlow(),
      message: this.getTransitionMessage(currentQuestion, result.nextQuestion || null)
    };
  }

  /**
   * Skip current question if allowed
   */
  skipCurrentQuestion(): ConversationResponse {
    const result = this.questionEngine.skipQuestion();

    if (!result.success) {
      return {
        success: false,
        error: result.error
      };
    }

    if (this.questionEngine.isComplete()) {
      return {
        success: true,
        message: this.getCompletionMessage(),
        flow: this.getCurrentFlow()
      };
    }

    return {
      success: true,
      nextQuestion: result.nextQuestion,
      flow: this.getCurrentFlow(),
      message: 'Question skipped. Let\'s continue...'
    };
  }

  /**
   * Go back to previous question
   */
  goToPreviousQuestion(): ConversationResponse {
    const previousQuestion = this.questionEngine.goBack();

    if (!previousQuestion) {
      return {
        success: false,
        error: 'Cannot go back further'
      };
    }

    return {
      success: true,
      nextQuestion: previousQuestion,
      flow: this.getCurrentFlow(),
      message: 'Let\'s go back to the previous question.'
    };
  }

  /**
   * Reset conversation
   */
  resetConversation(): ConversationResponse {
    this.questionEngine.reset();
    this.conversationHistory = [];
    return this.startConversation();
  }

  // ============================================================================
  // FLOW INFORMATION
  // ============================================================================

  /**
   * Get current conversation flow information
   */
  getCurrentFlow(): ConversationFlow {
    const progress = this.questionEngine.getProgress();
    const availableSections = this.questionEngine.getAvailableSections();
    const currentQuestion = this.questionEngine.getCurrentQuestion();

    return {
      currentStep: progress.current,
      totalSteps: progress.total,
      currentSection: progress.section,
      availableSections,
      canGoBack: progress.current > 0,
      canSkip: currentQuestion ? !currentQuestion.required : false
    };
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(): number {
    const progress = this.questionEngine.getProgress();
    return progress.percentage;
  }

  /**
   * Get current section information
   */
  getCurrentSectionInfo(): { section: ResumeSection; name: string; description: string } {
    const progress = this.questionEngine.getProgress();
    return this.getSectionInfo(progress.section);
  }

  /**
   * Get section information by section type
   */
  private getSectionInfo(section: ResumeSection): { section: ResumeSection; name: string; description: string } {
    const sectionMap = {
      classification: {
        name: 'Getting Started',
        description: 'Let\'s understand your background to customize your resume'
      },
      basic_info: {
        name: 'Basic Information',
        description: 'Your contact details and professional headline'
      },
      education: {
        name: 'Education',
        description: 'Your academic background and qualifications'
      },
      experience: {
        name: 'Work Experience',
        description: 'Your professional work history and achievements'
      },
      projects: {
        name: 'Projects',
        description: 'Your significant projects and contributions'
      },
      skills: {
        name: 'Skills',
        description: 'Your technical and professional skills'
      },
      achievements: {
        name: 'Achievements',
        description: 'Your certifications, awards, and accomplishments'
      },
      social_links: {
        name: 'Professional Links',
        description: 'Your LinkedIn, GitHub, and portfolio links'
      },
      ai_upsell: {
        name: 'AI Enhancement',
        description: 'Optional AI-powered resume improvement'
      },
      complete: {
        name: 'Complete',
        description: 'Your resume is ready!'
      }
    };

    return {
      section,
      ...sectionMap[section]
    };
  }

  // ============================================================================
  // MESSAGE GENERATION
  // ============================================================================

  /**
   * Get welcome message
   */
  private getWelcomeMessage(): string {
    return 'Welcome! I\'m here to help you create an ATS-friendly resume through a simple conversation. Let\'s get started!';
  }

  /**
   * Get completion message
   */
  private getCompletionMessage(): string {
    const userProfile = this.questionEngine.getUserProfile();
    const resumeData = this.questionEngine.getResumeData();
    
    return `Excellent! Your ${userProfile.background} resume is now complete. I've gathered all the information needed to create an ATS-optimized resume that will help you stand out to employers.`;
  }

  /**
   * Get transition message between questions
   */
  private getTransitionMessage(currentQuestion: Question | null, nextQuestion: Question | null): string {
    if (!currentQuestion || !nextQuestion) return '';

    // Section transition messages
    if (currentQuestion.section !== nextQuestion.section) {
      const sectionInfo = this.getSectionInfo(nextQuestion.section);
      return `Great! Now let's move on to ${sectionInfo.name}. ${sectionInfo.description}`;
    }

    // Same section continuation messages
    const continuationMessages = [
      'Perfect! Let\'s continue...',
      'Great answer! Next question...',
      'Excellent! Moving on...',
      'Thanks! Let\'s keep going...'
    ];

    return continuationMessages[Math.floor(Math.random() * continuationMessages.length)];
  }

  /**
   * Get input suggestions for validation errors
   */
  private getInputSuggestions(question: Question, input: string): string[] {
    const suggestions: string[] = [];

    switch (question.type) {
      case 'email':
        suggestions.push('Make sure to include @ and a domain (e.g., john@example.com)');
        break;
      case 'text':
        if (question.field === 'phone') {
          suggestions.push('Include country code if international (e.g., +1234567890)');
          suggestions.push('Remove any spaces or special characters except +');
        }
        break;
      case 'select':
        if (question.options) {
          suggestions.push(`Please choose one of: ${question.options.join(', ')}`);
        }
        break;
      case 'textarea':
        suggestions.push('You can write multiple lines or bullet points');
        suggestions.push('Press Enter to create new lines');
        break;
    }

    // Add general suggestions
    if (question.required) {
      suggestions.push('This field is required and cannot be left empty');
    } else {
      suggestions.push('You can type "skip" to skip this optional question');
    }

    return suggestions;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get current question
   */
  getCurrentQuestion(): Question | null {
    return this.questionEngine.getCurrentQuestion();
  }

  /**
   * Get user profile
   */
  getUserProfile(): UserProfile {
    return this.questionEngine.getUserProfile();
  }

  /**
   * Get resume data
   */
  getResumeData(): any {
    return this.questionEngine.getResumeData();
  }

  /**
   * Check if conversation is complete
   */
  isComplete(): boolean {
    return this.questionEngine.isComplete();
  }

  /**
   * Get conversation statistics
   */
  getStatistics(): {
    questionsAnswered: number;
    questionsSkipped: number;
    sectionsCompleted: string[];
    timeSpent: number;
  } {
    const progress = this.questionEngine.getProgress();
    const userProfile = this.questionEngine.getUserProfile();
    const availableSections = this.questionEngine.getAvailableSections();
    
    return {
      questionsAnswered: progress.current,
      questionsSkipped: 0, // This would need to be tracked separately
      sectionsCompleted: availableSections.slice(0, availableSections.indexOf(progress.section)),
      timeSpent: 0 // This would need to be tracked with timestamps
    };
  }

  /**
   * Validate if input matches expected format
   */
  validateInput(input: string, question: Question): { isValid: boolean; error?: string } {
    return this.questionEngine.validateAnswer(question, input);
  }

  /**
   * Get help text for current question
   */
  getHelpText(): string {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return '';

    if (currentQuestion.helpText) {
      return currentQuestion.helpText;
    }

    // Generate contextual help
    switch (currentQuestion.type) {
      case 'email':
        return 'Enter a valid email address (e.g., john@example.com)';
      case 'textarea':
        return 'You can write multiple lines. Press Enter for new lines.';
      case 'select':
        return `Choose one of the available options: ${currentQuestion.options?.join(', ')}`;
      default:
        return currentQuestion.placeholder || 'Enter your response';
    }
  }

  /**
   * Get example responses for current question
   */
  getExampleResponses(): string[] {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return [];

    const examples: Record<string, string[]> = {
      fullName: ['John Smith', 'Sarah Johnson', 'Michael Chen'],
      email: ['john.smith@email.com', 'sarah.j@company.com'],
      phone: ['+1234567890', '555-123-4567'],
      degree: ['Bachelor of Science in Computer Science', 'Master of Business Administration', 'Associate Degree in Engineering'],
      companyName: ['Google', 'Microsoft', 'Startup Inc', 'Local Business'],
      role: ['Software Engineer', 'Marketing Manager', 'Data Analyst', 'Project Manager'],
      primary: ['JavaScript, Python, React', 'Project Management, Leadership', 'Data Analysis, Excel, SQL']
    };

    return examples[currentQuestion.field] || [];
  }
}