'use client';

import React, { useState } from 'react';
import { tipsEngine } from '../../lib/chatbot/tipsEngine';
import { Question } from '../../lib/chatbot/questionEngine';
import { UserProfile } from '../../lib/chatbot/types';

interface SuggestionsPanelProps {
  question?: Question;
  userProfile: UserProfile;
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
}

function SuggestionChip({ text, onClick, variant = 'secondary' }: SuggestionChipProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200';
      case 'accent':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${getVariantClasses()}`}
    >
      {text}
      <span className="ml-1 opacity-60">+</span>
    </button>
  );
}

export default function SuggestionsPanel({ 
  question, 
  userProfile, 
  onSuggestionClick,
  className = '' 
}: SuggestionsPanelProps) {
  const [activeTab, setActiveTab] = useState<'examples' | 'verbs' | 'skills'>('examples');

  if (!question) return null;

  // Get suggestions based on question type and field
  const getExampleSuggestions = (): string[] => {
    return tipsEngine.getExampleSuggestions(question.id, userProfile);
  };

  const getActionVerbSuggestions = (): string[] => {
    // Show action verbs for achievement/experience fields
    if (question.field === 'achievements' || question.section === 'experience') {
      return tipsEngine.getActionVerbSuggestions().slice(0, 12);
    }
    return [];
  };

  const getSkillSuggestions = (): string[] => {
    // Show skill suggestions for skill-related fields
    if (question.section === 'skills' || question.field.includes('skill') || question.field === 'techStack' || question.field === 'businessTools') {
      const suggestions = tipsEngine.getSkillSuggestions(userProfile);
      return suggestions.flatMap(s => s.skills).slice(0, 15);
    }
    return [];
  };

  const getAchievementSuggestions = (): string[] => {
    // Show achievement templates for experience/achievement fields
    if (question.field === 'achievements' || question.section === 'experience') {
      return tipsEngine.generateAchievementSuggestions(userProfile);
    }
    return [];
  };

  const examples = getExampleSuggestions();
  const actionVerbs = getActionVerbSuggestions();
  const skills = getSkillSuggestions();
  const achievements = getAchievementSuggestions();

  // Determine which tabs to show
  const availableTabs: Array<{ id: string; label: string; count: number }> = [];
  if (examples.length > 0 || achievements.length > 0) {
    availableTabs.push({ id: 'examples', label: 'Examples', count: examples.length + achievements.length });
  }
  if (actionVerbs.length > 0) {
    availableTabs.push({ id: 'verbs', label: 'Action Verbs', count: actionVerbs.length });
  }
  if (skills.length > 0) {
    availableTabs.push({ id: 'skills', label: 'Skills', count: skills.length });
  }

  // Don't render if no suggestions available
  if (availableTabs.length === 0) return null;

  // Set default active tab to first available
  React.useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(tab => tab.id === activeTab)) {
      setActiveTab(availableTabs[0].id as any);
    }
  }, [availableTabs, activeTab]);

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className={`suggestions-panel bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-lg">✨</span>
        <h3 className="font-semibold text-gray-800 text-sm">Suggestions</h3>
      </div>

      {/* Tabs */}
      {availableTabs.length > 1 && (
        <div className="flex space-x-1 mb-3 bg-gray-100 rounded-lg p-1">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-1 text-xs opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Examples Tab */}
        {activeTab === 'examples' && (
          <div className="space-y-3">
            {examples.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  Examples
                </h4>
                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded border text-xs cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSuggestionClick(example)}
                    >
                      <div className="flex items-start justify-between">
                        <span className="flex-1">{example}</span>
                        <span className="text-blue-600 ml-2 opacity-60 hover:opacity-100">+</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {achievements.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  Achievement Templates
                </h4>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="p-2 bg-blue-50 rounded border border-blue-200 text-xs cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleSuggestionClick(achievement)}
                    >
                      <div className="flex items-start justify-between">
                        <span className="flex-1 text-blue-800">{achievement}</span>
                        <span className="text-blue-600 ml-2 opacity-60 hover:opacity-100">+</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Verbs Tab */}
        {activeTab === 'verbs' && actionVerbs.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Strong Action Verbs
            </h4>
            <div className="flex flex-wrap gap-2">
              {actionVerbs.map((verb, index) => (
                <SuggestionChip
                  key={index}
                  text={verb}
                  onClick={() => handleSuggestionClick(verb)}
                  variant="accent"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Start your achievements with these powerful action verbs
            </p>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && skills.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Relevant Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <SuggestionChip
                  key={index}
                  text={skill}
                  onClick={() => handleSuggestionClick(skill)}
                  variant="primary"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Popular skills in your field - click to add
            </p>
          </div>
        )}
      </div>

      {/* Footer tip */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center">
          <span className="mr-1">💡</span>
          Click any suggestion to add it to your response
        </p>
      </div>
    </div>
  );
}