'use client';

import React, { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'resume' | 'ats' | 'technical';
  tags: string[];
}

interface FAQSectionProps {
  className?: string;
  searchable?: boolean;
  categories?: string[];
}

const FAQ_DATA: FAQItem[] = [
  // General Questions
  {
    id: 'what-is-ats',
    question: 'What is an ATS and why does it matter?',
    answer: 'ATS stands for Applicant Tracking System. It\'s software used by employers to filter and rank resumes before human recruiters see them. An ATS-friendly resume uses proper formatting, relevant keywords, and standard section headings to ensure it passes through these systems successfully.',
    category: 'ats',
    tags: ['ats', 'applicant tracking system', 'resume screening']
  },
  {
    id: 'how-long-resume',
    question: 'How long should my resume be?',
    answer: 'For most professionals, a one-page resume is ideal, especially for those with less than 10 years of experience. Senior professionals or those in academic/research fields may use two pages. Never exceed two pages unless you\'re in a specialized field that requires it.',
    category: 'resume',
    tags: ['resume length', 'one page', 'two page']
  },
  {
    id: 'what-to-include',
    question: 'What should I include in my resume?',
    answer: 'Essential sections include: Contact Information, Professional Summary, Work Experience (or Projects for freshers), Education, Skills, and relevant Social Links. Optional sections include Certifications, Achievements, and Volunteer Work if they add value to your application.',
    category: 'resume',
    tags: ['resume sections', 'what to include', 'resume structure']
  },
  {
    id: 'fresher-vs-experienced',
    question: 'What\'s the difference between fresher and experienced resume formats?',
    answer: 'Fresher resumes emphasize education, projects, internships, and skills since work experience is limited. Experienced resumes focus on work history, achievements, and career progression. Our chatbot automatically adjusts questions based on your experience level.',
    category: 'resume',
    tags: ['fresher resume', 'experienced resume', 'resume format']
  },
  {
    id: 'tech-vs-non-tech',
    question: 'How do tech and non-tech resumes differ?',
    answer: 'Tech resumes emphasize technical skills, programming languages, frameworks, and technical projects. They often include GitHub profiles and technical certifications. Non-tech resumes focus more on soft skills, business achievements, and industry-specific tools and methodologies.',
    category: 'resume',
    tags: ['tech resume', 'non-tech resume', 'technical skills']
  },

  // ATS Optimization
  {
    id: 'ats-keywords',
    question: 'How do I optimize my resume for ATS keywords?',
    answer: 'Read job descriptions carefully and include relevant keywords naturally throughout your resume. Focus on skills, job titles, and industry terms. Don\'t stuff keywords unnaturally - use them in context within your experience descriptions and skills sections.',
    category: 'ats',
    tags: ['keywords', 'ats optimization', 'job descriptions']
  },
  {
    id: 'ats-formatting',
    question: 'What formatting should I avoid for ATS compatibility?',
    answer: 'Avoid: Images, graphics, tables, columns, headers/footers, unusual fonts, and creative layouts. Use: Standard fonts (Arial, Calibri), clear section headings, bullet points, and simple formatting. Our templates are already ATS-optimized.',
    category: 'ats',
    tags: ['ats formatting', 'resume formatting', 'ats friendly']
  },
  {
    id: 'ats-score',
    question: 'What is an ATS score and how is it calculated?',
    answer: 'An ATS score measures how well your resume matches a job description and how easily an ATS can read it. It considers keyword relevance, formatting compatibility, section organization, and content completeness. Higher scores increase your chances of passing initial screening.',
    category: 'ats',
    tags: ['ats score', 'resume scoring', 'ats ranking']
  },

  // Resume Writing
  {
    id: 'action-verbs',
    question: 'What are action verbs and why are they important?',
    answer: 'Action verbs are strong, specific words that describe what you accomplished (e.g., "Led," "Developed," "Improved"). They make your achievements more impactful and help quantify your contributions. Start each bullet point with an action verb for maximum effect.',
    category: 'resume',
    tags: ['action verbs', 'resume writing', 'achievements']
  },
  {
    id: 'quantify-achievements',
    question: 'How do I quantify my achievements?',
    answer: 'Use numbers, percentages, dollar amounts, timeframes, and metrics wherever possible. Examples: "Increased sales by 25%," "Led team of 8 developers," "Reduced processing time by 2 hours," "Managed $500K budget." Numbers make your impact concrete and memorable.',
    category: 'resume',
    tags: ['quantify achievements', 'metrics', 'numbers', 'impact']
  },
  {
    id: 'no-experience',
    question: 'What if I don\'t have much work experience?',
    answer: 'Focus on: Academic projects, internships, volunteer work, freelance projects, personal projects, relevant coursework, certifications, and transferable skills from part-time jobs. Emphasize your potential and eagerness to learn.',
    category: 'resume',
    tags: ['no experience', 'fresher', 'entry level', 'projects']
  },
  {
    id: 'career-gap',
    question: 'How do I handle employment gaps?',
    answer: 'Be honest but strategic. Use years instead of months if gaps are short. For longer gaps, briefly mention what you did (education, family, health, travel) and focus on skills maintained or gained. Emphasize your readiness to return to work.',
    category: 'resume',
    tags: ['employment gap', 'career break', 'resume gaps']
  },

  // Technical Questions
  {
    id: 'pdf-vs-word',
    question: 'Should I submit my resume as PDF or Word document?',
    answer: 'PDF is generally preferred as it preserves formatting across different devices and systems. However, some ATS systems prefer Word documents. When in doubt, check the job posting requirements or submit both formats if possible.',
    category: 'technical',
    tags: ['pdf', 'word document', 'file format']
  },
  {
    id: 'resume-file-name',
    question: 'How should I name my resume file?',
    answer: 'Use a professional format like "FirstName_LastName_Resume.pdf" or "FirstName_LastName_JobTitle_Resume.pdf". Avoid generic names like "Resume.pdf" or "MyResume.pdf". Include the date if you have multiple versions.',
    category: 'technical',
    tags: ['file naming', 'resume filename', 'professional naming']
  },
  {
    id: 'multiple-resumes',
    question: 'Should I have different resumes for different jobs?',
    answer: 'Yes, tailor your resume for different roles or industries. Adjust your professional summary, emphasize relevant skills, and reorder sections based on what\'s most important for each position. Keep the core information consistent.',
    category: 'resume',
    tags: ['tailored resume', 'multiple resumes', 'job targeting']
  },

  // Skills and Sections
  {
    id: 'soft-skills',
    question: 'Should I include soft skills on my resume?',
    answer: 'Yes, but demonstrate them through examples rather than just listing them. Instead of "Good communication skills," write "Presented quarterly reports to C-level executives" or "Mentored 5 junior developers." Show, don\'t tell.',
    category: 'resume',
    tags: ['soft skills', 'communication', 'leadership', 'teamwork']
  },
  {
    id: 'references',
    question: 'Should I include references on my resume?',
    answer: 'No, don\'t include references or "References available upon request" on your resume. It takes up valuable space. Prepare a separate reference list to provide when specifically requested during the interview process.',
    category: 'resume',
    tags: ['references', 'reference list', 'resume space']
  },
  {
    id: 'hobbies-interests',
    question: 'Should I include hobbies and interests?',
    answer: 'Only if they\'re relevant to the job or demonstrate valuable skills. For example, "Marathon runner" shows dedication and goal-setting, "Volunteer coding instructor" shows leadership and technical skills. Skip generic hobbies like "reading" or "movies."',
    category: 'resume',
    tags: ['hobbies', 'interests', 'personal interests', 'relevant skills']
  }
];

