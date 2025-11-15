'use client';

import React from 'react';
import { ResumeData } from '../lib/chatbot/types';
import ResumePreviewChatbot from '../components/resume/ResumePreviewChatbot';
import PDFPreview from '../components/pdf/PDFPreview';

// Sample resume data for testing
const sampleResumeData: ResumeData = {
  basicInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    location: 'New York, NY',
    headline: 'Senior Software Developer',
    summary: 'Experienced software developer with 5+ years of experience in full-stack web development. Passionate about creating scalable applications and leading development teams.'
  },
  education: [
    {
      degree: 'Bachelor of Computer Science',
      institution: 'University of Technology',
      startYear: 2018,
      endYear: 2022,
      marks: '3.8 GPA',
      specialization: 'Software Engineering'
    }
  ],
  experience: [
    {
      companyName: 'Tech Corp',
      role: 'Senior Software Developer',
      startDate: '2022-01',
      endDate: '2024-01',
      achievements: [
        'Led development of microservices architecture serving 1M+ users',
        'Improved system performance by 40% through code optimization',
        'Mentored 3 junior developers and conducted code reviews'
      ],
      toolsUsed: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
    },
    {
      companyName: 'StartupXYZ',
      role: 'Full Stack Developer',
      startDate: '2020-06',
      endDate: '2021-12',
      achievements: [
        'Built complete e-commerce platform from scratch',
        'Implemented payment processing and inventory management',
        'Reduced page load times by 60% through optimization'
      ],
      toolsUsed: ['React', 'Express.js', 'MongoDB', 'Stripe API']
    }
  ],
  projects: [
    {
      title: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform with React and Node.js, featuring user authentication, payment processing, and admin dashboard.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT'],
      link: 'https://github.com/johndoe/ecommerce',
      role: 'Full Stack Developer'
    },
    {
      title: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates and team collaboration features.',
      techStack: ['Vue.js', 'Socket.io', 'Express.js', 'PostgreSQL'],
      link: 'https://github.com/johndoe/taskmanager',
      role: 'Lead Developer'
    }
  ],
  skills: {
    primary: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
    secondary: ['Docker', 'AWS', 'Git', 'Agile', 'REST APIs'],
    techStack: ['React', 'Vue.js', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS'],
    businessTools: []
  },
  achievements: {
    certifications: ['AWS Certified Developer Associate', 'Google Cloud Professional Developer'],
    achievements: ['Employee of the Month - March 2023', 'Led successful migration to microservices'],
    extracurricular: ['Volunteer coding instructor at local bootcamp', 'Open source contributor']
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    website: 'https://johndoe.dev'
  },
  metadata: {
    background: 'tech',
    experience: 'experienced',
    completedSections: ['basic_info', 'education', 'experience', 'projects', 'skills', 'achievements', 'social_links'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

export default function PDFDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Generation Demo</h1>
          <p className="text-gray-600">
            Test the PDF generation functionality with sample resume data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume Preview with PDF Download */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume Preview</h2>
            <ResumePreviewChatbot
              resumeData={sampleResumeData}
              showATSScore={true}
              showPDFDownload={true}
              onPDFGenerate={() => {
                console.log('PDF generated successfully!');
              }}
            />
          </div>

          {/* Standalone PDF Preview Component */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">PDF Download Options</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">With Email Capture (Production)</h3>
                <PDFPreview resumeData={sampleResumeData} useEmailCapture={true} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Direct Download (Demo Only)</h3>
                <PDFPreview resumeData={sampleResumeData} useEmailCapture={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Test</h3>
          <div className="space-y-3 text-gray-700">
            <p>1. <strong>Resume Preview:</strong> The left panel shows the resume preview with an integrated PDF download button.</p>
            <p>2. <strong>PDF Options:</strong> The right panel provides different template options for PDF generation.</p>
            <p>3. <strong>ATS Score:</strong> Click on the ATS score to see detailed optimization suggestions.</p>
            <p>4. <strong>Templates:</strong> Try different templates (Standard, Modern, Minimal) to see formatting differences.</p>
            <p>5. <strong>Download:</strong> Click any download button to generate and download the PDF resume.</p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Features Implemented:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Client-side PDF generation using jsPDF</li>
                <li>• Multiple ATS-optimized templates</li>
                <li>• Real-time ATS compatibility scoring</li>
                <li>• Responsive design for all screen sizes</li>
                <li>• Error handling and user feedback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">ATS Optimization:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Clean, parseable formatting</li>
                <li>• Standard fonts (Helvetica/Arial)</li>
                <li>• Proper section ordering</li>
                <li>• Keyword optimization analysis</li>
                <li>• No complex layouts or graphics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}