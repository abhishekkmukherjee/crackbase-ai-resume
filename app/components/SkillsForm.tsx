'use client';

import { useState } from 'react';
import { Skills } from '@/lib/types';

interface SkillsFormProps {
  data: Skills;
  onUpdate: (data: Skills) => void;
  onNext: () => void;
  onBack: () => void;
}

const POPULAR_TECHNICAL_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'SQL', 'AWS', 'Docker', 'Git',
  'HTML/CSS', 'MongoDB', 'PostgreSQL', 'Express.js', 'Next.js', 'Vue.js', 'Angular', 'PHP', 'C++', 'Go'
];

const POPULAR_SOFT_SKILLS = [
  'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking',
  'Adaptability', 'Creativity', 'Project Management', 'Analytical Skills', 'Attention to Detail', 'Initiative'
];

export default function SkillsForm({ data, onUpdate, onNext, onBack }: SkillsFormProps) {
  const [skills, setSkills] = useState<Skills>(data);
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageProficiency, setNewLanguageProficiency] = useState<'Basic' | 'Intermediate' | 'Advanced' | 'Native'>('Intermediate');

  const addTechnicalCategory = () => {
    const updated = {
      ...skills,
      technical: [...skills.technical, { category: 'New Category', skills: [] }]
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const updateTechnicalCategory = (index: number, category: string) => {
    const updated = {
      ...skills,
      technical: skills.technical.map((tech, i) => 
        i === index ? { ...tech, category } : tech
      )
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const addTechnicalSkill = (categoryIndex: number) => {
    if (newTechnicalSkill.trim()) {
      const updated = {
        ...skills,
        technical: skills.technical.map((tech, i) => 
          i === categoryIndex 
            ? { ...tech, skills: [...tech.skills, newTechnicalSkill.trim()] }
            : tech
        )
      };
      setSkills(updated);
      onUpdate(updated);
      setNewTechnicalSkill('');
    }
  };

  const removeTechnicalSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = {
      ...skills,
      technical: skills.technical.map((tech, i) => 
        i === categoryIndex 
          ? { ...tech, skills: tech.skills.filter((_, si) => si !== skillIndex) }
          : tech
      )
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const addPopularSkill = (skill: string, categoryIndex: number) => {
    const updated = {
      ...skills,
      technical: skills.technical.map((tech, i) => 
        i === categoryIndex 
          ? { ...tech, skills: [...tech.skills, skill] }
          : tech
      )
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const addSoftSkill = () => {
    if (newSoftSkill.trim()) {
      const updated = {
        ...skills,
        soft: [...skills.soft, newSoftSkill.trim()]
      };
      setSkills(updated);
      onUpdate(updated);
      setNewSoftSkill('');
    }
  };

  const removeSoftSkill = (index: number) => {
    const updated = {
      ...skills,
      soft: skills.soft.filter((_, i) => i !== index)
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const addPopularSoftSkill = (skill: string) => {
    const updated = {
      ...skills,
      soft: [...skills.soft, skill]
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      const updated = {
        ...skills,
        languages: [...(skills.languages || []), { 
          language: newLanguage.trim(), 
          proficiency: newLanguageProficiency 
        }]
      };
      setSkills(updated);
      onUpdate(updated);
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    const updated = {
      ...skills,
      languages: (skills.languages || []).filter((_, i) => i !== index)
    };
    setSkills(updated);
    onUpdate(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const inputClasses = `
    w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400
    focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none bg-white hover:border-gray-300
  `;

  // Initialize with at least one technical category if empty
  if (skills.technical.length === 0) {
    const initialSkills = {
      ...skills,
      technical: [{ category: 'Programming Languages', skills: [] }]
    };
    setSkills(initialSkills);
    onUpdate(initialSkills);
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills & Expertise</h2>
        <p className="text-gray-600">Showcase your technical abilities, soft skills, and language proficiencies.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Technical Skills Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            Technical Skills
          </h3>
          
          {skills.technical.map((techCategory, categoryIndex) => (
            <div key={categoryIndex} className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={techCategory.category}
                  onChange={(e) => updateTechnicalCategory(categoryIndex, e.target.value)}
                  className={inputClasses}
                  placeholder="e.g., Programming Languages, Frameworks, Tools"
                />
              </div>

              <div className="mb-4">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTechnicalSkill}
                    onChange={(e) => setNewTechnicalSkill(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => addTechnicalSkill(categoryIndex))}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Add a skill..."
                  />
                  <button
                    type="button"
                    onClick={() => addTechnicalSkill(categoryIndex)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
                  >
                    Add
                  </button>
                </div>

                {/* Popular skills suggestions */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Popular skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_TECHNICAL_SKILLS
                      .filter(skill => !techCategory.skills.includes(skill))
                      .slice(0, 8)
                      .map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addPopularSkill(skill, categoryIndex)}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {techCategory.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeTechnicalSkill(categoryIndex, skillIndex)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors duration-200"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTechnicalCategory}
            className="w-full py-3 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-semibold"
          >
            + Add Another Category
          </button>
        </div>

        {/* Soft Skills Section */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            Soft Skills
          </h3>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSoftSkill}
              onChange={(e) => setNewSoftSkill(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, addSoftSkill)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
              placeholder="Add a soft skill..."
            />
            <button
              type="button"
              onClick={addSoftSkill}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold"
            >
              Add
            </button>
          </div>

          {/* Popular soft skills suggestions */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Popular soft skills:</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {POPULAR_SOFT_SKILLS
                .filter(skill => !skills.soft.includes(skill))
                .slice(0, 8)
                .map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addPopularSoftSkill(skill)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-green-100 hover:text-green-600 transition-colors duration-200"
                  >
                    + {skill}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.soft.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSoftSkill(index)}
                  className="text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-1 transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 12.236 11.618 14z" clipRule="evenodd" />
              </svg>
            </div>
            Languages
            <span className="text-gray-400 font-normal ml-2 text-sm">(Optional)</span>
          </h3>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, addLanguage)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Language name..."
            />
            <select
              value={newLanguageProficiency}
              onChange={(e) => setNewLanguageProficiency(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Native">Native</option>
            </select>
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-semibold"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(skills.languages || []).map((lang, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium"
              >
                <span>{lang.language} ({lang.proficiency})</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full p-1 transition-colors duration-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200"
          >
            <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Education
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue to Experience
            <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
