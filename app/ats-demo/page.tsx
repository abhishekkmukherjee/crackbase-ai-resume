'use client';

import React, { useState } from 'react';
import ResumePreviewChatbot from '@/app/components/resume/ResumePreviewChatbot';
import ATSOptimizationPanel from '@/app/components/ats/ATSOptimizationPanel';
import { ResumeData } from '@/app/lib/chatbot/types';

// Sample resume data for demonstration
const sampleResumeData: ResumeData = {
  basicInfo: {
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-987-6543',
    location: 'San Francisco, CA',
    headline: 'Full Stack Developer',
    summary: 'Passionate full stack developer with 3+ years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies. Led development of 5+ successful projects that improved user engagement by 40%.'
  },
  education: [{
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Stanford University',
    startYear: 2018,
    endYear: 2022,
    marks: '3.9 GPA',
    specialization: 'Software Engineering'
  }],
  experience: [{
    companyName: 'TechStart Inc.',
    role: 'Full Stack Developer',
    startDate: '2022-06',
    endDate: 'Present',
    achievements: [
      'Developed and deployed 3 web applications using React and Node.js, serving 10,000+ users',
      'Improved application performance by 45% through code optimization and caching strategies',
      'Collaborated with cross-functional teams to deliver features 20% faster than planned',
      'Implemented automated testing that reduced bugs by 60%'
    ],
    toolsUsed: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker']
  }],
  projects: [{
    title: 'Task Management Platform',
    description: 'Built a comprehensive task management platform with real-time collaboration features, supporting teams of up to 50 members.',
    techStack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    link: 'https://github.com/sarahjohnson/task-manager',
    role: 'Lead Developer'
  }, {
    title: 'E-learning Mobile App',
    description: 'Developed a cross-platform mobile application for online learning with video streaming and progress tracking.',
    techStack: ['React Native', 'Firebase', 'Node.js', 'MongoDB'],
    link: 'https://github.com/sarahjohnson/elearning-app',
    role: 'Mobile Developer'
  }],
  skills: {
    primary: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
    secondary: ['Vue.js', 'Angular', 'Express.js', 'FastAPI'],
    techStack: ['MongoDB', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes'],
    businessTools: []
  },
  achievements: {
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional Developer'],
    achievements: [
      'Winner of University Hackathon 2021',
      'Published research paper on web performance optimization',
      'Mentored 5+ junior developers'
    ],
    extracurricular: ['Women in Tech Community Leader', 'Open Source Contributor']
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    github: 'https://github.com/sarahjohnson',
    website: 'https://sarahjohnson.dev'
  },
  metadata: {
    background: 'tech',
    experience: 'experienced',
    completedSections: ['basic_info', 'education', 'experience', 'projects', 'skills', 'achievements', 'social_links'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

export default function ATSDemoPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<'ats-standard' | 'ats-modern' | 'ats-minimal'>('ats-standard');
  const [showOptimizationPanel, setShowOptimizationPanel] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ATS Resume Optimization Demo</h1>
              <p className="text-sm text-gray-600 mt-1">
                Experience our advanced ATS scoring and resume preview system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowOptimizationPanel(!showOptimizationPanel)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showOptimizationPanel
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showOptimizationPanel ? 'Hide' : 'Show'} ATS Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showOptimizationPanel ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* Resume Preview */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Preview</h2>
              <ResumePreviewChatbot
                resumeData={resumeData}
                template={selectedTemplate}
                showATSScore={true}
                onTemplateChange={setSelectedTemplate}
                className="h-full"
              />
            </div>

            {/* Template Showcase */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ATS-Optimized Templates</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'ats-standard', name: 'Standard', description: 'Clean and professional' },
                  { key: 'ats-modern', name: 'Modern', description: 'Contemporary design' },
                  { key: 'ats-minimal', name: 'Minimal', description: 'Simple and focused' }
                ].map(({ key, name, description }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key as any)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{name}</div>
                    <div className="text-sm text-gray-600 mt-1">{description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ATS Optimization Panel */}
          {showOptimizationPanel && (
            <div className="space-y-6">
              <ATSOptimizationPanel resumeData={resumeData} />
              
              {/* Feature Highlights */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 ATS Optimization Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Real-time ATS Scoring</h4>
                      <p className="text-sm text-gray-600">Get instant feedback on your resume's ATS compatibility</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Keyword Analysis</h4>
                      <p className="text-sm text-gray-600">Identify missing keywords and optimize content</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Structure Optimization</h4>
                      <p className="text-sm text-gray-600">Ensure proper section ordering and formatting</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Actionable Suggestions</h4>
                      <p className="text-sm text-gray-600">Get specific recommendations to improve your score</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to build your ATS-optimized resume?</h3>
            <p className="text-gray-600 mb-6">
              Start with our conversational chatbot and get real-time optimization feedback
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/chatbot-demo"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Chatbot Demo
              </a>
              <a
                href="/"
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}