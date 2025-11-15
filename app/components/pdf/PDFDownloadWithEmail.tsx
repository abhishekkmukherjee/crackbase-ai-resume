'use client';

import React, { useState } from 'react';
import { ResumeData } from '../../lib/chatbot/types';
import { generateResumePDF, downloadPDF, type PDFGeneratorOptions } from '../../lib/pdf';
import EmailCaptureModal from './EmailCaptureModal';
import DownloadSuccessModal from './DownloadSuccessModal';

interface PDFDownloadWithEmailProps {
  resumeData: ResumeData;
  template?: 'ats-standard' | 'ats-modern' | 'ats-minimal';
  buttonText?: string;
  buttonClassName?: string;
  showATSScore?: boolean;
  onDownloadComplete?: () => void;
}

interface EmailCaptureRequest {
  email: string;
  type: 'download' | 'ai_interest';
  resumeMetadata?: {
    sections: string[];
    background: string;
    experience: string;
  };
}

interface EmailCaptureResponse {
  success: boolean;
  message: string;
  downloadToken?: string;
}

export default function PDFDownloadWithEmail({
  resumeData,
  template = 'ats-standard',
  buttonText = 'Download PDF',
  buttonClassName = '',
  showATSScore = false,
  onDownloadComplete
}: PDFDownloadWithEmailProps) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [capturedEmail, setCapturedEmail] = useState<string>('');
  const [modalType, setModalType] = useState<'download' | 'ai_interest'>('download');

  const defaultButtonClass = "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2";

  const handleDownloadClick = () => {
    setModalType('download');
    setShowEmailModal(true);
    setEmailError(null);
  };

  const handleAIInterestClick = () => {
    setModalType('ai_interest');
    setShowEmailModal(true);
    setEmailError(null);
  };

  const captureEmail = async (email: string): Promise<void> => {
    try {
      const requestData: EmailCaptureRequest = {
        email,
        type: modalType,
        resumeMetadata: {
          sections: resumeData.metadata.completedSections,
          background: resumeData.metadata.background,
          experience: resumeData.metadata.experience
        }
      };

      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result: EmailCaptureResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setCapturedEmail(email);
      setShowEmailModal(false);

      // If this is a download request, generate and download the PDF
      if (modalType === 'download') {
        await generateAndDownloadPDF();
      }

      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to capture email');
      throw error; // Re-throw to let the modal handle the error state
    }
  };

  const generateAndDownloadPDF = async (): Promise<void> => {
    setIsGeneratingPDF(true);
    
    try {
      const pdfOptions: Partial<PDFGeneratorOptions> = {
        template,
        atsOptimized: true,
        includeATSScore: showATSScore
      };

      const result = await generateResumePDF(resumeData, pdfOptions);
      
      if (result.success && result.blob) {
        // Generate filename based on user's name
        const sanitizedName = resumeData.basicInfo.fullName
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        const filename = `${sanitizedName || 'Resume'}_${template}.pdf`;
        
        downloadPDF(result.blob, filename);
        onDownloadComplete?.();
      } else {
        throw new Error(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to generate PDF');
      throw error;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmailError(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCapturedEmail('');
  };

  // Check if resume has minimum required data
  const hasMinimumData = resumeData.basicInfo.fullName && resumeData.basicInfo.email;

  return (
    <>
      {/* Download Button */}
      <button
        onClick={handleDownloadClick}
        disabled={!hasMinimumData || isGeneratingPDF}
        className={buttonClassName || defaultButtonClass}
        title={!hasMinimumData ? 'Please complete basic information first' : 'Download your resume as PDF'}
      >
        {isGeneratingPDF ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {buttonText}
          </>
        )}
      </button>

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={handleCloseEmailModal}
        onEmailSubmit={captureEmail}
        resumeData={resumeData}
        isLoading={isGeneratingPDF}
        error={emailError}
        type={modalType}
      />

      {/* Success Modal */}
      <DownloadSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        type={modalType}
        userEmail={capturedEmail}
      />
    </>
  );
}

// Export a simpler version for AI interest capture
export function AIInterestButton({
  resumeData,
  buttonText = 'Join AI Waitlist',
  buttonClassName = '',
  onInterestCaptured
}: {
  resumeData: ResumeData;
  buttonText?: string;
  buttonClassName?: string;
  onInterestCaptured?: () => void;
}) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [capturedEmail, setCapturedEmail] = useState<string>('');

  const defaultButtonClass = "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2";

  const handleClick = () => {
    setShowEmailModal(true);
    setEmailError(null);
  };

  const captureEmail = async (email: string): Promise<void> => {
    try {
      const requestData: EmailCaptureRequest = {
        email,
        type: 'ai_interest',
        resumeMetadata: {
          sections: resumeData.metadata.completedSections,
          background: resumeData.metadata.background,
          experience: resumeData.metadata.experience
        }
      };

      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result: EmailCaptureResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setCapturedEmail(email);
      setShowEmailModal(false);
      setShowSuccessModal(true);
      onInterestCaptured?.();

    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to capture email');
      throw error;
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={buttonClassName || defaultButtonClass}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {buttonText}
      </button>

      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setEmailError(null);
        }}
        onEmailSubmit={captureEmail}
        resumeData={resumeData}
        error={emailError}
        type="ai_interest"
      />

      <DownloadSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setCapturedEmail('');
        }}
        type="ai_interest"
        userEmail={capturedEmail}
      />
    </>
  );
}