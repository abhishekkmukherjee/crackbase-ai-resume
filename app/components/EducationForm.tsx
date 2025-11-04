'use client';

import { useState } from 'react';

interface Education {
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function EducationForm({ data = [], onUpdate, onNext, onBack }: EducationFormProps) {
  const [educationList, setEducationList] = useState<Education[]>(
    data.length > 0 ? data : [{ institution: '', degree: '', field: '', year: '', gpa: '' }]
  );

  const addEducation = () => {
    const newEducation = { institution: '', degree: '', field: '', year: '', gpa: '' };
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

  const updateEducation = (index: number, field: keyof Education, value: string) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Education</h2>
      
      {educationList.map((education, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Education {index + 1}</h3>
            {educationList.length > 1 && (
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                required
                value={education.institution}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="University/College name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                required
                value={education.degree}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="B.Tech, MBA, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study *
              </label>
              <input
                type="text"
                required
                value={education.field}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Computer Science, Business, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="text"
                required
                value={education.year}
                onChange={(e) => updateEducation(index, 'year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2020-2024 or 2024"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA/Percentage (Optional)
              </label>
              <input
                type="text"
                value={education.gpa || ''}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8.5 CGPA or 85%"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-500"
      >
        + Add Another Education
      </button>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Next: Skills
        </button>
      </div>
    </form>
  );
}
