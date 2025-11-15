import { ResumeFormData } from './types';

const STORAGE_KEY = 'resume-form-data';

// Save form data to localStorage
export const saveFormData = (data: ResumeFormData): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
    console.log('Form data saved to localStorage');
  } catch (error) {
    console.error('Failed to save form data:', error);
    // Handle storage quota exceeded or other errors
  }
};

// Load form data from localStorage
export const loadFormData = (): ResumeFormData | null => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return null; // No saved data
    }
    
    const data = JSON.parse(serializedData) as ResumeFormData;
    console.log('Form data loaded from localStorage');
    return data;
  } catch (error) {
    console.error('Failed to load form data:', error);
    return null;
  }
};

// Clear saved form data
export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Form data cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
};

// Check if form data exists in localStorage
export const hasFormData = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check form data:', error);
    return false;
  }
};