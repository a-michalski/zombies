# Daily Rewards UI Components

Complete daily rewards system for Zombie Fleet with beautiful animations and compelling UX that encourages daily logins.

## 📦 Components

### 1. **DailyRewardCard** (`DailyRewardCard.tsx`)
Beautiful card component showing daily reward status.

**Features:**
- 🔥 Current streak display with fire emoji
- 🎁 Today's reward preview (scrap amount, special items)
- ⏰ Countdown timer if already claimed
- 🎯 Claim button (disabled if already claimed, animated if available)
- 📅 Next 7 days rewards preview (small icons/amounts)
- ✨ Animated claim effect with sparkles
- ⚠️ Streak danger warning (< 6 hours until expire)

**Props:**
```tsx
interface DailyRewardCardProps {
  userId: string;
  onClaim?: (reward: DailyRewardDefinition) => void;
  onViewFullScreen?: () => void;
}
```

**Usage:**
```tsx
import { DailyRewardCard } from '@/components/rewards';

<DailyRewardCard
  userId={user.id}
  onClaim={(reward) => console.log('Claimed:', reward)}
  onViewFullScreen={() => router.push('/rewards')}
/>
```

---

### 2. **Full Rewards Screen** (`app/rewards.tsx`)
Dedicated full-screen rewards page.

**Features:**
- 🏆 Current streak banner
- 📊 Stats grid (longest streak, total claimed)
- 📅 Full 7-day reward schedule
- 💡 Streak tips and best practices
- 🎨 Beautiful animations and transitions
- 🚫 Guest user redirect to login

**Navigation:**
```tsx
import { router } from 'expo-router';

router.push('/rewards');
```

---

### 3. **RewardClaimModal** (`RewardClaimModal.tsx`)
Success modal shown after claiming a reward.

**Features:**
- 🎊 Animated confetti explosion (30 particles)
- 💰 Reward amount display with icons
- 🔥 Streak information with fire emoji
- ⭐ Special bonus badge for days 3 & 7
- 🎁 Animated gift icon with sparkles
- 🎮 Smooth entrance/exit animations

**Props:**
```tsx
interface RewardClaimModalProps {
  visible: boolean;
  onClose: () => void;
  reward: DailyRewardDefinition;
  newStreak: number;
  streakBroken?: boolean;
}
```

**Usage:**
```tsx
import { RewardClaimModal } from '@/components/rewards';

<RewardClaimModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  reward={claimedReward}
  newStreak={5}
/>
```

---

## 🎨 Design

All components follow the dark zombie apocalypse theme:
- Uses centralized `THEME` from `/constants/ui/theme.ts`
- Dark backgrounds with elevated cards
- Gold/special styling for day 7 rewards
- Animated particles and confetti on claim
- Fire emoji (🔥) for streaks
- Scrap icon (🔩) for rewards

---

## 🔧 Integration

### Quick Start

```tsx
import { DailyRewardCard, RewardClaimModal } from '@/components/rewards';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [claimed, setClaimed] = useState(null);

  return (
    <View>
      {isAuthenticated && user && (
        <DailyRewardCard
          userId={user.id}
          onClaim={(reward) => {
            setClaimed({ reward, streak: 1 });
            setShowModal(true);
          }}
        />
      )}

      {claimed && (
        <RewardClaimModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          reward={claimed.reward}
          newStreak={claimed.streak}
        />
      )}
    </View>
  );
}
```

See `INTEGRATION_GUIDE.md` for detailed examples.

---

## 📚 API Reference

### Core Functions

All functions are imported from `/lib/dailyRewards.ts`:

```tsx
import {
  getDailyRewards,
  canClaimDailyReward,
  claimDailyReward,
  getRewardSchedule,
  getRewardForDay,
  getHoursUntilStreakExpires,
  isStreakInDanger,
  trackDailyRewardShown,
} from '@/lib/dailyRewards';
```

#### `getDailyRewards(userId: string)`
Get user's daily rewards status.

**Returns:**
```tsx
{
  success: boolean;
  rewards?: DailyRewards;
  error?: string;
}
```

#### `canClaimDailyReward(userId: string)`
Check if daily reward can be claimed today.

**Returns:**
```tsx
{
  canClaim: boolean;
  streak: number;
  nextReward?: DailyRewardDefinition;
}
```

#### `claimDailyReward(userId: string)`
Claim today's daily reward.

**Returns:**
```tsx
{
  success: boolean;
  reward?: DailyRewardDefinition;
  new_streak: number;
  streak_broken?: boolean;
  error?: string;
}
```

---

## 📊 Types

All types are imported from `/types/gamification.ts`:

```tsx
import {
  DailyRewards,
  DailyRewardDefinition,
  ClaimDailyRewardResult,
  DAILY_REWARD_SCHEDULE,
} from '@/types/gamification';
```

