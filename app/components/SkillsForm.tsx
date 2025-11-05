'use client';

import { useState } from 'react';

interface Skills {
  technical: string[];
  soft: string[];
}

interface SkillsFormProps {
  data: Skills;
  onUpdate: (data: Skills) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SkillsForm({ data, onUpdate, onNext, onBack }: SkillsFormProps) {
  const [skills, setSkills] = useState<Skills>(data);
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');

  const addTechnicalSkill = () => {
    if (newTechnicalSkill.trim()) {
      const updated = {
        ...skills,
        technical: [...skills.technical, newTechnicalSkill.trim()]
      };
      setSkills(updated);
      onUpdate(updated);
      setNewTechnicalSkill('');
    }
  };

  const removeTechnicalSkill = (index: number) => {
    const updated = {
      ...skills,
      technical: skills.technical.filter((_, i) => i !== index)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleTechnicalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnicalSkill();
    }
  };

  const handleSoftKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSoftSkill();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Skills</h2>
      
      {/* Technical Skills Section */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-medium">Technical Skills</h3>
        <p className="text-sm text-gray-600">
          Add programming languages, frameworks, tools, etc.
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newTechnicalSkill}
            onChange={(e) => setNewTechnicalSkill(e.target.value)}
            onKeyPress={handleTechnicalKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., JavaScript, React, Python, etc."
          />
          <button
            type="button"
            onClick={addTechnicalSkill}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.technical.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeTechnicalSkill(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Soft Skills Section */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-medium">Soft Skills</h3>
        <p className="text-sm text-gray-600">
          Add communication, leadership, teamwork skills, etc.
        </p>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newSoftSkill}
            onChange={(e) => setNewSoftSkill(e.target.value)}
            onKeyPress={handleSoftKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Leadership, Communication, Problem Solving, etc."
          />
          <button
            type="button"
            onClick={addSoftSkill}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.soft.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSoftSkill(index)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

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
          Next: Experience
        </button>
      </div>
    </form>
  );
}
