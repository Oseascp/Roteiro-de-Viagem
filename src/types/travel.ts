export type ActivityCategory = 
  | 'attraction'
  | 'food'
  | 'hotel'
  | 'transport'
  | 'leisure'
  | 'shopping'
  | 'cultural';

export interface Activity {
  id: string;
  time: string; // e.g. "09:30"
  title: string;
  category: ActivityCategory;
  location?: string;
  cost: number; // in BRL
  isPaid: boolean;
  notes?: string;
  completed: boolean;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  date: string; // YYYY-MM-DD
  themeOrTitle: string; // e.g. "Chegada e Praias da Zona Sul"
  activities: Activity[];
  notes?: string;
}

export type PackingCategory = 'docs' | 'clothes' | 'electronics' | 'health' | 'other';

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  isPacked: boolean;
}

export interface EmergencyContact {
  label: string;
  number: string;
  notes?: string;
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coverImage: string;
  tripStyle: 'Econômica' | 'Casal' | 'Família' | 'Aventura' | 'Gastronômica' | 'Cultural';
  totalBudget: number; // in BRL
  days: DayPlan[];
  packingList: PackingItem[];
  emergencyContacts: EmergencyContact[];
  flightOrBusNotes?: string;
  hotelNotes?: string;
}

export interface CuratedTemplate {
  id: string;
  title: string;
  destination: string;
  country: string;
  durationDays: number;
  suggestedBudget: number;
  coverImage: string;
  highlights: string[];
  description: string;
  days: DayPlan[];
}
