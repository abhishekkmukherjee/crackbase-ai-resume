// Main exports for the chatbot system
export * from './types';
export * from './questionEngine';
export * from './conversationManager';
export * from './progressTracker';
export * from './useConversation';
export { ChatbotProvider, useChatbot } from './ChatbotContext';

// Re-export commonly used types and classes
export type { 
  ChatMessage, 
  ChatbotState, 
  UserProfile, 
  ResumeData, 
  ResumeSection 
} from './types';

export type { 
  Question, 
  SkipCondition, 
  ValidationRule 
} from './questionEngine';

export type { 
  ConversationFlow, 
  ConversationResponse 
} from './conversationManager';

export type { 
  ProgressStep, 
  ProgressInfo 
} from './progressTracker';

export { QuestionEngine } from './questionEngine';
export { ConversationManager } from './conversationManager';
export { ProgressTracker } from './progressTracker';