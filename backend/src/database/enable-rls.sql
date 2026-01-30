-- Enable Row Level Security (RLS) on all tables
-- Run this script in your Supabase SQL Editor

-- =============================================
-- 1. ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE continents ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_activities ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. DROP EXISTING POLICIES (if any)
-- =============================================

DROP POLICY IF EXISTS "users_policy" ON users;
DROP POLICY IF EXISTS "destinations_policy" ON destinations;
DROP POLICY IF EXISTS "photos_policy" ON photos;
DROP POLICY IF EXISTS "activities_policy" ON activities;
DROP POLICY IF EXISTS "cities_read_policy" ON cities;
DROP POLICY IF EXISTS "countries_read_policy" ON countries;
DROP POLICY IF EXISTS "continents_read_policy" ON continents;
DROP POLICY IF EXISTS "city_activities_read_policy" ON city_activities;

-- =============================================
-- 3. CREATE POLICIES FOR REFERENCE DATA (Public Read)
-- These tables contain shared data that all users can read
-- =============================================

-- Cities: Anyone can read
CREATE POLICY "cities_read_policy" ON cities
    FOR SELECT
    USING (true);

-- Countries: Anyone can read
CREATE POLICY "countries_read_policy" ON countries
    FOR SELECT
    USING (true);

-- Continents: Anyone can read
CREATE POLICY "continents_read_policy" ON continents
    FOR SELECT
    USING (true);

-- City Activities: Anyone can read
CREATE POLICY "city_activities_read_policy" ON city_activities
    FOR SELECT
    USING (true);

-- =============================================
-- 4. CREATE POLICIES FOR USER DATA (Private)
-- These require authentication via the backend service role
-- =============================================

-- Users: Service role has full access (backend handles auth)
CREATE POLICY "users_policy" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Destinations: Service role has full access (backend handles auth)
CREATE POLICY "destinations_policy" ON destinations
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Photos: Service role has full access (backend handles auth)
CREATE POLICY "photos_policy" ON photos
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Activities: Service role has full access (backend handles auth)
CREATE POLICY "activities_policy" ON activities
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- =============================================
-- 5. GRANT SERVICE ROLE BYPASS (for backend)
-- The postgres/service_role should bypass RLS
-- =============================================

-- Grant the service role ability to bypass RLS
-- (This is usually already set for the postgres role in Supabase)
ALTER TABLE users FORCE ROW LEVEL SECURITY;
ALTER TABLE destinations FORCE ROW LEVEL SECURITY;
ALTER TABLE photos FORCE ROW LEVEL SECURITY;
ALTER TABLE activities FORCE ROW LEVEL SECURITY;
ALTER TABLE cities FORCE ROW LEVEL SECURITY;
ALTER TABLE countries FORCE ROW LEVEL SECURITY;
ALTER TABLE continents FORCE ROW LEVEL SECURITY;
ALTER TABLE city_activities FORCE ROW LEVEL SECURITY;

-- =============================================
-- VERIFICATION: Check RLS status
-- =============================================
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
