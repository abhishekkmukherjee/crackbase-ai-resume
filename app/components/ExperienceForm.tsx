"use client";

import { useState } from "react";
import { Experience } from "@/lib/types";

interface ExperienceFormProps {
  data: Experience[];
  onUpdate: (data: Experience[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ExperienceForm({ data, onUpdate, onNext, onBack }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      responsibilities: [''],
      achievements: [''],
      technologies: []
    };
    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const removeExperience = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const addResponsibility = (experienceId: string) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === experienceId 
        ? { ...exp, responsibilities: [...exp.responsibilities, ''] }
        : exp
    );
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const updateResponsibility = (experienceId: string, index: number, value: string) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === experienceId 
        ? { 
            ...exp, 
            responsibilities: exp.responsibilities.map((resp, i) => i === index ? value : resp)
          }
        : exp
    );
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const removeResponsibility = (experienceId: string, index: number) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === experienceId 
        ? { 
            ...exp, 
            responsibilities: exp.responsibilities.filter((_, i) => i !== index)
          }
        : exp
    );
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const addAchievement = (experienceId: string) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === experienceId 
        ? { ...exp, achievements: [...exp.achievements, ''] }
        : exp
    );
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const updateAchievement = (experienceId: string, index: number, value: string) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === experienceId 
        ? { 
            ...exp, 
            achievements: exp.achievements.map((ach, i) => i === index ? value : ach)
          }
        : exp
    );
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const removeAchievement = (experienceId: string, index: number) => {
    const updatedExperiences = experiences.map(exp =>
      exp.id === experienceId 
        ? { 
            ...exp, 
            achievements: exp.achievements.filter((_, i) => i !== index)
          }
        : exp
    );
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    experiences.forEach((exp, index) => {
      if (!exp.title.trim()) {
        newErrors[`title_${index}`] = 'Job title is required';
      }
      if (!exp.company.trim()) {
        newErrors[`company_${index}`] = 'Company name is required';
      }
      if (!exp.startDate) {
        newErrors[`startDate_${index}`] = 'Start date is required';
      }
      if (!exp.current && !exp.endDate) {
        newErrors[`endDate_${index}`] = 'End date is required if not current position';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // Initialize with one experience if empty
  if (experiences.length === 0) {
    addExperience();
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Work Experience</h2>
            <p className="text-gray-600 mt-1">Add your professional experience and achievements</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {experiences.map((experience, index) => (
          <div key={experience.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Experience {index + 1}
              </h3>
              {experiences.length > 1 && (
                <button
                  onClick={() => removeExperience(experience.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={experience.title}
                  onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors[`title_${index}`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Software Engineer"
                />
                {errors[`title_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`title_${index}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors[`company_${index}`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Google"
                />
                {errors[`company_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`company_${index}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors[`startDate_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`startDate_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`startDate_${index}`]}</p>
                  )}
                </div>

                {!experience.current && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="month"
                      value={experience.endDate}
                      onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors[`endDate_${index}`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`endDate_${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`endDate_${index}`]}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) => updateExperience(experience.id, 'current', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">I currently work here</span>
              </label>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={experience.description}
                onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Brief description of your role and responsibilities..."
              />
            </div>

            {/* Responsibilities Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Key Responsibilities
                </label>
                <button
                  onClick={() => addResponsibility(experience.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Responsibility
                </button>
              </div>
              <div className="space-y-3">
                {experience.responsibilities.map((responsibility, respIndex) => (
                  <div key={respIndex} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={responsibility}
                      onChange={(e) => updateResponsibility(experience.id, respIndex, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Developed and maintained web applications..."
                    />
                    {experience.responsibilities.length > 1 && (
                      <button
                        onClick={() => removeResponsibility(experience.id, respIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Key Achievements
                </label>
                <button
                  onClick={() => addAchievement(experience.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Achievement
                </button>
              </div>
              <div className="space-y-3">
                {experience.achievements.map((achievement, achIndex) => (
                  <div key={achIndex} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateAchievement(experience.id, achIndex, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Increased system performance by 40%..."
                    />
                    {experience.achievements.length > 1 && (
                      <button
                        onClick={() => removeAchievement(experience.id, achIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                        type="button"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
          type="button"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Experience
        </button>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200"
        >
          <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>
        
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue to Projects
          <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

