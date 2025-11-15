'use client';

import React, { useState } from 'react';
import { ResumeData } from '../../lib/chatbot/types';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmit: (email: string) => Promise<void>;
  resumeData: ResumeData;
  isLoading?: boolean;
  error?: string | null;
  type?: 'download' | 'ai_interest';
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  onEmailSubmit,
  resumeData,
  isLoading = false,
  error = null,
  type = 'download'
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError(null);
    setIsSubmitting(true);

    try {
      await onEmailSubmit(email);
      // Don't close modal here - let parent component handle success flow
    } catch (err) {
      // Error handling is done by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isLoading) {
      setEmail('');
      setEmailError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'download' ? 'Download Your Resume' : 'Join AI Waitlist'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === 'download' ? (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Enter your email address to download your ATS-optimized resume as a PDF.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">What you'll get:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Professional ATS-friendly PDF resume</li>
                  <li>• Optimized formatting for applicant tracking systems</li>
                  <li>• Clean, readable design that passes ATS filters</li>
                  <li>• Instant download - no waiting required</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                We're working on an AI-powered resume enhancement service that will make your resume 10x better. 
                Would you like to be notified when it's ready?
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">AI Enhancement Features:</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• AI-powered content optimization</li>
                  <li>• Industry-specific keyword suggestions</li>
                  <li>• Achievement quantification assistance</li>
                  <li>• Personalized improvement recommendations</li>
                </ul>
              </div>
            </div>
          )}

          {/* Resume Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Resume Summary:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div><span className="font-medium">Name:</span> {resumeData.basicInfo.fullName || 'Not provided'}</div>
              <div><span className="font-medium">Background:</span> {resumeData.metadata.background}</div>
              <div><span className="font-medium">Experience Level:</span> {resumeData.metadata.experience}</div>
              <div><span className="font-medium">Sections Completed:</span> {resumeData.metadata.completedSections.length}</div>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder="your.email@example.com"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  emailError ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting || isLoading}
                required
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* API Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !email.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting || isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {type === 'download' ? 'Generating PDF...' : 'Joining Waitlist...'}
                </>
              ) : (
                <>
                  {type === 'download' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Resume PDF
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Join AI Waitlist
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Privacy Notice:</span> Your email will only be used for the requested service. 
              We don't share your information with third parties and you can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}