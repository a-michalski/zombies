-- ============================================
-- ZOMBIE FLEET - Database Schema
-- Created: 2025-11-19
-- Supabase PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extends auth.users with game-specific data
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nickname TEXT UNIQUE NOT NULL,
    nationality TEXT NOT NULL, -- ISO 3166-1 alpha-2 (e.g., 'PL', 'US')
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT nickname_length CHECK (char_length(nickname) >= 3 AND char_length(nickname) <= 20),
    CONSTRAINT nickname_format CHECK (nickname ~ '^[a-zA-Z0-9_]+$'),
    CONSTRAINT nationality_format CHECK (nationality ~ '^[A-Z]{2}$')
);

-- Indexes for profiles
CREATE INDEX idx_profiles_nickname ON public.profiles(nickname);
CREATE INDEX idx_profiles_nationality ON public.profiles(nationality);
CREATE INDEX idx_profiles_last_seen ON public.profiles(last_seen_at DESC);

-- ============================================
-- CAMPAIGN PROGRESS TABLE
-- Cloud save for campaign progression
-- ============================================
CREATE TABLE IF NOT EXISTS public.campaign_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    save_data JSONB NOT NULL, -- Full CampaignSaveData structure
    version INTEGER DEFAULT 1,
    device_id TEXT,
    last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- One save per user (upsert pattern)
    CONSTRAINT unique_user_save UNIQUE(user_id)
);

-- Indexes for campaign progress
CREATE INDEX idx_campaign_progress_user ON public.campaign_progress(user_id);
CREATE INDEX idx_campaign_progress_synced ON public.campaign_progress(last_synced DESC);

-- ============================================
-- LEADERBOARDS TABLE
-- Per-level high scores
-- ============================================
CREATE TABLE IF NOT EXISTS public.leaderboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level_id TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 3),
    completion_time INTEGER NOT NULL, -- seconds
    zombies_killed INTEGER NOT NULL DEFAULT 0,
    hull_integrity INTEGER CHECK (hull_integrity >= 0 AND hull_integrity <= 100),

    -- Anti-cheat metadata
    gameplay_hash TEXT,
    client_version TEXT,
    flagged BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- One entry per user per level (best score)
    CONSTRAINT unique_user_level UNIQUE(user_id, level_id)
);

-- Indexes for leaderboards
CREATE INDEX idx_leaderboards_level_score ON public.leaderboards(level_id, score DESC);
CREATE INDEX idx_leaderboards_user ON public.leaderboards(user_id);
CREATE INDEX idx_leaderboards_flagged ON public.leaderboards(flagged) WHERE flagged = TRUE;
CREATE INDEX idx_leaderboards_created ON public.leaderboards(created_at DESC);

-- ============================================
-- PLAYER STATS TABLE
-- Global statistics per user
-- ============================================
CREATE TABLE IF NOT EXISTS public.player_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    total_games INTEGER DEFAULT 0,
    total_zombies_killed INTEGER DEFAULT 0,
    total_stars INTEGER DEFAULT 0,
    total_playtime INTEGER DEFAULT 0, -- seconds
    best_wave INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for stats
CREATE INDEX idx_player_stats_user ON public.player_stats(user_id);

-- ============================================
-- ACHIEVEMENTS TABLE
-- Achievement definitions and user progress
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY, -- 'first_blood', 'zombie_slayer_1000', etc.
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'combat', 'progression', 'special'
    requirement_type TEXT NOT NULL, -- 'kill_count', 'level_complete', 'speed_run'
    requirement_value INTEGER NOT NULL,
    reward_type TEXT, -- 'scrap', 'skin', 'flag'
    reward_value JSONB,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievement progress
CREATE TABLE IF NOT EXISTS public.achievement_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_id)
);

-- Indexes for achievements
CREATE INDEX idx_achievement_progress_user ON public.achievement_progress(user_id);
CREATE INDEX idx_achievement_progress_completed ON public.achievement_progress(completed, completed_at DESC);

