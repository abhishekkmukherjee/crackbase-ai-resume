'use client';

import React, { useState } from 'react';
import { Tip, tipsEngine } from '../../lib/chatbot/tipsEngine';
import { Question } from '../../lib/chatbot/questionEngine';
import { UserProfile } from '../../lib/chatbot/types';

interface TipsPanelProps {
  question?: Question;
  userProfile: UserProfile;
  className?: string;
  showAllTips?: boolean;
  maxTips?: number;
}

interface TipCardProps {
  tip: Tip;
  isExpanded: boolean;
  onToggle: () => void;
}

function TipCard({ tip, isExpanded, onToggle }: TipCardProps) {
  const getTypeColor = (type: Tip['type']) => {
    switch (type) {
      case 'ats':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'best_practice':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'contextual':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'example':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeLabel = (type: Tip['type']) => {
    switch (type) {
      case 'ats':
        return 'ATS Tip';
      case 'best_practice':
        return 'Best Practice';
      case 'contextual':
        return 'Contextual';
      case 'example':
        return 'Example';
      default:
        return 'Tip';
    }
  };

  const getPriorityIcon = (priority: Tip['priority']) => {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '💡';
      case 'low':
        return 'ℹ️';
      default:
        return '💡';
    }
  };

  return (
    <div className={`border rounded-lg p-3 transition-all duration-200 ${getTypeColor(tip.type)} hover:shadow-sm`}>
      <div 
        className="flex items-start justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start space-x-2 flex-1">
          <span className="text-lg flex-shrink-0 mt-0.5">
            {tip.icon || getPriorityIcon(tip.priority)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-sm truncate">{tip.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 flex-shrink-0">
                {getTypeLabel(tip.type)}
              </span>
            </div>
            {isExpanded && (
              <p className="text-sm opacity-90 leading-relaxed">{tip.content}</p>
            )}
          </div>
        </div>
        <button className="flex-shrink-0 ml-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
          {isExpanded ? '−' : '+'}
        </button>
      </div>
    </div>
  );
}

export default function TipsPanel({ 
  question, 
  userProfile, 
  className = '', 
  showAllTips = false,
  maxTips = 3
}: TipsPanelProps) {
  const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());
  const [showMore, setShowMore] = useState(false);

  // Get contextual tips based on current question
  const contextualTips = question 
    ? tipsEngine.getContextualTips(question, userProfile)
    : [];

  // Get general high-priority tips if no contextual tips or showAllTips is true
  const generalTips = showAllTips || contextualTips.length === 0
    ? tipsEngine.getHighPriorityTips().slice(0, 3)
    : [];

  // Combine and deduplicate tips
  const allTips = [...contextualTips, ...generalTips].reduce((unique, tip) => {
    if (!unique.find(t => t.id === tip.id)) {
      unique.push(tip);
    }
    return unique;
  }, [] as Tip[]);

  // Limit tips if not showing all
  const displayTips = showMore ? allTips : allTips.slice(0, maxTips);
  const hasMoreTips = allTips.length > maxTips;

  const toggleTip = (tipId: string) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded.has(tipId)) {
      newExpanded.delete(tipId);
    } else {
      newExpanded.add(tipId);
    }
    setExpandedTips(newExpanded);
  };

  if (allTips.length === 0) {
    return null;
  }

  return (
    <div className={`tips-panel ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">💡</span>
          <h3 className="font-semibold text-gray-800 text-sm">
            {question ? 'Tips for this question' : 'Helpful Tips'}
          </h3>
        </div>
        {hasMoreTips && !showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Show more
          </button>
        )}
      </div>

      <div className="space-y-2">
        {displayTips.map((tip) => (
          <TipCard
            key={tip.id}
            tip={tip}
            isExpanded={expandedTips.has(tip.id)}
            onToggle={() => toggleTip(tip.id)}
          />
        ))}
      </div>

      {showMore && hasMoreTips && (
        <button
          onClick={() => setShowMore(false)}
          className="text-xs text-gray-600 hover:text-gray-700 font-medium mt-2 w-full text-center"
        >
          Show less
        </button>
      )}
    </div>
  );
}