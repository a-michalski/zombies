# Zombie Fleet - Tower Defense Game

**Version:** 2.0 MVP
**Platform:** iOS, Android, Web
**Framework:** React Native + Expo
**Backend:** Supabase

---

## 🎮 Overview

**Zombie Fleet** is a tower defense game featuring a comprehensive authentication and gamification system. Players defend against waves of zombies, compete on global leaderboards, unlock achievements, and claim daily rewards.

### Key Features

- 🔐 **Authentication System** - Email/password signup, guest mode, seamless account conversion
- ☁️ **Cloud Save** - Multi-device sync with conflict resolution
- 🏆 **Global Leaderboards** - Real-time rankings (global, regional, level-specific)
- 🎖️ **Achievements** - Track progress, unlock rewards
- 🎁 **Daily Rewards** - Login streaks with escalating rewards
- 🛡️ **Anti-Cheat System** - Server-side score validation
- 📊 **Player Statistics** - Track kills, playtime, best scores
- 🌐 **Cross-Platform** - Play on mobile or web, progress syncs everywhere

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+) - [Install via nvm](https://github.com/nvm-sh/nvm)
- **Bun** - [Install Bun](https://bun.sh/docs/installation)
- **Expo CLI** - Installed automatically with dependencies

### Installation

```bash
# Clone repository
git clone [your-repo-url]
cd zombies

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Configure .env with your Supabase credentials
# (See DEPLOYMENT.md for Supabase setup)

# Start development server
bun run start-web     # For web preview
bun run start         # For mobile (scan QR code with Expo Go)
```

### Run on Mobile

**iOS:**
1. Download [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
2. Run `bun run start`
3. Scan QR code with Camera app

**Android:**
1. Download [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
2. Run `bun run start`
3. Scan QR code with Expo Go app

---

## 📁 Project Structure

```
zombies/
├── app/                          # Expo Router screens
│   ├── index.tsx                 # Main menu
│   ├── login.tsx                 # Sign in/up screen
│   ├── convert-account.tsx       # Guest to account conversion
│   ├── levels.tsx                # Campaign map
│   ├── game.tsx                  # Gameplay screen
│   ├── leaderboard.tsx           # Leaderboards
│   ├── achievements.tsx          # Achievement list
│   ├── rewards.tsx               # Daily rewards
│   ├── stats.tsx                 # Player statistics
│   └── settings.tsx              # Settings screen
│
├── lib/                          # Services & business logic
│   ├── supabase.ts               # Supabase client configuration
│   ├── profile.ts                # Profile CRUD operations
│   ├── leaderboard.ts            # Leaderboard queries
│   ├── achievements.ts           # Achievement tracking
│   ├── dailyRewards.ts           # Daily reward system
│   ├── cloudSync.ts              # Cloud save synchronization
│   ├── antiCheat.ts              # Score validation
│   ├── validation.ts             # Input validation
│   └── analytics.ts              # Analytics tracking
│
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx           # Authentication state
│   ├── CampaignContext.tsx       # Campaign progress
│   └── GameContext.tsx           # Gameplay state
│
├── components/                   # React components
│   ├── auth/                     # Auth-related components
│   ├── game/                     # Game components
│   └── ui/                       # Shared UI components
│
├── utils/                        # Utility functions
│   ├── storage.ts                # Local storage helpers
│   ├── imageAssets.ts            # Asset management
│   └── pathfinding.ts            # Game pathfinding
│
├── types/                        # TypeScript type definitions
│   ├── auth.ts                   # Authentication types
│   ├── leaderboard.ts            # Leaderboard types
│   ├── gamification.ts           # Achievement/reward types
│   └── progression.ts            # Campaign types
│
├── supabase/                     # Supabase configuration
│   └── schema.sql                # Database schema
│
├── docs/                         # Documentation
│   ├── FEATURES.md               # Feature overview
│   ├── API_REFERENCE.md          # API documentation
│   ├── TESTING_GUIDE.md          # Testing guide
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── SUPABASE_SETUP.md         # Supabase setup
│
├── assets/                       # Static assets
│   └── images/                   # Game graphics
│
├── .env.example                  # Environment variables template
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- **React Native** (0.79.1) - Cross-platform mobile framework
- **Expo** (53.0.4) - Development platform
- **Expo Router** (5.0.3) - File-based routing
- **TypeScript** (5.8.3) - Type safety
- **NativeWind** (4.1.23) - Tailwind for React Native

**Backend:**
- **Supabase** - PostgreSQL + Auth + Realtime + Edge Functions
- **PostgreSQL** - Primary database
- **Row Level Security (RLS)** - Data protection

**State Management:**
- **Zustand** (5.0.2) - Global state
- **React Query** (5.83.0) - Server state
- **AsyncStorage** (2.1.2) - Local persistence

**Services:**
- **Authentication** - Email/password via Supabase Auth
- **Cloud Sync** - Bidirectional sync with conflict resolution
- **Leaderboards** - Real-time rankings with anti-cheat
- **Achievements** - Progress tracking with rewards
- **Daily Rewards** - Streak system with escalating rewards

### Database Schema

**Core Tables:**
- `profiles` - User profiles (nickname, nationality, avatar)
- `campaign_progress` - Cloud saves (JSONB)
- `leaderboards` - Score submissions per level
- `player_stats` - Aggregate statistics
- `achievements` - Achievement definitions
- `achievement_progress` - User progress
- `daily_rewards` - Streak tracking
- `suspicious_scores` - Anti-cheat logs
- `user_bans` - Ban management

**Views:**
- `global_leaderboard` - Aggregated rankings

**Functions:**
- `get_regional_leaderboard(country_code)` - Regional rankings

See `/supabase/schema.sql` for complete schema.

---

## 🎯 Features

### Authentication

**Sign Up:**
- Email/password registration
- Real-time nickname validation
- Nationality selection (flag picker)
- Password strength requirements
- Auto-initialization of player stats and daily rewards

**Sign In:**
- Email/password authentication
- Session persistence (7 days)
- Cloud sync on login
- Auto-login if session valid

**Guest Mode:**
- Play without account
- Local save only
- Seamless conversion to account
- Progress preserved on conversion

### Gamification

**Leaderboards:**
- Global rankings (all levels combined)
- Level-specific leaderboards
- Regional rankings (by country)
- Real-time updates via WebSockets
- User rank and percentile display

**Achievements:**
- Combat achievements (kill counts)
- Progression achievements (level completions)
- Special achievements (perfect runs, speed runs)
- Progress tracking with notifications
- Scrap and cosmetic rewards

**Daily Rewards:**
- 7-day reward cycle
- Login streak tracking
- Escalating rewards (100-500+ scrap)
- Streak expiration (24h grace period)
- Visual calendar showing progress

**Player Statistics:**
- Total games played
- Total zombies killed
- Total stars earned
- Best wave reached
- Total playtime

### Cloud Sync

**Bidirectional Sync:**
- Local-first architecture (instant saves)
- Background cloud uploads
- Automatic conflict resolution
- Multi-device support

**Conflict Resolution:**
- Last-Write-Wins for different timestamps
- Merge strategy for simultaneous edits
- Takes best of all progress values
- Preserves all completed levels

### Anti-Cheat

**Score Validation:**
- Rate limiting (10 submissions/minute)
- Score range validation (theoretical max)
- Time validation (min/max completion time)
- Zombie count validation
- Gameplay hash verification (SHA-256)
- Consistency checks (stars vs score, etc.)

**Ban System:**
- Automatic flagging of suspicious scores
- Manual review system
- Temporary and permanent bans
- Ban enforcement before submission

---

## 📚 Documentation

Comprehensive documentation available in `/docs/`:

- **[FEATURES.md](./docs/FEATURES.md)** - Complete feature overview with user flows
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** - Full API documentation with examples
- **[TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)** - Testing procedures and scenarios
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Supabase configuration

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# Test coverage
npm run test:coverage

# E2E tests (coming soon)
npm run test:e2e
```

### Manual Testing

See [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) for:
- Authentication flow testing
- Cloud sync testing
- Leaderboard testing
- Achievement testing
- Daily rewards testing
- Multi-device testing

---

## 🚢 Deployment

### Prerequisites

- Supabase project (production)
- Apple Developer Account (iOS)
- Google Play Developer Account (Android)
- Hosting platform (Vercel/Netlify for web)

### Deploy to Production

**1. Backend Setup:**
```bash
# See DEPLOYMENT.md for detailed instructions
# 1. Create Supabase production project
# 2. Run database schema
# 3. Configure authentication
# 4. Set up environment variables
```

**2. Mobile App:**
```bash
# iOS
eas build --platform ios --profile production
eas submit --platform ios

# Android
eas build --platform android --profile production
eas submit --platform android
```

**3. Web App:**
```bash
# Build for web
npx expo export:web

# Deploy to Vercel
vercel --prod
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for complete deployment guide.

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
EXPO_PUBLIC_CLIENT_VERSION=2.0.0
EXPO_PUBLIC_ENVIRONMENT=production

# Anti-Cheat
EXPO_PUBLIC_MAX_SCORE_SUBMISSIONS_PER_MINUTE=10
```

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Run tests: `npm test`
4. Commit: `git commit -m "feat: your feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

### Code Style

- TypeScript for all code
- ESLint for linting: `npm run lint`
- Follow existing code patterns
- Document complex logic

---

## 📊 Performance

### Metrics

- **Local Save:** < 50ms
- **Cloud Upload:** < 2s
- **Cloud Download:** < 1s
- **Leaderboard Fetch:** < 100ms
- **Score Submission:** < 500ms
- **Profile Fetch:** < 50ms

### Optimization

- Local-first architecture (instant saves)
- Background sync (non-blocking)
- Optimistic UI updates
- Indexed database queries
- Cached leaderboard data

---

## 🔒 Security

### Data Protection

- **Row Level Security (RLS)** on all tables
- **JWT authentication** with refresh tokens
- **Password hashing** (bcrypt via Supabase)
- **Reserved usernames** protection
- **Rate limiting** on all endpoints

### Privacy

- GDPR compliant (right to be forgotten)
- Privacy policy in-app
- Data deletion support
- User consent for data collection

---

## 🐛 Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Ensure `.env` exists with correct values
- Restart dev server after changing `.env`

**"Row Level Security policy violation"**
- Check if user is authenticated
- Verify RLS policies in Supabase dashboard
- Re-run database schema

**"Cloud sync not working"**
- Check internet connection
- Verify Supabase project is active (not paused)
- Check RLS policies
- Try manual sync from settings

See [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) for more troubleshooting.

---

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| iOS | ✅ Supported | iOS 13+ |
| Android | ✅ Supported | Android 5.0+ |
| Web | ✅ Supported | Modern browsers |
| Desktop | 🚧 Planned | Electron wrapper |

---

## 🗺️ Roadmap

### Phase 1 (Complete) ✅
- ✅ Authentication system
- ✅ Cloud save
- ✅ Leaderboards
- ✅ Achievements
- ✅ Daily rewards
- ✅ Anti-cheat

### Phase 2 (Planned)
- 🔲 Friends system
- 🔲 Friend leaderboards
- 🔲 Direct challenges
- 🔲 In-game chat
- 🔲 Friend requests/blocking

### Phase 3 (Future)
- 🔲 Seasons & Battle Pass
- 🔲 Clans/Guilds
- 🔲 Clan wars
- 🔲 Weekly tournaments
- 🔲 Special events

### Phase 4 (Monetization)
- 🔲 In-app purchases
- 🔲 Premium subscription
- 🔲 Cosmetic shop
- 🔲 Battle Pass system

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 📞 Support

**Documentation:**
- [Features Guide](./docs/FEATURES.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

**External Resources:**
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)

**Community:**
- [Expo Forums](https://forums.expo.dev/)
- [Supabase Discord](https://discord.supabase.com/)
- [React Native Community](https://reactnative.dev/community/overview)

---

## 🎉 Credits

**Built with:**
- [React Native](https://reactnative.dev/) by Meta
- [Expo](https://expo.dev/) by Expo Team
- [Supabase](https://supabase.com/) by Supabase Team
- [TypeScript](https://www.typescriptlang.org/) by Microsoft

**Game Design:**
- Tower defense mechanics
- Progressive difficulty
- Engaging gamification

**Development:**
- Modern tooling and best practices
- Type-safe architecture
- Comprehensive testing
- Production-ready deployment

---

**Made with ❤️ for tower defense fans**
