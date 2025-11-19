# Daily Rewards UI Integration Guide

Complete integration guide for the Daily Rewards system in Zombie Fleet.

## Components Created

### 1. `DailyRewardCard.tsx`
Compact card component for displaying daily rewards inline (e.g., on home screen).

**Features:**
- Current streak display with fire emoji
- Today's reward preview
- Countdown timer when already claimed
- Animated claim button
- Preview of next 7 days rewards
- Streak danger warning (< 6 hours)
- Success animations with sparkles

### 2. `rewards.tsx` (Full Screen)
Dedicated rewards screen with complete information.

**Features:**
- Large streak banner
- Detailed reward card with claim button
- Stats grid (longest streak, total claimed)
- Full 7-day reward schedule
- Helpful streak tips
- Guest user redirect to login

### 3. `RewardClaimModal.tsx`
Beautiful success modal shown after claiming a reward.

**Features:**
- Animated confetti explosion
- Reward amount display
- Streak information
- Special bonus badge for day 3 & 7
- Gift icon animation

---

## Integration Examples

### Example 1: Add to Home Screen (Main Menu)

Add the daily reward card to the home screen for quick access:

```tsx
// app/index.tsx

import { DailyRewardCard } from '@/components/rewards/DailyRewardCard';
import { RewardClaimModal } from '@/components/rewards/RewardClaimModal';
import { useAuth } from '@/contexts/AuthContext';
import { DailyRewardDefinition } from '@/types/gamification';
import { useState } from 'react';
import { router } from 'expo-router';

export default function MainMenu() {
  const { user, isAuthenticated } = useAuth();
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [claimedReward, setClaimedReward] = useState<{
    reward: DailyRewardDefinition;
    streak: number;
  } | null>(null);

  const handleRewardClaim = (reward: DailyRewardDefinition) => {
    // Show success modal
    setClaimedReward({ reward, streak: 1 }); // Get actual streak from API
    setShowRewardModal(true);
  };

  const handleViewFullRewards = () => {
    router.push('/rewards');
  };

  return (
    <View style={styles.container}>
      {/* ... existing content ... */}

      {/* Daily Rewards Card - Only show for authenticated users */}
      {isAuthenticated && user && (
        <View style={styles.rewardsContainer}>
          <DailyRewardCard
            userId={user.id}
            onClaim={handleRewardClaim}
            onViewFullScreen={handleViewFullRewards}
          />
        </View>
      )}

      {/* Success Modal */}
      {claimedReward && (
        <RewardClaimModal
          visible={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          reward={claimedReward.reward}
          newStreak={claimedReward.streak}
        />
      )}

      {/* ... rest of menu ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...
  rewardsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
```

---

### Example 2: Add Menu Button to Navigate to Full Screen

Add a button to the main menu to access the full rewards screen:

```tsx
// app/index.tsx

import { Gift } from 'lucide-react-native';

export default function MainMenu() {
  return (
    <View style={styles.container}>
      {/* ... existing buttons ... */}

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => router.push('/rewards')}
        activeOpacity={0.7}
      >
        <Gift size={20} color="#FFFFFF" />
        <Text style={styles.menuButtonText}>Daily Rewards</Text>
      </TouchableOpacity>

      {/* ... rest of menu ... */}
    </View>
  );
}
```

---

### Example 3: Show Modal After Level Completion

Prompt users to claim daily reward after completing a level:

