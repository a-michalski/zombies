/**
 * Supabase Client Configuration
 * Created: 2025-11-19
 *
 * Centralized Supabase client for the entire app
 */

import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check .env file.\n' +
    'Required: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

/**
 * Supabase client instance
 * Uses AsyncStorage for session persistence across app restarts
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not needed for mobile/native
  },
});

/**
 * Database type definitions (auto-generated from Supabase)
 * Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string;
          nationality: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          last_seen_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          nationality: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          nationality?: string;
          avatar_url?: string | null;
          updated_at?: string;
          last_seen_at?: string;
        };
      };
      campaign_progress: {
        Row: {
          id: string;
          user_id: string;
          save_data: any; // JSONB
          version: number;
          device_id: string | null;
          last_synced: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          save_data: any;
          version?: number;
          device_id?: string | null;
          last_synced?: string;
          created_at?: string;
        };
        Update: {
          save_data?: any;
          version?: number;
          device_id?: string | null;
          last_synced?: string;
        };
      };
      leaderboards: {
        Row: {
          id: string;
          user_id: string;
          level_id: string;
          score: number;
          stars: number;
          completion_time: number;
          zombies_killed: number;
          hull_integrity: number | null;
          gameplay_hash: string | null;
          client_version: string | null;
          flagged: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level_id: string;
          score: number;
          stars: number;
          completion_time: number;
          zombies_killed: number;
          hull_integrity?: number | null;
          gameplay_hash?: string | null;
          client_version?: string | null;
          flagged?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          score?: number;
          stars?: number;
          completion_time?: number;
          zombies_killed?: number;
          hull_integrity?: number | null;
          gameplay_hash?: string | null;
          client_version?: string | null;
          flagged?: boolean;
          updated_at?: string;
        };
      };
      player_stats: {
        Row: {
          id: string;
          user_id: string;
          total_games: number;
          total_zombies_killed: number;
          total_stars: number;
          total_playtime: number;
          best_wave: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_games?: number;
          total_zombies_killed?: number;
          total_stars?: number;
          total_playtime?: number;
          best_wave?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          total_games?: number;
          total_zombies_killed?: number;
          total_stars?: number;
          total_playtime?: number;
          best_wave?: number;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          requirement_type: string;
          requirement_value: number;
          reward_type: string | null;
          reward_value: any | null;
          icon_url: string | null;
          created_at: string;
        };
      };
      achievement_progress: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          progress: number;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          progress?: number;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          progress?: number;
          completed?: boolean;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      daily_rewards: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_claim_date: string | null;
          total_rewards_claimed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_claim_date?: string | null;
          total_rewards_claimed?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          current_streak?: number;
          longest_streak?: number;
          last_claim_date?: string | null;
          total_rewards_claimed?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      global_leaderboard: {
        Row: {
          id: string;
          nickname: string;
          nationality: string;
          avatar_url: string | null;
          total_score: number;
          total_stars: number;
          levels_completed: number;
          last_activity: string;
        };
      };
    };
    Functions: {
      get_regional_leaderboard: {
        Args: { country_code: string };
        Returns: {
          user_id: string;
          nickname: string;
          nationality: string;
          total_score: number;
          total_stars: number;
          levels_completed: number;
        }[];
      };
    };
  };
};
