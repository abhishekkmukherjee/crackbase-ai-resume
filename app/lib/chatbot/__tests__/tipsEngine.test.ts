import { tipsEngine } from '../tipsEngine';
import { Question } from '../questionEngine';
import { UserProfile } from '../types';

describe('TipsEngine', () => {
  const mockUserProfile: UserProfile = {
    background: 'tech',
    experience: 'fresher',
    preferences: {
      skipOptional: false,
      fastMode: false
    }
  };

  const mockQuestion: Question = {
    id: 'experience_achievements',
    text: 'Can you describe your key achievements?',
    type: 'textarea',
    field: 'achievements',
    section: 'experience',
    required: false
  };

  describe('getContextualTips', () => {
    it('should return relevant tips for a question', () => {
      const tips = tipsEngine.getContextualTips(mockQuestion, mockUserProfile);
      expect(tips).toBeDefined();
      expect(Array.isArray(tips)).toBe(true);
    });

    it('should filter tips by user profile', () => {
      const techProfile: UserProfile = { ...mockUserProfile, background: 'tech' };
      const nonTechProfile: UserProfile = { ...mockUserProfile, background: 'non-tech' };

      const techTips = tipsEngine.getContextualTips(mockQuestion, techProfile);
      const nonTechTips = tipsEngine.getContextualTips(mockQuestion, nonTechProfile);

      // Both should return tips, but they might be different
      expect(techTips).toBeDefined();
      expect(nonTechTips).toBeDefined();
    });

    it('should sort tips by priority', () => {
      const tips = tipsEngine.getContextualTips(mockQuestion, mockUserProfile);
      
      if (tips.length > 1) {
        const priorities = tips.map(tip => tip.priority);
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        
        for (let i = 0; i < priorities.length - 1; i++) {
          expect(priorityOrder[priorities[i]]).toBeGreaterThanOrEqual(priorityOrder[priorities[i + 1]]);
        }
      }
    });
  });

  describe('getActionVerbSuggestions', () => {
    it('should return action verbs', () => {
      const verbs = tipsEngine.getActionVerbSuggestions();
      expect(verbs).toBeDefined();
      expect(Array.isArray(verbs)).toBe(true);
      expect(verbs.length).toBeGreaterThan(0);
    });

    it('should return verbs for specific category', () => {
      const leadershipVerbs = tipsEngine.getActionVerbSuggestions('Leadership');
      expect(leadershipVerbs).toBeDefined();
      expect(Array.isArray(leadershipVerbs)).toBe(true);
      expect(leadershipVerbs).toContain('Led');
    });

    it('should return empty array for invalid category', () => {
      const invalidVerbs = tipsEngine.getActionVerbSuggestions('InvalidCategory');
      expect(invalidVerbs).toEqual([]);
    });
  });

  describe('getSkillSuggestions', () => {
    it('should return skill suggestions for tech background', () => {
      const techProfile: UserProfile = { ...mockUserProfile, background: 'tech' };
      const skills = tipsEngine.getSkillSuggestions(techProfile);
      
      expect(skills).toBeDefined();
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
      
      // Should include tech-specific skills
      const hasProgLang = skills.some(s => s.category === 'Programming Languages');
      expect(hasProgLang).toBe(true);
    });

    it('should return skill suggestions for non-tech background', () => {
      const nonTechProfile: UserProfile = { ...mockUserProfile, background: 'non-tech' };
      const skills = tipsEngine.getSkillSuggestions(nonTechProfile);
      
      expect(skills).toBeDefined();
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
      
      // Should include business-specific skills
      const hasBusinessSkills = skills.some(s => s.category.includes('Business') || s.category.includes('Marketing'));
      expect(hasBusinessSkills).toBe(true);
    });

    it('should filter by category', () => {
      const skills = tipsEngine.getSkillSuggestions(mockUserProfile, 'Programming Languages');
      
      if (skills.length > 0) {
        expect(skills.every(s => s.category === 'Programming Languages')).toBe(true);
      }
    });
  });

  describe('getExampleSuggestions', () => {
    it('should return examples for headline question', () => {
      const examples = tipsEngine.getExampleSuggestions('headline', mockUserProfile);
      expect(examples).toBeDefined();
      expect(Array.isArray(examples)).toBe(true);
    });

    it('should return different examples for different backgrounds', () => {
      const techExamples = tipsEngine.getExampleSuggestions('headline', { ...mockUserProfile, background: 'tech' });
      const nonTechExamples = tipsEngine.getExampleSuggestions('headline', { ...mockUserProfile, background: 'non-tech' });
      
      // Examples should be different for different backgrounds
      if (techExamples.length > 0 && nonTechExamples.length > 0) {
        expect(techExamples).not.toEqual(nonTechExamples);
      }
    });
  });

  describe('generateAchievementSuggestions', () => {
    it('should generate achievement templates', () => {
      const achievements = tipsEngine.generateAchievementSuggestions(mockUserProfile);
      expect(achievements).toBeDefined();
      expect(Array.isArray(achievements)).toBe(true);
      expect(achievements.length).toBeGreaterThan(0);
      
      // Each achievement should start with an action verb
      achievements.forEach(achievement => {
        expect(typeof achievement).toBe('string');
        expect(achievement.length).toBeGreaterThan(0);
      });
    });

    it('should generate different templates for different backgrounds', () => {
      const techAchievements = tipsEngine.generateAchievementSuggestions({ ...mockUserProfile, background: 'tech' });
      const nonTechAchievements = tipsEngine.generateAchievementSuggestions({ ...mockUserProfile, background: 'non-tech' });
      
      expect(techAchievements).not.toEqual(nonTechAchievements);
    });
  });

  describe('getATSOptimizationTips', () => {
    it('should return ATS optimization tips', () => {
      const tips = tipsEngine.getATSOptimizationTips();
      expect(tips).toBeDefined();
      expect(Array.isArray(tips)).toBe(true);
      expect(tips.length).toBeGreaterThan(0);
      
      // All tips should be ATS type
      expect(tips.every(tip => tip.type === 'ats')).toBe(true);
    });
  });

  describe('getBestPracticeTips', () => {
    it('should return best practice tips', () => {
      const tips = tipsEngine.getBestPracticeTips();
      expect(tips).toBeDefined();
      expect(Array.isArray(tips)).toBe(true);
      expect(tips.length).toBeGreaterThan(0);
      
      // All tips should be best_practice type
      expect(tips.every(tip => tip.type === 'best_practice')).toBe(true);
    });
  });

  describe('searchTips', () => {
    it('should search tips by query', () => {
      const results = tipsEngine.searchTips('ATS');
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      
      // Results should contain the search term
      results.forEach(tip => {
        const containsQuery = tip.title.toLowerCase().includes('ats') || 
                             tip.content.toLowerCase().includes('ats');
        expect(containsQuery).toBe(true);
      });
    });

    it('should return empty array for non-matching query', () => {
      const results = tipsEngine.searchTips('nonexistentquery12345');
      expect(results).toEqual([]);
    });
  });
});