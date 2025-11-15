// PDF Generation Library
// Exports all PDF-related functionality for the ATS Resume Chatbot

export {
  PDFGenerator,
  generateResumePDF,
  downloadPDF,
  type PDFGeneratorOptions,
  type PDFResult,
  type ATSScore
} from './pdfGenerator';

export {
  getTemplateConfig,
  getAvailableTemplates,
  getOptimalSectionOrder,
  validateATSCompliance,
  ATS_STANDARD_TEMPLATE,
  ATS_MODERN_TEMPLATE,
  ATS_MINIMAL_TEMPLATE,
  ATS_OPTIMIZATION_RULES,
  type TemplateConfig,
  type SectionOrder,
  type ATSOptimizationRules
} from './templates';

// Re-export PDF components for convenience
export { default as PDFPreview } from '../../components/pdf/PDFPreview';
export { default as EmailCaptureModal } from '../../components/pdf/EmailCaptureModal';
export { default as DownloadSuccessModal } from '../../components/pdf/DownloadSuccessModal';
export { default as PDFDownloadWithEmail, AIInterestButton } from '../../components/pdf/PDFDownloadWithEmail';