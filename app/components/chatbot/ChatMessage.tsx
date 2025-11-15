'use client';

import React from 'react';
import { ChatMessage as ChatMessageType } from '../../lib/chatbot/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

export default function ChatMessage({ message, isLatest = false }: ChatMessageProps) {
  const isBot = message.type === 'bot';
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Bot Avatar */}
      {isBot && (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-md px-4 py-3 rounded-lg ${
        isBot 
          ? 'bg-white border border-gray-200 text-gray-800' 
          : 'bg-blue-600 text-white'
      } ${isLatest ? 'animate-pulse-once' : ''}`}>
        <div className="text-sm">
          {message.content}
        </div>
        
        {/* Question metadata for bot messages */}
        {isBot && message.metadata && (
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
            {message.metadata.isRequired && (
              <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs mr-2">
                Required
              </span>
            )}
            {message.metadata.inputType && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {message.metadata.inputType}
              </span>
            )}
            {message.metadata.options && message.metadata.options.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-400 mb-1">Options:</div>
                <div className="flex flex-wrap gap-1">
                  {message.metadata.options.map((option, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}