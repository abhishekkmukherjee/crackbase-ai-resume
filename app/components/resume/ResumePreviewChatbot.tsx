'use client';

import React, { useState, useMemo } from 'react';
import { ResumeData } from '@/app/lib/chatbot/types';
import { ATSOptimizer, ATSScore } from '@/app/lib/ats/atsOptimizer';
import { generateResumePDF, downloadPDF, PDFDownloadWithEmail } from '@/app/lib/pdf';



interface ResumePreviewChatbotProps {
  resumeData: ResumeData;
  template?: 'ats-standard' | 'ats-modern' | 'ats-minimal';
  showATSScore?: boolean;
  showPDFDownload?: boolean;
  className?: string;
  onTemplateChange?: (template: 'ats-standard' | 'ats-modern' | 'ats-minimal') => void;
  onPDFGenerate?: () => void;
}

export default function ResumePreviewChatbot({ 
  resumeData, 
  template = 'ats-standard',
  showATSScore = false,
  showPDFDownload = false,
  className = '',
  onTemplateChange,
  onPDFGenerate
}: ResumePreviewChatbotProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const [showATSDetails, setShowATSDetails] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Calculate ATS score based on resume data
  const atsScore = useMemo(() => ATSOptimizer.calculateATSScore(resumeData), [resumeData]);

  const hasBasicInfo = resumeData.basicInfo.fullName || resumeData.basicInfo.email;

  const handleTemplateChange = (newTemplate: 'ats-standard' | 'ats-modern' | 'ats-minimal') => {
    setSelectedTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    setPdfError(null);
    
    try {
      const result = await generateResumePDF(resumeData, {
        template: selectedTemplate,
        atsOptimized: true,
        includeATSScore: showATSScore
      });
      
      if (result.success && result.blob) {
        // Generate filename based on user's name
        const filename = `${resumeData.basicInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        downloadPDF(result.blob, filename);
        onPDFGenerate?.();
      } else {
        setPdfError(result.error || 'Failed to generate PDF');
      }
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!hasBasicInfo) {
    return (
      <div className={`resume-preview-chatbot ${className}`}>
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Resume Preview
          </h3>
          <p className="text-gray-500">
            Live resume preview will appear here as you build your resume
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`resume-preview-chatbot ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header with template selector and ATS score */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium text-gray-700">Resume Preview</h3>
              
              {/* Template Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Template:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value as any)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ats-standard">Standard</option>
                  <option value="ats-modern">Modern</option>
                  <option value="ats-minimal">Minimal</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* ATS Score Display */}
              {showATSScore && (
                <button
                  onClick={() => setShowATSDetails(!showATSDetails)}
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    atsScore.overall >= 80 
                      ? 'text-green-700 bg-green-100' 
                      : atsScore.overall >= 60 
                      ? 'text-yellow-700 bg-yellow-100'
                      : 'text-red-700 bg-red-100'
                  } hover:opacity-80 transition-opacity`}
                >
                  ATS Score: {atsScore.overall}%
                </button>
              )}

              {/* PDF Download Button */}
              {showPDFDownload && (
                <PDFDownloadWithEmail
                  resumeData={resumeData}
                  template={selectedTemplate}
                  buttonText="Download PDF"
                  buttonClassName="text-xs font-medium px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  showATSScore={showATSScore}
                  onDownloadComplete={() => {
                    onPDFGenerate?.();
                    setPdfError(null);
                  }}
                />
              )}
            </div>
          </div>

          {/* PDF Error Display */}
          {pdfError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-xs">{pdfError}</p>
            </div>
          )}

          {/* ATS Score Details */}
          {showATSScore && showATSDetails && (
            <ATSScoreDetails atsScore={atsScore} />
          )}
        </div>

        {/* Resume Content */}
        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
          <div className="min-w-0"> {/* Ensures content doesn't overflow on mobile */}
            <ResumeContent resumeData={resumeData} template={selectedTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResumeContentProps {
  resumeData: ResumeData;
  template: 'ats-standard' | 'ats-modern' | 'ats-minimal';
}

function ResumeContent({ resumeData, template }: ResumeContentProps) {
  const templateStyles = getTemplateStyles(template);

  return (
    <div className={`resume-content ${templateStyles.container}`}>
      {/* Header Section */}
      <ResumeHeader resumeData={resumeData} styles={templateStyles} />
      
      {/* Summary Section */}
      {resumeData.basicInfo.summary && (
        <ResumeSection title="Professional Summary" styles={templateStyles}>
          <p className={templateStyles.text}>{resumeData.basicInfo.summary}</p>
        </ResumeSection>
      )}

      {/* Experience Section */}
      {resumeData.experience.length > 0 && (
        <ResumeSection title="Work Experience" styles={templateStyles}>
          {resumeData.experience.map((exp, index) => (
            <ExperienceItem key={index} experience={exp} styles={templateStyles} />
          ))}
        </ResumeSection>
      )}

      {/* Projects Section */}
      {resumeData.projects.length > 0 && (
        <ResumeSection title="Projects" styles={templateStyles}>
          {resumeData.projects.map((project, index) => (
            <ProjectItem key={index} project={project} styles={templateStyles} />
          ))}
        </ResumeSection>
      )}

      {/* Education Section */}
      {resumeData.education.length > 0 && (
        <ResumeSection title="Education" styles={templateStyles}>
          {resumeData.education.map((edu, index) => (
            <EducationItem key={index} education={edu} styles={templateStyles} />
          ))}
        </ResumeSection>
      )}

      {/* Skills Section */}
      {resumeData.skills.primary.length > 0 && (
        <ResumeSection title="Skills" styles={templateStyles}>
          <SkillsSection skills={resumeData.skills} styles={templateStyles} />
        </ResumeSection>
      )}

      {/* Achievements Section */}
      {(resumeData.achievements.certifications?.length || 
        resumeData.achievements.achievements?.length) && (
        <ResumeSection title="Achievements & Certifications" styles={templateStyles}>
          <AchievementsSection achievements={resumeData.achievements} styles={templateStyles} />
        </ResumeSection>
      )}
    </div>
  );
}

function ResumeHeader({ resumeData, styles }: { resumeData: ResumeData; styles: any }) {
  return (
    <div className={styles.header}>
      <h1 className={styles.name}>
        {resumeData.basicInfo.fullName || 'Your Name'}
      </h1>
      {resumeData.basicInfo.headline && (
        <h2 className={styles.headline}>{resumeData.basicInfo.headline}</h2>
      )}
      
      <div className={styles.contact}>
        {resumeData.basicInfo.email && (
          <span className="inline-block">{resumeData.basicInfo.email}</span>
        )}
        {resumeData.basicInfo.phone && (
          <>
            <span className="hidden sm:inline"> • </span>
            <span className="inline-block">{resumeData.basicInfo.phone}</span>
          </>
        )}
        {resumeData.basicInfo.location && (
          <>
            <span className="hidden sm:inline"> • </span>
            <span className="inline-block">{resumeData.basicInfo.location}</span>
          </>
        )}
      </div>
      
      {(resumeData.socialLinks.linkedin || resumeData.socialLinks.github || resumeData.socialLinks.website) && (
        <div className={styles.social}>
          {resumeData.socialLinks.linkedin && (
            <span className="inline-block">
              <span className="font-medium">LinkedIn:</span> {resumeData.socialLinks.linkedin}
            </span>
          )}
          {resumeData.socialLinks.github && (
            <span className="inline-block">
              <span className="font-medium">GitHub:</span> {resumeData.socialLinks.github}
            </span>
          )}
          {resumeData.socialLinks.website && (
            <span className="inline-block">
              <span className="font-medium">Website:</span> {resumeData.socialLinks.website}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ResumeSection({ title, children, styles }: { 
  title: string; 
  children: React.ReactNode; 
  styles: any;
}) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionContent}>
        {children}
      </div>
    </div>
  );
}

function ExperienceItem({ experience, styles }: { 
  experience: any; 
  styles: any;
}) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <div className="flex-1">
          <h4 className={styles.itemTitle}>{experience.role}</h4>
          <div className={styles.itemSubtitle}>{experience.companyName}</div>
        </div>
        <span className={styles.itemDate}>
          {experience.startDate} - {experience.endDate || 'Present'}
        </span>
      </div>
      
      {experience.achievements && experience.achievements.length > 0 && (
        <ul className={styles.list}>
          {experience.achievements.map((achievement: string, index: number) => (
            <li key={index} className="break-words">{achievement}</li>
          ))}
        </ul>
      )}
      
      {experience.toolsUsed && experience.toolsUsed.length > 0 && (
        <div className={styles.tools}>
          <span className="font-medium">Technologies:</span> {experience.toolsUsed.join(', ')}
        </div>
      )}
    </div>
  );
}

function ProjectItem({ project, styles }: { 
  project: any; 
  styles: any;
}) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <div className="flex-1">
          <h4 className={styles.itemTitle}>{project.title}</h4>
          {project.role && (
            <div className="text-sm text-gray-600 font-medium">{project.role}</div>
          )}
        </div>
        {project.link && (
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.itemLink}
          >
            View Project
          </a>
        )}
      </div>
      
      {project.description && (
        <p className={`${styles.text} break-words`}>{project.description}</p>
      )}
      
      {project.techStack && project.techStack.length > 0 && (
        <div className={styles.tools}>
          <span className="font-medium">Technologies:</span> {project.techStack.join(', ')}
        </div>
      )}
    </div>
  );
}

function EducationItem({ education, styles }: { 
  education: any; 
  styles: any;
}) {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <div className="flex-1">
          <h4 className={styles.itemTitle}>{education.degree}</h4>
          <div className={styles.itemSubtitle}>{education.institution}</div>
        </div>
        <span className={styles.itemDate}>
          {education.startYear} - {education.endYear || 'Present'}
        </span>
      </div>
      
      <div className="space-y-1">
        {education.specialization && (
          <div className={styles.text}>
            <span className="font-medium">Specialization:</span> {education.specialization}
          </div>
        )}
        {education.marks && (
          <div className={styles.text}>
            <span className="font-medium">Grade:</span> {education.marks}
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsSection({ skills, styles }: { 
  skills: any; 
  styles: any;
}) {
  return (
    <div className={styles.skills}>
      {skills.primary.length > 0 && (
        <div className={styles.skillGroup}>
          <span className="font-semibold">Primary Skills:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {skills.primary.map((skill: string, index: number) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {skills.secondary && skills.secondary.length > 0 && (
        <div className={styles.skillGroup}>
          <span className="font-semibold">Secondary Skills:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {skills.secondary.map((skill: string, index: number) => (
              <span key={index} className="bg-gray-50 px-2 py-1 rounded text-sm border">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {skills.techStack && skills.techStack.length > 0 && (
        <div className={styles.skillGroup}>
          <span className="font-semibold">Technical Stack:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {skills.techStack.map((tech: string, index: number) => (
              <span key={index} className="bg-blue-50 px-2 py-1 rounded text-sm border border-blue-200">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {skills.businessTools && skills.businessTools.length > 0 && (
        <div className={styles.skillGroup}>
          <span className="font-semibold">Business Tools:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {skills.businessTools.map((tool: string, index: number) => (
              <span key={index} className="bg-green-50 px-2 py-1 rounded text-sm border border-green-200">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AchievementsSection({ achievements, styles }: { 
  achievements: any; 
  styles: any;
}) {
  return (
    <div className="space-y-4">
      {achievements.certifications && achievements.certifications.length > 0 && (
        <div className={styles.achievementGroup}>
          <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
          <ul className={styles.list}>
            {achievements.certifications.map((cert: string, index: number) => (
              <li key={index} className="break-words">{cert}</li>
            ))}
          </ul>
        </div>
      )}
      
      {achievements.achievements && achievements.achievements.length > 0 && (
        <div className={styles.achievementGroup}>
          <h4 className="font-semibold text-gray-900 mb-2">Achievements</h4>
          <ul className={styles.list}>
            {achievements.achievements.map((achievement: string, index: number) => (
              <li key={index} className="break-words">{achievement}</li>
            ))}
          </ul>
        </div>
      )}
      
      {achievements.extracurricular && achievements.extracurricular.length > 0 && (
        <div className={styles.achievementGroup}>
          <h4 className="font-semibold text-gray-900 mb-2">Extracurricular Activities</h4>
          <ul className={styles.list}>
            {achievements.extracurricular.map((activity: string, index: number) => (
              <li key={index} className="break-words">{activity}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ATS Score Details Component
function ATSScoreDetails({ atsScore }: { atsScore: ATSScore }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'optimization'>('overview');

  return (
    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`text-xs px-2 py-1 border-b-2 transition-colors ${
            activeTab === 'overview' 
              ? 'border-blue-500 text-blue-600 font-medium' 
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`text-xs px-2 py-1 border-b-2 transition-colors ${
            activeTab === 'keywords' 
              ? 'border-blue-500 text-blue-600 font-medium' 
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Keywords
        </button>
        <button
          onClick={() => setActiveTab('optimization')}
          className={`text-xs px-2 py-1 border-b-2 transition-colors ${
            activeTab === 'optimization' 
              ? 'border-blue-500 text-blue-600 font-medium' 
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Optimization
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <ScoreFactor label="Format" score={atsScore.factors.formatting} />
            <ScoreFactor label="Keywords" score={atsScore.factors.keywords} />
            <ScoreFactor label="Structure" score={atsScore.factors.structure} />
            <ScoreFactor label="Readability" score={atsScore.factors.readability} />
          </div>
          
          {atsScore.suggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Top Suggestions:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {atsScore.suggestions.slice(0, 3).map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Action Verbs Found</h4>
              <div className="text-xs text-green-600 font-medium">
                {atsScore.keywordAnalysis.actionVerbs.length} verbs
              </div>
              {atsScore.keywordAnalysis.actionVerbs.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {atsScore.keywordAnalysis.actionVerbs.slice(0, 3).join(', ')}
                  {atsScore.keywordAnalysis.actionVerbs.length > 3 && '...'}
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Technical Skills</h4>
              <div className="text-xs text-blue-600 font-medium">
                {atsScore.keywordAnalysis.technicalSkills.length} skills
              </div>
              {atsScore.keywordAnalysis.technicalSkills.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {atsScore.keywordAnalysis.technicalSkills.slice(0, 3).join(', ')}
                  {atsScore.keywordAnalysis.technicalSkills.length > 3 && '...'}
                </div>
              )}
            </div>
          </div>

          {atsScore.keywordAnalysis.missingKeywords.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Suggested Keywords</h4>
              <div className="flex flex-wrap gap-1">
                {atsScore.keywordAnalysis.missingKeywords.slice(0, 5).map((keyword, index) => (
                  <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'optimization' && (
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Section Quality</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Summary</span>
                <span className={`text-xs font-medium ${
                  atsScore.sectionOptimization.contentQuality.summaryQuality >= 70 
                    ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {atsScore.sectionOptimization.contentQuality.summaryQuality}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Experience</span>
                <span className={`text-xs font-medium ${
                  atsScore.sectionOptimization.contentQuality.experienceQuality >= 70 
                    ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {atsScore.sectionOptimization.contentQuality.experienceQuality}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Skills</span>
                <span className={`text-xs font-medium ${
                  atsScore.sectionOptimization.contentQuality.skillsQuality >= 70 
                    ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {atsScore.sectionOptimization.contentQuality.skillsQuality}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Education</span>
                <span className={`text-xs font-medium ${
                  atsScore.sectionOptimization.contentQuality.educationQuality >= 70 
                    ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {atsScore.sectionOptimization.contentQuality.educationQuality}%
                </span>
              </div>
            </div>
          </div>

          {atsScore.sectionOptimization.sectionOrder.suggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-1">Section Order</h4>
              <div className="text-xs text-gray-600">
                {atsScore.sectionOptimization.sectionOrder.suggestions[0]}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreFactor({ label, score }: { label: string; score: number }) {
  return (
    <div className="text-center">
      <div className={`text-xs font-medium ${
        score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
      }`}>
        {score}%
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}



function getTemplateStyles(template: 'ats-standard' | 'ats-modern' | 'ats-minimal') {
  const baseStyles = {
    container: 'text-sm leading-relaxed font-sans max-w-full',
    header: 'mb-6 pb-4 border-b border-gray-200',
    name: 'text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words',
    headline: 'text-base font-medium text-gray-700 mb-2 break-words',
    contact: 'text-sm text-gray-600 mb-1 flex flex-wrap gap-1 sm:gap-2',
    social: 'text-sm text-gray-600 flex flex-wrap gap-2',
    section: 'mb-5',
    sectionTitle: 'text-base font-semibold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1',
    sectionContent: 'space-y-4',
    item: 'mb-4',
    itemHeader: 'flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1',
    itemTitle: 'font-semibold text-gray-900 text-base break-words',
    itemSubtitle: 'text-gray-700 mb-2 font-medium break-words',
    itemDate: 'text-sm text-gray-600 font-medium whitespace-nowrap',
    itemLink: 'text-sm text-blue-600 hover:text-blue-800 break-all',
    text: 'text-gray-700 leading-relaxed break-words',
    list: 'list-disc list-inside text-gray-700 space-y-1 ml-2',
    tools: 'text-sm text-gray-600 mt-2 italic break-words',
    skills: 'space-y-3',
    skillGroup: 'text-gray-700',
    achievementGroup: 'mb-4'
  };

  switch (template) {
    case 'ats-modern':
      return {
        ...baseStyles,
        container: 'text-sm leading-relaxed font-sans bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg',
        name: 'text-2xl sm:text-3xl font-bold text-blue-900 mb-2',
        headline: 'text-lg font-medium text-blue-700 mb-3',
        sectionTitle: 'text-base font-bold text-blue-800 mb-3 uppercase tracking-wide border-b-2 border-blue-200 pb-2',
        itemTitle: 'font-bold text-gray-900 text-base',
        itemSubtitle: 'text-blue-700 mb-2 font-semibold',
        contact: 'text-sm text-gray-700 mb-2 flex flex-wrap gap-2',
        social: 'text-sm text-blue-600 flex flex-wrap gap-3'
      };
    
    case 'ats-minimal':
      return {
        ...baseStyles,
        container: 'text-sm leading-relaxed font-mono',
        header: 'mb-5 pb-3',
        name: 'text-xl sm:text-2xl font-semibold text-gray-900 mb-1',
        headline: 'text-base font-normal text-gray-600 mb-2',
        sectionTitle: 'text-base font-medium text-gray-800 mb-2 border-b border-gray-200 pb-1',
        itemTitle: 'font-medium text-gray-900',
        itemSubtitle: 'text-gray-600 mb-1',
        contact: 'text-sm text-gray-600 mb-1 flex flex-wrap gap-1',
        social: 'text-sm text-gray-600 flex flex-wrap gap-2',
        section: 'mb-4',
        sectionContent: 'space-y-3',
        item: 'mb-3'
      };
    
    default: // ats-standard
      return baseStyles;
  }
}