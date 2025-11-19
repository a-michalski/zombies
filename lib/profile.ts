/**
 * Profile Service - CRUD operations for user profiles
 * Created: 2025-11-19
 */

import { supabase } from './supabase';
import { UserProfile, CreateProfileData, UpdateProfileData } from '@/types/auth';
import { analytics } from './analytics';

// ============================================
// CREATE PROFILE
// ============================================

/**
 * Create a new user profile after signup
 * Called automatically after successful auth.signUp()
 */
export async function createProfile(
  userId: string,
  data: CreateProfileData
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        nickname: data.nickname,
        nationality: data.nationality,
        avatar_url: data.avatar_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[Profile] Create error:', error);

      // Handle specific errors
      if (error.code === '23505') {
        // Unique constraint violation
        return { success: false, error: 'Nickname already taken' };
      }

      return { success: false, error: error.message };
    }

    analytics.track('signup_completed', {
      user_id: userId,
      nationality: data.nationality,
    });

    return { success: true, profile };
  } catch (error) {
    console.error('[Profile] Create exception:', error);
    return { success: false, error: 'Failed to create profile' };
  }
}

// ============================================
// GET PROFILE
// ============================================

/**
 * Get profile by user ID
 */
export async function getProfile(
  userId: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[Profile] Get error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile };
  } catch (error) {
    console.error('[Profile] Get exception:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
}

/**
 * Get profile by nickname (for search/friend adding)
 */
export async function getProfileByNickname(
  nickname: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('nickname', nickname)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return { success: false, error: 'User not found' };
      }
      console.error('[Profile] Get by nickname error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profile };
  } catch (error) {
    console.error('[Profile] Get by nickname exception:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
}

// ============================================
// UPDATE PROFILE
// ============================================

/**
 * Update user profile
 * Only allows updating own profile (enforced by RLS)
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileData
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    // Track nickname changes
    if (data.nickname) {
      const { data: oldProfile } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userId)
        .single();

      if (oldProfile && oldProfile.nickname !== data.nickname) {
        // Log username change
        await supabase.from('username_history').insert({
          user_id: userId,
          old_username: oldProfile.nickname,
          new_username: data.nickname,
        });
      }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        nickname: data.nickname,
        nationality: data.nationality,
        avatar_url: data.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[Profile] Update error:', error);

      if (error.code === '23505') {
        return { success: false, error: 'Nickname already taken' };
      }

      return { success: false, error: error.message };
    }

    return { success: true, profile };
  } catch (error) {
    console.error('[Profile] Update exception:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// ============================================
// UPDATE LAST SEEN
// ============================================

/**
 * Update last seen timestamp
 * Call this on app launch/resume
 */
export async function updateLastSeen(userId: string): Promise<void> {
  try {
    await supabase
      .from('profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.error('[Profile] Update last seen error:', error);
    // Non-critical, don't throw
  }
}

// ============================================
// DELETE PROFILE
// ============================================

/**
 * Delete user profile and all associated data
 * GDPR compliance - "Right to be forgotten"
 */
export async function deleteProfile(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Note: Cascading deletes are handled by database
    // (campaign_progress, leaderboards, etc. will be deleted automatically)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('[Profile] Delete error:', error);
      return { success: false, error: error.message };
    }

    // Also delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('[Profile] Delete auth user error:', authError);
      // Profile is already deleted, but auth user remains
      // This is okay - admin can clean up later
    }

    analytics.track('account_deleted', { user_id: userId });

    return { success: true };
  } catch (error) {
    console.error('[Profile] Delete exception:', error);
    return { success: false, error: 'Failed to delete profile' };
  }
}

// ============================================
// SEARCH PROFILES
// ============================================

/**
 * Search profiles by nickname (for friend search)
 * Returns up to 20 results
 */
export async function searchProfiles(
  query: string,
  limit = 20
): Promise<{ success: boolean; profiles?: UserProfile[]; error?: string }> {
  try {
    if (query.length < 2) {
      return { success: true, profiles: [] };
    }

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('nickname', `%${query}%`)
      .limit(limit);

    if (error) {
      console.error('[Profile] Search error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profiles: profiles || [] };
  } catch (error) {
    console.error('[Profile] Search exception:', error);
    return { success: false, error: 'Failed to search profiles' };
  }
}

// ============================================
// BATCH GET PROFILES
// ============================================

/**
 * Get multiple profiles by IDs (for friend lists, leaderboards)
 */
export async function getProfiles(
  userIds: string[]
): Promise<{ success: boolean; profiles?: UserProfile[]; error?: string }> {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    if (error) {
      console.error('[Profile] Batch get error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, profiles: profiles || [] };
  } catch (error) {
    console.error('[Profile] Batch get exception:', error);
    return { success: false, error: 'Failed to fetch profiles' };
  }
}
