// Custom hook for managing conversation state and flow
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ResumeSection, UserProfile } from './types';
import { Question } from './questionEngine';
import { ConversationManager, ConversationFlow, ConversationResponse } from './conversationManager';

export interface ConversationState {
  messages: ChatMessage[];
  currentQuestion: Question | null;
  flow: ConversationFlow | null;
  isLoading: boolean;
  error: string | null;
  isComplete: boolean;
  userProfile: UserProfile | null;
  resumeData: any;
}

export interface ConversationActions {
  sendMessage: (content: string) => Promise<void>;
  skipQuestion: () => Promise<void>;
  goBack: () => Promise<void>;
  resetConversation: () => void;
  clearError: () => void;
  getProgress: () => { current: number; total: number; percentage: number };
  getHelpText: () => string;
  getExamples: () => string[];
  getSuggestions: (input: string) => string[];
}

export interface UseConversationReturn {
  state: ConversationState;
  actions: ConversationActions;
}

const initialState: ConversationState = {
  messages: [],
  currentQuestion: null,
  flow: null,
  isLoading: false,
  error: null,
  isComplete: false,
  userProfile: null,
  resumeData: null
};

export function useConversation(): UseConversationReturn {
  const [state, setState] = useState<ConversationState>(initialState);
  const [conversationManager] = useState(() => new ConversationManager());

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>): void => {
    const fullMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, fullMessage]
    }));
  }, []);

  const updateStateFromResponse = useCallback((response: ConversationResponse): void => {
    setState(prev => ({
      ...prev,
      currentQuestion: response.nextQuestion || null,
      flow: response.flow || prev.flow,
      error: response.error || null,
      isComplete: conversationManager.isComplete(),
      userProfile: conversationManager.getUserProfile(),
      resumeData: conversationManager.getResumeData()
    }));
  }, [conversationManager]);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const initializeConversation = () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        const response = conversationManager.startConversation();
        
        if (response.success && response.nextQuestion) {
          // Add welcome message if provided
          if (response.message) {
            addMessage({
              type: 'bot',
              content: response.message
            });
          }

          // Add first question
          addMessage({
            type: 'bot',
            content: response.nextQuestion.text,
            metadata: {
              field: response.nextQuestion.field,
              section: response.nextQuestion.section,
              isRequired: response.nextQuestion.required,
              inputType: response.nextQuestion.type,
              options: response.nextQuestion.options,
              questionId: response.nextQuestion.id
            }
          });

          updateStateFromResponse(response);
        } else {
          setState(prev => ({
            ...prev,
            error: response.error || 'Failed to initialize conversation'
          }));
        }
      } catch (error) {
        console.error('Error initializing conversation:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to start conversation'
        }));
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Only initialize if we don't have messages yet
    if (state.messages.length === 0) {
      initializeConversation();
    }
  }, [addMessage, updateStateFromResponse, conversationManager, state.messages.length]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Add user message with metadata from current question
      const currentQuestion = conversationManager.getCurrentQuestion();
      addMessage({
        type: 'user',
        content: content.trim(),
        metadata: currentQuestion ? {
          field: currentQuestion.field,
          section: currentQuestion.section,
          questionId: currentQuestion.id
        } : undefined
      });

      // Process the message
      const response = conversationManager.processUserInput(content.trim());

      if (response.success) {
        // Add transition message if provided
        if (response.message && !response.nextQuestion) {
          addMessage({
            type: 'bot',
            content: response.message
          });
        }

        // Add next question if available
        if (response.nextQuestion) {
          // Add transition message if provided and different from question
          if (response.message && response.message !== response.nextQuestion.text) {
            addMessage({
              type: 'bot',
              content: response.message
            });
          }

          addMessage({
            type: 'bot',
            content: response.nextQuestion.text,
            metadata: {
              field: response.nextQuestion.field,
              section: response.nextQuestion.section,
              isRequired: response.nextQuestion.required,
              inputType: response.nextQuestion.type,
              options: response.nextQuestion.options,
              questionId: response.nextQuestion.id
            }
          });
        }

        updateStateFromResponse(response);
      } else {
        // Add error message
        addMessage({
          type: 'bot',
          content: response.error || 'I didn\'t understand that. Please try again.',
          metadata: {
            validationError: response.error
          }
        });

        // Add suggestions if available
        if (response.suggestions && response.suggestions.length > 0) {
          addMessage({
            type: 'bot',
            content: `Here are some suggestions:\n${response.suggestions.map(s => `• ${s}`).join('\n')}`
          });
        }

        setState(prev => ({ ...prev, error: response.error || null }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        type: 'bot',
        content: 'I encountered an error processing your message. Please try again.'
      });
      setState(prev => ({ ...prev, error: 'Failed to process message' }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.isLoading, addMessage, conversationManager, updateStateFromResponse]);

  const skipQuestion = useCallback(async (): Promise<void> => {
    if (state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = conversationManager.skipCurrentQuestion();

      if (response.success) {
        // Add skip message
        addMessage({
          type: 'user',
          content: '[Skipped]'
        });

        // Add response message if provided
        if (response.message) {
          addMessage({
            type: 'bot',
            content: response.message
          });
        }

        // Add next question if available
        if (response.nextQuestion) {
          addMessage({
            type: 'bot',
            content: response.nextQuestion.text,
            metadata: {
              field: response.nextQuestion.field,
              section: response.nextQuestion.section,
              isRequired: response.nextQuestion.required,
              inputType: response.nextQuestion.type,
              options: response.nextQuestion.options,
              questionId: response.nextQuestion.id
            }
          });
        }

        updateStateFromResponse(response);
      } else {
        addMessage({
          type: 'bot',
          content: response.error || 'This question cannot be skipped.'
        });
        setState(prev => ({ ...prev, error: response.error || null }));
      }
    } catch (error) {
      console.error('Error skipping question:', error);
      addMessage({
        type: 'bot',
        content: 'I encountered an error skipping the question. Please try again.'
      });
      setState(prev => ({ ...prev, error: 'Failed to skip question' }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.isLoading, addMessage, conversationManager, updateStateFromResponse]);

  const goBack = useCallback(async (): Promise<void> => {
    if (state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = conversationManager.goToPreviousQuestion();

      if (response.success && response.nextQuestion) {
        // Remove last few messages (user answer and bot question)
        setState(prev => ({
          ...prev,
          messages: prev.messages.slice(0, -2)
        }));

        // Add back message if provided
        if (response.message) {
          addMessage({
            type: 'bot',
            content: response.message
          });
        }

        // Add previous question
        addMessage({
          type: 'bot',
          content: response.nextQuestion.text,
          metadata: {
            field: response.nextQuestion.field,
            section: response.nextQuestion.section,
            isRequired: response.nextQuestion.required,
            inputType: response.nextQuestion.type,
            options: response.nextQuestion.options,
            questionId: response.nextQuestion.id
          }
        });

        updateStateFromResponse(response);
      } else {
        addMessage({
          type: 'bot',
          content: response.error || 'Cannot go back further.'
        });
        setState(prev => ({ ...prev, error: response.error || null }));
      }
    } catch (error) {
      console.error('Error going back:', error);
      addMessage({
        type: 'bot',
        content: 'I encountered an error going back. Please continue with the current question.'
      });
      setState(prev => ({ ...prev, error: 'Failed to go back' }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.isLoading, addMessage, conversationManager, updateStateFromResponse]);

  const resetConversation = useCallback((): void => {
    setState(initialState);
    
    try {
      const response = conversationManager.resetConversation();
      
      if (response.success && response.nextQuestion) {
        // Add welcome message if provided
        if (response.message) {
          addMessage({
            type: 'bot',
            content: response.message
          });
        }

        // Add first question
        addMessage({
          type: 'bot',
          content: response.nextQuestion.text,
          metadata: {
            field: response.nextQuestion.field,
            section: response.nextQuestion.section,
            isRequired: response.nextQuestion.required,
            inputType: response.nextQuestion.type,
            options: response.nextQuestion.options,
            questionId: response.nextQuestion.id
          }
        });

        updateStateFromResponse(response);
      }
    } catch (error) {
      console.error('Error resetting conversation:', error);
      setState(prev => ({ ...prev, error: 'Failed to reset conversation' }));
    }
  }, [addMessage, conversationManager, updateStateFromResponse]);

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const getProgress = useCallback(() => {
    if (!state.flow) {
      return { current: 0, total: 0, percentage: 0 };
    }
    return {
      current: state.flow.currentStep,
      total: state.flow.totalSteps,
      percentage: Math.round((state.flow.currentStep / state.flow.totalSteps) * 100)
    };
  }, [state.flow]);

  const getHelpText = useCallback((): string => {
    return conversationManager.getHelpText();
  }, [conversationManager]);

  const getExamples = useCallback((): string[] => {
    return conversationManager.getExampleResponses();
  }, [conversationManager]);

  const getSuggestions = useCallback((input: string): string[] => {
    const currentQuestion = conversationManager.getCurrentQuestion();
    if (!currentQuestion) return [];
    
    const validation = conversationManager.validateInput(input, currentQuestion);
    if (validation.isValid) return [];
    
    // This would need to be implemented in conversationManager
    return [];
  }, [conversationManager]);

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  return {
    state,
    actions: {
      sendMessage,
      skipQuestion,
      goBack,
      resetConversation,
      clearError,
      getProgress,
      getHelpText,
      getExamples,
      getSuggestions
    }
  };
}