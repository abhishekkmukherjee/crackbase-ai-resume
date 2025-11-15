'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../../lib/chatbot/types';

interface InputFieldProps {
  message: ChatMessage;
  onSend: (content: string) => Promise<void>;
  onSkip?: () => Promise<void>;
  disabled?: boolean;
  onSuggestionInsert?: (handler: (suggestion: string) => void) => void;
}

export default function InputField({ message, onSend, onSkip, disabled = false, onSuggestionInsert }: InputFieldProps) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const { metadata } = message;
  const inputType = metadata?.inputType || 'text';
  const options = metadata?.options || [];
  const isRequired = metadata?.isRequired || false;

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Handle suggestion insertion
  const handleSuggestionInsert = useCallback((suggestion: string) => {
    if (inputType === 'textarea') {
      // For textarea, append to existing content
      const currentValue = value;
      const newValue = currentValue ? `${currentValue}\n${suggestion}` : suggestion;
      setValue(newValue);
    } else {
      // For regular inputs, replace content
      setValue(suggestion);
    }
    
    // Focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [message.metadata?.inputType, value]);

  // Expose suggestion handler to parent
  useEffect(() => {
    if (onSuggestionInsert) {
      onSuggestionInsert(handleSuggestionInsert);
    }
  }, [onSuggestionInsert, handleSuggestionInsert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || isSubmitting || (!value.trim() && isRequired)) return;

    setIsSubmitting(true);
    try {
      await onSend(value.trim());
      setValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (disabled || isSubmitting || !onSkip) return;
    
    setIsSubmitting(true);
    try {
      await onSkip();
      setValue('');
    } catch (error) {
      console.error('Error skipping question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = () => {
    const commonProps = {
      ref: inputRef as any,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
      disabled: disabled || isSubmitting,
      className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    };

    switch (inputType) {
      case 'textarea':
        return <textarea {...commonProps} rows={3} placeholder="Type your response..." />;
      case 'email':
        return <input {...commonProps} type="email" placeholder="Enter your email..." />;
      case 'number':
        return <input {...commonProps} type="number" placeholder="Enter a number..." />;
      case 'select':
        return (
          <div>
            <input {...commonProps} type="text" placeholder="Choose an option..." list="options" />
            {options.length > 0 && (
              <datalist id="options">
                {options.map((option, index) => (
                  <option key={index} value={option} />
                ))}
              </datalist>
            )}
          </div>
        );
      default:
        return <input {...commonProps} type="text" placeholder="Type your response..." />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {renderInput()}
      
      <div className="flex items-center justify-between">
        <div>
          {!isRequired && onSkip && (
            <button
              type="button"
              onClick={handleSkip}
              disabled={disabled || isSubmitting}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Skip
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || isSubmitting || (!value.trim() && isRequired)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}