```tsx
// components/campaign/VictoryScreenEnhanced.tsx

import { canClaimDailyReward } from '@/lib/dailyRewards';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export function VictoryScreenEnhanced({ visible, ...props }: VictoryScreenEnhancedProps) {
  const { user } = useAuth();
  const [hasUnclaimedReward, setHasUnclaimedReward] = useState(false);

  useEffect(() => {
    if (visible && user) {
      // Check if user has unclaimed reward
      canClaimDailyReward(user.id).then(result => {
        setHasUnclaimedReward(result.canClaim);
      });
    }
  }, [visible, user]);

  return (
    <Modal transparent visible={visible}>
      {/* ... victory content ... */}

      {/* Reminder about daily reward */}
      {hasUnclaimedReward && (
        <TouchableOpacity
          style={styles.dailyRewardBanner}
          onPress={() => {
            props.onBackToCampaign();
            // Navigate to rewards screen or show inline card
            router.push('/rewards');
          }}
        >
          <Gift size={24} color={THEME.colors.star.filled} />
          <View style={styles.dailyRewardText}>
            <Text style={styles.dailyRewardTitle}>Don't Forget!</Text>
            <Text style={styles.dailyRewardSubtitle}>
              Claim your daily reward to keep your streak
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </Modal>
  );
}
```

---

### Example 4: Campaign Screen Integration

Show daily rewards status on the campaign levels screen:

```tsx
// app/levels.tsx

import { DailyRewardCard } from '@/components/rewards/DailyRewardCard';
import { useAuth } from '@/contexts/AuthContext';

export default function CampaignScreen() {
  const { user, isAuthenticated } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {/* Daily Reward Card at top */}
      {isAuthenticated && user && (
        <View style={styles.rewardsSection}>
          <DailyRewardCard
            userId={user.id}
            onViewFullScreen={() => router.push('/rewards')}
          />
        </View>
      )}

      {/* Level cards */}
      {levels.map(level => (
        <LevelCard key={level.id} level={level} />
      ))}
    </ScrollView>
  );
}
```

---

## API Usage

### Check if user can claim reward

```tsx
import { canClaimDailyReward } from '@/lib/dailyRewards';

const { canClaim, streak, nextReward } = await canClaimDailyReward(userId);

if (canClaim) {
  console.log('User can claim reward:', nextReward);
  console.log('Current streak:', streak);
}
```

### Claim daily reward

```tsx
import { claimDailyReward } from '@/lib/dailyRewards';

const result = await claimDailyReward(userId);

if (result.success) {
  console.log('Claimed reward:', result.reward);
  console.log('New streak:', result.new_streak);
  console.log('Streak broken?:', result.streak_broken);

  // Show success feedback
  // Grant scrap to user
} else {
  console.error('Failed to claim:', result.error);
}
```

### Get rewards status

```tsx
import { getDailyRewards } from '@/lib/dailyRewards';

const { success, rewards } = await getDailyRewards(userId);

if (success && rewards) {
  console.log('Current streak:', rewards.current_streak);
  console.log('Longest streak:', rewards.longest_streak);
  console.log('Total claimed:', rewards.total_rewards_claimed);
  console.log('Last claim:', rewards.last_claim_date);
}
```

### Check if streak is in danger

```tsx
import { isStreakInDanger, getHoursUntilStreakExpires } from '@/lib/dailyRewards';

if (isStreakInDanger(lastClaimDate)) {
  const hours = getHoursUntilStreakExpires(lastClaimDate);
  console.log(`Streak expires in ${hours} hours!`);
  // Show warning to user
}
```

---

## Styling Customization

All components use the centralized `THEME` from `/constants/ui/theme.ts`.

### Customize reward card appearance

```tsx
// Override styles by passing custom style prop (if needed)
<DailyRewardCard
  userId={userId}
  onClaim={handleClaim}
  style={customStyles.rewardCard}
/>
```

### Customize colors

Edit `/constants/ui/theme.ts`:

```tsx
export const THEME = {
  colors: {
    success: '#4CAF50',     // Claim button color
    scrap: '#FFD700',       // Scrap/reward color
    star: {
      filled: '#FFD700',    // Special reward color
    },
    // ... other colors
  },
};
```

---

## Analytics Events

All components automatically track analytics events:

- `daily_reward_shown` - When reward UI is displayed
- `daily_reward_claimed` - When reward is successfully claimed
- `daily_reward_claim_failed` - When claim fails

