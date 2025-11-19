/**
 * Anti-Cheat Validation
 * Created: 2025-11-19
 *
 * Server-side score validation to prevent cheating
 * This logic should be deployed as Supabase Edge Function for maximum security
 *
 * For now, implements client-side validation with server-side ready structure
 */

import { ScoreSubmission, SuspiciousReason } from '@/types/leaderboard';
import { ALL_LEVELS } from '@/data/maps';
import { supabase } from './supabase';

// ============================================
// VALIDATION RULES PER LEVEL
// ============================================

interface LevelValidationRules {
  maxScore: number; // Theoretical maximum score for the level
  minTime: number; // Minimum possible completion time (seconds)
  maxTime: number; // Maximum reasonable completion time
  maxZombies: number; // Maximum zombies in this level
  minZombies: number; // Minimum zombies to complete
}

/**
 * Calculate validation rules for a level
 * Based on wave configuration
 */
function calculateLevelRules(levelId: string): LevelValidationRules | null {
  const level = ALL_LEVELS.find(l => l.id === levelId);

  if (!level) {
    return null;
  }

  const waves = level.mapConfig.waves;
  const totalWaves = waves.length;

  // Calculate total zombies
  const totalZombies = waves.reduce((sum, wave) => {
    return sum + wave.enemies.reduce((waveSum, enemy) => waveSum + enemy.count, 0);
  }, 0);

  // Estimate min time (assuming perfect play)
  // ~10 seconds per wave minimum
  const minTime = totalWaves * 10;

  // Max time (assuming reasonable play, not AFK)
  // ~180 seconds per wave max
  const maxTime = totalWaves * 180;

  // Theoretical max score
  // Assume ~100 points per zombie + 3 stars (1000 each) + time bonus
  const maxScore = (totalZombies * 100) + (3 * 1000) + 5000;

  return {
    maxScore,
    minTime,
    maxTime,
    maxZombies: totalZombies,
    minZombies: Math.floor(totalZombies * 0.8), // Must kill at least 80%
  };
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate if score is possible for the level
 */
function validateScore(levelId: string, score: number): {
  valid: boolean;
  reason?: SuspiciousReason;
} {
  const rules = calculateLevelRules(levelId);

  if (!rules) {
    return { valid: false, reason: 'impossible_score' };
  }

  // Score too high
  if (score > rules.maxScore) {
    return { valid: false, reason: 'impossible_score' };
  }

  // Score is suspiciously high (> 95% of theoretical max suggests cheating)
  if (score > rules.maxScore * 0.95) {
    console.warn('[AntiCheat] Score suspiciously high:', {
      score,
      maxScore: rules.maxScore,
      percentage: (score / rules.maxScore) * 100,
    });
    // Allow but flag for review
  }

  return { valid: true };
}

/**
 * Validate completion time
 */
function validateTime(levelId: string, completionTime: number): {
  valid: boolean;
  reason?: SuspiciousReason;
} {
  const rules = calculateLevelRules(levelId);

  if (!rules) {
    return { valid: false, reason: 'impossible_time' };
  }

  // Too fast (impossible)
  if (completionTime < rules.minTime) {
    return { valid: false, reason: 'impossible_time' };
  }

  // Too slow (suspicious - might be AFK/bot)
  if (completionTime > rules.maxTime) {
    console.warn('[AntiCheat] Completion time suspiciously long:', {
      completionTime,
      maxTime: rules.maxTime,
    });
    // Allow but flag for review
  }

  return { valid: true };
}

/**
 * Validate zombie kill count
 */
function validateZombieCount(levelId: string, zombiesKilled: number): {
  valid: boolean;
  reason?: SuspiciousReason;
} {
  const rules = calculateLevelRules(levelId);

  if (!rules) {
    return { valid: false, reason: 'impossible_zombies' };
  }

  // Too many zombies
  if (zombiesKilled > rules.maxZombies) {
    return { valid: false, reason: 'impossible_zombies' };
  }

  // Too few zombies (can't complete without killing most)
  if (zombiesKilled < rules.minZombies) {
    return { valid: false, reason: 'impossible_zombies' };
  }

  return { valid: true };
}

/**
 * Validate gameplay hash (if provided)
 * Hash should be SHA-256 of gameplay events (tower placements, zombie kills, etc.)
 */
function validateGameplayHash(hash: string | undefined): {
  valid: boolean;
  reason?: SuspiciousReason;
} {
  if (!hash) {
    // Hash is optional for now
    return { valid: true };
  }

  // Basic format check (SHA-256 is 64 hex characters)
  if (!/^[a-f0-9]{64}$/i.test(hash)) {
    return { valid: false, reason: 'hash_mismatch' };
  }

  // TODO: Server-side verification of hash against expected gameplay
  // This requires storing gameplay events and recalculating hash

  return { valid: true };
}

// ============================================
// RATE LIMITING
// ============================================

const submissionTimestamps = new Map<string, number[]>();

/**
 * Check if user is submitting too many scores too quickly
 */
function checkRateLimit(userId: string): {
  allowed: boolean;
  reason?: SuspiciousReason;
} {
  const now = Date.now();
  const maxPerMinute = parseInt(
    process.env.EXPO_PUBLIC_MAX_SCORE_SUBMISSIONS_PER_MINUTE || '10',
    10
  );

  // Get recent submissions
  const timestamps = submissionTimestamps.get(userId) || [];

  // Filter to last minute
  const recentSubmissions = timestamps.filter(
    t => now - t < 60 * 1000
  );

  // Check limit
  if (recentSubmissions.length >= maxPerMinute) {
    return { allowed: false, reason: 'rate_limit_exceeded' };
  }

  // Add current timestamp
  recentSubmissions.push(now);
  submissionTimestamps.set(userId, recentSubmissions);

  // Cleanup old entries (older than 5 minutes)
  setTimeout(() => {
    const current = submissionTimestamps.get(userId) || [];
    const filtered = current.filter(t => now - t < 5 * 60 * 1000);
    submissionTimestamps.set(userId, filtered);
  }, 5 * 60 * 1000);

  return { allowed: true };
}

// ============================================
// MAIN VALIDATION FUNCTION
// ============================================

/**
 * Validate a score submission
 * Returns validation result with reasons if invalid
 */
export async function validateScoreSubmission(
  userId: string,
  submission: ScoreSubmission
): Promise<{
  valid: boolean;
  shouldFlag: boolean;
  reasons: SuspiciousReason[];
  metadata?: Record<string, any>;
}> {
  const reasons: SuspiciousReason[] = [];
  let shouldFlag = false;

  // 1. Rate limit check
  const rateLimitResult = checkRateLimit(userId);
  if (!rateLimitResult.allowed) {
    reasons.push(rateLimitResult.reason!);
    shouldFlag = true;
  }

  // 2. Score validation
  const scoreResult = validateScore(submission.level_id, submission.score);
  if (!scoreResult.valid) {
    reasons.push(scoreResult.reason!);
    shouldFlag = true;
  }

  // 3. Time validation
  const timeResult = validateTime(submission.level_id, submission.completion_time);
  if (!timeResult.valid) {
    reasons.push(timeResult.reason!);
    shouldFlag = true;
  }

  // 4. Zombie count validation
  const zombieResult = validateZombieCount(submission.level_id, submission.zombies_killed);
  if (!zombieResult.valid) {
    reasons.push(zombieResult.reason!);
    shouldFlag = true;
  }

  // 5. Gameplay hash validation
  const hashResult = validateGameplayHash(submission.gameplay_hash);
  if (!hashResult.valid) {
    reasons.push(hashResult.reason!);
    shouldFlag = true;
  }

  // 6. Consistency checks
  const consistencyReasons = checkConsistency(submission);
  if (consistencyReasons.length > 0) {
    reasons.push(...consistencyReasons);
    // Consistency warnings don't auto-flag, just log
  }

  // Build metadata
  const rules = calculateLevelRules(submission.level_id);
  const metadata = {
    submission,
    rules,
    timestamp: Date.now(),
  };

  return {
    valid: reasons.length === 0,
    shouldFlag,
    reasons,
    metadata,
  };
}

/**
 * Check for internal consistency in submission
 */
function checkConsistency(submission: ScoreSubmission): SuspiciousReason[] {
  const warnings: SuspiciousReason[] = [];

  // Stars vs Score consistency
  // 3 stars should mean high score
  if (submission.stars === 3 && submission.score < 5000) {
    console.warn('[AntiCheat] Low score with 3 stars');
  }

  // Hull integrity vs Stars
  // 3 stars usually means high hull integrity
  if (submission.stars === 3 && (submission.hull_integrity || 0) < 50) {
    console.warn('[AntiCheat] Low hull with 3 stars');
  }

  // Time vs Zombies killed
  // Fast time with few kills is suspicious
  const zombiesPerSecond = submission.zombies_killed / submission.completion_time;
  if (zombiesPerSecond > 10) {
    console.warn('[AntiCheat] Unrealistic kill rate:', zombiesPerSecond);
  }

  return warnings;
}

// ============================================
// FLAG SUSPICIOUS SCORES
// ============================================

/**
 * Flag a score as suspicious in the database
 */
export async function flagSuspiciousScore(
  userId: string,
  submission: ScoreSubmission,
  reasons: SuspiciousReason[],
  metadata: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('suspicious_scores').insert({
      user_id: userId,
      level_id: submission.level_id,
      score: submission.score,
      reason: reasons.join(', '),
      metadata,
      auto_banned: false, // Manual review required
      reviewed: false,
    });

    console.warn('[AntiCheat] Flagged suspicious score:', {
      userId,
      levelId: submission.level_id,
      score: submission.score,
      reasons,
    });
  } catch (error) {
    console.error('[AntiCheat] Failed to flag score:', error);
  }
}

