'use client';

import React, { useState } from 'react';
import { generateResumePDF, downloadPDF, type PDFGeneratorOptions } from '../../lib/pdf';
import { ResumeData } from '../../lib/chatbot/types';
import PDFDownloadWithEmail from './PDFDownloadWithEmail';

interface PDFPreviewProps {
  resumeData: ResumeData;
  className?: string;
  useEmailCapture?: boolean;
}

export default function PDFPreview({ resumeData, className = '', useEmailCapture = true }: PDFPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<any>(null);

  const handleGeneratePDF = async (options?: Partial<PDFGeneratorOptions>) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateResumePDF(resumeData, {
        includeATSScore: true,
        ...options
      });
      
      if (result.success && result.blob) {
        // Generate filename based on user's name
        const filename = `${resumeData.basicInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        downloadPDF(result.blob, filename);
        
        if (result.atsScore) {
          setAtsScore(result.atsScore);
        }
      } else {
        setError(result.error || 'Failed to generate PDF');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Download Resume</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {atsScore && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">ATS Compatibility Score</h4>
          <div className="flex items-center mb-2">
            <div className="text-2xl font-bold text-blue-700">{atsScore.overall}%</div>
            <div className="ml-4 text-sm text-blue-600">
              <div>Formatting: {atsScore.factors.formatting}%</div>
              <div>Keywords: {atsScore.factors.keywords}%</div>
              <div>Structure: {atsScore.factors.structure}%</div>
              <div>Readability: {atsScore.factors.readability}%</div>
            </div>
          </div>
          {atsScore.suggestions.length > 0 && (
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Suggestions:</h5>
              <ul className="text-sm text-blue-700 list-disc list-inside">
                {atsScore.suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium mb-2">Choose Template:</h4>
          {useEmailCapture ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <PDFDownloadWithEmail
                resumeData={resumeData}
                template="ats-standard"
                buttonText="Standard"
                buttonClassName="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                showATSScore={true}
                onDownloadComplete={() => console.log('Standard template downloaded')}
              />
              <PDFDownloadWithEmail
                resumeData={resumeData}
                template="ats-modern"
                buttonText="Modern"
                buttonClassName="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                showATSScore={true}
                onDownloadComplete={() => console.log('Modern template downloaded')}
              />
              <PDFDownloadWithEmail
                resumeData={resumeData}
                template="ats-minimal"
                buttonText="Minimal"
                buttonClassName="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                showATSScore={true}
                onDownloadComplete={() => console.log('Minimal template downloaded')}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleGeneratePDF({ template: 'ats-standard' })}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isGenerating ? 'Generating...' : 'Standard'}
              </button>
              <button
                onClick={() => handleGeneratePDF({ template: 'ats-modern' })}
                disabled={isGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isGenerating ? 'Generating...' : 'Modern'}
              </button>
              <button
                onClick={() => handleGeneratePDF({ template: 'ats-minimal' })}
                disabled={isGenerating}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isGenerating ? 'Generating...' : 'Minimal'}
              </button>
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          All templates are optimized for ATS (Applicant Tracking System) compatibility
        </div>
      </div>
    </div>
  );
}