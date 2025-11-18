import { RSVPFormData } from '@/app/types';

export const rsvpService = {
  async submitRSVP(data: RSVPFormData): Promise<{ success: boolean }> {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to submit RSVP');
    }

    return response.json();
  }
};