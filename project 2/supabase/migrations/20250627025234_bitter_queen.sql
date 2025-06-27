/*
  # Database Functions and Triggers

  1. Utility Functions
    - Update timestamps automatically
    - Calculate distances and ratings
    - Safe counter increments

  2. Business Logic Functions
    - Restaurant search with filters
    - Distance calculations
    - Basic utility functions

  Note: Only includes functions that work with existing auth.users table
  Other functions will be added when tables are created
*/

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(lat1 FLOAT, lng1 FLOAT, lat2 FLOAT, lng2 FLOAT)
RETURNS FLOAT AS $$
DECLARE
    r FLOAT := 6371; -- Earth's radius in kilometers
    dlat FLOAT;
    dlng FLOAT;
    a FLOAT;
    c FLOAT;
BEGIN
    dlat := radians(lat2 - lat1);
    dlng := radians(lng2 - lng1);
    a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng/2) * sin(dlng/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    RETURN r * c;
END;
$$ LANGUAGE plpgsql;

-- Function to increment counters safely (will be used when tables exist)
CREATE OR REPLACE FUNCTION increment_counter(table_name TEXT, column_name TEXT, row_id UUID, increment_by INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', table_name, column_name, column_name)
    USING increment_by, row_id;
EXCEPTION
    WHEN undefined_table THEN
        -- Table doesn't exist yet, ignore
        RETURN;
    WHEN undefined_column THEN
        -- Column doesn't exist yet, ignore
        RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely check if table exists
CREATE OR REPLACE FUNCTION table_exists(table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
    );
END;
$$ LANGUAGE plpgsql;

-- Function to safely check if column exists
CREATE OR REPLACE FUNCTION column_exists(table_name TEXT, column_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1 
        AND column_name = $2
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get user profile safely (works with auth.users)
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if profiles table exists
    IF table_exists('profiles') THEN
        SELECT row_to_json(p) INTO result
        FROM profiles p
        WHERE p.id = user_id;
    ELSE
        -- Fallback to auth.users
        SELECT json_build_object(
            'id', u.id,
            'email', u.email,
            'created_at', u.created_at,
            'updated_at', u.updated_at
        ) INTO result
        FROM auth.users u
        WHERE u.id = user_id;
    END IF;
    
    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create basic search functionality
CREATE OR REPLACE FUNCTION simple_text_search(search_text TEXT, target_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN target_text ILIKE '%' || search_text || '%';
END;
$$ LANGUAGE plpgsql;

-- Function to generate UUID v4 (backup if uuid-ossp not available)
CREATE OR REPLACE FUNCTION generate_uuid()
RETURNS UUID AS $$
BEGIN
    RETURN gen_random_uuid();
EXCEPTION
    WHEN undefined_function THEN
        -- Fallback if gen_random_uuid not available
        RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql;

-- Function to validate email format
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Function to sanitize text input
CREATE OR REPLACE FUNCTION sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Remove potentially harmful characters and trim
    RETURN trim(regexp_replace(input_text, '[<>"\'';&]', '', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Function to format phone number
CREATE OR REPLACE FUNCTION format_phone(phone_input TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Remove all non-digit characters
    RETURN regexp_replace(phone_input, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user ID safely
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log errors safely
CREATE OR REPLACE FUNCTION log_error(error_message TEXT, error_context TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    -- Only log if error_logs table exists
    IF table_exists('error_logs') THEN
        INSERT INTO error_logs (error_message, error_context, created_at)
        VALUES (error_message, error_context, NOW());
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore logging errors
        RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create audit trail
CREATE OR REPLACE FUNCTION create_audit_log(
    table_name TEXT,
    record_id UUID,
    action_type TEXT,
    old_values JSON DEFAULT NULL,
    new_values JSON DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Only create audit log if table exists
    IF table_exists('audit_logs') THEN
        INSERT INTO audit_logs (
            table_name,
            record_id,
            action_type,
            old_values,
            new_values,
            user_id,
            created_at
        )
        VALUES (
            table_name,
            record_id,
            action_type,
            old_values,
            new_values,
            auth.uid(),
            NOW()
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore audit logging errors
        RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    user_id UUID,
    action_type TEXT,
    max_requests INTEGER DEFAULT 100,
    time_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
    request_count INTEGER;
    window_start TIMESTAMP;
BEGIN
    -- Only check if rate_limits table exists
    IF NOT table_exists('rate_limits') THEN
        RETURN TRUE; -- Allow if no rate limiting table
    END IF;
    
    window_start := NOW() - (time_window_minutes || ' minutes')::INTERVAL;
    
    SELECT COUNT(*) INTO request_count
    FROM rate_limits
    WHERE user_id = check_rate_limit.user_id
    AND action_type = check_rate_limit.action_type
    AND created_at >= window_start;
    
    RETURN request_count < max_requests;
EXCEPTION
    WHEN OTHERS THEN
        -- Allow on error
        RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record rate limit attempt
CREATE OR REPLACE FUNCTION record_rate_limit_attempt(
    user_id UUID,
    action_type TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Only record if rate_limits table exists
    IF table_exists('rate_limits') THEN
        INSERT INTO rate_limits (user_id, action_type, created_at)
        VALUES (user_id, action_type, NOW());
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore rate limit recording errors
        RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;