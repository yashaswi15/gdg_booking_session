
import { Speaker, TimeSlot, User } from "@/types";

export const mockSpeakers: Speaker[] = [
  {
    id: "1",
    first_name: "Alex",
    last_name: "Johnson",
    email: "alex@example.com",
    user_type: "speaker",
    created_at: "2023-05-10T08:00:00.000Z",
    expertise: ["Artificial Intelligence", "Machine Learning", "Data Science"],
    price_per_session: 150,
    bio: "Alex is a renowned AI researcher with over 10 years of experience in the field.",
    profile_image: "https://i.pravatar.cc/300?img=1"
  },
  {
    id: "2",
    first_name: "Sarah",
    last_name: "Williams",
    email: "sarah@example.com",
    user_type: "speaker",
    created_at: "2023-05-15T08:00:00.000Z",
    expertise: ["Leadership", "Business Strategy", "Entrepreneurship"],
    price_per_session: 200,
    bio: "Sarah is a business strategist who has helped numerous startups scale successfully.",
    profile_image: "https://i.pravatar.cc/300?img=5"
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Chen",
    email: "michael@example.com",
    user_type: "speaker",
    created_at: "2023-05-20T08:00:00.000Z",
    expertise: ["Digital Marketing", "SEO", "Content Strategy"],
    price_per_session: 120,
    bio: "Michael specializes in digital marketing strategies that drive measurable results.",
    profile_image: "https://i.pravatar.cc/300?img=3"
  },
  {
    id: "4",
    first_name: "Jessica",
    last_name: "Rodriguez",
    email: "jessica@example.com",
    user_type: "speaker",
    created_at: "2023-05-25T08:00:00.000Z",
    expertise: ["UX Design", "Product Management", "Innovation"],
    price_per_session: 180,
    bio: "Jessica is a product design expert who helps companies create user-centered products.",
    profile_image: "https://i.pravatar.cc/300?img=25"
  },
  {
    id: "5",
    first_name: "David",
    last_name: "Kim",
    email: "david@example.com",
    user_type: "speaker",
    created_at: "2023-06-01T08:00:00.000Z",
    expertise: ["Blockchain", "Cryptocurrency", "Web3"],
    price_per_session: 250,
    bio: "David is a blockchain expert who has been involved in the space since 2013.",
    profile_image: "https://i.pravatar.cc/300?img=12"
  },
];

// Generate time slots for the next 7 days for each speaker
export const generateTimeSlots = (speakerId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate hourly slots from 9 AM to 4 PM
    for (let hour = 9; hour < 16; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      slots.push({
        id: `${speakerId}-${dateStr}-${startTime}`,
        speaker_id: speakerId,
        date: dateStr,
        start_time: startTime,
        end_time: endTime,
        is_booked: Math.random() > 0.7 // Randomly mark some slots as booked for demo purposes
      });
    }
  }
  
  return slots;
};

// Assign available slots to each mock speaker
export const mockSpeakersWithSlots = mockSpeakers.map(speaker => ({
  ...speaker,
  available_slots: generateTimeSlots(speaker.id)
}));

export const mockUser: User = {
  id: "101",
  first_name: "Sam",
  last_name: "User",
  email: "sam@example.com",
  user_type: "user",
  created_at: "2023-04-15T08:00:00.000Z",
};
