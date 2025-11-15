'use client';

import React, { useState, useMemo } from 'react';
import { ResumeData, UserProfile } from '../../lib/chatbot/types';

interface ResumeChecklistProps {
  resumeData: ResumeData;
  userProfile: UserProfile;
  className?: string;
  onImprovementClick?: (section: string, improvement: string) => void;
}

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete' | 'warning';
  priority: 'high' | 'medium' | 'low';
  improvement?: string;
  section?: string;
}

export default function ResumeChecklist({ 
  resumeData, 
  userProfile, 
  className = '',
  onImprovementClick
}: ResumeChecklistProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['high_priority']));

  const checklistItems = useMemo((): ChecklistItem[] => {
    const items: ChecklistItem[] = [];

    // Basic Information Checks
    items.push({
      id: 'basic_name',
      category: 'Basic Information',
      title: 'Full Name',
      description: 'Professional full name is provided',
      status: resumeData.basicInfo?.fullName ? 'complete' : 'incomplete',
      priority: 'high',
      section: 'basic_info'
    });

    items.push({
      id: 'basic_email',
      category: 'Basic Information',
      title: 'Professional Email',
      description: 'Professional email address is provided',
      status: resumeData.basicInfo?.email ? 'complete' : 'incomplete',
      priority: 'high',
      section: 'basic_info'
    });

    items.push({
      id: 'basic_phone',
      category: 'Basic Information',
      title: 'Phone Number',
      description: 'Contact phone number is provided',
      status: resumeData.basicInfo?.phone ? 'complete' : 'incomplete',
      priority: 'high',
      section: 'basic_info'
    });

    items.push({
      id: 'basic_headline',
      category: 'Basic Information',
      title: 'Professional Headline',
      description: 'Compelling professional headline or title',
      status: resumeData.basicInfo?.headline ? 'complete' : 'warning',
      priority: 'medium',
      improvement: 'Add a professional headline that summarizes your expertise',
      section: 'basic_info'
    });

    items.push({
      id: 'basic_summary',
      category: 'Basic Information',
      title: 'Professional Summary',
      description: 'Brief professional summary highlighting key strengths',
      status: resumeData.basicInfo?.summary ? 'complete' : 'warning',
      priority: 'medium',
      improvement: 'Add a 2-3 sentence summary of your professional background',
      section: 'basic_info'
    });

    // Education Checks
    const hasEducation = resumeData.education && resumeData.education.length > 0;
    items.push({
      id: 'education_present',
      category: 'Education',
      title: 'Education Information',
      description: 'Educational background is provided',
      status: hasEducation ? 'complete' : 'incomplete',
      priority: 'high',
      section: 'education'
    });

    if (hasEducation) {
      const education = resumeData.education[0];
      items.push({
        id: 'education_complete',
        category: 'Education',
        title: 'Complete Education Details',
        description: 'Degree, institution, and graduation year are provided',
        status: (education.degree && education.institution && education.endYear) ? 'complete' : 'warning',
        priority: 'medium',
        improvement: 'Ensure all education fields are complete',
        section: 'education'
      });
    }

    // Experience/Projects Checks
    const hasExperience = resumeData.experience && resumeData.experience.length > 0;
    const hasProjects = resumeData.projects && resumeData.projects.length > 0;
    
    if (userProfile.experience === 'experienced') {
      items.push({
        id: 'experience_present',
        category: 'Work Experience',
        title: 'Work Experience',
        description: 'Professional work experience is documented',
        status: hasExperience ? 'complete' : 'incomplete',
        priority: 'high',
        section: 'experience'
      });

      if (hasExperience) {
        const experience = resumeData.experience[0];
        items.push({
          id: 'experience_achievements',
          category: 'Work Experience',
          title: 'Quantified Achievements',
          description: 'Work experience includes specific achievements and metrics',
          status: (experience.achievements && experience.achievements.length > 0) ? 'complete' : 'warning',
          priority: 'high',
          improvement: 'Add specific achievements with numbers and metrics',
          section: 'experience'
        });
      }
    } else {
      items.push({
        id: 'projects_present',
        category: 'Projects',
        title: 'Project Experience',
        description: 'Relevant projects are documented',
        status: hasProjects ? 'complete' : 'warning',
        priority: 'high',
        improvement: 'Add relevant projects to showcase your skills',
        section: 'projects'
      });

      if (hasProjects && userProfile.background === 'tech') {
        const project = resumeData.projects[0];
        items.push({
          id: 'projects_tech_stack',
          category: 'Projects',
          title: 'Technical Details',
          description: 'Projects include technical stack and implementation details',
          status: (project.techStack && project.techStack.length > 0) ? 'complete' : 'warning',
          priority: 'medium',
          improvement: 'Add technical stack and tools used in your projects',
          section: 'projects'
        });
      }
    }

    // Skills Checks
    const hasSkills = resumeData.skills?.primary && resumeData.skills.primary.length > 0;
    items.push({
      id: 'skills_present',
      category: 'Skills',
      title: 'Core Skills',
      description: 'Primary skills are listed',
      status: hasSkills ? 'complete' : 'incomplete',
      priority: 'high',
      section: 'skills'
    });

    if (hasSkills) {
      const skillCount = resumeData.skills.primary.length;
      items.push({
        id: 'skills_comprehensive',
        category: 'Skills',
        title: 'Comprehensive Skill Set',
        description: 'Adequate number of relevant skills listed',
        status: skillCount >= 5 ? 'complete' : 'warning',
        priority: 'medium',
        improvement: 'Add more relevant skills to strengthen your profile',
        section: 'skills'
      });
    }

    // Social Links Checks
    const hasLinkedIn = resumeData.socialLinks?.linkedin;
    items.push({
      id: 'social_linkedin',
      category: 'Professional Links',
      title: 'LinkedIn Profile',
      description: 'LinkedIn profile URL is provided',
      status: hasLinkedIn ? 'complete' : 'warning',
      priority: 'high',
      improvement: 'Add your LinkedIn profile URL',
      section: 'social_links'
    });

    if (userProfile.background === 'tech') {
      const hasGitHub = resumeData.socialLinks?.github;
      items.push({
        id: 'social_github',
        category: 'Professional Links',
        title: 'GitHub Profile',
        description: 'GitHub profile showcasing code projects',
        status: hasGitHub ? 'complete' : 'warning',
        priority: 'medium',
        improvement: 'Add your GitHub profile to showcase your code',
        section: 'social_links'
      });
    }

    // ATS Optimization Checks
    const totalContent = [
      resumeData.basicInfo?.summary,
      ...(resumeData.experience?.flatMap(exp => exp.achievements) || []),
      ...(resumeData.projects?.map(proj => proj.description) || []),
      ...(resumeData.skills?.primary || [])
    ].filter(Boolean).join(' ');

    items.push({
      id: 'ats_keywords',
      category: 'ATS Optimization',
      title: 'Keyword Density',
      description: 'Resume contains relevant keywords for ATS systems',
      status: totalContent.length > 200 ? 'complete' : 'warning',
      priority: 'high',
      improvement: 'Add more relevant keywords throughout your resume',
      section: 'skills'
    });

    items.push({
      id: 'ats_formatting',
      category: 'ATS Optimization',
      title: 'ATS-Friendly Format',
      description: 'Resume uses ATS-compatible formatting',
      status: 'complete', // Our template is ATS-friendly
      priority: 'medium'
    });

    return items;
  }, [resumeData, userProfile]);

  const categorizedItems = useMemo(() => {
    const categories: Record<string, ChecklistItem[]> = {};
    
    checklistItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    return categories;
  }, [checklistItems]);

  const stats = useMemo(() => {
    const total = checklistItems.length;
    const complete = checklistItems.filter(item => item.status === 'complete').length;
    const warnings = checklistItems.filter(item => item.status === 'warning').length;
    const incomplete = checklistItems.filter(item => item.status === 'incomplete').length;
    const percentage = Math.round((complete / total) * 100);

    return { total, complete, warnings, incomplete, percentage };
  }, [checklistItems]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return <span className="text-green-600">✅</span>;
      case 'warning':
        return <span className="text-yellow-600">⚠️</span>;
      case 'incomplete':
        return <span className="text-red-600">❌</span>;
    }
  };

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'complete':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'incomplete':
        return 'border-red-200 bg-red-50';
    }
  };

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className={`resume-checklist bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2">📋</span>
            Resume Checklist
          </h3>
          <div className="text-sm text-gray-600">
            {stats.complete}/{stats.total} complete
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex space-x-4">
            <span className="text-green-600">✅ {stats.complete} Complete</span>
            <span className="text-yellow-600">⚠️ {stats.warnings} Needs Attention</span>
            <span className="text-red-600">❌ {stats.incomplete} Missing</span>
          </div>
          <div className="font-medium text-gray-900">{stats.percentage}%</div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(categorizedItems).map(([category, items]) => (
          <div key={category} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{category}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {items.filter(item => item.status === 'complete').length}/{items.length}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedCategories.has(category) ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>

            {expandedCategories.has(category) && (
              <div className="px-4 pb-3 space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border ${getStatusColor(item.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-medium text-sm text-gray-900">{item.title}</h5>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          
                          {item.improvement && item.status !== 'complete' && (
                            <div className="flex items-start space-x-2">
                              <span className="text-blue-600 text-sm">💡</span>
                              <p className="text-sm text-blue-700">{item.improvement}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {item.improvement && item.section && onImprovementClick && item.status !== 'complete' && (
                        <button
                          onClick={() => onImprovementClick(item.section!, item.improvement!)}
                          className="ml-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Fix
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}