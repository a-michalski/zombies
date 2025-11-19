# Zombie Fleet - Production Deployment Guide

**Version:** 2.0 MVP
**Last Updated:** November 19, 2025
**Audience:** DevOps, Backend Developers, System Administrators

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Supabase Setup](#supabase-setup)
4. [Database Migration](#database-migration)
5. [Environment Variables](#environment-variables)
6. [Edge Functions Deployment](#edge-functions-deployment)
7. [Mobile App Deployment](#mobile-app-deployment)
8. [Web Deployment](#web-deployment)
9. [Monitoring & Logging](#monitoring--logging)
10. [Backup & Recovery](#backup--recovery)
11. [Security Configuration](#security-configuration)
12. [Performance Optimization](#performance-optimization)
13. [Rollback Procedures](#rollback-procedures)
14. [Troubleshooting](#troubleshooting)

---

## Overview

Zombie Fleet uses a modern serverless architecture:

**Backend:** Supabase (PostgreSQL + Auth + Realtime + Edge Functions)
**Frontend:** React Native (Expo) for mobile
**Web:** React Native Web
**Hosting:**
- Mobile: App Store / Google Play
- Web: Vercel / Netlify / EAS Hosting

**Deployment Stages:**
1. Development → Local Supabase / Expo Dev
2. Staging → Staging Supabase / TestFlight / Internal Testing
3. Production → Production Supabase / App Store / Play Store

---

## Pre-Deployment Checklist

### Before Production Deployment

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Database schema finalized
- [ ] Environment variables documented
- [ ] Backup strategy defined
- [ ] Monitoring configured
- [ ] Rollback plan prepared
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] App store assets ready (screenshots, descriptions)

### Compliance

- [ ] GDPR compliance verified (if serving EU users)
- [ ] COPPA compliance (if allowing users < 13)
- [ ] App Store guidelines reviewed
- [ ] Google Play policies reviewed
- [ ] Privacy policy accessible in-app
- [ ] Terms of service accessible in-app

---

## Supabase Setup

### 1. Create Production Project

**Option A: New Project**

1. Go to https://app.supabase.com/
2. Click "New Project"
3. Configure:
   - **Name:** `zombie-fleet-prod`
   - **Database Password:** Strong password (save to password manager!)
   - **Region:** Choose closest to target users
     - US users: `us-east-1` or `us-west-1`
     - EU users: `eu-central-1` or `eu-west-1`
     - Asia users: `ap-southeast-1`
   - **Pricing Plan:** Pro (recommended for production)
     - Includes: Daily backups, Point-in-Time Recovery, better performance

4. Click "Create new project"
5. Wait for provisioning (~2 minutes)

**Option B: Upgrade Existing Project**

If you have a staging project:
1. Don't reuse it for production
2. Create separate production project
3. Keep staging for testing

### 2. Get API Credentials

1. Go to **Settings** → **API**
2. Copy and save securely:

```
Project URL: https://[project-id].supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (KEEP SECRET!)
```

**Security Notes:**
- `anon` key: Safe to expose in client apps
- `service_role` key: **NEVER** expose publicly (admin access)
- Store in password manager or secret management system

### 3. Configure Authentication

**Email/Password Settings:**

1. Go to **Authentication** → **Settings**
2. Configure **Email Auth:**
   - ✅ Enable email confirmations (recommended)
   - Set confirmation email expiry: 24 hours
   - Enable secure email change flow

3. Configure **Password Requirements:**
   - Minimum length: 8 characters
   - Require lowercase: Yes
   - Require uppercase: Yes
   - Require numbers: Yes
   - Require special characters: No (optional)

4. **Session Settings:**
   - JWT expiry: 3600 seconds (1 hour)
   - Refresh token rotation: Enabled
   - Refresh token expiry: 604800 seconds (7 days)

**Custom SMTP (Recommended for Production):**

1. Go to **Authentication** → **Email** → **SMTP Settings**
2. Configure your email service:

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [SendGrid API key]
Sender Email: noreply@zombiefleet.com
Sender Name: Zombie Fleet
```

**Recommended Email Services:**
- SendGrid (99% delivery, free tier: 100 emails/day)
- AWS SES (cheap, high volume)
- Mailgun (developer-friendly)
- Postmark (transactional emails)

**Email Templates:**

Customize email templates:
1. Go to **Authentication** → **Email Templates**
2. Edit templates:
   - Confirmation email
   - Password reset
   - Magic link (if enabled)

### 4. Configure Security

**Rate Limiting:**

1. Go to **Settings** → **API**
2. Review default rate limits:
   - Anonymous requests: 60/minute
   - Authenticated requests: 200/minute

**Custom rate limits (Pro plan):**
```sql
-- In SQL Editor
ALTER DATABASE postgres SET rate_limit.anon_requests_per_second = '1';
ALTER DATABASE postgres SET rate_limit.authenticated_requests_per_second = '10';
```

**CORS Configuration:**

1. Go to **Settings** → **API**
2. Set allowed origins:

```
Production Web URL: https://zombiefleet.com
Development: http://localhost:8081
```

---

## Database Migration

### 1. Run Initial Schema

1. Go to **SQL Editor**
2. Create new query
3. Copy entire contents of `/supabase/schema.sql`
4. Run query

**Verify Success:**
```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should return:
-- achievements
-- achievement_progress
-- campaign_progress
-- daily_rewards
-- friends
-- leaderboards
-- player_stats
-- profiles
-- reserved_usernames
-- suspicious_scores
-- user_bans
-- username_history
```

### 2. Verify Row Level Security

```sql
-- Check RLS enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- All should have rowsecurity = true
```

### 3. Create Database Backups

**Automatic Backups (Pro Plan):**
- Daily backups enabled by default
- 7-day retention
- Point-in-Time Recovery available

**Manual Backup:**

1. Go to **Settings** → **Database** → **Backups**
2. Click "Create backup now"
3. Wait for completion
4. Download backup file (.sql)

**Automated Backup Script:**

```bash
#!/bin/bash
# backup-supabase.sh

PROJECT_ID="your-project-id"
SERVICE_ROLE_KEY="your-service-role-key"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database schema
pg_dump "postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres" \
  --schema-only > "$BACKUP_DIR/schema_$DATE.sql"

# Backup data
pg_dump "postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres" \
  --data-only > "$BACKUP_DIR/data_$DATE.sql"

echo "Backup completed: $DATE"

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/schema_$DATE.sql" s3://zombiefleet-backups/
aws s3 cp "$BACKUP_DIR/data_$DATE.sql" s3://zombiefleet-backups/
```

**Schedule with cron:**
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-supabase.sh
```

### 4. Database Migrations

**Future Schema Changes:**

Create migration files in `/supabase/migrations/`:

```sql
-- /supabase/migrations/001_add_user_badges.sql
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_badge UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);
```

**Apply Migration:**

1. Test on staging first
2. Create backup before applying
3. Run migration in SQL Editor
4. Verify with test queries
5. Monitor for errors

---

## Environment Variables

### Production Environment Variables

Create `.env.production`:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://[prod-project-id].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[prod-anon-key]

# App Configuration
EXPO_PUBLIC_CLIENT_VERSION=2.0.0
EXPO_PUBLIC_ENVIRONMENT=production

# Anti-Cheat Configuration
EXPO_PUBLIC_MAX_SCORE_SUBMISSIONS_PER_MINUTE=10

# Analytics (Optional)
EXPO_PUBLIC_ANALYTICS_ENABLED=true
EXPO_PUBLIC_SENTRY_DSN=[sentry-dsn]

# Feature Flags
EXPO_PUBLIC_ENABLE_LEADERBOARDS=true
EXPO_PUBLIC_ENABLE_ACHIEVEMENTS=true
EXPO_PUBLIC_ENABLE_DAILY_REWARDS=true
```

### Staging Environment

Create `.env.staging`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://[staging-project-id].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
EXPO_PUBLIC_CLIENT_VERSION=2.0.0-staging
EXPO_PUBLIC_ENVIRONMENT=staging
```

### Development Environment

Use `.env.development`:

```bash
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=[local-anon-key]
EXPO_PUBLIC_CLIENT_VERSION=2.0.0-dev
EXPO_PUBLIC_ENVIRONMENT=development
```

### Secret Management

**For CI/CD:**

Use environment-specific secrets:

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
env:
  EXPO_PUBLIC_SUPABASE_URL: ${{ secrets.PROD_SUPABASE_URL }}
  EXPO_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PROD_SUPABASE_ANON_KEY }}
```

**EAS Build:**
```json
// eas.json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "$PROD_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "$PROD_SUPABASE_ANON_KEY"
      }
    }
  }
}
```

Set secrets:
```bash
eas secret:create --scope project --name PROD_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name PROD_SUPABASE_ANON_KEY --value "eyJ..."
```

---

## Edge Functions Deployment

**Future Anti-Cheat Enhancement:**

Deploy score validation to Supabase Edge Functions for server-side security.

### 1. Create Edge Function

```typescript
// supabase/functions/validate-score/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { userId, submission } = await req.json();

    // Server-side validation (cannot be tampered by client)
    const validation = await validateScore(userId, submission);

    if (!validation.valid) {
      // Flag suspicious score
      await flagSuspicious(userId, submission, validation.reasons);
    }

    return new Response(JSON.stringify(validation), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

### 2. Deploy Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref [project-id]

# Deploy function
supabase functions deploy validate-score

# Test function
curl -X POST https://[project-id].supabase.co/functions/v1/validate-score \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{"userId": "...", "submission": {...}}'
```

### 3. Update Client Code

```typescript
// lib/leaderboard.ts
async function submitScore(userId: string, submission: ScoreSubmission) {
  // Call Edge Function instead of client-side validation
  const { data, error } = await supabase.functions.invoke('validate-score', {
    body: { userId, submission }
  });

  if (data.valid) {
    // Submit to leaderboard
  } else {
    // Reject
  }
}
```

---

## Mobile App Deployment

### iOS App Store

**Prerequisites:**
- Apple Developer Account ($99/year)
- Mac for building (or use EAS Build cloud service)

**1. Configure app.json:**

```json
{
  "expo": {
    "name": "Zombie Fleet",
    "slug": "zombie-fleet",
    "version": "2.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.zombiefleet",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Used for profile pictures",
        "NSPhotoLibraryUsageDescription": "Used for profile pictures"
      }
    }
  }
}
```

**2. Build with EAS:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Wait for build (~10-20 minutes)
```

**3. Submit to App Store:**

```bash
# Submit
eas submit --platform ios

# Or manually:
# 1. Download .ipa from EAS
# 2. Upload via Transporter app
# 3. Configure in App Store Connect
```

**4. App Store Connect Configuration:**

1. Go to https://appstoreconnect.apple.com/
2. Create new app
3. Configure:
   - App name: "Zombie Fleet"
   - Subtitle: "Tower Defense Strategy"
   - Category: Games > Strategy
   - Age rating: 12+ (violence)
   - Screenshots (required sizes)
   - Description
   - Keywords
   - Privacy policy URL
   - Support URL

4. Submit for review
5. Wait 1-3 days for approval

### Android Play Store

**Prerequisites:**
- Google Play Developer Account ($25 one-time)

**1. Configure app.json:**

```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.zombiefleet",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0a0a0a"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    }
  }
}
```

**2. Build with EAS:**

```bash
eas build --platform android --profile production
```

**3. Submit to Play Store:**

```bash
eas submit --platform android
```

**4. Play Console Configuration:**

1. Go to https://play.google.com/console/
2. Create new app
3. Configure:
   - App name
   - Category: Strategy
   - Content rating questionnaire
   - Target audience (age groups)
   - Privacy policy
   - Data safety section (what data you collect)
   - Screenshots
   - Feature graphic
   - App icon

4. Create internal/alpha/beta track for testing
5. Promote to production when ready

---

## Web Deployment

### Option 1: Vercel

**1. Install Vercel CLI:**

```bash
npm install -g vercel
```

**2. Deploy:**

```bash
# Build for web
npx expo export:web

# Deploy to Vercel
vercel --prod
```

**3. Configure Environment Variables:**

In Vercel dashboard:
- Add `EXPO_PUBLIC_SUPABASE_URL`
- Add `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Option 2: Netlify

**1. Build:**

```bash
npx expo export:web
```

**2. Deploy:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=web-build
```

### Option 3: EAS Hosting

```bash
# Configure
eas hosting:configure

# Deploy
eas hosting:deploy
```

---

## Monitoring & Logging

### Supabase Monitoring

**1. Database Performance:**

Go to **Database** → **Performance**

Monitor:
- Query performance
- Slow queries (> 1s)
- Connection pool usage
- Disk space usage

**2. API Logs:**

Go to **Settings** → **API** → **Logs**

Monitor:
- Request rate
- Error rate
- Response times
- Failed authentications

**3. Real-time Monitoring:**

Go to **Database** → **Realtime**

Monitor:
- Active connections
- Message rate
- Subscription count

### Application Monitoring (Sentry)

**1. Install Sentry:**

```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative
```

**2. Configure:**

```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

**3. Monitor in Sentry Dashboard:**

- Error tracking
- Performance monitoring
- User sessions
- Release tracking

### Analytics

**Optional: Implement analytics:**

```typescript
// lib/analytics.ts
import { Analytics } from '@segment/analytics-react-native';

export const analytics = new Analytics({
  writeKey: process.env.EXPO_PUBLIC_SEGMENT_KEY!,
});

// Track events
analytics.track('level_completed', {
  level_id: 'city_hall',
  score: 15000,
  stars: 3
});
```

---

## Backup & Recovery

### Automated Backups

**Supabase Pro:**
- Daily backups (automatic)
- 7-day retention
- Point-in-Time Recovery (PITR)

**Manual Backups:**

```bash
# Backup entire database
pg_dump "postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres" \
  > backup_$(date +%Y%m%d).sql

# Backup specific table
pg_dump "postgresql://..." --table=profiles > profiles_backup.sql
```

### Recovery Procedures

**Restore from Backup:**

```bash
# Restore full database
psql "postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres" \
  < backup_20251119.sql

# Restore specific table
psql "postgresql://..." < profiles_backup.sql
```

**Point-in-Time Recovery (Pro Plan):**

1. Go to **Settings** → **Database** → **Backups**
2. Click "Point-in-Time Recovery"
3. Select timestamp
4. Click "Restore"
5. Wait for restoration

---

## Security Configuration

### 1. Row Level Security Audit

```sql
-- Verify all policies
SELECT schemaname, tablename, policyname, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### 2. Reserved Usernames

```sql
-- Add more reserved names
INSERT INTO public.reserved_usernames (username, reason) VALUES
  ('admin', 'System reserved'),
  ('moderator', 'System reserved'),
  ('support', 'System reserved'),
  ('zombiefleet', 'Brand protection'),
  ('official', 'Brand protection');
```

### 3. Rate Limiting

Implement rate limiting for sensitive operations:

```sql
-- Example: Limit password reset requests
CREATE TABLE IF NOT EXISTS rate_limit_password_reset (
  ip_address INET PRIMARY KEY,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Security Headers (Web)

Configure in `vercel.json` or `netlify.toml`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

---

## Performance Optimization

### Database Optimization

**1. Index Analysis:**

```sql
-- Find missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

**2. Query Performance:**

```sql
-- Analyze slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 1000
ORDER BY mean_exec_time DESC
LIMIT 20;
```

**3. Optimize Leaderboard Queries:**

```sql
-- Create materialized view for global leaderboard (refresh hourly)
CREATE MATERIALIZED VIEW global_leaderboard_cache AS
SELECT * FROM global_leaderboard;

CREATE INDEX ON global_leaderboard_cache(total_score DESC);

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY global_leaderboard_cache;
```

### Client Optimization

**1. Lazy Loading:**

```typescript
// Lazy load screens
const Leaderboard = lazy(() => import('./app/leaderboard'));
```

**2. Image Optimization:**

```bash
# Optimize assets
npm run optimize-images
```

**3. Bundle Size:**

```bash
# Analyze bundle
npx expo export --analyze

# Tree shaking unused code
```

---

## Rollback Procedures

### Database Rollback

**1. Restore from Backup:**

```bash
# Restore yesterday's backup
psql "postgresql://..." < backup_20251118.sql
```

**2. Revert Migration:**

```sql
-- Create rollback migration
-- /supabase/migrations/001_rollback_user_badges.sql
DROP TABLE IF EXISTS public.user_badges;
```

### App Rollback

**iOS:**
- Cannot rollback once live
- Submit new version with fixes
- Use staged rollout to limit impact

**Android:**
- Can rollback to previous version in Play Console
- Go to Release → Production → Revert

**Web:**
- Revert deployment in Vercel/Netlify
- Redeploy previous version

---

## Troubleshooting

### Database Issues

**High CPU Usage:**
```sql
-- Find expensive queries
SELECT pid, query, state, query_start
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY query_start;

-- Kill long-running query
SELECT pg_terminate_backend(pid);
```

**Connection Pool Exhausted:**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Increase pool size (Supabase dashboard)
```

### Authentication Issues

**Email Not Sending:**
1. Check SMTP configuration
2. Verify sender email domain
3. Check spam folder
4. Review Supabase email logs

**Session Expired:**
1. Check JWT expiry settings
2. Verify refresh token rotation enabled
3. Review AsyncStorage persistence

---

## Conclusion

This deployment guide covers all aspects of deploying Zombie Fleet to production:

- ✅ Supabase configuration
- ✅ Database migration
- ✅ Environment variables
- ✅ Mobile app deployment
- ✅ Web deployment
- ✅ Monitoring setup
- ✅ Backup procedures
- ✅ Security hardening
- ✅ Performance optimization
- ✅ Rollback procedures

For additional support:
- Supabase Discord: https://discord.supabase.com/
- Expo Forums: https://forums.expo.dev/
- Documentation: See other docs in `/docs/` directory
