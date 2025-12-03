// 'use client'

import { useState, useEffect  } from 'react';
import { RSVPFormData } from '@/app/types';
import { rsvpService } from './rsvpService';

// interface UseRSVPFormReturn {
//   formData: RSVPFormData;
//   updateField: (field: keyof RSVPFormData, value: string) => void;
//   submitForm: () => Promise<void>;
//   isSubmitting: boolean;
//   isSubmitted: boolean;
//   error: string | null;
//   resetForm: () => void;
// }

// const initialFormData: RSVPFormData = {
//   name: '',
//   email: '',
//   phone: '',
//   guests: '1',
//   attending: 'yes',
//   message: ''
// };

// export function useRSVPForm(): UseRSVPFormReturn {
//   const [formData, setFormData] = useState<RSVPFormData>(initialFormData);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const updateField = (field: keyof RSVPFormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (error) {
//       setError(null);
//     }
//   };

//   const validateForm = (): boolean => {
//     // Name validation
//     if (!formData.name.trim()) {
//       setError('Please enter your name');
//       return false;
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       setError('Please enter your email');
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }

//     return true;
//   };

//   const resetForm = () => {
//     setFormData(initialFormData);
//     setError(null);
//     setIsSubmitted(false);
//   };

//   const submitForm = async () => {
//     setError(null);
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await rsvpService.submitRSVP(formData);
      
//       // Success!
//       setIsSubmitted(true);
//       resetForm();
      
//       // Hide success message after 3 seconds
//       setTimeout(() => {
//         setIsSubmitted(false);
//       }, 3000);
//     } catch (err) {
//       const errorMessage = err instanceof Error 
//         ? err.message 
//         : 'Something went wrong. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return {
//     formData,
//     updateField,
//     submitForm,
//     isSubmitting,
//     isSubmitted,
//     error,
//     resetForm
//   };
// }


const INITIAL_FORM_DATA: RSVPFormData = {
  name: '',
  email: '',
  phone: '',
  guests: '1',
  attending: 'yes',
  message: '',
};

const STORAGE_KEY = 'wedding_rsvp_submitted';
const FORM_DATA_KEY = 'wedding_rsvp_data';

export function useRSVPForm() {
  const [formData, setFormData] = useState<RSVPFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [submittedData, setSubmittedData] = useState<RSVPFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check localStorage on mount
  useEffect(() => {
    const checkPreviousSubmission = () => {
      try {
        const submitted = localStorage.getItem(STORAGE_KEY);
        const savedData = localStorage.getItem(FORM_DATA_KEY);
        
        if (submitted === 'true' && savedData) {
          setHasSubmittedBefore(true);
          setIsSubmitted(true);
          setSubmittedData(JSON.parse(savedData));
        }
      } catch (err) {
        console.error('Error reading from localStorage:', err);
      }
    };

    checkPreviousSubmission();
  }, []);

  const updateField = (field: keyof RSVPFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if it has at least 10 digits (most phone numbers)
    // Adjust this based on your country requirements
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    // if (!formData.email.trim()) {
    //   setError('Please enter your email');
    //   return false;
    // }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }

    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   setError('Please enter a valid email address');
    //   return false;
    // }
    if (!formData.attending) {
      setError('Please select if you will be attending');
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit RSVP');
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
      
      setIsSubmitted(true);
      setHasSubmittedBefore(true);
      setSubmittedData(formData);
      
      // Reset form
      setFormData(INITIAL_FORM_DATA);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmission = () => {
    // Allow user to submit again (useful for testing or if they want to change their RSVP)
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FORM_DATA_KEY);
    setIsSubmitted(false);
    setHasSubmittedBefore(false);
    setSubmittedData(null);
    setFormData(INITIAL_FORM_DATA);
    setError(null);
  };

  return {
    formData,
    updateField,
    submitForm,
    resetSubmission,
    isSubmitting,
    isSubmitted,
    hasSubmittedBefore,
    submittedData,
    error,
  };
}