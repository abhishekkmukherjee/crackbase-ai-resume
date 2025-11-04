'use client';

import { useState } from 'react';
import FormStepper from './FormStepper';
import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import { ResumeFormData } from '@/lib/types';
import { edgeServerAppPaths } from 'next/dist/build/webpack/plugins/pages-manifest-plugin';

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
        
        {/* We'll add other form steps here later */}
       {
        currentStep === 1 && (
          <EducationForm 
          data={formData.education}
          onUpdate={(education)=> setFormData(prev => ({...prev, education}))}  
          onNext={handleNext}
          onBack={handleBack}
          />
        )
       }
      </div>
    </div>
  );
}
