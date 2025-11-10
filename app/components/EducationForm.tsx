'use client';

import { useState } from 'react';
import { Education } from '@/lib/types';

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EducationForm({ data = [], onUpdate, onNext, onBack }: EducationFormProps) {
  const [educationList, setEducationList] = useState<Education[]>(
    data.length > 0 ? data : [{
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
      relevantCoursework: [],
      current: false
    }]
  );

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: '',
      relevantCoursework: [],
      current: false
    };
    const updated = [...educationList, newEducation];
    setEducationList(updated);
    onUpdate(updated);
  };

  const removeEducation = (index: number) => {
    if (educationList.length > 1) {
      const updated = educationList.filter((_, i) => i !== index);
      setEducationList(updated);
      onUpdate(updated);
    }
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = educationList.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducationList(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const inputClasses = `
    w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400
    focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-white hover:border-gray-300
  `;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Education</h2>
        <p className="text-gray-600">Add your educational background to showcase your qualifications.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {educationList.map((education, index) => (
          <div key={education.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  {index + 1}
                </div>
                Education Entry
              </h3>
              {educationList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                  title="Remove this education entry"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Institution *
                </label>
                <input
                  type="text"
                  required
                  value={education.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className={inputClasses}
                  placeholder="University or College name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  required
                  value={education.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className={inputClasses}
                  placeholder="Bachelor's, Master's, PhD, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  required
                  value={education.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  className={inputClasses}
                  placeholder="Computer Science, Business Administration, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GPA/Grade
                  <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={education.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  className={inputClasses}
                  placeholder="8.5 CGPA, 3.8 GPA, First Class, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="month"
                  required
                  value={education.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <div className="space-y-2">
                  <input
                    type="month"
                    value={education.endDate}
                    onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                    className={inputClasses}
                    disabled={education.current}
                  />
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={education.current}
                      onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Currently studying here
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Honors & Awards
                  <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={education.honors || ''}
                  onChange={(e) => updateEducation(index, 'honors', e.target.value)}
                  className={inputClasses}
                  placeholder="Magna Cum Laude, Dean's List, Merit Scholarship, etc."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addEducation}
          className="w-full py-4 px-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-semibold"
        >
          <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Education
        </button>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200"
          >
            <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Personal Info
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue to Skills
            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
