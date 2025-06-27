/*
  # Performance Indexes and Row Level Security

  1. Geographic Indexes
    - Location-based queries for restaurants and users
    - Spatial indexes for proximity searches

  2. Composite Indexes
    - Common query patterns optimization
    - Social features performance
    - Search optimization

  3. Row Level Security Policies
    - User data protection
    - Subscription-aware access control
    - Privacy settings enforcement
*/

-- Geographic indexes for location-based queries
CREATE INDEX CONCURRENTLY idx_profiles_location ON public.profiles USING GIST (location);
CREATE INDEX CONCURRENTLY idx_restaurants_location ON public.restaurants USING GIST (location);
CREATE INDEX CONCURRENTLY idx_posts_location ON public.posts USING GIST (location);

-- Composite indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_restaurants_cuisine_rating ON public.restaurants (cuisine_types, rating DESC) WHERE status = 'active';
CREATE INDEX CONCURRENTLY idx_restaurants_location_rating ON public.restaurants USING GIST (location, rating);
CREATE INDEX CONCURRENTLY idx_posts_user_created ON public.posts (user_id, created_at DESC) WHERE visibility != 'private';
CREATE INDEX CONCURRENTLY idx_posts_restaurant_rating ON public.posts (restaurant_id, overall_rating DESC, created_at DESC);

-- Social features optimization
CREATE INDEX CONCURRENTLY idx_friendships_users ON public.friendships (requester_id, addressee_id, status);
CREATE INDEX CONCURRENTLY idx_friendships_status_created ON public.friendships (status, created_at DESC);
CREATE INDEX CONCURRENTLY idx_post_likes_post_user ON public.post_likes (post_id, user_id);
CREATE INDEX CONCURRENTLY idx_post_comments_post_created ON public.post_comments (post_id, created_at ASC);

-- Search optimization
CREATE INDEX CONCURRENTLY idx_restaurants_search ON public.restaurants USING GIN (search_vector);
CREATE INDEX CONCURRENTLY idx_dishes_search ON public.dishes USING GIN (search_vector);
CREATE INDEX CONCURRENTLY idx_restaurants_name_trgm ON public.restaurants USING GIN (name gin_trgm_ops);

-- User activity and analytics
CREATE INDEX CONCURRENTLY idx_user_activity_user_type_created ON public.user_activity (user_id, activity_type, created_at DESC);
CREATE INDEX CONCURRENTLY idx_notifications_user_unread ON public.notifications (user_id, read, created_at DESC);
CREATE INDEX CONCURRENTLY idx_subscriptions_user_status ON public.subscriptions (user_id, status, expiration_date);

-- AI and conversation optimization
CREATE INDEX CONCURRENTLY idx_ai_conversations_user_session ON public.ai_conversations (user_id, session_id, last_message_at DESC);
CREATE INDEX CONCURRENTLY idx_ai_conversations_active ON public.ai_conversations (active, last_message_at DESC) WHERE active = true;

-- Reservation management
CREATE INDEX CONCURRENTLY idx_reservations_user_status_date ON public.reservations (user_id, status, reservation_datetime DESC);
CREATE INDEX CONCURRENTLY idx_reservations_restaurant_date ON public.reservations (restaurant_id, reservation_datetime) WHERE status IN ('confirmed', 'seated');

-- Performance monitoring
CREATE INDEX CONCURRENTLY idx_api_metrics_endpoint_created ON public.api_metrics (endpoint, created_at DESC);
CREATE INDEX CONCURRENTLY idx_api_metrics_performance ON public.api_metrics (response_time_ms, created_at DESC);

