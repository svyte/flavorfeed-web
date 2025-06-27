/*
  # Database Functions and Triggers

  1. Utility Functions
    - Update timestamps automatically
    - Increment counters safely
    - Calculate distances and ratings

  2. Business Logic Functions
    - Friend request handling
    - Subscription management
    - Notification triggers

  3. Performance Functions
    - Search optimization
    - Analytics aggregation
    - Cache invalidation
*/

-- Function to update restaurant rating
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.restaurants 
    SET 
        rating = (
            SELECT COALESCE(AVG(overall_rating), 0)
            FROM public.posts 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
            AND overall_rating IS NOT NULL
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.posts 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
            AND overall_rating IS NOT NULL
        )
    WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update dish rating
CREATE OR REPLACE FUNCTION update_dish_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.dishes 
    SET 
        rating = (
            SELECT COALESCE(AVG(dish_rating), 0)
            FROM public.posts 
            WHERE dish_id = COALESCE(NEW.dish_id, OLD.dish_id)
            AND dish_rating IS NOT NULL
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.posts 
            WHERE dish_id = COALESCE(NEW.dish_id, OLD.dish_id)
            AND dish_rating IS NOT NULL
        )
    WHERE id = COALESCE(NEW.dish_id, OLD.dish_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update post engagement counts
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts 
        SET like_count = like_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts 
        SET like_count = like_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.posts 
        SET comment_count = comment_count + 1 
        WHERE id = NEW.post_id;
        
        -- Update parent comment reply count if this is a reply
        IF NEW.parent_comment_id IS NOT NULL THEN
            UPDATE public.post_comments 
            SET reply_count = reply_count + 1 
            WHERE id = NEW.parent_comment_id;
        END IF;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.posts 
        SET comment_count = comment_count - 1 
        WHERE id = OLD.post_id;
        
        -- Update parent comment reply count if this was a reply
        IF OLD.parent_comment_id IS NOT NULL THEN
            UPDATE public.post_comments 
            SET reply_count = reply_count - 1 
            WHERE id = OLD.parent_comment_id;
        END IF;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles 
        SET 
            total_posts = total_posts + 1,
            total_reviews = total_reviews + CASE WHEN NEW.overall_rating IS NOT NULL THEN 1 ELSE 0 END
        WHERE id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.profiles 
        SET 
            total_posts = total_posts - 1,
            total_reviews = total_reviews - CASE WHEN OLD.overall_rating IS NOT NULL THEN 1 ELSE 0 END
        WHERE id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update friendship count
CREATE OR REPLACE FUNCTION update_friendship_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'accepted' THEN
        UPDATE public.profiles 
        SET friends_count = friends_count + 1 
        WHERE id IN (NEW.requester_id, NEW.addressee_id);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'accepted' AND NEW.status = 'accepted' THEN
            UPDATE public.profiles 
            SET friends_count = friends_count + 1 
            WHERE id IN (NEW.requester_id, NEW.addressee_id);
        ELSIF OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
            UPDATE public.profiles 
            SET friends_count = friends_count - 1 
            WHERE id IN (NEW.requester_id, NEW.addressee_id);
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'accepted' THEN
        UPDATE public.profiles 
        SET friends_count = friends_count - 1 
        WHERE id IN (OLD.requester_id, OLD.addressee_id);
        RETURN OLD;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to handle subscription updates
CREATE OR REPLACE FUNCTION update_profile_subscription()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.profiles 
        SET 
            subscription_tier = NEW.tier,
            subscription_status = NEW.status,
            subscription_end_date = NEW.expiration_date,
            updated_at = NOW()
        WHERE id = NEW.user_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to increment restaurant check-in count
CREATE OR REPLACE FUNCTION increment_checkin_count(restaurant_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.restaurants 
    SET check_in_count = check_in_count + 1 
    WHERE id = restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search restaurants with filters
CREATE OR REPLACE FUNCTION search_restaurants(
    search_query TEXT DEFAULT '',
    user_lat FLOAT DEFAULT NULL,
    user_lng FLOAT DEFAULT NULL,
    max_distance_km FLOAT DEFAULT 25,
    cuisine_filter TEXT[] DEFAULT NULL,
    price_range_filter INTEGER[] DEFAULT NULL,
    min_rating FLOAT DEFAULT 0,
    has_insider_access BOOLEAN DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    cuisine_types TEXT[],
    rating DECIMAL,
    review_count INTEGER,
    price_range INTEGER,
    distance_km FLOAT,
    images TEXT[],
    insider_access BOOLEAN,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.name,
        r.cuisine_types,
        r.rating,
        r.review_count,
        r.price_range,
        CASE 
            WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL THEN
                calculate_distance(user_lat, user_lng, ST_Y(r.location::geometry), ST_X(r.location::geometry))
            ELSE NULL
        END as distance_km,
        r.images,
        r.insider_access,
        r.status
    FROM public.restaurants r
    WHERE 
        r.status = 'active'
        AND (search_query = '' OR r.search_vector @@ plainto_tsquery('english', search_query))
        AND (cuisine_filter IS NULL OR r.cuisine_types && cuisine_filter)
        AND (price_range_filter IS NULL OR r.price_range = ANY(price_range_filter))
        AND r.rating >= min_rating
        AND (has_insider_access IS NULL OR r.insider_access = has_insider_access)
        AND (
            user_lat IS NULL OR user_lng IS NULL OR
            calculate_distance(user_lat, user_lng, ST_Y(r.location::geometry), ST_X(r.location::geometry)) <= max_distance_km
        )
    ORDER BY 
        CASE WHEN search_query != '' THEN ts_rank(r.search_vector, plainto_tsquery('english', search_query)) ELSE 0 END DESC,
        r.rating DESC,
        distance_km ASC NULLS LAST
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON public.dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_devices_updated_at BEFORE UPDATE ON public.user_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for rating updates
CREATE TRIGGER update_restaurant_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.posts 
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

CREATE TRIGGER update_dish_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.posts 
    FOR EACH ROW EXECUTE FUNCTION update_dish_rating();

-- Create triggers for engagement counts
CREATE TRIGGER update_post_like_count_trigger 
    AFTER INSERT OR DELETE ON public.post_likes 
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

CREATE TRIGGER update_post_comment_count_trigger 
    AFTER INSERT OR DELETE ON public.post_comments 
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Create triggers for user stats
CREATE TRIGGER update_user_stats_trigger 
    AFTER INSERT OR DELETE ON public.posts 
    FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Create triggers for friendship counts
CREATE TRIGGER update_friendship_count_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.friendships 
    FOR EACH ROW EXECUTE FUNCTION update_friendship_count();

-- Create trigger for subscription updates
CREATE TRIGGER update_profile_subscription_trigger 
    AFTER INSERT OR UPDATE ON public.subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_profile_subscription();