"use client";

import { useState } from "react";

interface AchievementsFormProps {
  data: string[];
  onUpdate: (data: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AchievementsForm({ data, onUpdate, onNext, onBack }: AchievementsFormProps) {
  const [achievements, setAchievements] = useState<string[]>(data.length > 0 ? data : ['']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addAchievement = () => {
    const updatedAchievements = [...achievements, ''];
    setAchievements(updatedAchievements);
    onUpdate(updatedAchievements);
  };

  const updateAchievement = (index: number, value: string) => {
    const updatedAchievements = achievements.map((achievement, i) => 
      i === index ? value : achievement
    );
    setAchievements(updatedAchievements);
    onUpdate(updatedAchievements);
  };

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      const updatedAchievements = achievements.filter((_, i) => i !== index);
      setAchievements(updatedAchievements);
      onUpdate(updatedAchievements);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Check if at least one achievement is filled
    const hasValidAchievement = achievements.some(achievement => achievement.trim().length > 0);
    
    if (!hasValidAchievement) {
      newErrors.general = 'Please add at least one achievement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Filter out empty achievements before validation
    const filteredAchievements = achievements.filter(achievement => achievement.trim().length > 0);
    setAchievements(filteredAchievements);
    onUpdate(filteredAchievements);
    
    if (filteredAchievements.length > 0) {
      onNext();
    } else {
      setErrors({ general: 'Please add at least one achievement' });
    }
  };

  const achievementSuggestions = [
    "Dean's List for academic excellence",
    "Winner of hackathon/coding competition",
    "Published research paper or article",
    "Led a team of X members in project/organization",
    "Increased efficiency/performance by X%",
    "Reduced costs/time by X amount",
    "Received scholarship or academic award",
    "Volunteer work with measurable impact",
    "Certification in relevant technology/skill",
    "Speaking at conferences or events",
    "Open source contributions",
    "Mentored junior developers/students"
  ];

  const addSuggestion = (suggestion: string) => {
    const emptyIndex = achievements.findIndex(achievement => achievement.trim() === '');
    if (emptyIndex !== -1) {
      updateAchievement(emptyIndex, suggestion);
    } else {
      const updatedAchievements = [...achievements, suggestion];
      setAchievements(updatedAchievements);
      onUpdate(updatedAchievements);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Achievements</h2>
            <p className="text-gray-600 mt-1">Highlight your accomplishments and recognitions</p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-1">
              <textarea
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder={`Achievement ${index + 1} - e.g., Won first place in university coding competition with 200+ participants`}
              />
            </div>
            {achievements.length > 1 && (
              <button
                onClick={() => removeAchievement(index)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors mt-1"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addAchievement}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
          type="button"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Another Achievement
        </button>
      </div>

      {/* Achievement Suggestions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need inspiration? Try these examples:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievementSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => addSuggestion(suggestion)}
              className="text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-colors text-sm text-gray-700 hover:text-blue-700"
              type="button"
            >
              <div className="flex items-start">
                <svg className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {suggestion}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Click on any suggestion to add it to your achievements. You can then customize it to match your specific accomplishments.
        </p>
      </div>

      {/* Tips Section */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tips for Great Achievements
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Use specific numbers and metrics when possible (e.g., "increased by 25%", "led team of 8")
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Focus on results and impact, not just activities
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Include both academic and extracurricular achievements
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            Mention any awards, recognitions, or certifications
          </li>
        </ul>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
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
          Generate Resume
          <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}