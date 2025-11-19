/**
 * Achievements Screen
 * Displays all achievements with filtering, sorting, and progress tracking
 */

import { router } from 'expo-router';
import { ArrowLeft, Trophy, Filter, SlidersHorizontal } from 'lucide-react-native';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/lib/analytics';
import {
  getAchievementsWithProgress,
  getAchievementStats,
  getRecentlyUnlocked,
} from '@/lib/achievements';
import { THEME } from '@/constants/ui/theme';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { AchievementUnlockModal } from '@/components/achievements/AchievementUnlockModal';
import type {
  AchievementWithProgress,
  AchievementCategory,
  AchievementUnlocked,
} from '@/types/gamification';

type TabFilter = 'all' | AchievementCategory;
type SortOption = 'progress' | 'category' | 'unlock_date';

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();

  // State
  const [achievements, setAchievements] = useState<AchievementWithProgress[]>([]);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<AchievementUnlocked[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('progress');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    locked: 0,
    completionPercentage: 0,
  });

  // Modal state
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementUnlocked | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  /**
   * Load achievements data
   */
  const loadAchievements = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load achievements with progress
      const { success, achievements: data } = await getAchievementsWithProgress(user.id);

      if (success && data) {
        setAchievements(data);

        // Load stats
        const statsData = await getAchievementStats(user.id);
        setStats(statsData);

        // Load recently unlocked
        const { achievements: recent } = await getRecentlyUnlocked(user.id, 3);
        if (recent) {
          setRecentlyUnlocked(recent);
        }
      }
    } catch (error) {
      console.error('[Achievements] Load error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  /**
   * Initial load and analytics tracking
   */
  useEffect(() => {
    loadAchievements();

    if (user) {
      analytics.track('screen_view', {
        screen_name: 'achievements',
        user_id: user.id,
      });
    }
  }, [loadAchievements, user]);

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAchievements();
  }, [loadAchievements]);

  /**
   * Filter achievements by tab
   */
  const filteredAchievements = achievements.filter((achievement) => {
    if (selectedTab === 'all') return true;
    return achievement.category === selectedTab;
  });

  /**
   * Sort achievements
   */
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'progress': {
        // Sort by closest to completion (in-progress first, then locked, then completed)
        const aProgress = a.progress?.progress || 0;
        const bProgress = b.progress?.progress || 0;
        const aCompleted = a.progress?.completed || false;
        const bCompleted = b.progress?.completed || false;

        // Completed last
        if (aCompleted !== bCompleted) {
          return aCompleted ? 1 : -1;
        }

        // In-progress by percentage
        const aPercentage = (aProgress / a.requirement_value) * 100;
        const bPercentage = (bProgress / b.requirement_value) * 100;
        return bPercentage - aPercentage;
      }
      case 'category': {
        return a.category.localeCompare(b.category);
      }
      case 'unlock_date': {
        const aDate = a.progress?.completed_at || '';
        const bDate = b.progress?.completed_at || '';
        return bDate.localeCompare(aDate);
      }
      default:
        return 0;
    }
  });

  /**
   * Handle achievement press
   */
  const handleAchievementPress = (achievement: AchievementWithProgress) => {
    if (achievement.progress?.completed) {
      // Show unlock modal for completed achievements
      setSelectedAchievement({
        achievement,
        progress: achievement.progress,
      });
      setShowUnlockModal(true);

      analytics.track('achievement_viewed', {
        user_id: user?.id,
        achievement_id: achievement.id,
        achievement_name: achievement.name,
      });
    }
  };

  /**
   * Render tab button
   */
  const renderTabButton = (tab: TabFilter, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, selectedTab === tab && styles.tabButtonActive]}
      onPress={() => setSelectedTab(tab)}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabButtonText, selectedTab === tab && styles.tabButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  /**
   * Render sort option
   */
  const renderSortOption = (option: SortOption, label: string) => (
    <TouchableOpacity
      key={option}
      style={[styles.sortOption, sortBy === option && styles.sortOptionActive]}
      onPress={() => {
        setSortBy(option);
        setShowSortMenu(false);
      }}
      activeOpacity={0.7}
    >
      <Text style={[styles.sortOptionText, sortBy === option && styles.sortOptionTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Trophy size={64} color={THEME.colors.text.disabled} />
      <Text style={styles.emptyStateTitle}>No Achievements Yet</Text>
      <Text style={styles.emptyStateText}>
        Play the game to start unlocking achievements!
      </Text>
    </View>
  );

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Loading achievements...</Text>
        </View>
      </View>
    );
  }

  /**
   * Render achievement item
   */
  const renderAchievement = ({ item }: { item: AchievementWithProgress }) => (
    <AchievementCard achievement={item} onPress={() => handleAchievementPress(item)} />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={THEME.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Trophy size={24} color={THEME.colors.star.filled} />
          <Text style={styles.headerTitle}>Achievements</Text>
        </View>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
          activeOpacity={0.7}
        >
          <SlidersHorizontal size={24} color={THEME.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Sort menu */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          <Text style={styles.sortMenuTitle}>Sort by:</Text>
          {renderSortOption('progress', 'Progress')}
          {renderSortOption('category', 'Category')}
          {renderSortOption('unlock_date', 'Unlock Date')}
        </View>
      )}

      {/* Stats header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {stats.completed}/{stats.total}
          </Text>
          <Text style={styles.statLabel}>Unlocked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(stats.completionPercentage)}%</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>

      {/* Recently unlocked */}
      {recentlyUnlocked.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recently Unlocked</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentlyUnlocked.map((unlock) => (
              <TouchableOpacity
                key={unlock.achievement.id}
                style={styles.recentCard}
                onPress={() => {
                  setSelectedAchievement(unlock);
                  setShowUnlockModal(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.recentEmoji}>
                  {unlock.achievement.category === 'combat'
                    ? '💀'
                    : unlock.achievement.category === 'progression'
                    ? '🏆'
                    : '⭐'}
                </Text>
                <Text style={styles.recentName} numberOfLines={2}>
                  {unlock.achievement.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tab filters */}
      <View style={styles.tabContainer}>
        {renderTabButton('all', 'All')}
        {renderTabButton('combat', 'Combat')}
        {renderTabButton('progression', 'Progression')}
        {renderTabButton('special', 'Special')}
      </View>

      {/* Achievement list */}
      <FlatList
        data={sortedAchievements}
        renderItem={renderAchievement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME.colors.primary}
            colors={[THEME.colors.primary]}
          />
        }
      />

      {/* Unlock modal */}
      <AchievementUnlockModal
        achievement={selectedAchievement}
        visible={showUnlockModal}
        onClose={() => {
          setShowUnlockModal(false);
          setSelectedAchievement(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  loadingText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    backgroundColor: THEME.colors.background.tertiary,
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.border.default,
  },
  backButton: {
    padding: THEME.spacing.sm,
    width: 40,
  },
  sortButton: {
    padding: THEME.spacing.sm,
    width: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  headerTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.extrabold,
    color: THEME.colors.text.primary,
  },
  sortMenu: {
    backgroundColor: THEME.colors.background.elevated,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
    padding: THEME.spacing.md,
    gap: THEME.spacing.xs,
  },
  sortMenuTitle: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  sortOption: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
  },
  sortOptionActive: {
    backgroundColor: THEME.colors.primary + '20',
  },
  sortOptionText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
  },
  sortOptionTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.background.elevated,
    padding: THEME.spacing.md,
    marginHorizontal: THEME.spacing.md,
    marginTop: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
    ...THEME.shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: THEME.colors.border.default,
  },
  statValue: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.star.filled,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  recentSection: {
    marginTop: THEME.spacing.md,
    paddingLeft: THEME.spacing.md,
  },
  recentTitle: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  recentCard: {
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    marginRight: THEME.spacing.sm,
    width: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.success + '40',
    ...THEME.shadows.sm,
  },
  recentEmoji: {
    fontSize: 32,
    marginBottom: THEME.spacing.xs,
  },
  recentName: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.background.elevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  tabButtonText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
  },
  tabButtonTextActive: {
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.xxl * 2,
    gap: THEME.spacing.md,
  },
  emptyStateTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.secondary,
  },
  emptyStateText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
});