### Custom analytics tracking

```tsx
import { analytics } from '@/lib/analytics';

analytics.track('daily_reward_claimed', {
  user_id: userId,
  streak: newStreak,
  reward_type: reward.reward_type,
  reward_amount: reward.reward_amount,
  day: dayNumber,
});
```

---

## Reward Schedule

The reward schedule is defined in `/types/gamification.ts`:

```tsx
export const DAILY_REWARD_SCHEDULE: DailyRewardDefinition[] = [
  { day: 1, reward_type: 'scrap', reward_amount: 100 },
  { day: 2, reward_type: 'scrap', reward_amount: 200 },
  { day: 3, reward_type: 'scrap', reward_amount: 500, special: true },
  { day: 4, reward_type: 'scrap', reward_amount: 300 },
  { day: 5, reward_type: 'scrap', reward_amount: 400 },
  { day: 6, reward_type: 'scrap', reward_amount: 600 },
  { day: 7, reward_type: 'scrap', reward_amount: 1000, special: true },
];
```

To modify rewards, edit this array. The schedule cycles automatically after day 7.

---

## Best Practices

### 1. Always check authentication

```tsx
if (!isAuthenticated || !user) {
  // Don't show daily rewards for guests
  return null;
}
```

### 2. Handle errors gracefully

```tsx
const result = await claimDailyReward(userId);

if (!result.success) {
  // Show user-friendly error message
  Alert.alert('Error', result.error || 'Failed to claim reward');
}
```

### 3. Refresh rewards after claim

```tsx
const handleClaim = async (reward: DailyRewardDefinition) => {
  // ... claim logic ...

  // Reload rewards to update UI
  await loadRewards();
};
```

### 4. Show compelling CTAs

```tsx
// Remind users to claim at key moments:
// - After level completion
// - On app startup
// - Before streak expires
```

### 5. Celebrate streaks

```tsx
if (newStreak === 7) {
  // Special celebration for week-long streak
  showConfetti();
  playSound('celebration');
}
```

---

## Testing

### Test claim flow

```tsx
// 1. Navigate to rewards screen
// 2. Verify "can claim" status
// 3. Click claim button
// 4. Verify success modal appears
// 5. Verify streak increments
// 6. Verify button becomes disabled
// 7. Verify countdown timer appears
```

### Test streak expiration

```tsx
// 1. Claim reward on day 1
// 2. Wait 48+ hours (or mock time)
// 3. Attempt to claim on day 3
// 4. Verify streak resets to 1
// 5. Verify "streak broken" message
```

### Test guest users

```tsx
// 1. Ensure guest users can't see rewards
// 2. Verify redirect to login screen
// 3. Verify "create account" CTA
```

---

## Future Enhancements

### Planned features:

1. **Push notifications** - Remind users to claim daily
2. **Reward variety** - Add gems, items, power-ups
3. **Extended streaks** - Bonus for 30-day, 100-day streaks
4. **Social features** - Compare streaks with friends
5. **Streak insurance** - Allow missing 1 day per month
6. **Claim history** - Calendar view of past claims
7. **Reward multipliers** - Double rewards on weekends

---

## Troubleshooting

### Reward not appearing?

- Check authentication status
- Verify database permissions
- Check network connectivity
- Review server logs

### Claim button disabled?

- Already claimed today
- Network error during claim
- User not authenticated

### Countdown timer wrong?

- Check server time sync
- Verify timezone handling
- Test midnight rollover

### Animation not smooth?

- Reduce confetti particle count
- Use `useNativeDriver: true`
- Test on physical device

---

## Support

For questions or issues:
- Review API docs in `/lib/dailyRewards.ts`
- Check type definitions in `/types/gamification.ts`
- Review theme in `/constants/ui/theme.ts`

**Happy rewarding!** 🎁🔥
