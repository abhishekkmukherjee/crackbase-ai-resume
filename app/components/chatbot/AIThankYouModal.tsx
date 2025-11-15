'use client';

import React from 'react';

interface AIThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadResume: () => void;
}

export default function AIThankYouModal({ 
  isOpen, 
  onClose, 
  onDownloadResume 
}: AIThankYouModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-lg text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Thank You!</h2>
          <p className="text-green-100 text-sm mt-1">You're on the AI waitlist</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              We're working on it!
            </h3>
            <p className="text-gray-600 mb-4">
              Thanks for your interest in our AI resume enhancement service. We'll let you know when it's ready.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-blue-900 text-sm">What's Next?</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    You can still download your current ATS-optimized resume. When our AI service launches, we'll email you with early access.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onDownloadResume}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Download Resume
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Keep an eye on your inbox for updates!
          </p>
        </div>
      </div>
    </div>
  );
}