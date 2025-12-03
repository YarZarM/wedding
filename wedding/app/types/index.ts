// export interface RSVPFormData {
//   name: string;
//   email: string;
//   phone: string;
//   guests: string;
//   attending: 'yes' | 'no';
//   message: string;
// }

export interface RSVPFormData {
  name: string;
  email: string;
  phone: string;
  guests: string;
  attending: string;
  message: string;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Venue {
  name: string;
  address: string;
  time: string;
}