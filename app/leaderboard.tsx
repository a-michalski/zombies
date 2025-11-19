/**
 * Leaderboard Screen - Global, Regional, and Per-Level Rankings
 *
 * Created: 2025-11-19
 *
 * Route: /leaderboard
 *
 * Features:
 * - Tab switcher for Global/Regional/Per-Level scopes
 * - Top 3 podium display with special styling
 * - User's position card (highlighted)
 * - Level selector and timeframe filters
 * - Pull-to-refresh functionality
 * - Empty states and error handling
 * - Smooth animations and loading states
 */

import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Trophy,
  Globe,
  MapPin,
  Target,
  RefreshCw,
  ChevronDown,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEME } from '@/constants/ui/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_LEVELS } from '@/data/maps';
import { analytics } from '@/lib/analytics';
import {
  getLeaderboard,
  getGlobalLeaderboard,
  getRegionalLeaderboard,
} from '@/lib/leaderboard';
import { getNationalityByCode } from '@/types/auth';
import {
  LeaderboardScope,
  LeaderboardTimeframe,
  LeaderboardEntryWithProfile,
  GlobalLeaderboardEntry,
} from '@/types/leaderboard';
import { LevelConfig } from '@/types/levels';

type LeaderboardTab = 'global' | 'regional' | 'per-level';
type CombinedLeaderboardEntry = LeaderboardEntryWithProfile | GlobalLeaderboardEntry;

