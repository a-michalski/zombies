/**
 * Validation Utilities
 * Created: 2025-11-19
 *
 * Username validation, profanity filter, etc.
 */

import { supabase } from './supabase';
import { UsernameValidationResult, UsernameCheckResult } from '@/types/auth';

// ============================================
// PROFANITY LISTS
// ============================================

// Basic profanity list (multi-language)
// TODO: Replace with comprehensive library like 'bad-words' or API service
const PROFANITY_LIST = [
  // English
  'fuck', 'shit', 'bitch', 'ass', 'dick', 'cock', 'pussy', 'cunt', 'nigger', 'faggot',
  // Polish
  'kurwa', 'chuj', 'pizda', 'jebać', 'kutas', 'dupa', 'pierdol', 'cipa',
  // German
  'fick', 'scheiße', 'arsch', 'fotze', 'hure',
  // Spanish
  'mierda', 'puta', 'coño', 'polla', 'joder',
  // Add more as needed...
];

// Reserved usernames (system, admin, etc.)
const RESERVED_USERNAMES = [
  'admin',
  'administrator',
  'moderator',
  'mod',
  'official',
  'support',
  'system',
  'zombiefleet',
  'zombie',
  'fleet',
  'bastion',
  'guest',
  'user',
  'player',
  'test',
  'bot',
  'null',
  'undefined',
];

// ============================================
// USERNAME VALIDATION
// ============================================

/**
 * Validate username format (client-side)
 * Rules:
 * - 3-20 characters
 * - Alphanumeric + underscore only
 * - No profanity
 * - Not reserved
 */
export function validateUsername(username: string): UsernameValidationResult {
  // Length check
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters' };
  }

  // Format check (alphanumeric + underscore)
  const formatRegex = /^[a-zA-Z0-9_]+$/;
  if (!formatRegex.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  // Must start with letter or number (not underscore)
  if (username.startsWith('_')) {
    return { valid: false, error: 'Username cannot start with underscore' };
  }

  // Profanity check
  const lowerUsername = username.toLowerCase();
  const hasProfanity = PROFANITY_LIST.some(word => lowerUsername.includes(word));

  if (hasProfanity) {
    return { valid: false, error: 'Username contains inappropriate content' };
  }

  // Reserved check
  if (RESERVED_USERNAMES.includes(lowerUsername)) {
    return { valid: false, error: 'This username is reserved' };
  }

  return { valid: true };
}

/**
 * Check username availability (server-side)
 * Also validates format
 */
export async function checkUsernameAvailability(
  username: string
): Promise<UsernameCheckResult> {
  // First, validate format
  const validation = validateUsername(username);
  if (!validation.valid) {
    return validation;
  }

  try {
    // Check database for existing nickname
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname')
      .ilike('nickname', username)
      .limit(1);

    if (error) {
      console.error('[Validation] Username availability check error:', error);
      return {
        valid: false,
        error: 'Failed to check username availability',
      };
    }

    const isTaken = data && data.length > 0;

    if (isTaken) {
      // Generate suggestions
      const suggestions = generateUsernameSuggestions(username);

      return {
        valid: false,
        available: false,
        error: 'Username is already taken',
        suggested: suggestions,
      };
    }

    return {
      valid: true,
      available: true,
    };
  } catch (error) {
    console.error('[Validation] Username availability check exception:', error);
    return {
      valid: false,
      error: 'Failed to check username availability',
    };
  }
}

/**
 * Generate username suggestions if taken
 */
function generateUsernameSuggestions(username: string, count = 3): string[] {
  const suggestions: string[] = [];

  // Strategy 1: Add random numbers
  for (let i = 0; i < count; i++) {
    const randomNum = Math.floor(Math.random() * 9999);
    suggestions.push(`${username}${randomNum}`);
  }

  // Strategy 2: Add year
  const year = new Date().getFullYear();
  suggestions.push(`${username}${year}`);

  // Strategy 3: Add underscore + number
  suggestions.push(`${username}_${Math.floor(Math.random() * 999)}`);

  // Return unique, valid suggestions
  return Array.from(new Set(suggestions))
    .filter(s => validateUsername(s).valid)
    .slice(0, count);
}

// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * Validate email format
 */
export function validateEmail(email: string): UsernameValidationResult {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

// ============================================
// PASSWORD VALIDATION
// ============================================

/**
 * Validate password strength
 * Rules:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 */
export function validatePassword(password: string): UsernameValidationResult {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  return { valid: true };
}

/**
 * Calculate password strength (0-100)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15; // Special chars

  return Math.min(strength, 100);
}

// ============================================
// NATIONALITY VALIDATION
// ============================================

/**
 * Validate nationality code
 */
export function validateNationality(code: string): UsernameValidationResult {
  if (!code || code.trim().length === 0) {
    return { valid: false, error: 'Nationality is required' };
  }

  // Should be 2-letter ISO code or 'OTHER'
  const validFormat = /^[A-Z]{2}$/.test(code) || code === 'OTHER';

  if (!validFormat) {
    return { valid: false, error: 'Invalid nationality code' };
  }

  return { valid: true };
}

// ============================================
// ANTI-SPAM / RATE LIMITING
// ============================================

/**
 * Simple client-side rate limiter for signup attempts
 * Prevents spam account creation
 */
const signupAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();

export function checkSignupRateLimit(identifier: string): {
  allowed: boolean;
  retryAfter?: number;
} {
  const now = Date.now();
  const limit = 5; // Max 5 attempts
  const windowMs = 15 * 60 * 1000; // 15 minutes

  const attempts = signupAttempts.get(identifier);

  if (!attempts) {
    signupAttempts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Reset if window expired
  if (now - attempts.lastAttempt > windowMs) {
    signupAttempts.set(identifier, { count: 1, lastAttempt: now });
    return { allowed: true };
  }

  // Check if exceeded
  if (attempts.count >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - attempts.lastAttempt)) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment
  attempts.count++;
  attempts.lastAttempt = now;

  return { allowed: true };
}
