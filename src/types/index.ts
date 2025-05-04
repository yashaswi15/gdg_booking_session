
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'user' | 'speaker';
  created_at: string;
}

export interface Speaker extends User {
  expertise: string[];
  price_per_session: number;
  bio: string;
  profile_image?: string;
  available_slots?: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  speaker_id: string;
  date: string;
  start_time: string; // Format: HH:MM (24-hour)
  end_time: string; // Format: HH:MM (24-hour)
  is_booked: boolean;
  booking_id?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  speaker_id: string;
  slot_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
