// localStorage management for ATS Resume Chatbot
import { 
  ChatMessage, 
  UserProfile, 
  ResumeData, 
  ResumeSection 
} from '../chatbot/types';

// ============================================================================
// INTERFACES AND TYPES
// ============================================================================

export interface LocalStorageData {
  resumeData: ResumeData;
  chatHistory: ChatMessage[];
  userProfile: UserProfile;
  progress: {
    currentSection: ResumeSection;
    completedSections: ResumeSection[];
    lastUpdated: Date;
  };
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
}

export interface StorageBackup {
  data: LocalStorageData;
  timestamp: Date;
  version: string;
  checksum: string;
}

export interface StorageMetrics {
  totalSize: number;
  itemCount: number;
  lastCleanup: Date;
  backupCount: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
  MAIN_DATA: 'ats_resume_data',
  BACKUP_PREFIX: 'ats_resume_backup_',
  METRICS: 'ats_resume_metrics',
  ENCRYPTION_KEY: 'ats_resume_key'
} as const;

const STORAGE_CONFIG = {
  MAX_BACKUPS: 5,
  BACKUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  CLEANUP_THRESHOLD: 0.8, // 80% of quota
  ENCRYPTION_ENABLED: true,
  VERSION: '1.0.0'
} as const;

// ============================================================================
// ENCRYPTION UTILITIES
// ============================================================================

class SimpleEncryption {
  private key: string;

  constructor() {
    this.key = this.getOrCreateKey();
  }

  private getOrCreateKey(): string {
    let key = globalThis.localStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);
    if (!key) {
      key = this.generateKey();
      globalThis.localStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, key);
    }
    return key;
  }

  private generateKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  encrypt(data: string): string {
    if (!STORAGE_CONFIG.ENCRYPTION_ENABLED) return data;
    
    try {
      // Simple XOR encryption for client-side storage
      const keyBytes = this.key.match(/.{2}/g)?.map(hex => parseInt(hex, 16)) || [];
      const dataBytes = new TextEncoder().encode(data);
      const encrypted = new Uint8Array(dataBytes.length);
      
      for (let i = 0; i < dataBytes.length; i++) {
        encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      
      return btoa(String.fromCharCode(...encrypted));
    } catch (error) {
      console.warn('Encryption failed, storing unencrypted:', error);
      return data;
    }
  }

  decrypt(encryptedData: string): string {
    if (!STORAGE_CONFIG.ENCRYPTION_ENABLED) return encryptedData;
    
    try {
      const keyBytes = this.key.match(/.{2}/g)?.map(hex => parseInt(hex, 16)) || [];
      const encryptedBytes = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      const decrypted = new Uint8Array(encryptedBytes.length);
      
      for (let i = 0; i < encryptedBytes.length; i++) {
        decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
      }
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.warn('Decryption failed, returning as-is:', error);
      return encryptedData;
    }
  }
}

// ============================================================================
// STORAGE MANAGER CLASS
// ============================================================================

class LocalStorageManager {
  private encryption: SimpleEncryption;
  private lastBackupTime: number = 0;

