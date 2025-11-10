'use client';

import { useState } from 'react';
import FormStepper from './FormStepper';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import ExperienceForm from './ExperienceForm';
import ProjectsForm from './ProjectsForm';
import AchievementsForm from './AchievementsForm';
import { ResumeFormData, PersonalInfo, Education, Skills, Experience, Project } from '@/lib/types';

const FORM_STEPS = [
  'Personal Info',
  'Education', 
  'Skills',
  'Experience',
  'Projects',
  'Achievements'
];

export default function ResumeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ResumeFormData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: []
    },
    experience: [],
    projects: [],
    achievements: [],
    certifications: []
  });

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (personalInfo: PersonalInfo) => {
    setFormData(prev => ({ ...prev, personalInfo }));
  };

  const updateEducation = (education: Education[]) => {
    setFormData(prev => ({ ...prev, education }));
  };

  const updateSkills = (skills: Skills) => {
    setFormData(prev => ({ ...prev, skills }));
  };

  const updateExperience = (experience: Experience[]) => {
    setFormData(prev => ({ ...prev, experience }));
  };

  const updateProjects = (projects: Project[]) => {
    setFormData(prev => ({ ...prev, projects }));
  };

  const updateAchievements = (achievements: string[]) => {
    setFormData(prev => ({ ...prev, achievements }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Resume</h1>
          <p className="text-lg text-gray-600">Build a professional resume in minutes with AI assistance</p>
        </div>

        <FormStepper 
          currentStep={currentStep}
          totalSteps={FORM_STEPS.length}
          steps={FORM_STEPS}
        />
        
        <div className="mt-8">
          {currentStep === 0 && (
            <PersonalInfoForm
              data={formData.personalInfo}
              onUpdate={updatePersonalInfo}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 1 && (
            <EducationForm 
              data={formData.education}
              onUpdate={updateEducation}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 2 && (
            <SkillsForm 
              data={formData.skills}
              onUpdate={updateSkills}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <ExperienceForm 
              data={formData.experience}
              onUpdate={updateExperience}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <ProjectsForm 
              data={formData.projects}
              onUpdate={updateProjects}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <AchievementsForm 
              data={formData.achievements}
              onUpdate={updateAchievements}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {/* Placeholder for remaining steps */}
          {currentStep > 5 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {FORM_STEPS[currentStep]} Section
                </h2>
                <p className="text-gray-600 mb-6">
                  This section is coming up next! We're building an amazing experience for you.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                >
                  <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back
                </button>
                
                {currentStep < FORM_STEPS.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Continue
                    <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator at bottom */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Your progress is automatically saved as you go
          </p>
        </div>
      </div>
    </div>
  );
}
