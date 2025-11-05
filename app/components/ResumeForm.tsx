'use client';

import { useState } from 'react';
import FormStepper from './FormStepper';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import SkillsForm from './SkillsForm';
import { ResumeFormData } from '@/lib/types';

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
      linkedin: '',
      github: ''
    },
    education: [],
    skills: {
      technical: [],
      soft: []
    },
    experience: [],
    projects: [],
    achievements: []
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

  const updatePersonalInfo = (personalInfo: any) => {
    setFormData(prev => ({ ...prev, personalInfo }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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
            onUpdate={(education) => setFormData(prev => ({...prev, education}))}  
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 2 && (
          <SkillsForm 
            data={formData.skills}
            onUpdate={(skills) => setFormData(prev => ({...prev, skills}))}  
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {/* We'll add other form steps here later */}
        {currentStep > 2 && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">
              {FORM_STEPS[currentStep]} Form
            </h2>
            <p className="text-gray-600 mb-4">
              This step will be implemented next!
            </p>
            <div className="space-x-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                disabled={currentStep === FORM_STEPS.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
