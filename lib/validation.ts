import { PersonalInfo, Education, Experience, Project, Skills } from './types';

// Basic validation functions - these are pure functions that return error messages or null

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  // Simple but effective email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's between 10-15 digits (covers most international formats)
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return 'Please enter a valid phone number';
  }
  
  return null;
};

export const validateDate = (date: string, fieldName: string): string | null => {
  if (!date || !date.trim()) {
    return `${fieldName} is required`;
  }
  
  // Check if it's a valid date format (YYYY-MM or YYYY-MM-DD)
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  
  return null;
};

export const validateUrl = (url: string, fieldName: string): string | null => {
  if (!url || !url.trim()) {
    return null; // URL fields are usually optional
  }
  
  try {
    new URL(url);
    return null;
  } catch {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
};

// Form-specific validation functions

export const validatePersonalInfo = (data: PersonalInfo): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Required fields
  const nameError = validateRequired(data.name, 'Full name');
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  
  const addressError = validateRequired(data.address, 'Address');
  if (addressError) errors.address = addressError;
  
  const cityError = validateRequired(data.city, 'City');
  if (cityError) errors.city = cityError;
  
  const stateError = validateRequired(data.state, 'State');
  if (stateError) errors.state = stateError;
  
  const zipError = validateRequired(data.zipCode, 'ZIP code');
  if (zipError) errors.zipCode = zipError;
  
  // Optional fields with URL validation
  if (data.linkedin) {
    const linkedinError = validateUrl(data.linkedin, 'LinkedIn URL');
    if (linkedinError) errors.linkedin = linkedinError;
  }
  
  if (data.github) {
    const githubError = validateUrl(data.github, 'GitHub URL');
    if (githubError) errors.github = githubError;
  }
  
  if (data.portfolio) {
    const portfolioError = validateUrl(data.portfolio, 'Portfolio URL');
    if (portfolioError) errors.portfolio = portfolioError;
  }
  
  return errors;
};

export const validateEducation = (educationList: Education[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (educationList.length === 0) {
    errors.general = 'Please add at least one education entry';
    return errors;
  }
  
  educationList.forEach((education, index) => {
    const institutionError = validateRequired(education.institution, 'Institution');
    if (institutionError) errors[`institution_${index}`] = institutionError;
    
    const degreeError = validateRequired(education.degree, 'Degree');
    if (degreeError) errors[`degree_${index}`] = degreeError;
    
    const fieldError = validateRequired(education.field, 'Field of study');
    if (fieldError) errors[`field_${index}`] = fieldError;
    
    const startDateError = validateDate(education.startDate, 'Start date');
    if (startDateError) errors[`startDate_${index}`] = startDateError;
    
    if (!education.current) {
      const endDateError = validateDate(education.endDate, 'End date');
      if (endDateError) errors[`endDate_${index}`] = endDateError;
    }
  });
  
  return errors;
};

export const validateExperience = (experienceList: Experience[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Experience is optional, so we don't require at least one entry
  
  experienceList.forEach((experience, index) => {
    const titleError = validateRequired(experience.title, 'Job title');
    if (titleError) errors[`title_${index}`] = titleError;
    
    const companyError = validateRequired(experience.company, 'Company');
    if (companyError) errors[`company_${index}`] = companyError;
    
    const startDateError = validateDate(experience.startDate, 'Start date');
    if (startDateError) errors[`startDate_${index}`] = startDateError;
    
    if (!experience.current) {
      const endDateError = validateDate(experience.endDate, 'End date');
      if (endDateError) errors[`endDate_${index}`] = endDateError;
    }
    
    // Validate that responsibilities are not empty
    const validResponsibilities = experience.responsibilities.filter(resp => resp.trim().length > 0);
    if (validResponsibilities.length === 0) {
      errors[`responsibilities_${index}`] = 'Please add at least one responsibility';
    }
  });
  
  return errors;
};

export const validateProjects = (projectsList: Project[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Projects are optional, so we don't require at least one entry
  
  projectsList.forEach((project, index) => {
    const nameError = validateRequired(project.name, 'Project name');
    if (nameError) errors[`name_${index}`] = nameError;
    
    const descriptionError = validateRequired(project.description, 'Project description');
    if (descriptionError) errors[`description_${index}`] = descriptionError;
    
    const startDateError = validateDate(project.startDate, 'Start date');
    if (startDateError) errors[`startDate_${index}`] = startDateError;
    
    if (!project.current && project.endDate) {
      const endDateError = validateDate(project.endDate, 'End date');
      if (endDateError) errors[`endDate_${index}`] = endDateError;
    }
    
    // Validate URLs if provided
    if (project.link) {
      const linkError = validateUrl(project.link, 'Project link');
      if (linkError) errors[`link_${index}`] = linkError;
    }
    
    if (project.github) {
      const githubError = validateUrl(project.github, 'GitHub link');
      if (githubError) errors[`github_${index}`] = githubError;
    }
  });
  
  return errors;
};

export const validateSkills = (skills: Skills): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  // Check if at least some skills are provided
  const hasTechnicalSkills = skills.technical.some(category => 
    category.skills.length > 0 && category.skills.some(skill => skill.trim().length > 0)
  );
  
  const hasSoftSkills = skills.soft.length > 0 && skills.soft.some(skill => skill.trim().length > 0);
  
  if (!hasTechnicalSkills && !hasSoftSkills) {
    errors.general = 'Please add at least some technical or soft skills';
  }
  
  return errors;
};

export const validateAchievements = (achievements: string[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  const validAchievements = achievements.filter(achievement => achievement.trim().length > 0);
  
  if (validAchievements.length === 0) {
    errors.general = 'Please add at least one achievement';
  }
  
  return errors;
};

// Utility function to check if any errors exist
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};

// Utility function to get first error message
export const getFirstError = (errors: Record<string, string>): string | null => {
  const errorKeys = Object.keys(errors);
  return errorKeys.length > 0 ? errors[errorKeys[0]] : null;
};