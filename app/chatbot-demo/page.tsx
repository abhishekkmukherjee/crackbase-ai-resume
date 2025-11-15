'use client';

import { useState } from 'react';
import ChatbotInterface from '../components/chatbot/ChatbotInterface';
import { ChatbotProvider } from '../lib/chatbot/ChatbotContext';

export default function ChatbotDemo() {
  const [resumeData, setResumeData] = useState<any>(null);

  const handleChatbotComplete = (data: any) => {
    setResumeData(data);
    console.log('Resume completed:', data);
  };

  return (
    <ChatbotProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ATS Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build a professional, ATS-optimized resume through our intelligent chatbot conversation
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Integrated Chatbot Interface with Resume Preview and PDF Download */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ minHeight: '600px' }}>
            <ChatbotInterface
              onComplete={handleChatbotComplete}
              showProgress={true}
              autoScroll={true}
              showResumePreview={true}
              showPDFDownload={true}
              className="h-full"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Conversation</h3>
            <p className="text-gray-600">
              Our AI chatbot adapts questions based on your background and experience level
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ATS Optimized</h3>
            <p className="text-gray-600">
              Built specifically to pass Applicant Tracking Systems used by employers
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick & Easy</h3>
            <p className="text-gray-600">
              Complete your professional resume in just 5-10 minutes through conversation
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Try the Full Experience
            </h3>
            <p className="text-gray-600 mb-4">
              This is a fully functional demo of our ATS Resume Builder. Start the conversation above to build your own professional resume!
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Adaptive Questions</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Real-time Preview</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">✓ Progress Tracking</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">✓ ATS Optimization</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </ChatbotProvider>
  );
}