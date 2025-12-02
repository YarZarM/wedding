export const weddingConfig = {
  couple: {
    name1: "Su Pyae",
    name2: "Yar Zar",
  },
  date: "2026-02-03T18:00:00",
  venue: {
    ceremony: {
      name: "Novotel Bangkok Sukhumvit 20",
      address: "19/9 Sukhumvit 20 Alley, Khlong Toei, Bangkok 10110, Thailand",
      time: "6:00 PM - 9:00 PM"
    },
    reception: {
      name: "Novotel Bangkok Sukhumvit 20",
      address: "Same venue",
      time: "6:00 PM - 9:00 PM"
    }
  },
  rsvpDeadline: "November 30th, 2025",
  registries: [
    { name: 'Amazon', color: 'bg-orange-500', url: 'https://amazon.com/registry' },
    { name: 'Target', color: 'bg-red-600', url: 'https://target.com/registry' },
    { name: 'Bed Bath & Beyond', color: 'bg-blue-600', url: 'https://bedbathandbeyond.com' }
  ]
} as const;

export type WeddingConfig = typeof weddingConfig;