### DailyRewardDefinition
```tsx
interface DailyRewardDefinition {
  day: number;
  reward_type: 'scrap' | 'gems' | 'item';
  reward_amount?: number;
  reward_item_id?: string;
  special?: boolean;
}
```

### Reward Schedule
```tsx
const DAILY_REWARD_SCHEDULE: DailyRewardDefinition[] = [
  { day: 1, reward_type: 'scrap', reward_amount: 100 },
  { day: 2, reward_type: 'scrap', reward_amount: 200 },
  { day: 3, reward_type: 'scrap', reward_amount: 500, special: true },
  { day: 4, reward_type: 'scrap', reward_amount: 300 },
  { day: 5, reward_type: 'scrap', reward_amount: 400 },
  { day: 6, reward_type: 'scrap', reward_amount: 600 },
  { day: 7, reward_type: 'scrap', reward_amount: 1000, special: true },
];
```

---

## 🎯 Features

### Animations

1. **Claim Button Pulse** - Continuous pulse when reward is available
2. **Sparkle Effect** - Sparkles appear after successful claim
3. **Confetti Explosion** - 30 particles with physics in modal
4. **Scale Animations** - Button press feedback
5. **Fade Transitions** - Smooth entrance/exit
6. **Gift Rotation** - Playful rotation on claim

### User Experience

1. **Auto-check claim status** on mount
2. **Real-time countdown timer** updates every second
3. **Disabled states** when already claimed
4. **Success feedback** with animation and modal
5. **Error handling** with user-friendly messages
6. **Guest user prompts** to create account
7. **Streak danger warnings** when < 6 hours remain

### Analytics

Automatic tracking of:
- `daily_reward_shown` - When UI is displayed
- `daily_reward_claimed` - When reward is claimed
- `daily_reward_claim_failed` - When claim fails

---

## 🎨 Customization

### Modify Reward Schedule

Edit `/types/gamification.ts`:

```tsx
export const DAILY_REWARD_SCHEDULE: DailyRewardDefinition[] = [
  { day: 1, reward_type: 'scrap', reward_amount: 150 }, // Increased!
  { day: 2, reward_type: 'scrap', reward_amount: 300 }, // Increased!
  // ... more days
];
```

### Customize Colors

Edit `/constants/ui/theme.ts`:

```tsx
export const THEME = {
  colors: {
    success: '#00FF00',  // Change claim button color
    scrap: '#FFD700',    // Change reward color
    // ... more colors
  },
};
```

### Adjust Animations

In component files, modify animation durations:

```tsx
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 500, // Change this
  useNativeDriver: true,
});
```

---

## 📁 File Structure

```
components/rewards/
├── DailyRewardCard.tsx       # Compact card component
├── RewardClaimModal.tsx      # Success modal
├── RewardsExample.tsx        # Usage example
├── INTEGRATION_GUIDE.md      # Detailed integration guide
├── README.md                 # This file
└── index.ts                  # Clean exports

app/
└── rewards.tsx               # Full-screen rewards page
```

---

## ✅ Testing Checklist

- [ ] Guest users see login prompt
- [ ] Authenticated users see reward card
- [ ] Claim button works and shows animation
- [ ] Success modal appears after claim
- [ ] Countdown timer updates correctly
- [ ] Streak increments properly
- [ ] Special rewards (day 3, 7) show bonus badge
- [ ] Streak danger warning appears < 6 hours
- [ ] Preview shows next 7 days correctly
- [ ] Navigation to full screen works
- [ ] Full screen shows stats correctly
- [ ] Reward schedule displays all 7 days
- [ ] Analytics events fire correctly

---

## 🐛 Troubleshooting

### Claim button not working?
- Check user is authenticated
- Verify network connection
- Check database permissions
- Review server logs

### Countdown timer not showing?
- Already claimed today
- Check `last_claim_date` value
- Verify timezone handling

### Animations choppy?
- Use `useNativeDriver: true`
- Reduce confetti particle count
- Test on physical device

### Reward not granted?
- Implement `grantScrapReward()` function
- Update campaign progress after claim
- Check user balance updates

---

## 🚀 Future Enhancements

Planned features:
- [ ] Push notifications for daily reminders
- [ ] Extended streaks (30-day, 100-day bonuses)
- [ ] Reward variety (gems, items, power-ups)
- [ ] Social features (compare with friends)
- [ ] Streak insurance (miss 1 day per month)
- [ ] Calendar view of past claims
- [ ] Weekend reward multipliers

---

## 📄 License

Part of Zombie Fleet Bastion project.

---

## 🤝 Contributing

When adding new features:
1. Follow existing code patterns
2. Use centralized THEME
3. Add TypeScript types
4. Include animations
5. Track analytics events
6. Update documentation

---

**Built with ❤️ for Zombie Fleet**

Encourage daily logins, reward loyal players, and build streaks! 🔥🎁
