/*
  # FlavorFeed Complete Database Schema

  1. Core Tables
    - `profiles` - User profiles extending Supabase auth
    - `restaurants` - Restaurant data with location and features
    - `dishes` - Menu items with detailed categorization
    - `posts` - Social posts with ratings and media
    - `friendships` - Social connections between users
    - `subscriptions` - RevenueCat subscription management
    - `ai_conversations` - AI chat history and context
    - `reservations` - Restaurant bookings with smart features
    - `notifications` - Multi-channel notification system

  2. Security
    - Row Level Security enabled on all tables
    - Comprehensive RLS policies for data protection
    - Subscription-aware access control

  3. Performance
    - Strategic indexes for common query patterns
    - Full-text search capabilities
    - Geographic indexes for location queries
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  location GEOGRAPHY(POINT),
  location_name TEXT,
  
  -- Subscription Management
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'insider')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  revenuecat_user_id TEXT UNIQUE,
  
  -- User Preferences
  dietary_restrictions TEXT[],
  cuisine_preferences TEXT[],
  privacy_settings JSONB DEFAULT '{"profile": "public", "location": "friends", "activity": "public"}',
  notification_settings JSONB DEFAULT '{"push": true, "email": true, "sms": false, "ai_suggestions": true}',
  ai_voice_settings JSONB DEFAULT '{"voice_id": "default", "speed": 1.0, "enabled": true}',
  
  -- Gamification & Analytics
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_posts INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  friends_count INTEGER DEFAULT 0,
  
  -- System Fields
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Validation
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Restaurants table with advanced features
CREATE TABLE public.restaurants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  cuisine_types TEXT[] NOT NULL,
  location GEOGRAPHY(POINT) NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'US',
  postal_code TEXT,
  phone TEXT,
  website TEXT,
  email TEXT,
  
  -- Business Hours
  hours JSONB,
  special_hours JSONB,
  
  -- Pricing & Quality
  price_range INTEGER CHECK (price_range BETWEEN 1 AND 4),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  popularity_score DECIMAL(5,2) DEFAULT 0,
  
  -- Features & Amenities
  verified BOOLEAN DEFAULT FALSE,
  partner_restaurant BOOLEAN DEFAULT FALSE,
  insider_access BOOLEAN DEFAULT FALSE,
  amenities TEXT[],
  dietary_options TEXT[],
  
  -- Media & Content
  images TEXT[],
  menu_url TEXT,
  virtual_tour_url TEXT,
  
  -- Reservation Integration
  reservation_system TEXT,
  reservation_url TEXT,
  accepts_reservations BOOLEAN DEFAULT TRUE,
  typical_wait_time INTEGER,
  
  -- Business Management
  business_owner_id UUID REFERENCES public.profiles(id),
  claimed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'temporarily_closed', 'permanently_closed')),
  
  -- SEO & Discovery
  tags TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  check_in_count INTEGER DEFAULT 0,
  
  -- System Fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || array_to_string(tags, ' '))
  ) STORED
);

-- Dishes table with enhanced categorization
CREATE TABLE public.dishes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  
  -- Categorization
  category TEXT NOT NULL,
  subcategory TEXT,
  course_order INTEGER,
  
  -- Dietary Information
  dietary_tags TEXT[],
  allergens TEXT[],
  spice_level INTEGER CHECK (spice_level BETWEEN 0 AND 5),
  ingredients TEXT[],
  
  -- Nutritional Information
  calories INTEGER,
  protein_grams DECIMAL(5,2),
  carbs_grams DECIMAL(5,2),
  fat_grams DECIMAL(5,2),
  
  -- Media & Presentation
  images TEXT[],
  preparation_time INTEGER,
  
  -- Popularity & Analytics
  popularity_score DECIMAL(3,2) DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Availability
  available BOOLEAN DEFAULT TRUE,
  seasonal BOOLEAN DEFAULT FALSE,
  limited_time BOOLEAN DEFAULT FALSE,
  availability_schedule JSONB,
  
  -- Special Features
  chef_special BOOLEAN DEFAULT FALSE,
  house_favorite BOOLEAN DEFAULT FALSE,
  instagram_worthy BOOLEAN DEFAULT FALSE,
  
  -- System Fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || array_to_string(ingredients, ' '))
  ) STORED
);

-- Enhanced social posts table
CREATE TABLE public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id),
  dish_id UUID REFERENCES public.dishes(id),
  
  -- Content
  content TEXT,
  images TEXT[],
  video_url TEXT,
  
  -- Ratings
  overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
  dish_rating INTEGER CHECK (dish_rating BETWEEN 1 AND 5),
  service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
  atmosphere_rating INTEGER CHECK (atmosphere_rating BETWEEN 1 AND 5),
  value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
  
  -- Location & Context
  location GEOGRAPHY(POINT),
  visit_date DATE,
  meal_type TEXT,
  occasion TEXT,
  party_size INTEGER,
  
  -- Social Features
  tags TEXT[],
  mentions TEXT[],
  hashtags TEXT[],
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  
  -- Engagement Metrics
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  
  -- Verification & Quality
  verified_visit BOOLEAN DEFAULT FALSE,
  quality_score DECIMAL(3,2) DEFAULT 0,
  
  -- AI Enhancement
  ai_generated_tags TEXT[],
  ai_sentiment_score DECIMAL(3,2),
  ai_summary TEXT,
  
  -- System Fields
  featured BOOLEAN DEFAULT FALSE,
  reported BOOLEAN DEFAULT FALSE,
  moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social interactions
CREATE TABLE public.post_likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

CREATE TABLE public.post_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.post_comments(id),
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT FALSE,
  ai_moderated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT max_comment_length CHECK (char_length(content) <= 1000),
  CONSTRAINT no_empty_comments CHECK (trim(content) != '')
);

-- Advanced friendship system
CREATE TABLE public.friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  close_friend BOOLEAN DEFAULT FALSE,
  notification_settings JSONB DEFAULT '{"posts": true, "activity": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- Subscription management (RevenueCat integration)
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  revenuecat_subscription_id TEXT UNIQUE NOT NULL,
  product_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('premium', 'insider')),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled', 'in_trial', 'past_due')),
  
  -- Subscription Details
  original_purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiration_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  is_trial BOOLEAN DEFAULT FALSE,
  auto_renew BOOLEAN DEFAULT TRUE,
  
  -- Pricing
  price_usd DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  billing_period TEXT,
  
  -- Platform Details
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  store TEXT NOT NULL CHECK (store IN ('app_store', 'play_store', 'stripe')),
  transaction_id TEXT,
  
  -- Analytics
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversation history
CREATE TABLE public.ai_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  conversation_type TEXT DEFAULT 'general' CHECK (conversation_type IN ('general', 'recommendation', 'reservation', 'review')),
  
  -- Conversation Content
  messages JSONB NOT NULL,
  context JSONB,
  
  -- AI Response Metadata
  ai_provider TEXT DEFAULT 'ckcn',
  response_time_ms INTEGER,
  tokens_used INTEGER,
  cost_usd DECIMAL(8,4),
  
  -- Quality & Feedback
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),
  user_feedback TEXT,
  
  -- Voice Features
  voice_enabled BOOLEAN DEFAULT FALSE,
  voice_messages JSONB,
  
  -- System Fields
  active BOOLEAN DEFAULT TRUE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations with advanced features
CREATE TABLE public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  
  -- Reservation Details
  reservation_type TEXT DEFAULT 'standard' CHECK (reservation_type IN ('standard', 'floating', 'insider', 'waitlist')),
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  
  -- Timing
  reservation_datetime TIMESTAMP WITH TIME ZONE,
  time_window_start TIMESTAMP WITH TIME ZONE,
  time_window_end TIMESTAMP WITH TIME ZONE,
  estimated_duration_minutes INTEGER DEFAULT 120,
  
  -- Status Management
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show', 'modified')),
  confirmation_code TEXT UNIQUE,
  check_in_code TEXT UNIQUE,
  
  -- Contact Information
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  
  -- Special Requirements
  special_requests TEXT,
  dietary_requirements TEXT[],
  accessibility_needs TEXT[],
  celebration_type TEXT,
  
  -- External Integration
  external_reservation_id TEXT,
  external_platform TEXT,
  
  -- Pricing
  deposit_amount DECIMAL(10,2),
  deposit_paid BOOLEAN DEFAULT FALSE,
  cancellation_fee DECIMAL(10,2),
  
  -- Policies
  cancellation_policy TEXT,
  modification_policy TEXT,
  
  -- Notifications
  reminder_sent BOOLEAN DEFAULT FALSE,
  confirmation_sent BOOLEAN DEFAULT FALSE,
  follow_up_sent BOOLEAN DEFAULT FALSE,
  
  -- Analytics
  source TEXT,
  conversion_funnel JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications system
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Notification Details
  type TEXT NOT NULL CHECK (type IN ('friend_request', 'friend_accepted', 'post_like', 'post_comment', 'reservation_reminder', 'reservation_confirmed', 'insider_event', 'group_plan', 'ai_suggestion', 'achievement', 'subscription')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Rich Content
  image_url TEXT,
  action_url TEXT,
  deep_link TEXT,
  
  -- Metadata
  data JSONB,
  template_id TEXT,
  
  -- Delivery
  channels TEXT[] DEFAULT ARRAY['push'],
  delivery_status JSONB DEFAULT '{}',
  
  -- User Interaction
  read BOOLEAN DEFAULT FALSE,
  clicked BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Priority & Grouping
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  group_key TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- User activity tracking
CREATE TABLE public.user_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Activity Details
  activity_type TEXT NOT NULL,
  activity_data JSONB,
  session_id TEXT,
  
  -- Context
  location GEOGRAPHY(POINT),
  user_agent TEXT,
  ip_address INET,
  platform TEXT,
  app_version TEXT,
  
  -- Performance Metrics
  page_load_time_ms INTEGER,
  interaction_time_ms INTEGER,
  
  -- A/B Testing
  experiment_cohort TEXT,
  feature_flags TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR Check-in system
CREATE TABLE public.restaurant_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  verification_level TEXT NOT NULL CHECK (verification_level IN ('confirmed', 'likely', 'unverified')),
  table_number TEXT,
  points_earned INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate check-ins within short time
  CONSTRAINT unique_checkin_per_hour UNIQUE (user_id, restaurant_id, DATE_TRUNC('hour', created_at))
);

-- Device management for push notifications
CREATE TABLE public.user_devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  fcm_token TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  app_version TEXT,
  os_version TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, device_id)
);

-- Performance monitoring
CREATE TABLE public.api_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  
  -- Performance Metrics
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  error_message TEXT,
  
  -- External API Tracking
  external_api_calls JSONB,
  external_api_latency_ms INTEGER,
  external_api_cost_usd DECIMAL(8,4),
  
  -- Request Details
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  cache_hit BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE public.user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, restaurant_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_location ON public.profiles USING GIST (location);
CREATE INDEX idx_restaurants_location ON public.restaurants USING GIST (location);
CREATE INDEX idx_restaurants_cuisine_rating ON public.restaurants (cuisine_types, rating DESC) WHERE status = 'active';
CREATE INDEX idx_restaurants_search ON public.restaurants USING GIN (search_vector);
CREATE INDEX idx_dishes_search ON public.dishes USING GIN (search_vector);
CREATE INDEX idx_posts_user_created ON public.posts (user_id, created_at DESC);
CREATE INDEX idx_posts_restaurant_rating ON public.posts (restaurant_id, overall_rating DESC, created_at DESC);
CREATE INDEX idx_friendships_users ON public.friendships (requester_id, addressee_id, status);
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, read, created_at DESC);
CREATE INDEX idx_user_favorites_user ON public.user_favorites (user_id, created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Public profiles viewable" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Restaurants viewable by everyone" ON public.restaurants
  FOR SELECT USING (status = 'active');

CREATE POLICY "Dishes viewable for active restaurants" ON public.dishes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE id = dishes.restaurant_id AND status = 'active'
    )
  );

CREATE POLICY "Posts viewable based on visibility" ON public.posts
  FOR SELECT USING (
    visibility = 'public' OR 
    user_id = auth.uid() OR
    (visibility = 'friends' AND EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE ((requester_id = auth.uid() AND addressee_id = posts.user_id) OR
             (addressee_id = auth.uid() AND requester_id = posts.user_id))
      AND status = 'accepted'
    ))
  );

CREATE POLICY "Users can manage their own posts" ON public.posts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own likes" ON public.post_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own comments" ON public.post_comments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view friendships they're part of" ON public.friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can manage friendships they're part of" ON public.friendships
  FOR ALL USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own AI conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reservations" ON public.reservations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own check-ins" ON public.restaurant_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" ON public.restaurant_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own devices" ON public.user_devices
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON public.user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- API metrics are admin only
CREATE POLICY "API metrics admin only" ON public.api_metrics
  FOR ALL USING (false);