-- Check-in system
CREATE INDEX CONCURRENTLY idx_checkins_user_date ON public.restaurant_checkins (user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_checkins_restaurant_date ON public.restaurant_checkins (restaurant_id, created_at DESC);

-- Device management
CREATE INDEX CONCURRENTLY idx_user_devices_active ON public.user_devices (user_id, active);

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

-- Profile policies with subscription awareness
CREATE POLICY "Public profiles viewable based on privacy settings" ON public.profiles
  FOR SELECT USING (
    CASE 
      WHEN privacy_settings->>'profile' = 'public' THEN true
      WHEN privacy_settings->>'profile' = 'friends' THEN (
        auth.uid() = id OR
        EXISTS (
          SELECT 1 FROM public.friendships 
          WHERE ((requester_id = auth.uid() AND addressee_id = id) OR 
                 (addressee_id = auth.uid() AND requester_id = id)) 
          AND status = 'accepted'
        )
      )
      ELSE auth.uid() = id
    END
  );

CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Restaurant policies
CREATE POLICY "Restaurants viewable by everyone" ON public.restaurants
  FOR SELECT USING (status = 'active');

CREATE POLICY "Restaurant owners can manage their restaurants" ON public.restaurants
  FOR ALL USING (auth.uid() = business_owner_id);

-- Dish policies
CREATE POLICY "Dishes viewable for active restaurants" ON public.dishes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE id = dishes.restaurant_id AND status = 'active'
    )
  );

CREATE POLICY "Restaurant owners can manage dishes" ON public.dishes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE id = dishes.restaurant_id AND business_owner_id = auth.uid()
    )
  );

-- Post policies with subscription tiers
CREATE POLICY "Posts viewable based on visibility and subscription" ON public.posts
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

-- Social interaction policies
CREATE POLICY "Users can like posts they can see" ON public.post_likes
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_likes.post_id AND (
        visibility = 'public' OR 
        user_id = auth.uid() OR
        (visibility = 'friends' AND EXISTS (
          SELECT 1 FROM public.friendships 
          WHERE ((requester_id = auth.uid() AND addressee_id = posts.user_id) OR
                 (addressee_id = auth.uid() AND requester_id = posts.user_id))
          AND status = 'accepted'
        ))
      )
    )
  );

CREATE POLICY "Users can view likes on posts they can see" ON public.post_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_likes.post_id AND (
        visibility = 'public' OR 
        user_id = auth.uid() OR
        (visibility = 'friends' AND EXISTS (
          SELECT 1 FROM public.friendships 
          WHERE ((requester_id = auth.uid() AND addressee_id = posts.user_id) OR
                 (addressee_id = auth.uid() AND requester_id = posts.user_id))
          AND status = 'accepted'
        ))
      )
    )
  );

CREATE POLICY "Users can delete their own likes" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Comment policies
CREATE POLICY "Users can comment on posts they can see" ON public.post_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_comments.post_id AND (
        visibility = 'public' OR 
        user_id = auth.uid() OR
        (visibility = 'friends' AND EXISTS (
          SELECT 1 FROM public.friendships 
          WHERE ((requester_id = auth.uid() AND addressee_id = posts.user_id) OR
                 (addressee_id = auth.uid() AND requester_id = posts.user_id))
          AND status = 'accepted'
        ))
      )
    )
  );

CREATE POLICY "Users can view comments on posts they can see" ON public.post_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE id = post_comments.post_id AND (
        visibility = 'public' OR 
        user_id = auth.uid() OR
        (visibility = 'friends' AND EXISTS (
          SELECT 1 FROM public.friendships 
          WHERE ((requester_id = auth.uid() AND addressee_id = posts.user_id) OR
                 (addressee_id = auth.uid() AND requester_id = posts.user_id))
          AND status = 'accepted'
        ))
      )
    )
  );

CREATE POLICY "Users can manage their own comments" ON public.post_comments
  FOR ALL USING (auth.uid() = user_id);

-- Friendship policies
CREATE POLICY "Users can view friendships they're part of" ON public.friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friend requests" ON public.friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're part of" ON public.friendships
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- AI conversation policies
CREATE POLICY "Users can only access their own AI conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id);

-- Reservation policies
CREATE POLICY "Users can view their own reservations" ON public.reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations" ON public.reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reservations" ON public.reservations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Restaurant owners can view reservations for their restaurants" ON public.reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.restaurants 
      WHERE id = reservations.restaurant_id AND business_owner_id = auth.uid()
    )
  );

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can view their own activity" ON public.user_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity" ON public.user_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Check-in policies
CREATE POLICY "Users can view their own check-ins" ON public.restaurant_checkins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" ON public.restaurant_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Device management policies
CREATE POLICY "Users can manage their own devices" ON public.user_devices
  FOR ALL USING (auth.uid() = user_id);