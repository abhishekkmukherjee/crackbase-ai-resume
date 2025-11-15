'use client';

import React from 'react';
import { Question } from '../../lib/chatbot/questionEngine';
import { UserProfile } from '../../lib/chatbot/types';
import { tipsEngine } from '../../lib/chatbot/tipsEngine';

interface GuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question;
  userProfile?: UserProfile;
  type?: 'tips' | 'examples' | 'help';
}

interface ExampleSectionProps {
  title: string;
  examples: string[];
  onExampleClick?: (example: string) => void;
}

function ExampleSection({ title, examples, onExampleClick }: ExampleSectionProps) {
  if (examples.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-2">
          💡
        </span>
        {title}
      </h4>
      <div className="space-y-2">
        {examples.map((example, index) => (
          <div
            key={index}
            className={`p-3 bg-gray-50 rounded-lg border text-sm ${
              onExampleClick ? 'cursor-pointer hover:bg-gray-100 hover:border-blue-200' : ''
            }`}
            onClick={() => onExampleClick?.(example)}
          >
            <div className="flex items-start justify-between">
              <span className="flex-1">{example}</span>
              {onExampleClick && (
                <span className="text-blue-600 ml-2 opacity-60 hover:opacity-100 text-xs">
                  Use this
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GuidanceModal({ 
  isOpen, 
  onClose, 
  question, 
  userProfile,
  type = 'help'
}: GuidanceModalProps) {
  if (!isOpen) return null;

  const handleExampleClick = (example: string) => {
    // Copy to clipboard
    navigator.clipboard.writeText(example).then(() => {
      // Could show a toast notification here
      console.log('Example copied to clipboard');
    });
  };

  const renderTipsContent = () => {
    if (!question || !userProfile) return null;

    const contextualTips = tipsEngine.getContextualTips(question, userProfile);
    const atsOptimizationTips = tipsEngine.getATSOptimizationTips().slice(0, 3);
    const bestPracticeTips = tipsEngine.getBestPracticeTips().slice(0, 3);

    return (
      <div className="space-y-6">
        {contextualTips.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm mr-2">
                🎯
              </span>
              Tips for This Question
            </h4>
            <div className="space-y-3">
              {contextualTips.map((tip) => (
                <div key={tip.id} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg flex-shrink-0">{tip.icon || '💡'}</span>
                    <div>
                      <h5 className="font-medium text-purple-800 text-sm mb-1">{tip.title}</h5>
                      <p className="text-purple-700 text-sm">{tip.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-2">
              🤖
            </span>
            ATS Optimization Tips
          </h4>
          <div className="space-y-3">
            {atsOptimizationTips.map((tip) => (
              <div key={tip.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <span className="text-lg flex-shrink-0">{tip.icon || '🔍'}</span>
                  <div>
                    <h5 className="font-medium text-blue-800 text-sm mb-1">{tip.title}</h5>
                    <p className="text-blue-700 text-sm">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm mr-2">
              ✨
            </span>
            Best Practices
          </h4>
          <div className="space-y-3">
            {bestPracticeTips.map((tip) => (
              <div key={tip.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <span className="text-lg flex-shrink-0">{tip.icon || '⭐'}</span>
                  <div>
                    <h5 className="font-medium text-green-800 text-sm mb-1">{tip.title}</h5>
                    <p className="text-green-700 text-sm">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExamplesContent = () => {
    if (!question || !userProfile) return null;

    const examples = tipsEngine.getExampleSuggestions(question.id, userProfile);
    const achievements = question.field === 'achievements' || question.section === 'experience' 
      ? tipsEngine.generateAchievementSuggestions(userProfile)
      : [];
    const actionVerbs = question.field === 'achievements' || question.section === 'experience'
      ? tipsEngine.getActionVerbSuggestions().slice(0, 10)
      : [];

    return (
      <div className="space-y-6">
        <ExampleSection
          title="Example Responses"
          examples={examples}
          onExampleClick={handleExampleClick}
        />
        
        <ExampleSection
          title="Achievement Templates"
          examples={achievements}
          onExampleClick={handleExampleClick}
        />
        
        {actionVerbs.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm mr-2">
                ⚡
              </span>
              Action Verbs
            </h4>
            <div className="flex flex-wrap gap-2">
              {actionVerbs.map((verb, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(verb)}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm hover:bg-orange-200 transition-colors"
                >
                  {verb}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHelpContent = () => {
    if (!question) return null;

    const helpContent = {
      classification: {
        title: 'Getting Started',
        content: 'These questions help us customize your resume building experience. Choose the options that best describe your background and experience level.',
        tips: [
          'Tech background includes software development, engineering, IT, and related fields',
          'Non-tech includes business, marketing, finance, healthcare, education, and other fields',
          'Fresher typically means less than 1 year of professional experience',
          'Experienced means 1+ years of full-time work experience'
        ]
      },
      basic_info: {
        title: 'Personal Information',
        content: 'This section covers your contact information and professional summary. This information appears at the top of your resume.',
        tips: [
          'Use a professional email address (firstname.lastname@email.com)',
          'Include your phone number with country code if applying internationally',
          'Location can be city and state/country (you can be general for privacy)',
          'Professional headline should be concise and impactful',
          'Summary should be 2-3 sentences highlighting your value proposition'
        ]
      },
      education: {
        title: 'Education Details',
        content: 'Include your educational background, starting with the highest or most recent degree.',
        tips: [
          'Include degree type and field of study',
          'Institution name should be the official name',
          'Include graduation year (or expected graduation)',
          'Include GPA if 3.5+ or equivalent percentage above 70%',
          'Mention relevant coursework, honors, or specializations'
        ]
      },
      experience: {
        title: 'Work Experience',
        content: 'Detail your professional work experience, focusing on achievements and impact.',
        tips: [
          'Start with your most recent position',
          'Use action verbs to begin each bullet point',
          'Quantify achievements with numbers, percentages, or metrics',
          'Focus on results and impact, not just responsibilities',
          'Include relevant tools and technologies used'
        ]
      },
      projects: {
        title: 'Projects',
        content: 'Showcase your personal, academic, or professional projects that demonstrate your skills.',
        tips: [
          'Choose projects that are relevant to your target role',
          'Explain what problem the project solved',
          'Include technologies or tools used',
          'Provide links to live demos or code repositories',
          'Mention your specific role if it was a team project'
        ]
      },
      skills: {
        title: 'Skills',
        content: 'List your technical and professional skills, prioritizing those most relevant to your target roles.',
        tips: [
          'Organize skills by category (e.g., Programming Languages, Tools, Soft Skills)',
          'List most relevant skills first',
          'Include both technical and soft skills',
          'Match skills to job descriptions you\'re targeting',
          'Be honest about your skill level'
        ]
      },
      achievements: {
        title: 'Achievements & Activities',
        content: 'Highlight certifications, awards, and extracurricular activities that add value to your profile.',
        tips: [
          'Include relevant certifications with issuing organization',
          'Mention awards, honors, or recognition received',
          'Include leadership roles or volunteer work',
          'Focus on achievements that demonstrate skills or character',
          'Keep it relevant to your career goals'
        ]
      },
      social_links: {
        title: 'Professional Links',
        content: 'Provide links to your professional online presence.',
        tips: [
          'LinkedIn profile should be complete and professional',
          'GitHub should showcase your best code (for tech roles)',
          'Personal website/portfolio should be professional and up-to-date',
          'Ensure all links are working and lead to professional content',
          'Use custom URLs when possible (linkedin.com/in/yourname)'
        ]
      }
    };

    const sectionHelp = helpContent[question.section as keyof typeof helpContent];
    
    if (!sectionHelp) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">❓</span>
          </div>
          <p className="text-gray-600">Help information for this section is not available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">{sectionHelp.title}</h4>
          <p className="text-gray-600 mb-4">{sectionHelp.content}</p>
        </div>

        <div>
          <h5 className="font-medium text-gray-800 mb-3">Tips for this section:</h5>
          <ul className="space-y-2">
            {sectionHelp.tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-gray-600">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {question.helpText && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 text-sm mb-1">Question-specific help:</h5>
            <p className="text-blue-700 text-sm">{question.helpText}</p>
          </div>
        )}
      </div>
    );
  };

  const getModalTitle = () => {
    switch (type) {
      case 'tips':
        return 'Tips & Guidance';
      case 'examples':
        return 'Examples & Templates';
      case 'help':
        return 'Help & Information';
      default:
        return 'Help';
    }
  };

  const getModalIcon = () => {
    switch (type) {
      case 'tips':
        return '💡';
      case 'examples':
        return '📝';
      case 'help':
        return '❓';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getModalIcon()}</span>
            <h3 className="text-lg font-semibold text-gray-900">{getModalTitle()}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {type === 'tips' && renderTipsContent()}
          {type === 'examples' && renderExamplesContent()}
          {type === 'help' && renderHelpContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {type === 'examples' ? 'Click any example to copy it to your clipboard' : 'Use these tips to improve your resume'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}