'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/app/lib/chatbot/types';
import { ATSOptimizer, ATSScore } from '@/app/lib/ats/atsOptimizer';

interface ATSOptimizationPanelProps {
  resumeData: ResumeData;
  className?: string;
}

export default function ATSOptimizationPanel({ resumeData, className = '' }: ATSOptimizationPanelProps) {
  const [atsScore, setATSScore] = useState<ATSScore>(() => ATSOptimizer.calculateATSScore(resumeData));
  const [activeSection, setActiveSection] = useState<'score' | 'keywords' | 'structure' | 'suggestions'>('score');

  // Recalculate score when resume data changes
  React.useEffect(() => {
    setATSScore(ATSOptimizer.calculateATSScore(resumeData));
  }, [resumeData]);

  return (
    <div className={`ats-optimization-panel ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">ATS Optimization</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              atsScore.overall >= 80 
                ? 'bg-green-100 text-green-800' 
                : atsScore.overall >= 60 
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {atsScore.overall}% ATS Ready
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { key: 'score', label: 'Score', icon: '📊' },
            { key: 'keywords', label: 'Keywords', icon: '🔍' },
            { key: 'structure', label: 'Structure', icon: '📋' },
            { key: 'suggestions', label: 'Tips', icon: '💡' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === key
                  ? 'bg-white text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {activeSection === 'score' && <ScoreSection atsScore={atsScore} />}
          {activeSection === 'keywords' && <KeywordsSection atsScore={atsScore} />}
          {activeSection === 'structure' && <StructureSection atsScore={atsScore} />}
          {activeSection === 'suggestions' && <SuggestionsSection atsScore={atsScore} />}
        </div>
      </div>
    </div>
  );
}

function ScoreSection({ atsScore }: { atsScore: ATSScore }) {
  return (
    <div className="space-y-4">
      {/* Overall Score Circle */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-2xl font-bold ${
          atsScore.overall >= 80 
            ? 'bg-green-100 text-green-800' 
            : atsScore.overall >= 60 
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {atsScore.overall}%
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {atsScore.overall >= 80 
            ? 'Excellent ATS compatibility' 
            : atsScore.overall >= 60 
            ? 'Good ATS compatibility'
            : 'Needs improvement for ATS'}
        </p>
      </div>

      {/* Factor Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(atsScore.factors).map(([factor, score]) => (
          <div key={factor} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {factor}
              </span>
              <span className={`text-sm font-bold ${
                score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeywordsSection({ atsScore }: { atsScore: ATSScore }) {
  return (
    <div className="space-y-4">
      {/* Keyword Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">
            {atsScore.keywordAnalysis.totalKeywords}
          </div>
          <div className="text-xs text-blue-700">Total Keywords</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">
            {atsScore.keywordAnalysis.actionVerbs.length}
          </div>
          <div className="text-xs text-green-700">Action Verbs</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">
            {atsScore.keywordAnalysis.technicalSkills.length}
          </div>
          <div className="text-xs text-purple-700">Tech Skills</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">
            {atsScore.keywordAnalysis.industryKeywords.length}
          </div>
          <div className="text-xs text-orange-700">Industry Terms</div>
        </div>
      </div>

      {/* Keyword Strength Indicator */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Keyword Strength</span>
          <span className={`text-sm font-bold px-2 py-1 rounded ${
            atsScore.keywordAnalysis.keywordStrength === 'strong' 
              ? 'bg-green-100 text-green-800' 
              : atsScore.keywordAnalysis.keywordStrength === 'moderate'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {atsScore.keywordAnalysis.keywordStrength.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Found Keywords */}
      {atsScore.keywordAnalysis.actionVerbs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Action Verbs Found</h4>
          <div className="flex flex-wrap gap-2">
            {atsScore.keywordAnalysis.actionVerbs.map((verb, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {verb}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {atsScore.keywordAnalysis.technicalSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Technical Skills Found</h4>
          <div className="flex flex-wrap gap-2">
            {atsScore.keywordAnalysis.technicalSkills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Industry Keywords */}
      {atsScore.keywordAnalysis.industryKeywords.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Industry Keywords Found</h4>
          <div className="flex flex-wrap gap-2">
            {atsScore.keywordAnalysis.industryKeywords.map((keyword, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {atsScore.keywordAnalysis.missingKeywords.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Suggested Keywords to Add</h4>
          <div className="flex flex-wrap gap-2">
            {atsScore.keywordAnalysis.missingKeywords.map((keyword, index) => (
              <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs border border-yellow-300">
                + {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keyword Density */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Keyword Density</span>
          <span className={`text-sm font-bold ${
            atsScore.keywordAnalysis.keywordDensity >= 0.02 && atsScore.keywordAnalysis.keywordDensity <= 0.08
              ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {(atsScore.keywordAnalysis.keywordDensity * 100).toFixed(1)}%
          </span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {atsScore.keywordAnalysis.keywordDensity < 0.02 
            ? 'Consider adding more relevant keywords'
            : atsScore.keywordAnalysis.keywordDensity > 0.08
            ? 'Keyword density is high - avoid keyword stuffing'
            : 'Optimal keyword density'}
        </div>
      </div>
    </div>
  );
}

function StructureSection({ atsScore }: { atsScore: ATSScore }) {
  return (
    <div className="space-y-4">
      {/* Section Quality Scores */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Section Quality Analysis</h4>
        <div className="space-y-3">
          {[
            { name: 'Professional Summary', score: atsScore.sectionOptimization.contentQuality.summaryQuality },
            { name: 'Work Experience', score: atsScore.sectionOptimization.contentQuality.experienceQuality },
            { name: 'Skills', score: atsScore.sectionOptimization.contentQuality.skillsQuality },
            { name: 'Education', score: atsScore.sectionOptimization.contentQuality.educationQuality }
          ].map(({ name, score }) => (
            <div key={name} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={`text-sm font-medium w-10 ${
                  score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Order */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Section Order</h4>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700">Current Order</span>
            <span className={`text-sm font-medium ${
              atsScore.sectionOptimization.sectionOrder.score >= 80 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {atsScore.sectionOptimization.sectionOrder.score}% optimal
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {atsScore.sectionOptimization.sectionOrder.currentOrder.join(' → ')}
          </div>
          {atsScore.sectionOptimization.sectionOrder.score < 100 && (
            <div className="mt-2 text-xs text-blue-600">
              Recommended: {atsScore.sectionOptimization.sectionOrder.recommendedOrder.join(' → ')}
            </div>
          )}
        </div>
      </div>

      {/* Formatting Analysis */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Formatting Analysis</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`text-lg font-bold ${
              atsScore.sectionOptimization.formatting.consistency >= 80 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {atsScore.sectionOptimization.formatting.consistency}%
            </div>
            <div className="text-xs text-gray-600">Consistency</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`text-lg font-bold ${
              atsScore.sectionOptimization.formatting.readability >= 80 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {atsScore.sectionOptimization.formatting.readability}%
            </div>
            <div className="text-xs text-gray-600">Readability</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className={`text-lg font-bold ${
              atsScore.sectionOptimization.formatting.atsCompliance >= 80 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {atsScore.sectionOptimization.formatting.atsCompliance}%
            </div>
            <div className="text-xs text-gray-600">ATS Friendly</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionsSection({ atsScore }: { atsScore: ATSScore }) {
  const allSuggestions = [
    ...atsScore.suggestions,
    ...atsScore.keywordAnalysis.recommendations,
    ...atsScore.sectionOptimization.contentQuality.suggestions,
    ...atsScore.sectionOptimization.formatting.suggestions
  ].filter((suggestion, index, array) => array.indexOf(suggestion) === index); // Remove duplicates

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Optimization Recommendations</h4>
        {allSuggestions.length > 0 ? (
          <div className="space-y-3">
            {allSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Great job!</h3>
            <p className="text-sm text-gray-600">Your resume is well-optimized for ATS systems.</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Quick ATS Tips</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• Use standard section headings (Experience, Education, Skills)</li>
          <li>• Include relevant keywords from job descriptions</li>
          <li>• Use simple, clean formatting without complex graphics</li>
          <li>• Quantify achievements with numbers and percentages</li>
          <li>• Save your resume as both PDF and Word formats</li>
        </ul>
      </div>
    </div>
  );
}