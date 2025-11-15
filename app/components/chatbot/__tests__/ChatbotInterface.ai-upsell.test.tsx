import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatbotInterface from '../ChatbotInterface';

// Mock scrollIntoView
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true
});

// Mock the useConversation hook
jest.mock('../../../lib/chatbot/useConversation', () => ({
  useConversation: () => ({
    state: {
      messages: [
        {
          id: 'msg_1',
          type: 'bot',
          content: 'Great job! Your resume is ready. We\'re working on an AI resume service that will make your resume 10x better. Would you be interested in this?',
          timestamp: new Date(),
          metadata: {
            section: 'ai_upsell',
            questionId: 'ai_interest',
            field: 'aiInterest',
            isRequired: true,
            inputType: 'select',
            options: ['Yes, I\'m interested', 'No, thanks']
          }
        },
        {
          id: 'msg_2',
          type: 'user',
          content: 'Yes, I\'m interested',
          timestamp: new Date(),
          metadata: {
            section: 'ai_upsell',
            questionId: 'ai_interest',
            field: 'aiInterest'
          }
        }
      ],
      currentQuestion: null,
      flow: {
        currentStep: 10,
        totalSteps: 10,
        currentSection: 'ai_upsell',
        availableSections: ['ai_upsell'],
        canGoBack: true,
        canSkip: false
      },
      isLoading: false,
      error: null,
      isComplete: false,
      userProfile: {
        background: 'tech',
        experience: 'experienced',
        preferences: {
          skipOptional: false,
          fastMode: false
        }
      },
      resumeData: {
        basicInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        }
      }
    },
    actions: {
      sendMessage: jest.fn(),
      skipQuestion: jest.fn(),
      goBack: jest.fn(),
      resetConversation: jest.fn(),
      clearError: jest.fn(),
      getProgress: () => ({ current: 10, total: 10, percentage: 100 }),
      getHelpText: () => '',
      getExamples: () => [],
      getSuggestions: () => []
    }
  })
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('ChatbotInterface AI Upsell Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Thank you for your interest! We\'ll notify you when the AI service is ready.'
      })
    });
  });

  it('shows AI Interest Modal when user responds positively to AI interest question', async () => {
    render(<ChatbotInterface />);

    // Wait for the AI Interest Modal to appear
    await waitFor(() => {
      expect(screen.getByText('🚀 AI Resume Enhancement')).toBeInTheDocument();
    });

    expect(screen.getByText('Join the waitlist for 10x better resumes')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Optimization')).toBeInTheDocument();
  });

  it('submits AI interest email and shows thank you modal', async () => {
    render(<ChatbotInterface />);

    // Wait for the AI Interest Modal to appear
    await waitFor(() => {
      expect(screen.getByText('🚀 AI Resume Enhancement')).toBeInTheDocument();
    });

    // Fill in email and submit
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByText('Join Waitlist');
    fireEvent.click(submitButton);

    // Wait for API call and modal transition
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          type: 'ai_interest',
          resumeMetadata: {
            sections: ['ai_upsell'],
            background: 'tech',
            experience: 'experienced',
          },
        }),
      });
    });

    // Check that Thank You Modal appears
    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
    });

    expect(screen.getByText('You\'re on the AI waitlist')).toBeInTheDocument();
    expect(screen.getByText('We\'re working on it!')).toBeInTheDocument();
  });

  it('handles AI modal close correctly', async () => {
    render(<ChatbotInterface />);

    // Wait for the AI Interest Modal to appear
    await waitFor(() => {
      expect(screen.getByText('🚀 AI Resume Enhancement')).toBeInTheDocument();
    });

    // Click "Maybe Later" button
    const maybeLaterButton = screen.getByText('Maybe Later');
    fireEvent.click(maybeLaterButton);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByText('🚀 AI Resume Enhancement')).not.toBeInTheDocument();
    });
  });
});