  constructor() {
    this.encryption = new SimpleEncryption();
    this.initializeStorage();
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  private initializeStorage(): void {
    try {
      // Check if localStorage is available
      if (!this.isLocalStorageAvailable()) {
        throw new Error('localStorage is not available');
      }

      // Initialize metrics if not exists
      if (!globalThis.localStorage.getItem(STORAGE_KEYS.METRICS)) {
        this.updateMetrics({
          totalSize: 0,
          itemCount: 0,
          lastCleanup: new Date(),
          backupCount: 0
        });
      }

      // Perform initial cleanup if needed
      this.performCleanupIfNeeded();
    } catch (error) {
      console.error('Failed to initialize localStorage:', error);
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      globalThis.localStorage.setItem(test, 'test');
      globalThis.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // ========================================================================
  // DATA PERSISTENCE AND RETRIEVAL
  // ========================================================================

  saveData(data: Partial<LocalStorageData>): boolean {
    try {
      const currentData = this.loadData();
      const updatedData: LocalStorageData = {
        ...currentData,
        ...data,
        progress: {
          ...currentData.progress,
          ...data.progress,
          lastUpdated: new Date()
        }
      };

      const serializedData = JSON.stringify(updatedData, this.dateReplacer);
      const encryptedData = this.encryption.encrypt(serializedData);
      
      globalThis.localStorage.setItem(STORAGE_KEYS.MAIN_DATA, encryptedData);
      
      // Create backup if enough time has passed
      this.createBackupIfNeeded(updatedData);
      
      // Update metrics
      this.updateStorageMetrics();
      
      return true;
    } catch (error) {
      console.error('Failed to save data:', error);
      return false;
    }
  }

  loadData(): LocalStorageData {
    try {
      const encryptedData = globalThis.localStorage.getItem(STORAGE_KEYS.MAIN_DATA);
      
      if (!encryptedData) {
        return this.getDefaultData();
      }

      const decryptedData = this.encryption.decrypt(encryptedData);
      const parsedData = JSON.parse(decryptedData, this.dateReviver);
      
      // Validate and migrate data if needed
      return this.validateAndMigrateData(parsedData);
    } catch (error) {
      console.error('Failed to load data, using default:', error);
      return this.getDefaultData();
    }
  }

  private getDefaultData(): LocalStorageData {
    return {
      resumeData: {
        basicInfo: {
          fullName: '',
          email: '',
          phone: ''
        },
        education: [],
        experience: [],
        projects: [],
        skills: {
          primary: []
        },
        achievements: {},
        socialLinks: {},
        metadata: {
          background: 'tech',
          experience: 'fresher',
          completedSections: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      chatHistory: [],
      userProfile: {
        background: 'tech',
        experience: 'fresher',
        preferences: {
          skipOptional: false,
          fastMode: false
        }
      },
      progress: {
        currentSection: 'classification',
        completedSections: [],
        lastUpdated: new Date()
      },
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true
      }
    };
  }

  // ========================================================================
  // BACKUP AND RECOVERY
  // ========================================================================

  createBackup(data?: LocalStorageData): boolean {
    try {
      const dataToBackup = data || this.loadData();
      const backup: StorageBackup = {
        data: dataToBackup,
        timestamp: new Date(),
        version: STORAGE_CONFIG.VERSION,
        checksum: this.generateChecksum(dataToBackup)
      };

      const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}${Date.now()}`;
      const serializedBackup = JSON.stringify(backup, this.dateReplacer);
      const encryptedBackup = this.encryption.encrypt(serializedBackup);
      
      globalThis.localStorage.setItem(backupKey, encryptedBackup);
      
      // Clean old backups
      this.cleanOldBackups();
      
      this.lastBackupTime = Date.now();
      return true;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return false;
    }
  }

  private createBackupIfNeeded(data: LocalStorageData): void {
    const now = Date.now();
    if (now - this.lastBackupTime >= STORAGE_CONFIG.BACKUP_INTERVAL) {
      this.createBackup(data);
    }
  }

  getBackups(): StorageBackup[] {
    const backups: StorageBackup[] = [];
    
    try {
      for (let i = 0; i < globalThis.localStorage.length; i++) {
        const key = globalThis.localStorage.key(i);
        if (key?.startsWith(STORAGE_KEYS.BACKUP_PREFIX)) {
          const encryptedBackup = globalThis.localStorage.getItem(key);
          if (encryptedBackup) {
            const decryptedBackup = this.encryption.decrypt(encryptedBackup);
            const backup = JSON.parse(decryptedBackup, this.dateReviver);
            backups.push(backup);
          }
        }
      }
      
      return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Failed to get backups:', error);
      return [];
    }
  }

  restoreFromBackup(timestamp: number): boolean {
    try {
      const backups = this.getBackups();
      const backup = backups.find(b => {
        const backupTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
        return backupTime === timestamp;
      });
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Verify checksum
      const currentChecksum = this.generateChecksum(backup.data);
      if (currentChecksum !== backup.checksum) {
        throw new Error('Backup data is corrupted');
      }

      return this.saveData(backup.data);
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  private cleanOldBackups(): void {
    try {
      const backups = this.getBackups();
      
      if (backups.length > STORAGE_CONFIG.MAX_BACKUPS) {
        const backupsToDelete = backups.slice(STORAGE_CONFIG.MAX_BACKUPS);
        
        backupsToDelete.forEach(backup => {
          const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}${backup.timestamp.getTime()}`;
          globalThis.localStorage.removeItem(backupKey);
        });
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  // ========================================================================
  // DATA CLEANUP AND GARBAGE COLLECTION
  // ========================================================================

  performCleanup(): StorageMetrics {
    try {
      // Remove expired or invalid data
      this.cleanInvalidData();
      
      // Clean old backups
      this.cleanOldBackups();
      
      // Compact data if possible
      this.compactData();
      
      // Update metrics
      const metrics = this.updateStorageMetrics();
      
      // Update last cleanup time
      metrics.lastCleanup = new Date();
      this.updateMetrics(metrics);
      
      return metrics;
    } catch (error) {
      console.error('Cleanup failed:', error);
      return this.getStorageMetrics();
    }
  }

  private performCleanupIfNeeded(): void {
    const metrics = this.getStorageMetrics();
    const quotaUsage = this.getQuotaUsage();
    
    if (quotaUsage > STORAGE_CONFIG.CLEANUP_THRESHOLD) {
      console.log('Storage quota threshold reached, performing cleanup');
      this.performCleanup();
    }
  }

  private cleanInvalidData(): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < globalThis.localStorage.length; i++) {
      const key = globalThis.localStorage.key(i);
      if (!key) continue;
      
      // Check for orphaned or invalid keys
      if (key.startsWith('ats_resume_') && 
          !Object.values(STORAGE_KEYS).some(validKey => 
            key === validKey || key.startsWith(validKey)
          )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => globalThis.localStorage.removeItem(key));
  }

  private compactData(): void {
    try {
      const data = this.loadData();
      
      // Remove empty arrays and objects
      this.removeEmptyValues(data);
      
      // Save compacted data
      this.saveData(data);
    } catch (error) {
      console.error('Data compaction failed:', error);
    }
  }

  private removeEmptyValues(obj: any): void {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          obj[key] = obj[key].filter((item: any) => 
            item !== null && item !== undefined && item !== ''
          );
        } else {
          this.removeEmptyValues(obj[key]);
        }
      }
    });
  }

  clearAllData(): boolean {
    try {
      // Remove all ATS resume related data
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < globalThis.localStorage.length; i++) {
        const key = globalThis.localStorage.key(i);
        if (key?.startsWith('ats_resume_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => globalThis.localStorage.removeItem(key));
      
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      return false;
    }
  }

  // ========================================================================
  // METRICS AND MONITORING
  // ========================================================================

  getStorageMetrics(): StorageMetrics {
    try {
      const metricsData = globalThis.localStorage.getItem(STORAGE_KEYS.METRICS);
      if (metricsData) {
        return JSON.parse(metricsData, this.dateReviver);
      }
    } catch (error) {
      console.error('Failed to get storage metrics:', error);
    }
    
    return {
      totalSize: 0,
      itemCount: 0,
      lastCleanup: new Date(),
      backupCount: 0
    };
  }

  private updateStorageMetrics(): StorageMetrics {
    const metrics: StorageMetrics = {
      totalSize: this.calculateTotalSize(),
      itemCount: this.countStorageItems(),
      lastCleanup: this.getStorageMetrics().lastCleanup,
      backupCount: this.getBackups().length
    };
    
    this.updateMetrics(metrics);
    return metrics;
  }

  private updateMetrics(metrics: StorageMetrics): void {
    try {
      globalThis.localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics, this.dateReplacer));
    } catch (error) {
      console.error('Failed to update metrics:', error);
    }
  }

  private calculateTotalSize(): number {
    let totalSize = 0;
    
    for (let i = 0; i < globalThis.localStorage.length; i++) {
      const key = globalThis.localStorage.key(i);
      if (key?.startsWith('ats_resume_')) {
        const value = globalThis.localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }
    
    return totalSize;
  }

  private countStorageItems(): number {
    let count = 0;
    
    for (let i = 0; i < globalThis.localStorage.length; i++) {
      const key = globalThis.localStorage.key(i);
      if (key?.startsWith('ats_resume_')) {
        count++;
      }
    }
    
    return count;
  }

  getQuotaUsage(): number {
    try {
      const totalSize = this.calculateTotalSize();
      // Estimate localStorage quota (usually 5-10MB)
      const estimatedQuota = 5 * 1024 * 1024; // 5MB
      return totalSize / estimatedQuota;
    } catch (error) {
      console.error('Failed to calculate quota usage:', error);
      return 0;
    }
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  private generateChecksum(data: LocalStorageData): string {
    const str = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(16);
  }

  private validateAndMigrateData(data: any): LocalStorageData {
    // Ensure all required fields exist
    const defaultData = this.getDefaultData();
    
    return {
      resumeData: { ...defaultData.resumeData, ...data.resumeData },
      chatHistory: Array.isArray(data.chatHistory) ? data.chatHistory : [],
      userProfile: { ...defaultData.userProfile, ...data.userProfile },
      progress: { ...defaultData.progress, ...data.progress },
      preferences: { ...defaultData.preferences, ...data.preferences }
    };
  }

  private dateReplacer(key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  private dateReviver(key: string, value: any): any {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  }

  // ========================================================================
  // PUBLIC API METHODS
  // ========================================================================

  exportData(): string {
    try {
      const data = this.loadData();
      return JSON.stringify(data, this.dateReplacer, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return '';
    }
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData, this.dateReviver);
      const validatedData = this.validateAndMigrateData(data);
      return this.saveData(validatedData);
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE AND PUBLIC API
// ============================================================================

let storageManager: LocalStorageManager | null = null;

function getStorageManager(): LocalStorageManager {
  if (!storageManager) {
    storageManager = new LocalStorageManager();
  }
  return storageManager;
}

// Public API functions
export const localStorage = {
  // Data persistence
  save: (data: Partial<LocalStorageData>) => getStorageManager().saveData(data),
  load: () => getStorageManager().loadData(),
  
  // Backup and recovery
  createBackup: () => getStorageManager().createBackup(),
  getBackups: () => getStorageManager().getBackups(),
  restoreFromBackup: (timestamp: number) => getStorageManager().restoreFromBackup(timestamp),
  
  // Cleanup and maintenance
  cleanup: () => getStorageManager().performCleanup(),
  clearAll: () => getStorageManager().clearAllData(),
  
  // Metrics and monitoring
  getMetrics: () => getStorageManager().getStorageMetrics(),
  getQuotaUsage: () => getStorageManager().getQuotaUsage(),
  
  // Import/Export
  export: () => getStorageManager().exportData(),
  import: (data: string) => getStorageManager().importData(data)
};

export default localStorage;