export default function LeaderboardScreen() {
  const router = useRouter();
  const { profile, isAuthenticated } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');

  // Filter states
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all_time');

  // Data states
  const [entries, setEntries] = useState<CombinedLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User position
  const [userRank, setUserRank] = useState<number | null>(null);

  // Modal states
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [showTimeframePicker, setShowTimeframePicker] = useState(false);

  /**
   * Load leaderboard data based on active tab and filters
   */
  const loadLeaderboard = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        let result;

        if (activeTab === 'global') {
          // Global leaderboard (aggregated across all levels)
          result = await getGlobalLeaderboard(100, 0);
        } else if (activeTab === 'regional') {
          // Regional leaderboard (by user's nationality)
          if (!profile?.nationality) {
            setError('You must be signed in to view regional leaderboard');
            setEntries([]);
            return;
          }
          result = await getRegionalLeaderboard(profile.nationality, 100);
        } else if (activeTab === 'per-level') {
          // Per-level leaderboard
          if (!selectedLevel) {
            setError('Please select a level');
            setEntries([]);
            return;
          }
          result = await getLeaderboard({
            scope: 'global',
            timeframe,
            level_id: selectedLevel.id,
            limit: 100,
          });
        }

        if (result?.success && result.entries) {
          setEntries(result.entries);

          // Find user's rank
          if (profile?.id) {
            const userEntry = result.entries.findIndex((entry: any) => {
              return entry.user_id === profile.id || entry.id === profile.id;
            });
            setUserRank(userEntry !== -1 ? userEntry + 1 : null);
          }
        } else {
          setError(result?.error || 'Failed to load leaderboard');
          setEntries([]);
        }
      } catch (err) {
        console.error('[Leaderboard] Load error:', err);
        setError('Network error. Please check your connection.');
        setEntries([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [activeTab, selectedLevel, timeframe, profile]
  );

  /**
   * Load leaderboard on mount and when filters change
   */
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  /**
   * Handle tab change
   */
  const handleTabChange = (tab: LeaderboardTab) => {
    setActiveTab(tab);
    analytics.track('leaderboard_tab_changed', { tab });
  };

  /**
   * Handle level selection
   */
  const handleLevelSelect = (level: LevelConfig) => {
    setSelectedLevel(level);
    setShowLevelPicker(false);
    analytics.track('leaderboard_level_selected', { level_id: level.id });
  };

  /**
   * Handle timeframe selection
   */
  const handleTimeframeSelect = (tf: LeaderboardTimeframe) => {
    setTimeframe(tf);
    setShowTimeframePicker(false);
    analytics.track('leaderboard_timeframe_changed', { timeframe: tf });
  };

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = () => {
    loadLeaderboard(true);
  };

  /**
   * Get medal emoji for top 3
   */
  const getMedal = (rank: number): string => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  /**
   * Format score with commas
   */
  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  /**
   * Get user's entry data
   */
  const userEntry = useMemo(() => {
    if (!profile?.id) return null;
    return entries.find((entry: any) => {
      return entry.user_id === profile.id || entry.id === profile.id;
    });
  }, [entries, profile]);

  /**
   * Render user's position card
   */
  const renderUserPositionCard = () => {
    if (!isAuthenticated || !profile) {
      return (
        <View style={styles.userPositionCard}>
          <Text style={styles.userPositionText}>
            Sign in to see your ranking
          </Text>
        </View>
      );
    }

    if (!userEntry || userRank === null) {
      return (
        <View style={styles.userPositionCard}>
          <Text style={styles.userPositionText}>
            {activeTab === 'per-level' && !selectedLevel
              ? 'Select a level to see your ranking'
              : 'No ranking yet - play a game to get ranked!'}
          </Text>
        </View>
      );
    }

    const score =
      'total_score' in userEntry ? userEntry.total_score : userEntry.score;
    const percentile = ((entries.length - userRank + 1) / entries.length) * 100;

    return (
      <View style={styles.userPositionCard}>
        <View style={styles.userPositionHeader}>
          <Trophy size={20} color={THEME.colors.star.filled} />
          <Text style={styles.userPositionTitle}>Your Rank</Text>
        </View>
        <View style={styles.userPositionStats}>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>#{userRank}</Text>
            <Text style={styles.userStatLabel}>Rank</Text>
          </View>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>{formatScore(score)}</Text>
            <Text style={styles.userStatLabel}>Score</Text>
          </View>
          <View style={styles.userStat}>
            <Text style={styles.userStatValue}>Top {percentile.toFixed(0)}%</Text>
            <Text style={styles.userStatLabel}>Percentile</Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Render leaderboard entry
   */
  const renderEntry = ({ item, index }: { item: CombinedLeaderboardEntry; index: number }) => {
    const rank = index + 1;
    const isUser = profile?.id && ('user_id' in item ? item.user_id === profile.id : item.id === profile.id);
    const isTopThree = rank <= 3;

    // Extract data (different structures for global vs per-level)
    const nickname = 'nickname' in item ? item.nickname : item.profile.nickname;
    const nationality = 'nationality' in item ? item.nationality : item.profile.nationality;
    const score = 'total_score' in item ? item.total_score : item.score;
    const stars = 'total_stars' in item ? item.total_stars : item.stars;

    const flag = getNationalityByCode(nationality);

    return (
      <View style={[styles.entryRow, isUser && styles.entryRowUser, isTopThree && styles.entryRowTopThree]}>
        {/* Rank */}
        <View style={styles.rankContainer}>
          {isTopThree ? (
            <Text style={styles.medalEmoji}>{getMedal(rank)}</Text>
          ) : (
            <Text style={[styles.rankText, isUser && styles.rankTextUser]}>
              {rank}
            </Text>
          )}
        </View>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <View style={styles.playerNameRow}>
            <Text style={styles.flagEmoji}>{flag?.flag || '🌍'}</Text>
            <Text
              style={[styles.nicknameText, isUser && styles.nicknameTextUser]}
              numberOfLines={1}
            >
              {nickname}
            </Text>
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, isUser && styles.scoreTextUser]}>
            {formatScore(score)}
          </Text>
          {activeTab !== 'global' && (
            <View style={styles.starsRow}>
              {[...Array(3)].map((_, i) => (
                <Text key={i} style={styles.starIcon}>
                  {i < stars ? '⭐' : '☆'}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    if (loading) return null;

    if (error) {
      return (
        <View style={styles.emptyState}>
          <WifiOff size={48} color={THEME.colors.text.tertiary} />
          <Text style={styles.emptyStateTitle}>Connection Error</Text>
          <Text style={styles.emptyStateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadLeaderboard()}>
            <RefreshCw size={20} color={THEME.colors.text.primary} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Trophy size={48} color={THEME.colors.text.tertiary} />
        <Text style={styles.emptyStateTitle}>No Rankings Yet</Text>
        <Text style={styles.emptyStateText}>
          {activeTab === 'per-level' && !selectedLevel
            ? 'Select a level to view rankings'
            : 'Be the first to set a record!'}
        </Text>
      </View>
    );
  };

  /**
   * Render tab button
   */
  const renderTab = (tab: LeaderboardTab, icon: any, label: string) => {
    const isActive = activeTab === tab;
    const Icon = icon;

    return (
      <TouchableOpacity
        style={[styles.tab, isActive && styles.tabActive]}
        onPress={() => handleTabChange(tab)}
        activeOpacity={0.7}
      >
        <Icon
          size={20}
          color={isActive ? THEME.colors.primary : THEME.colors.text.tertiary}
        />
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render timeframe badge
   */
  const getTimeframeLabel = (tf: LeaderboardTimeframe): string => {
    switch (tf) {
      case 'all_time':
        return 'All Time';
      case 'this_week':
        return 'This Week';
      case 'this_month':
        return 'This Month';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={THEME.colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>LEADERBOARD</Text>

        <View style={styles.headerButton} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {renderTab('global', Globe, 'Global')}
        {renderTab('regional', MapPin, 'Regional')}
        {renderTab('per-level', Target, 'Per Level')}
      </View>

      {/* Filters */}
      {activeTab === 'per-level' && (
        <View style={styles.filtersRow}>
          {/* Level Selector */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowLevelPicker(true)}
          >
            <Text style={styles.filterButtonText}>
              {selectedLevel ? selectedLevel.name : 'Select Level'}
            </Text>
            <ChevronDown size={16} color={THEME.colors.text.secondary} />
          </TouchableOpacity>

          {/* Timeframe Selector */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowTimeframePicker(true)}
          >
            <Text style={styles.filterButtonText}>
              {getTimeframeLabel(timeframe)}
            </Text>
            <ChevronDown size={16} color={THEME.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* User Position Card */}
      {renderUserPositionCard()}

      {/* Leaderboard List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Loading rankings...</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item, index) => `entry-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={THEME.colors.primary}
              colors={[THEME.colors.primary]}
            />
          }
        />
      )}

      {/* Level Picker Modal */}
      <Modal
        visible={showLevelPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLevelPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Level</Text>
              <TouchableOpacity onPress={() => setShowLevelPicker(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {ALL_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.pickerItem,
                    selectedLevel?.id === level.id && styles.pickerItemSelected,
                  ]}
                  onPress={() => handleLevelSelect(level)}
                >
                  <Text style={styles.pickerItemNumber}>{level.number}</Text>
                  <Text style={styles.pickerItemText}>{level.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Timeframe Picker Modal */}
      <Modal
        visible={showTimeframePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeframePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Timeframe</Text>
              <TouchableOpacity onPress={() => setShowTimeframePicker(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.pickerItem,
                timeframe === 'all_time' && styles.pickerItemSelected,
              ]}
              onPress={() => handleTimeframeSelect('all_time')}
            >
              <Text style={styles.pickerItemText}>All Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerItem,
                timeframe === 'this_week' && styles.pickerItemSelected,
              ]}
              onPress={() => handleTimeframeSelect('this_week')}
            >
              <Text style={styles.pickerItemText}>This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pickerItem,
                timeframe === 'this_month' && styles.pickerItemSelected,
              ]}
              onPress={() => handleTimeframeSelect('this_month')}
            >
              <Text style={styles.pickerItemText}>This Month</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background.primary,
  },

  // Header
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
    backgroundColor: THEME.colors.background.secondary,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: THEME.typography.fontSize.xl,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },

  // Tabs
  tabs: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.xs,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: THEME.colors.primary,
  },
  tabText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  tabTextActive: {
    color: THEME.colors.primary,
  },

  // Filters
  filtersRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.background.elevated,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
  },
  filterButtonText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },

  // User Position Card
  userPositionCard: {
    margin: THEME.spacing.md,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    ...THEME.shadows.primary,
  },
  userPositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.sm,
  },
  userPositionTitle: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  userPositionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userStat: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: THEME.typography.fontSize.xl,
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  userStatLabel: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    marginTop: THEME.spacing.xs,
  },
  userPositionText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },

  // Leaderboard List
  listContent: {
    padding: THEME.spacing.md,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background.secondary,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
  },
  entryRowTopThree: {
    backgroundColor: THEME.colors.background.elevated,
    borderColor: THEME.colors.star.filled,
    ...THEME.shadows.sm,
  },
  entryRowUser: {
    backgroundColor: THEME.colors.background.elevated,
    borderColor: THEME.colors.primary,
    borderWidth: 2,
    ...THEME.shadows.primary,
  },

  // Rank
  rankContainer: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: THEME.typography.fontSize.lg,
    color: THEME.colors.text.tertiary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  rankTextUser: {
    color: THEME.colors.primary,
  },
  medalEmoji: {
    fontSize: 28,
  },

  // Player Info
  playerInfo: {
    flex: 1,
    marginLeft: THEME.spacing.sm,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  flagEmoji: {
    fontSize: 20,
  },
  nicknameText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  nicknameTextUser: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },

  // Score
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: THEME.typography.fontSize.lg,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  scoreTextUser: {
    color: THEME.colors.primary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: THEME.spacing.xs,
  },
  starIcon: {
    fontSize: 12,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.md,
  },
  loadingText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  emptyStateTitle: {
    fontSize: THEME.typography.fontSize.xl,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginTop: THEME.spacing.md,
    ...THEME.shadows.primary,
  },
  retryButtonText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay.dark,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.background.elevated,
    borderTopLeftRadius: THEME.borderRadius.lg,
    borderTopRightRadius: THEME.borderRadius.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
  },
  modalTitle: {
    fontSize: THEME.typography.fontSize.lg,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  modalCloseText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.dark,
    gap: THEME.spacing.md,
  },
  pickerItemSelected: {
    backgroundColor: THEME.colors.background.secondary,
  },
  pickerItemNumber: {
    fontSize: THEME.typography.fontSize.lg,
    color: THEME.colors.text.secondary,
    fontWeight: THEME.typography.fontWeight.bold,
    width: 32,
  },
  pickerItemText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
});
