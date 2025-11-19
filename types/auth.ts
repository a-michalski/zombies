/**
 * Authentication and User Profile Types
 * Created: 2025-11-19
 */

import { Session, User } from '@supabase/supabase-js';

// ============================================
// USER PROFILE
// ============================================

export interface UserProfile {
  id: string; // UUID from auth.users
  nickname: string;
  nationality: string; // ISO 3166-1 alpha-2 (e.g., 'PL', 'US')
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface CreateProfileData {
  nickname: string;
  nationality: string;
  avatar_url?: string;
}

export interface UpdateProfileData {
  nickname?: string;
  nationality?: string;
  avatar_url?: string;
}

// ============================================
// NATIONALITY DATA
// ============================================

export interface Nationality {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  flag: string; // Emoji flag
}

export const NATIONALITIES: Nationality[] = [
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'OTHER', name: 'Other', flag: '🌍' },
];

export function getNationalityByCode(code: string): Nationality | undefined {
  return NATIONALITIES.find(n => n.code === code);
}

// ============================================
// AUTH STATE
// ============================================

export type AuthStatus = 'loading' | 'authenticated' | 'guest' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
}

// ============================================
// USERNAME VALIDATION
// ============================================

export interface UsernameValidationResult {
  valid: boolean;
  error?: string;
}

export interface UsernameCheckResult extends UsernameValidationResult {
  available?: boolean;
  suggested?: string[];
}

// ============================================
// SIGN UP / SIGN IN
// ============================================

export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  nationality: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface GuestToAccountData {
  email: string;
  password: string;
  // Profile already exists for guest, just linking to email/password
}

// ============================================
// AUTH ERRORS
// ============================================

export type AuthError =
  | 'invalid_credentials'
  | 'email_already_exists'
  | 'nickname_already_exists'
  | 'weak_password'
  | 'invalid_email'
  | 'network_error'
  | 'unknown_error'
  | 'nickname_profane'
  | 'nickname_reserved';

export interface AuthErrorResult {
  error: AuthError;
  message: string;
}
