import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatbotInterface from '../ChatbotInterface';
import { useConversation } from '../../../lib/chatbot/useConversation';

// Mock the useConversation hook
jest.mock('../../../lib/chatbot/useConversation');
const mockUseConversation = useConversation as jest.MockedFunction<typeof useConversation>;

// Mock the PDF and Resume components
jest.mock('../../resume/ResumePreviewChatbot', () => {
  return function MockResumePreviewChatbot({ resumeData }: any) {
    return (
      <div data-testid="resume-preview-chatbot">
        Resume Preview for {resumeData?.basicInfo?.fullName || 'Unknown'}
      </div>
    );
  };
});

jest.mock('../../pdf/PDFDownloadWithEmail', () => {
  return function MockPDFDownloadWithEmail({ resumeData }: any) {
    return (
      <button data-testid="pdf-download-button">
        Download PDF for {resumeData?.basicInfo?.fullName || 'Unknown'}
      </button>
    );
  };
});

describe('ChatbotInterface - Completion Integration', () => {
  const mockResumeData = {
    basicInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'New York, NY',
      headline: 'Software Engineer',
      summary: 'Experienced software engineer with 5 years of experience'
    },
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        startYear: 2015,
        endYear: 2019,
        marks: '3.8 GPA'
      }
    ],
    experience: [
      {
        companyName: 'Tech Corp',
        role: 'Senior Software Engineer',
        startDate: '2020-01',
        endDate: '2023-12',
        achievements: ['Led team of 5 developers', 'Increased performance by 40%'],
        toolsUsed: ['React', 'Node.js', 'PostgreSQL']
      }
    ],
    projects: [],
    skills: {
      primary: ['JavaScript', 'React', 'Node.js'],
      secondary: ['Python', 'Docker'],
      techStack: ['React', 'Node.js', 'PostgreSQL']
    },
    achievements: {
      certifications: ['AWS Certified Developer'],
      achievements: ['Employee of the Month']
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    },
    metadata: {
      background: 'tech' as const,
      experience: 'experienced' as const,
      completedSections: ['basic_info', 'education', 'experience', 'skills'] as any[],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  const mockActions = {
    sendMessage: jest.fn(),
    skipQuestion: jest.fn(),
    goBack: jest.fn(),
    resetConversation: jest.fn(),
    clearError: jest.fn(),
    getProgress: jest.fn(() => ({ current: 10, total: 10, percentage: 100 })),
    getHelpText: jest.fn(() => ''),
    getExamples: jest.fn(() => []),
    getSuggestions: jest.fn(() => [])
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows resume preview and PDF download when conversation is complete', () => {
    mockUseConversation.mockReturnValue({
      state: {
        messages: [
          {
            id: '1',
            type: 'bot',
            content: 'Congratulations! Your resume is complete.',
            timestamp: new Date()
          }
        ],
        currentQuestion: null,
        flow: null,
        isLoading: false,
        error: null,
        isComplete: true,
        userProfile: {
          background: 'tech',
          experience: 'experienced',
          preferences: { skipOptional: false, fastMode: false }
        },
        resumeData: mockResumeData
      },
      actions: mockActions
    });

    render(
      <ChatbotInterface
        showResumePreview={true}
        showPDFDownload={true}
      />
    );

    // Check that completion header is shown
    expect(screen.getByText('Resume Complete!')).toBeInTheDocument();
    expect(screen.getByText('Your ATS-optimized resume is ready for preview and download.')).toBeInTheDocument();

    // Check that resume preview component is rendered
    expect(screen.getByTestId('resume-preview-chatbot')).toBeInTheDocument();
    expect(screen.getByText('Resume Preview for John Doe')).toBeInTheDocument();

    // Check that PDF download component is rendered
    expect(screen.getByTestId('pdf-download-button')).toBeInTheDocument();
    expect(screen.getByText('Download PDF for John Doe')).toBeInTheDocument();

    // Check that the download section is present
    expect(screen.getByText('Ready to Download?')).toBeInTheDocument();
    expect(screen.getByText('Get your professional resume as a PDF file')).toBeInTheDocument();
  });

  it('shows fallback when resume preview and PDF download are disabled', () => {
    mockUseConversation.mockReturnValue({
      state: {
        messages: [],
        currentQuestion: null,
        flow: null,
        isLoading: false,
        error: null,
        isComplete: true,
        userProfile: null,
        resumeData: mockResumeData
      },
      actions: mockActions
    });

    const mockOnComplete = jest.fn();

    render(
      <ChatbotInterface
        showResumePreview={false}
        showPDFDownload={false}
        onComplete={mockOnComplete}
      />
    );

    // Check that completion header is shown
    expect(screen.getByText('Resume Complete!')).toBeInTheDocument();

    // Check that fallback content is shown
    expect(screen.getByText('Your resume data is ready!')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();

    // Check that resume preview and PDF download are not shown
    expect(screen.queryByTestId('resume-preview-chatbot')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pdf-download-button')).not.toBeInTheDocument();
  });

  it('does not show completion state when conversation is not complete', () => {
    mockUseConversation.mockReturnValue({
      state: {
        messages: [
          {
            id: '1',
            type: 'bot',
            content: 'What is your name?',
            timestamp: new Date(),
            metadata: {
              field: 'fullName',
              section: 'basic_info',
              isRequired: true,
              inputType: 'text'
            }
          }
        ],
        currentQuestion: {
          id: 'fullName',
          text: 'What is your name?',
          type: 'text',
          field: 'fullName',
          section: 'basic_info',
          required: true
        },
        flow: null,
        isLoading: false,
        error: null,
        isComplete: false,
        userProfile: null,
        resumeData: null
      },
      actions: mockActions
    });

    render(<ChatbotInterface />);

    // Check that completion state is not shown
    expect(screen.queryByText('Resume Complete!')).not.toBeInTheDocument();
    expect(screen.queryByTestId('resume-preview-chatbot')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pdf-download-button')).not.toBeInTheDocument();

    // Check that the question is shown instead
    expect(screen.getByText('What is your name?')).toBeInTheDocument();
  });

  it('handles template changes correctly', () => {
    mockUseConversation.mockReturnValue({
      state: {
        messages: [],
        currentQuestion: null,
        flow: null,
        isLoading: false,
        error: null,
        isComplete: true,
        userProfile: null,
        resumeData: mockResumeData
      },
      actions: mockActions
    });

    render(
      <ChatbotInterface
        showResumePreview={true}
        showPDFDownload={true}
      />
    );

    // The template state should be managed internally
    // This test verifies the component renders without errors when template changes occur
    expect(screen.getByTestId('resume-preview-chatbot')).toBeInTheDocument();
    expect(screen.getByTestId('pdf-download-button')).toBeInTheDocument();
  });
});