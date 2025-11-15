'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ChatMessage, ChatbotState, UserProfile, ResumeData, ResumeSection } from './types';
import { QuestionEngine, Question } from './questionEngine';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface ChatbotContextType {
  state: ChatbotState;
  sendMessage: (content: string) => Promise<void>;
  skipQuestion: () => Promise<void>;
  goBack: () => Promise<void>;
  resetChat: () => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => { current: number; total: number; section: ResumeSection; percentage: number };
  isLoading: boolean;
}

interface ChatbotAction {
  type: 'ADD_MESSAGE' | 'UPDATE_STATE' | 'SET_LOADING' | 'RESET' | 'UPDATE_PROGRESS';
  payload?: any;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ChatbotState = {
  messages: [],
  currentSection: 'classification',
  userProfile: {
    background: 'tech',
    experience: 'fresher',
    preferences: {
      skipOptional: false,
      fastMode: false
    }
  },
  resumeData: {
    basicInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      headline: '',
      summary: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      primary: [],
      secondary: [],
      techStack: [],
      businessTools: []
    },
    achievements: {
      certifications: [],
      achievements: [],
      extracurricular: []
    },
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    },
    metadata: {
      background: 'tech',
      experience: 'fresher',
      completedSections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  isComplete: false
};

// ============================================================================
// REDUCER
// ============================================================================

function chatbotReducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case 'UPDATE_STATE':
      return {
        ...state,
        ...action.payload
      };
    
    case 'RESET':
      return {
        ...initialState,
        messages: []
      };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        currentSection: action.payload.section,
        userProfile: action.payload.userProfile,
        resumeData: {
          ...state.resumeData,
          ...action.payload.resumeData,
          metadata: {
            ...state.resumeData.metadata,
            ...action.payload.userProfile,
            updatedAt: new Date()
          }
        }
      };
    
    default:
      return state;
  }
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface ChatbotProviderProps {
  children: ReactNode;
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);
  const [questionEngine] = React.useState(() => new QuestionEngine());
  const [isLoading, setIsLoading] = React.useState(false);

  // Initialize chatbot with welcome message
  useEffect(() => {
    const initializeChat = async () => {
      const firstQuestion = questionEngine.getCurrentQuestion();
      if (firstQuestion && state.messages.length === 0) {
        const welcomeMessage: ChatMessage = {
          id: generateMessageId(),
          type: 'bot',
          content: firstQuestion.text,
          timestamp: new Date(),
          metadata: {
            field: firstQuestion.field,
            section: firstQuestion.section,
            isRequired: firstQuestion.required,
            inputType: firstQuestion.type,
            options: firstQuestion.options,
            questionId: firstQuestion.id
          }
        };
        
        dispatch({ type: 'ADD_MESSAGE', payload: welcomeMessage });
      }
    };

    initializeChat();
  }, []);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {
    const fullMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: fullMessage });
  };

  const updateProgress = (): void => {
    const progress = questionEngine.getProgress();
    const userProfile = questionEngine.getUserProfile();
    const resumeData = questionEngine.getResumeData();

    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        section: progress.section,
        userProfile,
        resumeData
      }
    });
  };

  // ============================================================================
  // MAIN FUNCTIONS
  // ============================================================================

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    setIsLoading(true);

    try {
      // Add user message
      addMessage({
        type: 'user',
        content: content.trim()
      });

      // Process the answer
      const result = questionEngine.processAnswer(content.trim());

      if (!result.success) {
        // Add error message
        addMessage({
          type: 'bot',
          content: `I'm sorry, but ${result.error}. Please try again.`,
          metadata: {
            validationError: result.error
          }
        });
        return;
      }

      // Update progress
      updateProgress();

      // Check if there's a next question
      if (result.nextQuestion) {
        // Add bot message with next question
        addMessage({
          type: 'bot',
          content: result.nextQuestion.text,
          metadata: {
            field: result.nextQuestion.field,
            section: result.nextQuestion.section,
            isRequired: result.nextQuestion.required,
            inputType: result.nextQuestion.type,
            options: result.nextQuestion.options,
            questionId: result.nextQuestion.id
          }
        });
      } else {
        // Conversation is complete
        addMessage({
          type: 'bot',
          content: 'Perfect! Your resume is now complete. Let me prepare it for you...'
        });

        dispatch({
          type: 'UPDATE_STATE',
          payload: { isComplete: true }
        });
      }

    } catch (error) {
      console.error('Error processing message:', error);
      addMessage({
        type: 'bot',
        content: 'I encountered an error processing your response. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const skipQuestion = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const result = questionEngine.skipQuestion();

      if (!result.success) {
        addMessage({
          type: 'bot',
          content: result.error || 'This question cannot be skipped.'
        });
        return;
      }

      // Add skip message
      addMessage({
        type: 'user',
        content: '[Skipped]'
      });

      // Update progress
      updateProgress();

      // Check if there's a next question
      if (result.nextQuestion) {
        addMessage({
          type: 'bot',
          content: result.nextQuestion.text,
          metadata: {
            field: result.nextQuestion.field,
            section: result.nextQuestion.section,
            isRequired: result.nextQuestion.required,
            inputType: result.nextQuestion.type,
            options: result.nextQuestion.options,
            questionId: result.nextQuestion.id
          }
        });
      } else {
        // Conversation is complete
        addMessage({
          type: 'bot',
          content: 'Perfect! Your resume is now complete. Let me prepare it for you...'
        });

        dispatch({
          type: 'UPDATE_STATE',
          payload: { isComplete: true }
        });
      }

    } catch (error) {
      console.error('Error skipping question:', error);
      addMessage({
        type: 'bot',
        content: 'I encountered an error skipping the question. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const previousQuestion = questionEngine.goBack();

      if (previousQuestion) {
        // Remove the last two messages (user answer and bot question)
        const newMessages = state.messages.slice(0, -2);
        
        dispatch({
          type: 'UPDATE_STATE',
          payload: {
            messages: newMessages,
            isComplete: false
          }
        });

        // Update progress
        updateProgress();

        // Add the previous question back
        addMessage({
          type: 'bot',
          content: previousQuestion.text,
          metadata: {
            field: previousQuestion.field,
            section: previousQuestion.section,
            isRequired: previousQuestion.required,
            inputType: previousQuestion.type,
            options: previousQuestion.options,
            questionId: previousQuestion.id
          }
        });
      } else {
        addMessage({
          type: 'bot',
          content: 'You\'re already at the beginning of the conversation.'
        });
      }

    } catch (error) {
      console.error('Error going back:', error);
      addMessage({
        type: 'bot',
        content: 'I encountered an error going back. Please continue with the current question.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = (): void => {
    questionEngine.reset();
    dispatch({ type: 'RESET' });
    
    // Add welcome message
    const firstQuestion = questionEngine.getCurrentQuestion();
    if (firstQuestion) {
      addMessage({
        type: 'bot',
        content: firstQuestion.text,
        metadata: {
          field: firstQuestion.field,
          section: firstQuestion.section,
          isRequired: firstQuestion.required,
          inputType: firstQuestion.type,
          options: firstQuestion.options,
          questionId: firstQuestion.id
        }
      });
    }
  };

  const getCurrentQuestion = (): Question | null => {
    return questionEngine.getCurrentQuestion();
  };

  const getProgress = () => {
    return questionEngine.getProgress();
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const contextValue: ChatbotContextType = {
    state,
    sendMessage,
    skipQuestion,
    goBack,
    resetChat,
    getCurrentQuestion,
    getProgress,
    isLoading
  };

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
    </ChatbotContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useChatbot(): ChatbotContextType {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

export default ChatbotContext;