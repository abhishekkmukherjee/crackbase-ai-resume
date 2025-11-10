"use client";

import { useState } from "react";
import { Project } from "@/lib/types";

interface ProjectsFormProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ProjectsForm({ data, onUpdate, onNext, onBack }: ProjectsFormProps) {
  const [projects, setProjects] = useState<Project[]>(data);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      current: false,
      link: '',
      github: '',
      highlights: ['']
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    );
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const addTechnology = (projectId: string, technology: string) => {
    if (technology.trim()) {
      const updatedProjects = projects.map(project =>
        project.id === projectId 
          ? { ...project, technologies: [...project.technologies, technology.trim()] }
          : project
      );
      setProjects(updatedProjects);
      onUpdate(updatedProjects);
    }
  };

  const removeTechnology = (projectId: string, techIndex: number) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { 
            ...project, 
            technologies: project.technologies.filter((_, i) => i !== techIndex)
          }
        : project
    );
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const addHighlight = (projectId: string) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { ...project, highlights: [...project.highlights, ''] }
        : project
    );
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const updateHighlight = (projectId: string, index: number, value: string) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { 
            ...project, 
            highlights: project.highlights.map((highlight, i) => i === index ? value : highlight)
          }
        : project
    );
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const removeHighlight = (projectId: string, index: number) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { 
            ...project, 
            highlights: project.highlights.filter((_, i) => i !== index)
          }
        : project
    );
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    projects.forEach((project, index) => {
      if (!project.name.trim()) {
        newErrors[`name_${index}`] = 'Project name is required';
      }
      if (!project.description.trim()) {
        newErrors[`description_${index}`] = 'Project description is required';
      }
      if (!project.startDate) {
        newErrors[`startDate_${index}`] = 'Start date is required';
      }
      if (!project.current && !project.endDate) {
        newErrors[`endDate_${index}`] = 'End date is required if project is not ongoing';
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

  const handleTechnologyKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, projectId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      addTechnology(projectId, target.value);
      target.value = '';
    }
  };

  // Initialize with one project if empty
  if (projects.length === 0) {
    addProject();
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
            <p className="text-gray-600 mt-1">Showcase your personal and professional projects</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <div key={project.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Project {index + 1}
              </h3>
              {projects.length > 1 && (
                <button
                  onClick={() => removeProject(project.id)}
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors[`name_${index}`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., E-commerce Website"
                />
                {errors[`name_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`name_${index}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors[`startDate_${index}`] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[`startDate_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`startDate_${index}`]}</p>
                )}
              </div>

              {!project.current && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="month"
                    value={project.endDate || ''}
                    onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors[`endDate_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`endDate_${index}`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`endDate_${index}`]}</p>
                  )}
                </div>
              )}

              <div className="md:col-span-2">
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={project.current}
                    onChange={(e) => updateProject(project.id, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">This is an ongoing project</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Link
                </label>
                <input
                  type="url"
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  value={project.github || ''}
                  onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors[`description_${index}`] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what the project does, your role, and the impact it had..."
              />
              {errors[`description_${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`description_${index}`]}</p>
              )}
            </div>

            {/* Technologies Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <div className="mb-3">
                <input
                  type="text"
                  onKeyPress={(e) => handleTechnologyKeyPress(e, project.id)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Type a technology and press Enter (e.g., React, Node.js, MongoDB)"
                />
                <p className="text-xs text-gray-500 mt-1">Press Enter to add each technology</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(project.id, techIndex)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      type="button"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Key Highlights & Achievements
                </label>
                <button
                  onClick={() => addHighlight(project.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  type="button"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Highlight
                </button>
              </div>
              <div className="space-y-3">
                {project.highlights.map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateHighlight(project.id, highlightIndex, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Implemented user authentication system..."
                    />
                    {project.highlights.length > 1 && (
                      <button
                        onClick={() => removeHighlight(project.id, highlightIndex)}
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
          onClick={addProject}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
          type="button"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Project
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
          Continue to Achievements
          <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}