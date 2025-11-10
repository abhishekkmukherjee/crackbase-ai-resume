'use client';

import { useState } from 'react';
import { PersonalInfo } from '@/lib/types';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
  onNext: () => void;
}

export default function PersonalInfoForm({ data, onUpdate, onNext }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-gray-900 placeholder-gray-400
    ${errors[fieldName] 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
    }
    focus:outline-none focus:ring-4 bg-white hover:border-gray-300
  `;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic details to create your professional resume.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClasses('name')}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClasses('email')}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputClasses('phone')}
              placeholder="+91 9876543210"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={inputClasses('address')}
            placeholder="123 Main Street, Apartment 4B"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        {/* City, State, ZIP Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={inputClasses('city')}
              placeholder="Mumbai"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              required
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className={inputClasses('state')}
              placeholder="Maharashtra"
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP Code *
            </label>
            <input
              type="text"
              required
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              className={inputClasses('zipCode')}
              placeholder="400001"
            />
            {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Professional Summary
            <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            value={formData.summary || ''}
            onChange={(e) => handleChange('summary', e.target.value)}
            className={inputClasses('summary')}
            placeholder="Brief overview of your professional background and career objectives..."
            rows={4}
          />
          <p className="mt-1 text-xs text-gray-500">A compelling summary can help your resume stand out to employers.</p>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Professional Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                LinkedIn Profile
                <span className="text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className={inputClasses('linkedin')}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                GitHub Profile
                <span className="text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                className={inputClasses('github')}
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Portfolio Website
              <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <input
              type="url"
              value={formData.portfolio || ''}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              className={inputClasses('portfolio')}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue to Education
          <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </form>
    </div>
  );
}