/**
 * Check if user is banned
 */
export async function isUserBanned(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_bans')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (error) {
      console.error('[AntiCheat] Failed to check ban status:', error);
      return false;
    }

    if (!data || data.length === 0) {
      return false;
    }

    // Check if ban is still active
    const now = new Date();
    const activeBan = data.find(ban => {
      if (ban.permanent) return true;
      if (ban.banned_until && new Date(ban.banned_until) > now) return true;
      return false;
    });

    return !!activeBan;
  } catch (error) {
    console.error('[AntiCheat] Ban check exception:', error);
    return false;
  }
}

// ============================================
// CLIENT-SIDE HELPERS
// ============================================

/**
 * Generate gameplay hash (client-side)
 * This should hash gameplay events for verification
 *
 * For now, returns a simple hash of key stats
 */
export async function generateGameplayHash(
  levelId: string,
  score: number,
  completionTime: number,
  zombiesKilled: number
): Promise<string> {
  // Simple hash for now
  // In production, hash actual gameplay events (tower placements, timings, etc.)

  const data = `${levelId}:${score}:${completionTime}:${zombiesKilled}`;

  // Use crypto.subtle if available (Web/modern React Native)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.warn('[AntiCheat] Crypto not available, using fallback hash');
    }
  }

  // Fallback: simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16).padStart(64, '0');
}

// ============================================
// EXPORT VALIDATION RULES (for Edge Function)
// ============================================

/**
 * This function signature is Edge Function compatible
 * Can be deployed to Supabase Edge Functions for server-side validation
 */
export const edgeFunctionHandler = async (request: Request) => {
  try {
    const { userId, submission } = await request.json();

    // Validate
    const result = await validateScoreSubmission(userId, submission);

    // Flag if suspicious
    if (result.shouldFlag) {
      await flagSuspiciousScore(userId, submission, result.reasons, result.metadata || {});
    }

    return new Response(
      JSON.stringify(result),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Validation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
