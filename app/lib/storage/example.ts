// Example usage of the localStorage management system
import { localStorage } from './localStorage';
import type { ResumeData, ChatMessage } from '../chatbot/types';

// Example: Save resume data
export function saveResumeExample() {
  const resumeData: Partial<ResumeData> = {
    basicInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      headline: 'Full Stack Developer'
    },
    education: [{
      degree: 'Bachelor of Computer Science',
      institution: 'Stanford University',
      startYear: 2018,
      endYear: 2022,
      marks: '3.8 GPA'
    }],
    skills: {
      primary: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      techStack: ['MongoDB', 'Express', 'React', 'Node.js']
    }
  };

  const success = localStorage.save({ resumeData: resumeData as ResumeData });
  console.log('Resume saved:', success);
  
  return success;
}

// Example: Load and display resume data
export function loadResumeExample() {
  const data = localStorage.load();
  console.log('Loaded resume data:', data.resumeData);
  
  return data;
}

// Example: Create and manage backups
export function backupExample() {
  // Create a backup
  const backupSuccess = localStorage.createBackup();
  console.log('Backup created:', backupSuccess);
  
  // List all backups
  const backups = localStorage.getBackups();
  console.log('Available backups:', backups.length);
  
  // Restore from most recent backup if available
  if (backups.length > 0) {
    const latestBackup = backups[0];
    const timestamp = latestBackup.timestamp instanceof Date 
      ? latestBackup.timestamp.getTime() 
      : new Date(latestBackup.timestamp).getTime();
    
    const restoreSuccess = localStorage.restoreFromBackup(timestamp);
    console.log('Restore successful:', restoreSuccess);
  }
  
  return { backupSuccess, backupCount: backups.length };
}

// Example: Monitor storage usage
export function monitorStorageExample() {
  const metrics = localStorage.getMetrics();
  const quotaUsage = localStorage.getQuotaUsage();
  
  console.log('Storage metrics:', {
    totalSize: `${(metrics.totalSize / 1024).toFixed(2)} KB`,
    itemCount: metrics.itemCount,
    quotaUsage: `${(quotaUsage * 100).toFixed(1)}%`,
    lastCleanup: metrics.lastCleanup
  });
  
  // Perform cleanup if quota usage is high
  if (quotaUsage > 0.8) {
    console.log('High storage usage detected, performing cleanup...');
    const cleanupMetrics = localStorage.cleanup();
    console.log('Cleanup completed:', cleanupMetrics);
  }
  
  return { metrics, quotaUsage };
}

// Example: Export and import data
export function exportImportExample() {
  // Export current data
  const exportedData = localStorage.export();
  console.log('Data exported, size:', exportedData.length, 'characters');
  
  // Save to file (in a real app, you might trigger a download)
  const blob = new Blob([exportedData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  console.log('Export blob URL:', url);
  
  // Import data (in a real app, this would come from a file upload)
  const importSuccess = localStorage.import(exportedData);
  console.log('Import successful:', importSuccess);
  
  return { exportSize: exportedData.length, importSuccess };
}

// Example: Handle chat messages
export function chatExample() {
  const chatMessages: ChatMessage[] = [
    {
      id: '1',
      type: 'bot',
      content: 'Hello! Let\'s build your resume. What\'s your full name?',
      timestamp: new Date(),
      metadata: {
        field: 'fullName',
        section: 'basic_info',
        isRequired: true,
        inputType: 'text'
      }
    },
    {
      id: '2',
      type: 'user',
      content: 'John Doe',
      timestamp: new Date()
    }
  ];

  const success = localStorage.save({ chatHistory: chatMessages });
  console.log('Chat history saved:', success);
  
  const loadedData = localStorage.load();
  console.log('Chat history loaded:', loadedData.chatHistory.length, 'messages');
  
  return { success, messageCount: loadedData.chatHistory.length };
}

// Example: Complete workflow
export function completeWorkflowExample() {
  console.log('=== Complete localStorage Workflow Example ===');
  
  // 1. Save initial data
  console.log('\n1. Saving resume data...');
  saveResumeExample();
  
  // 2. Add chat history
  console.log('\n2. Adding chat history...');
  chatExample();
  
  // 3. Create backup
  console.log('\n3. Creating backup...');
  backupExample();
  
  // 4. Monitor storage
  console.log('\n4. Monitoring storage...');
  monitorStorageExample();
  
  // 5. Export data
  console.log('\n5. Exporting data...');
  exportImportExample();
  
  // 6. Load final state
  console.log('\n6. Final state:');
  const finalData = loadResumeExample();
  
  console.log('\n=== Workflow Complete ===');
  return finalData;
}