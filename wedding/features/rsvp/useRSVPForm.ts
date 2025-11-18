'use client'

import { useState } from 'react';
import { RSVPFormData } from '@/app/types';
import { rsvpService } from './rsvpService';

interface UseRSVPFormReturn {
  formData: RSVPFormData;
  updateField: (field: keyof RSVPFormData, value: string) => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  resetForm: () => void;
}

const initialFormData: RSVPFormData = {
  name: '',
  email: '',
  phone: '',
  guests: '1',
  attending: 'yes',
  message: ''
};

export function useRSVPForm(): UseRSVPFormReturn {
  const [formData, setFormData] = useState<RSVPFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof RSVPFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    // Name validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
    setIsSubmitted(false);
  };

  const submitForm = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await rsvpService.submitRSVP(formData);
      
      // Success!
      setIsSubmitted(true);
      resetForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    submitForm,
    isSubmitting,
    isSubmitted,
    error,
    resetForm
  };
}