export default function FAQSection({ 
  className = '', 
  searchable = true, 
  categories = ['general', 'resume', 'ats', 'technical'] 
}: FAQSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory && categories.includes(faq.category);
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return '❓';
      case 'resume': return '📄';
      case 'ats': return '🤖';
      case 'technical': return '⚙️';
      default: return '❓';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'general': return 'General';
      case 'resume': return 'Resume Writing';
      case 'ats': return 'ATS Optimization';
      case 'technical': return 'Technical';
      default: return category;
    }
  };

  return (
    <div className={`faq-section bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          <span className="mr-2">❓</span>
          Frequently Asked Questions
        </h3>
        <p className="text-gray-600 text-sm">
          Find answers to common questions about resume building and ATS optimization
        </p>
      </div>

      {/* Search and Filters */}
      {searchable && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg 
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div className="max-h-96 overflow-y-auto">
        {filteredFAQs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">No FAQs found</h4>
            <p className="text-gray-600 text-sm">
              Try adjusting your search terms or category filter
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="p-4">
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {getCategoryIcon(faq.category)}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {faq.question}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {getCategoryLabel(faq.category)}
                          </span>
                          {faq.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs text-gray-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                        expandedItems.has(faq.id) ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedItems.has(faq.id) && (
                  <div className="mt-3 pl-8">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.tags.length > 2 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {faq.tags.slice(2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
        <p className="text-sm text-gray-600">
          Can't find what you're looking for? 
          <button className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
            Contact support
          </button>
        </p>
      </div>
    </div>
  );
}