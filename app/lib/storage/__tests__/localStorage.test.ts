import { localStorage as storageAPI } from '../localStorage';
import type { LocalStorageData, ResumeData } from '../localStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock crypto for encryption
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }
  }
});

// Mock TextEncoder and TextDecoder for encryption
Object.defineProperty(global, 'TextEncoder', {
  value: class TextEncoder {
    encode(input: string): Uint8Array {
      const bytes = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        bytes[i] = input.charCodeAt(i);
      }
      return bytes;
    }
  }
});

Object.defineProperty(global, 'TextDecoder', {
  value: class TextDecoder {
    decode(input: Uint8Array): string {
      return String.fromCharCode(...input);
    }
  }
});

describe('LocalStorage Management System', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset the singleton instance for each test
    jest.resetModules();
  });

  describe('Data Persistence and Retrieval', () => {
    test('should save and load data correctly', () => {
      const testData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
          },
          education: [{
            degree: 'Bachelor of Science',
            institution: 'Test University',
            startYear: 2018,
            endYear: 2022
          }],
          experience: [],
          projects: [],
          skills: {
            primary: ['JavaScript', 'React', 'Node.js']
          },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: ['basic_info', 'education'],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      const saveResult = storageAPI.save(testData);
      expect(saveResult).toBe(true);

      const loadedData = storageAPI.load();
      expect(loadedData.resumeData.basicInfo.fullName).toBe('John Doe');
      expect(loadedData.resumeData.basicInfo.email).toBe('john@example.com');
      expect(loadedData.resumeData.education[0].degree).toBe('Bachelor of Science');
      expect(loadedData.resumeData.skills.primary).toEqual(['JavaScript', 'React', 'Node.js']);
    });

    test('should return default data when no data exists', () => {
      const data = storageAPI.load();
      
      expect(data.resumeData.basicInfo.fullName).toBe('');
      expect(data.resumeData.basicInfo.email).toBe('');
      expect(data.resumeData.education).toEqual([]);
      expect(data.chatHistory).toEqual([]);
      expect(data.userProfile.background).toBe('tech');
      expect(data.progress.currentSection).toBe('classification');
    });

    test('should merge partial data with existing data', () => {
      // Save initial data
      const initialData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
          },
          education: [],
          experience: [],
          projects: [],
          skills: { primary: [] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };
      
      storageAPI.save(initialData);

      // Update with partial data
      const partialUpdate: Partial<LocalStorageData> = {
        resumeData: {
          ...initialData.resumeData!,
          basicInfo: {
            ...initialData.resumeData!.basicInfo,
            location: 'New York, NY'
          }
        }
      };

      storageAPI.save(partialUpdate);

      const loadedData = storageAPI.load();
      expect(loadedData.resumeData.basicInfo.fullName).toBe('John Doe');
      expect(loadedData.resumeData.basicInfo.location).toBe('New York, NY');
    });
  });

  describe('Backup and Recovery', () => {
    test('should create and retrieve backups', () => {
      const testData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890'
          },
          education: [],
          experience: [],
          projects: [],
          skills: { primary: ['Testing'] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      storageAPI.save(testData);
      const backupResult = storageAPI.createBackup();
      expect(backupResult).toBe(true);

      const backups = storageAPI.getBackups();
      expect(backups.length).toBeGreaterThan(0);
      expect(backups[0].data.resumeData.basicInfo.fullName).toBe('Test User');
    });

    test('should restore from backup', () => {
      // Save initial data
      const initialData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'Original User',
            email: 'original@example.com',
            phone: '+1234567890'
          },
          education: [],
          experience: [],
          projects: [],
          skills: { primary: [] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      storageAPI.save(initialData);
      storageAPI.createBackup();

      // Modify data
      const modifiedData: Partial<LocalStorageData> = {
        resumeData: {
          ...initialData.resumeData!,
          basicInfo: {
            ...initialData.resumeData!.basicInfo,
            fullName: 'Modified User'
          }
        }
      };

      storageAPI.save(modifiedData);

      // Restore from backup
      const backups = storageAPI.getBackups();
      const timestamp = typeof backups[0].timestamp === 'string' 
        ? new Date(backups[0].timestamp).getTime() 
        : backups[0].timestamp.getTime();
      const restoreResult = storageAPI.restoreFromBackup(timestamp);
      expect(restoreResult).toBe(true);

      const restoredData = storageAPI.load();
      expect(restoredData.resumeData.basicInfo.fullName).toBe('Original User');
    });
  });

  describe('Data Cleanup and Garbage Collection', () => {
    test('should perform cleanup and return metrics', () => {
      // Add some test data
      const testData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890'
          },
          education: [],
          experience: [],
          projects: [],
          skills: { primary: [] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      storageAPI.save(testData);
      storageAPI.createBackup();

      const metrics = storageAPI.cleanup();
      expect(metrics).toHaveProperty('totalSize');
      expect(metrics).toHaveProperty('itemCount');
      expect(metrics).toHaveProperty('lastCleanup');
      expect(metrics).toHaveProperty('backupCount');
      expect(typeof metrics.totalSize).toBe('number');
      expect(typeof metrics.itemCount).toBe('number');
    });

    test('should clear all data', () => {
      const testData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890'
          },
          education: [],
          experience: [],
          projects: [],
          skills: { primary: [] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      storageAPI.save(testData);
      
      const clearResult = storageAPI.clearAll();
      expect(clearResult).toBe(true);

      const loadedData = storageAPI.load();
      expect(loadedData.resumeData.basicInfo.fullName).toBe('');
    });
  });

  describe('Metrics and Monitoring', () => {
    test('should get storage metrics', () => {
      const testData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890'
          },
          education: [],
          experience: [],
          projects: [],
          skills: { primary: [] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      storageAPI.save(testData);

      const metrics = storageAPI.getMetrics();
      expect(metrics).toHaveProperty('totalSize');
      expect(metrics).toHaveProperty('itemCount');
      expect(metrics.totalSize).toBeGreaterThan(0);
      expect(metrics.itemCount).toBeGreaterThan(0);
    });

    test('should calculate quota usage', () => {
      const testData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890'
          },
          education: [],
          experience: [],
          projects: [],
          skills: { primary: [] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      storageAPI.save(testData);

      const quotaUsage = storageAPI.getQuotaUsage();
      expect(typeof quotaUsage).toBe('number');
      expect(quotaUsage).toBeGreaterThanOrEqual(0);
      expect(quotaUsage).toBeLessThanOrEqual(1);
    });
  });

  describe('Import and Export', () => {
    test('should export and import data', () => {
      const testData: Partial<LocalStorageData> = {
        resumeData: {
          basicInfo: {
            fullName: 'Export Test User',
            email: 'export@example.com',
            phone: '+1234567890'
          },
          education: [{
            degree: 'Test Degree',
            institution: 'Test University'
          }],
          experience: [],
          projects: [],
          skills: { primary: ['Export', 'Import'] },
          achievements: {},
          socialLinks: {},
          metadata: {
            background: 'tech',
            experience: 'fresher',
            completedSections: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      };

      storageAPI.save(testData);

      const exportedData = storageAPI.export();
      expect(exportedData).toBeTruthy();
      expect(typeof exportedData).toBe('string');

      // Clear data and import
      storageAPI.clearAll();
      const importResult = storageAPI.import(exportedData);
      expect(importResult).toBe(true);

      const importedData = storageAPI.load();
      expect(importedData.resumeData.basicInfo.fullName).toBe('Export Test User');
      expect(importedData.resumeData.education[0].degree).toBe('Test Degree');
      expect(importedData.resumeData.skills.primary).toEqual(['Export', 'Import']);
    });
  });

  describe('Error Handling', () => {
    test('should handle corrupted data gracefully', () => {
      // Manually set corrupted data
      localStorageMock.setItem('ats_resume_data', 'invalid json data');

      const data = storageAPI.load();
      expect(data.resumeData.basicInfo.fullName).toBe('');
      expect(data.chatHistory).toEqual([]);
    });

    test('should handle import of invalid JSON', () => {
      const importResult = storageAPI.import('invalid json');
      expect(importResult).toBe(false);
    });
  });
});