-- ============================================
-- DAILY REWARDS TABLE
-- Track daily login streaks and rewards
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_claim_date DATE,
    total_rewards_claimed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for daily rewards
CREATE INDEX idx_daily_rewards_user ON public.daily_rewards(user_id);
CREATE INDEX idx_daily_rewards_last_claim ON public.daily_rewards(last_claim_date DESC);

-- ============================================
-- SUSPICIOUS SCORES TABLE
-- Anti-cheat flagging system
-- ============================================
CREATE TABLE IF NOT EXISTS public.suspicious_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    level_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    reason TEXT NOT NULL, -- 'impossible_time', 'impossible_score', 'hash_mismatch'
    metadata JSONB, -- Additional context
    auto_banned BOOLEAN DEFAULT FALSE,
    reviewed BOOLEAN DEFAULT FALSE,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for suspicious scores
CREATE INDEX idx_suspicious_scores_user ON public.suspicious_scores(user_id);
CREATE INDEX idx_suspicious_scores_reviewed ON public.suspicious_scores(reviewed) WHERE reviewed = FALSE;

-- ============================================
-- USER BANS TABLE
-- Ban management
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_bans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    banned_by UUID REFERENCES public.profiles(id),
    banned_until TIMESTAMP WITH TIME ZONE,
    permanent BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lifted_at TIMESTAMP WITH TIME ZONE
);

-- Index for bans
CREATE INDEX idx_user_bans_user ON public.user_bans(user_id);
CREATE INDEX idx_user_bans_active ON public.user_bans(active) WHERE active = TRUE;

-- ============================================
-- USERNAME HISTORY TABLE
-- Track nickname changes
-- ============================================
CREATE TABLE IF NOT EXISTS public.username_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    old_username TEXT NOT NULL,
    new_username TEXT NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for username history
CREATE INDEX idx_username_history_user ON public.username_history(user_id);

-- ============================================
-- RESERVED USERNAMES TABLE
-- Prevent impersonation
-- ============================================
CREATE TABLE IF NOT EXISTS public.reserved_usernames (
    username TEXT PRIMARY KEY,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default reserved usernames
INSERT INTO public.reserved_usernames (username, reason) VALUES
    ('admin', 'System reserved'),
    ('moderator', 'System reserved'),
    ('official', 'System reserved'),
    ('zombiefleet', 'System reserved'),
    ('support', 'System reserved'),
    ('system', 'System reserved')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- FRIENDS TABLE (Future Phase 2)
-- ============================================
CREATE TABLE IF NOT EXISTS public.friends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT unique_friendship UNIQUE(user_id, friend_id),
    CONSTRAINT no_self_friend CHECK (user_id != friend_id)
);

-- Indexes for friends
CREATE INDEX idx_friends_user ON public.friends(user_id);
CREATE INDEX idx_friends_status ON public.friends(status);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspicious_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.username_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Profiles: Everyone can view, users can update their own
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Campaign Progress: Users can only access their own
CREATE POLICY "Users can view their own campaign progress"
    ON public.campaign_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaign progress"
    ON public.campaign_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign progress"
    ON public.campaign_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Leaderboards: Everyone can view, users can insert/update their own
CREATE POLICY "Leaderboards are viewable by everyone"
    ON public.leaderboards FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own scores"
    ON public.leaderboards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores"
    ON public.leaderboards FOR UPDATE
    USING (auth.uid() = user_id);

-- Player Stats: Everyone can view, users manage their own
CREATE POLICY "Player stats are viewable by everyone"
    ON public.player_stats FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own stats"
    ON public.player_stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
    ON public.player_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- Achievement Progress: Users can only access their own
CREATE POLICY "Users can view their own achievement progress"
    ON public.achievement_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievement progress"
    ON public.achievement_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievement progress"
    ON public.achievement_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- Daily Rewards: Users can only access their own
CREATE POLICY "Users can view their own daily rewards"
    ON public.daily_rewards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily rewards"
    ON public.daily_rewards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily rewards"
    ON public.daily_rewards FOR UPDATE
    USING (auth.uid() = user_id);

