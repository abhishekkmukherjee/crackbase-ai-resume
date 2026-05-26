'use client'

import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { Message, Step } from '../lib/types'

interface QuestionConfig {
  placeholder: string
  hint?: string
  isTextarea?: boolean
}

interface ChatPanelProps {
  messages: Message[]
  currentQuestion: QuestionConfig | null
  isGenerating: boolean
  step: Step
  onAnswer: (answer: string, choiceValue?: string) => void
}

export default function ChatPanel({ messages, currentQuestion, isGenerating, step, onAnswer }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
  const disabled = !currentQuestion || isGenerating || step === 'generating' || step === 'complete'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!disabled) {
      setTimeout(() => (inputRef.current as HTMLElement)?.focus(), 80)
    }
  }, [step, disabled])

  const submit = () => {
    const val = input.trim()
    if (!val || disabled) return
    setInput('')
    onAnswer(val)
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const lastMsg = messages[messages.length - 1]
  const showChoices = lastMsg?.role === 'bot' && lastMsg.choices && !isGenerating

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg-in flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-[#1C1C1C] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L7.5 4.5H11L8.25 6.75L9.25 10.5L6 8.5L2.75 10.5L3.75 6.75L1 4.5H4.5L6 1Z" fill="white"/>
                </svg>
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1C1C1C] text-white rounded-br-sm'
                  : 'bg-white border border-[#EBEBEB] text-[#1C1C1C] rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.isTyping ? (
                <span className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA] dot1 inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA] dot2 inline-block" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA] dot3 inline-block" />
                </span>
              ) : msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator while generating */}
        {isGenerating && (
          <div className="msg-in flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[#1C1C1C] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.5 4.5H11L8.25 6.75L9.25 10.5L6 8.5L2.75 10.5L3.75 6.75L1 4.5H4.5L6 1Z" fill="white"/>
              </svg>
            </div>
            <div className="bg-white border border-[#EBEBEB] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <span className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA] dot1 inline-block" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA] dot2 inline-block" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#AAAAAA] dot3 inline-block" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Choice buttons */}
      {showChoices && (
        <div className="px-5 pb-3 flex gap-2">
          {lastMsg.choices!.map((c) => (
            <button
              key={c.value}
              onClick={() => onAnswer(c.label, c.value)}
              className="px-4 py-1.5 rounded-full border border-[#1C1C1C] text-sm font-medium text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      {!disabled && (
        <div className="border-t border-[#EBEBEB] bg-white px-4 py-3">
          {currentQuestion?.hint && (
            <p className="text-xs text-[#9C9C9C] mb-2">{currentQuestion.hint}</p>
          )}
          <div className="flex gap-2 items-end">
            {currentQuestion?.isTextarea ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={currentQuestion?.placeholder || ''}
                rows={4}
                className="flex-1 resize-none text-sm text-[#1C1C1C] placeholder-[#BBBBBB] bg-[#F7F6F3] rounded-xl px-3 py-2.5 border border-transparent focus:border-[#CCCCCC] focus:outline-none transition-colors"
              />
            ) : (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={currentQuestion?.placeholder || ''}
                className="flex-1 text-sm text-[#1C1C1C] placeholder-[#BBBBBB] bg-[#F7F6F3] rounded-xl px-3 py-2.5 border border-transparent focus:border-[#CCCCCC] focus:outline-none transition-colors"
              />
            )}
            <button
              onClick={submit}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-[#1C1C1C] flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-[#333] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 7M13 7L7 13M13 7H1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="border-t border-[#EBEBEB] bg-white px-5 py-4">
          <p className="text-xs text-center text-[#9C9C9C]">
            Your resume is ready — check the preview on the right
          </p>
        </div>
      )}
    </div>
  )
}
