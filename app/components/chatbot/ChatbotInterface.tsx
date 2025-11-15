'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useConversation } from '../../lib/chatbot/useConversation';
import ChatMessage from './ChatMessage';
import InputField from './InputField';
import TipsPanel from './TipsPanel';
import SuggestionsPanel from './SuggestionsPanel';
import HelpTooltip from './HelpTooltip';
import GuidanceModal from './GuidanceModal';
import ResumeChecklist from './ResumeChecklist';
import FAQSection from './FAQSection';
import AIInterestModal from './AIInterestModal';
import AIThankYouModal from './AIThankYouModal';
import ResumePreviewChatbot from '../resume/ResumePreviewChatbot';
import PDFDownloadWithEmail from '../pdf/PDFDownloadWithEmail';

interface ChatbotInterfaceProps {
  className?: string;
  onComplete?: (resumeData: any) => void;
  showProgress?: boolean;
  autoScroll?: boolean;
  showResumePreview?: boolean;
  showPDFDownload?: boolean;
}

export default function ChatbotInterface({ 
  className = '', 
  onComplete,
  showProgress = true,
  autoScroll = true,
  showResumePreview = true,
  showPDFDownload = true
}: ChatbotInterfaceProps) {
  const { state, actions } = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // AI Upsell Modal State
  const [showAIInterestModal, setShowAIInterestModal] = useState(false);
  const [showAIThankYouModal, setShowAIThankYouModal] = useState(false);
  const [aiUpsellCompleted, setAiUpsellCompleted] = useState(false);
  
  // Resume Preview State
  const [selectedTemplate, setSelectedTemplate] = useState<'ats-standard' | 'ats-modern' | 'ats-minimal'>('ats-standard');
  
  // Tips and Suggestions State
  const [showTips, setShowTips] = useState(true);
  const [suggestionInsertHandler, setSuggestionInsertHandler] = useState<((suggestion: string) => void) | null>(null);
  
  // Help and Guidance State
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [guidanceModalType, setGuidanceModalType] = useState<'tips' | 'examples' | 'help'>('help');
  const [showResumeChecklist, setShowResumeChecklist] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, autoScroll]);

  // Handle completion
  useEffect(() => {
    if (state.isComplete && onComplete) {
      onComplete(state.resumeData);
    }
  }, [state.isComplete, state.resumeData, onComplete]);

  // Handle AI upsell section detection
  useEffect(() => {
    if (aiUpsellCompleted) return;

    const messages = state.messages;
    if (messages.length < 2) return;

    // Look for the AI interest question (bot message) followed by user response
    for (let i = messages.length - 2; i >= 0; i--) {
      const botMessage = messages[i];
      const userMessage = messages[i + 1];

      // Check if we have the AI interest question followed by user response
      if (botMessage?.type === 'bot' && 
          botMessage?.metadata?.section === 'ai_upsell' &&
          botMessage?.metadata?.questionId === 'ai_interest' &&
          userMessage?.type === 'user') {
        
        const userResponse = userMessage.content.toLowerCase();
        
        if (userResponse.includes('yes') || userResponse.includes('interested')) {
          // User is interested in AI service
          setShowAIInterestModal(true);
        } else {
          // User is not interested, show thank you and proceed
          setShowAIThankYouModal(true);
        }
        
        setAiUpsellCompleted(true);
        break;
      }
    }
  }, [state.messages, aiUpsellCompleted]);

  const progress = actions.getProgress();
  const currentMessage = state.messages[state.messages.length - 1];
  const isWaitingForInput = currentMessage?.type === 'bot' && !state.isComplete;

  // AI Modal Handlers
  const handleAIInterestSubmit = async (email: string) => {
    try {
      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'ai_interest',
          resumeMetadata: {
            sections: progress.current ? [state.flow?.currentSection || 'ai_upsell'] : [],
            background: state.userProfile?.background || 'tech',
            experience: state.userProfile?.experience || 'fresher',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to capture email');
      }

      // Close AI interest modal and show thank you modal
      setShowAIInterestModal(false);
      setShowAIThankYouModal(true);
    } catch (error) {
      console.error('Error capturing AI interest email:', error);
      throw error; // Re-throw to let the modal handle the error display
    }
  };

  const handleAIModalClose = () => {
    setShowAIInterestModal(false);
    setShowAIThankYouModal(false);
    
    // Continue with the conversation flow
    if (!state.isComplete) {
      actions.sendMessage('no'); // Simulate "no" response to continue
    }
  };

  const handleDownloadResume = () => {
    setShowAIThankYouModal(false);
    
    // Trigger completion if not already complete
    if (onComplete && state.resumeData) {
      onComplete(state.resumeData);
    }
  };

  const handleTemplateChange = (template: 'ats-standard' | 'ats-modern' | 'ats-minimal') => {
    setSelectedTemplate(template);
  };

  const handlePDFDownloadComplete = () => {
    // Optional: Add any post-download logic here
    console.log('PDF download completed');
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestionInsertHandler) {
      suggestionInsertHandler(suggestion);
    }
  };

  const handleSuggestionInsertSetup = (handler: (suggestion: string) => void) => {
    setSuggestionInsertHandler(() => handler);
  };

  const openGuidanceModal = (type: 'tips' | 'examples' | 'help') => {
    setGuidanceModalType(type);
    setShowGuidanceModal(true);
  };

  const handleChecklistImprovement = (section: string, improvement: string) => {
    // Could navigate to specific section or show targeted help
    console.log('Improvement needed:', section, improvement);
    // For now, just show tips modal
    openGuidanceModal('tips');
  };

  return (
    <div className={`chatbot-interface flex flex-col h-full bg-white ${className}`}>
      {/* Header with Progress */}
      {showProgress && (
        <div className="chatbot-header bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">ATS Resume Builder</h2>
            <div className="flex items-center space-x-3">
              {/* Help Buttons */}
              <div className="flex items-center space-x-1">
                <HelpTooltip content="Get help and guidance for the current question" position="bottom">
                  <button
                    onClick={() => openGuidanceModal('help')}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </HelpTooltip>
                
                <HelpTooltip content="View examples and templates" position="bottom">
                  <button
                    onClick={() => openGuidanceModal('examples')}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </HelpTooltip>

                {state.isComplete && (
                  <HelpTooltip content="Check your resume completeness" position="bottom">
                    <button
                      onClick={() => setShowResumeChecklist(!showResumeChecklist)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </button>
                  </HelpTooltip>
                )}

                <HelpTooltip content="Frequently asked questions" position="bottom">
                  <button
                    onClick={() => setShowFAQ(!showFAQ)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </HelpTooltip>
              </div>
              
              <div className="text-sm opacity-90">
                {progress.current} of {progress.total}
              </div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}      
{/* Messages Container */}
      <div className="messages-container flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {state.messages.length === 0 && (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-600">Starting your resume conversation...</p>
            </div>
          </div>
        )}

        {state.messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLatest={index === state.messages.length - 1}
          />
        ))}

        {/* Typing Indicator */}
        {state.isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Tips and Suggestions */}
      {!state.isComplete && isWaitingForInput && !showAIInterestModal && !showAIThankYouModal && (
        <div className="input-area bg-white border-t border-gray-200">
          {/* Tips and Suggestions Section */}
          {showTips && state.currentQuestion && state.userProfile && (
            <div className="border-b border-gray-100 p-4 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Tips Panel */}
                <TipsPanel
                  question={state.currentQuestion}
                  userProfile={state.userProfile}
                  maxTips={2}
                  className="bg-white rounded-lg shadow-sm"
                />
                
                {/* Suggestions Panel */}
                <SuggestionsPanel
                  question={state.currentQuestion}
                  userProfile={state.userProfile}
                  onSuggestionClick={handleSuggestionClick}
                  className="bg-white rounded-lg shadow-sm"
                />
              </div>
              
              {/* Toggle Tips Button */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => setShowTips(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <span>Hide tips</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Show Tips Button (when hidden) */}
          {!showTips && state.currentQuestion && state.userProfile && (
            <div className="border-b border-gray-100 p-2 bg-gray-50 text-center">
              <button
                onClick={() => setShowTips(true)}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1 mx-auto"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>Show tips & suggestions</span>
              </button>
            </div>
          )}
          
          {/* Input Field */}
          <div className="p-4">
            <InputField
              message={currentMessage}
              onSend={actions.sendMessage}
              onSkip={actions.skipQuestion}
              disabled={state.isLoading}
              onSuggestionInsert={handleSuggestionInsertSetup}
            />
          </div>
        </div>
      )}

      {/* Completion State with Resume Preview and PDF Download */}
      {state.isComplete && !showAIInterestModal && !showAIThankYouModal && (
        <div className="completion-area bg-white border-t border-gray-200">
          {/* Completion Header */}
          <div className="bg-green-50 border-b border-green-200 p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-1">Resume Complete!</h3>
            <p className="text-green-700 text-sm">
              Your ATS-optimized resume is ready for preview and download.
            </p>
          </div>

          {/* Resume Preview Section */}
          {showResumePreview && state.resumeData && (
            <div className="p-4">
              <ResumePreviewChatbot
                resumeData={state.resumeData}
                template={selectedTemplate}
                showATSScore={true}
                showPDFDownload={false} // We'll show the PDF download separately
                className="mb-4"
                onTemplateChange={handleTemplateChange}
              />
            </div>
          )}

          {/* PDF Download Section */}
          {showPDFDownload && state.resumeData && (
            <div className="bg-gray-50 border-t border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold text-gray-800 mb-1">Ready to Download?</h4>
                  <p className="text-sm text-gray-600">
                    Get your professional resume as a PDF file
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <PDFDownloadWithEmail
                    resumeData={state.resumeData}
                    template={selectedTemplate}
                    buttonText="Download Resume PDF"
                    buttonClassName="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                    showATSScore={true}
                    onDownloadComplete={handlePDFDownloadComplete}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Fallback for when resume preview/download are disabled */}
          {(!showResumePreview && !showPDFDownload) && (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                Your resume data is ready!
              </p>
              {onComplete && (
                <button
                  onClick={() => onComplete(state.resumeData)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* AI Interest Modal */}
      <AIInterestModal
        isOpen={showAIInterestModal}
        onClose={handleAIModalClose}
        onSubmit={handleAIInterestSubmit}
        userEmail={state.resumeData?.basicInfo?.email || ''}
      />

      {/* AI Thank You Modal */}
      <AIThankYouModal
        isOpen={showAIThankYouModal}
        onClose={handleAIModalClose}
        onDownloadResume={handleDownloadResume}
      />

      {/* Guidance Modal */}
      <GuidanceModal
        isOpen={showGuidanceModal}
        onClose={() => setShowGuidanceModal(false)}
        question={state.currentQuestion || undefined}
        userProfile={state.userProfile || undefined}
        type={guidanceModalType}
      />

      {/* Resume Checklist Overlay */}
      {showResumeChecklist && state.resumeData && state.userProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Resume Checklist</h3>
              <button
                onClick={() => setShowResumeChecklist(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <ResumeChecklist
                resumeData={state.resumeData}
                userProfile={state.userProfile}
                onImprovementClick={handleChecklistImprovement}
              />
            </div>
          </div>
        </div>
      )}

      {/* FAQ Overlay */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Help & FAQ</h3>
              <button
                onClick={() => setShowFAQ(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <FAQSection searchable={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}