-- Friends: Users can view their own friendships
CREATE POLICY "Users can view their own friends"
    ON public.friends FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests"
    ON public.friends FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friend requests"
    ON public.friends FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboards_updated_at BEFORE UPDATE ON public.leaderboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_stats_updated_at BEFORE UPDATE ON public.player_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievement_progress_updated_at BEFORE UPDATE ON public.achievement_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_rewards_updated_at BEFORE UPDATE ON public.daily_rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create player_stats when profile is created
CREATE OR REPLACE FUNCTION create_player_stats_for_new_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.player_stats (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_profile_created AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION create_player_stats_for_new_profile();

-- Auto-create daily_rewards when profile is created
CREATE OR REPLACE FUNCTION create_daily_rewards_for_new_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.daily_rewards (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_profile_created_daily_rewards AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION create_daily_rewards_for_new_profile();

-- ============================================
-- SEED DATA - Default Achievements
-- ============================================
INSERT INTO public.achievements (id, name, description, category, requirement_type, requirement_value, reward_type, reward_value) VALUES
    ('first_blood', 'First Blood', 'Kill your first zombie', 'combat', 'kill_count', 1, 'scrap', '{"amount": 100}'),
    ('zombie_slayer_100', 'Zombie Slayer', 'Kill 100 zombies', 'combat', 'kill_count', 100, 'scrap', '{"amount": 500}'),
    ('zombie_slayer_1000', 'Zombie Massacre', 'Kill 1000 zombies', 'combat', 'kill_count', 1000, 'scrap', '{"amount": 2000}'),
    ('first_victory', 'First Victory', 'Complete your first level', 'progression', 'level_complete', 1, 'scrap', '{"amount": 200}'),
    ('perfect_run', 'Perfect Defense', 'Complete a level with 100% hull integrity', 'special', 'perfect_health', 1, 'scrap', '{"amount": 1000}'),
    ('speed_demon', 'Speed Demon', 'Complete a level in under 5 minutes', 'special', 'speed_run', 300, 'scrap', '{"amount": 750}'),
    ('three_star_master', 'Three Star Master', 'Get 3 stars on 10 levels', 'progression', 'three_stars', 10, 'scrap', '{"amount": 1500}'),
    ('completionist', 'Completionist', 'Get 3 stars on all levels', 'progression', 'all_three_stars', 17, 'skin', '{"type": "tower", "id": "golden_tower"}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Global leaderboard view (aggregated across all levels)
CREATE OR REPLACE VIEW public.global_leaderboard AS
SELECT
    p.id,
    p.nickname,
    p.nationality,
    p.avatar_url,
    SUM(l.score) as total_score,
    SUM(l.stars) as total_stars,
    COUNT(DISTINCT l.level_id) as levels_completed,
    MAX(l.updated_at) as last_activity
FROM public.profiles p
INNER JOIN public.leaderboards l ON p.id = l.user_id
WHERE l.flagged = FALSE
GROUP BY p.id, p.nickname, p.nationality, p.avatar_url
ORDER BY total_score DESC;

-- Regional leaderboard function
CREATE OR REPLACE FUNCTION public.get_regional_leaderboard(country_code TEXT)
RETURNS TABLE (
    user_id UUID,
    nickname TEXT,
    nationality TEXT,
    total_score BIGINT,
    total_stars BIGINT,
    levels_completed BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.nickname,
        p.nationality,
        SUM(l.score) as total_score,
        SUM(l.stars) as total_stars,
        COUNT(DISTINCT l.level_id) as levels_completed
    FROM public.profiles p
    INNER JOIN public.leaderboards l ON p.id = l.user_id
    WHERE p.nationality = country_code AND l.flagged = FALSE
    GROUP BY p.id, p.nickname, p.nationality
    ORDER BY total_score DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant access to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant access to anonymous users (read-only for leaderboards)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.leaderboards TO anon;
GRANT SELECT ON public.achievements TO anon;
