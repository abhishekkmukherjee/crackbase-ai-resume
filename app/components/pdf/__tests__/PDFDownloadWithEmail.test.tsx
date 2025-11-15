import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PDFDownloadWithEmail, { AIInterestButton } from '../PDFDownloadWithEmail';
import { ResumeData } from '../../../lib/chatbot/types';

// Mock the PDF generation
jest.mock('../../../lib/pdf', () => ({
  generateResumePDF: jest.fn(),
  downloadPDF: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockResumeData: ResumeData = {
  basicInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    location: 'New York, NY',
    headline: 'Software Developer',
    summary: 'Experienced software developer'
  },
  education: [],
  experience: [],
  projects: [],
  skills: {
    primary: ['JavaScript', 'React'],
    secondary: [],
    techStack: [],
    businessTools: []
  },
  achievements: {
    certifications: [],
    achievements: [],
    extracurricular: []
  },
  socialLinks: {},
  metadata: {
    background: 'tech',
    experience: 'experienced',
    completedSections: ['basic_info', 'skills'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

describe('PDFDownloadWithEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        message: 'Email captured successfully',
        downloadToken: 'test-token'
      })
    });
  });

  it('renders download button', () => {
    render(<PDFDownloadWithEmail resumeData={mockResumeData} />);
    
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('opens email capture modal when download button is clicked', () => {
    render(<PDFDownloadWithEmail resumeData={mockResumeData} />);
    
    fireEvent.click(screen.getByText('Download PDF'));
    
    expect(screen.getByText('Download Your Resume')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
  });

  it('disables download button when resume has insufficient data', () => {
    const incompleteResumeData = {
      ...mockResumeData,
      basicInfo: {
        ...mockResumeData.basicInfo,
        fullName: '',
        email: ''
      }
    };

    render(<PDFDownloadWithEmail resumeData={incompleteResumeData} />);
    
    const downloadButton = screen.getByText('Download PDF');
    expect(downloadButton).toBeDisabled();
  });

  it('validates email format in modal', async () => {
    render(<PDFDownloadWithEmail resumeData={mockResumeData} />);
    
    // Open modal
    fireEvent.click(screen.getByText('Download PDF'));
    
    // Enter invalid email
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Download Resume PDF/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('submits email and triggers PDF generation', async () => {
    const { generateResumePDF, downloadPDF } = require('../../../lib/pdf');
    generateResumePDF.mockResolvedValue({
      success: true,
      blob: new Blob(['test'], { type: 'application/pdf' })
    });

    render(<PDFDownloadWithEmail resumeData={mockResumeData} />);
    
    // Open modal
    fireEvent.click(screen.getByText('Download PDF'));
    
    // Enter valid email
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Download Resume PDF'));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          type: 'download',
          resumeMetadata: {
            sections: ['basic_info', 'skills'],
            background: 'tech',
            experience: 'experienced'
          }
        })
      });
    });

    await waitFor(() => {
      expect(generateResumePDF).toHaveBeenCalled();
      expect(downloadPDF).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        success: false,
        message: 'Email already exists'
      })
    });

    render(<PDFDownloadWithEmail resumeData={mockResumeData} />);
    
    // Open modal
    fireEvent.click(screen.getByText('Download PDF'));
    
    // Enter email
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Submit form
    fireEvent.click(screen.getByText('Download Resume PDF'));
    
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('shows success modal after successful download', async () => {
    const { generateResumePDF, downloadPDF } = require('../../../lib/pdf');
    generateResumePDF.mockResolvedValue({
      success: true,
      blob: new Blob(['test'], { type: 'application/pdf' })
    });

    render(<PDFDownloadWithEmail resumeData={mockResumeData} />);
    
    // Open modal and submit email
    fireEvent.click(screen.getByText('Download PDF'));
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Download Resume PDF'));
    
    await waitFor(() => {
      expect(screen.getByText('Resume Downloaded Successfully!')).toBeInTheDocument();
    });
  });
});

describe('AIInterestButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        message: 'Thank you for your interest!'
      })
    });
  });

  it('renders AI interest button', () => {
    render(<AIInterestButton resumeData={mockResumeData} />);
    
    expect(screen.getByText('Join AI Waitlist')).toBeInTheDocument();
  });

  it('opens AI interest modal when clicked', () => {
    render(<AIInterestButton resumeData={mockResumeData} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Join AI Waitlist/i }));
    
    expect(screen.getByRole('heading', { name: /Join AI Waitlist/i })).toBeInTheDocument();
    expect(screen.getByText('We\'re working on an AI-powered resume enhancement service')).toBeInTheDocument();
  });

  it('submits AI interest email', async () => {
    render(<AIInterestButton resumeData={mockResumeData} />);
    
    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /Join AI Waitlist/i }));
    
    // Enter email
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Submit form - use the submit button inside the form
    const submitButton = screen.getByRole('button', { name: /Join AI Waitlist/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          type: 'ai_interest',
          resumeMetadata: {
            sections: ['basic_info', 'skills'],
            background: 'tech',
            experience: 'experienced'
          }
        })
      });
    });
  });

  it('shows AI success modal after submission', async () => {
    render(<AIInterestButton resumeData={mockResumeData} />);
    
    // Open modal and submit email
    fireEvent.click(screen.getByRole('button', { name: /Join AI Waitlist/i }));
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    const submitButton = screen.getByRole('button', { name: /Join AI Waitlist/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Welcome to the AI Waitlist!')).toBeInTheDocument();
    });
  });
});