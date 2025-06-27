export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: Date;
  membershipTier: 'basic' | 'premium' | 'elite';
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  cuisines: string[];
  dietaryRestrictions: string[];
  priceRange: [number, number];
  socialVisibility: 'public' | 'friends' | 'private';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  reservationReminders: boolean;
  friendActivity: boolean;
  exclusiveOffers: boolean;
  groupInvites: boolean;
}

export interface UserStats {
  restaurantsVisited: number;
  cuisinesExplored: number;
  friendsConnected: number;
  reviewsWritten: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  priceRange: number;
  rating: number;
  reviewCount: number;
  images: string[];
  address: string;
  distance: number;
  phone: string;
  website?: string;
  hours: DayHours[];
  availability: 'available' | 'limited' | 'unavailable';
  waitTime?: number;
  features: string[];
  hasInsiderAccess: boolean;
  coordinates: [number, number];
}

export interface DayHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  userId: string;
  date: Date;
  time: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  specialRequests?: string;
  occasion?: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  restaurantId: string;
  images: string[];
  date: Date;
  duration: string;
  capacity: number;
  spotsAvailable: number;
  price: number;
  membershipRequired: 'basic' | 'premium' | 'elite';
  type: 'chefs-table' | 'wine-vault' | 'private-dining' | 'workshop' | 'popup';
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  currentLocation?: {
    restaurantId: string;
    restaurantName: string;
    timestamp: Date;
  };
  mutualFriends: number;
}

export interface SocialActivity {
  id: string;
  type: 'checkin' | 'review' | 'photo' | 'group-plan';
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: Date;
  content: CheckinActivity | ReviewActivity | PhotoActivity | GroupPlanActivity;
}

export interface CheckinActivity {
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
}

export interface ReviewActivity {
  restaurantId: string;
  restaurantName: string;
  rating: number;
  reviewText: string;
}

export interface PhotoActivity {
  restaurantId: string;
  restaurantName: string;
  dishName: string;
  imageUrl: string;
  likes: number;
}

export interface GroupPlanActivity {
  eventName: string;
  memberCount: number;
  status: 'planning' | 'voting' | 'confirmed';
  restaurantOptions?: string[];
}

export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  suggestions?: string[];
  restaurantRecommendations?: Restaurant[];
}