# 🚀 Supabase Setup Guide

Complete guide to setting up Supabase backend for Zombie Fleet.

---

## 📋 Prerequisites

- Supabase account (free tier): https://supabase.com/
- Basic understanding of PostgreSQL

---

## 🛠️ Step 1: Create Supabase Project

1. Go to https://app.supabase.com/
2. Click **"New Project"**
3. Fill in:
   - **Name**: `zombie-fleet` (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `eu-central-1` for Europe)
   - **Pricing Plan**: Free (or Pro if needed)
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

---

## 🗄️ Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `/supabase/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. Verify success - you should see:
   - ✅ Tables created
   - ✅ Indexes created
   - ✅ RLS policies enabled
   - ✅ Functions created

**Troubleshooting:**
- If you get "relation already exists" errors, it's safe to ignore (schema is idempotent)
- If you get permission errors, ensure you're logged in as project owner

---

## 🔐 Step 3: Get API Credentials

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Keep these safe - you'll need them next

---

## ⚙️ Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **IMPORTANT**: Never commit `.env` to git!
   - Already in `.gitignore`
   - Use `.env.example` for documentation only

---

## 🔒 Step 5: Verify Row Level Security (RLS)

RLS is **critical** for security. Verify it's enabled:

1. Go to **Authentication** → **Policies** (left sidebar)
2. You should see policies for:
   - ✅ `profiles` - Public read, own write
   - ✅ `campaign_progress` - Own read/write only
   - ✅ `leaderboards` - Public read, own write
   - ✅ `player_stats` - Public read, own write
   - ✅ `achievement_progress` - Own read/write only
   - ✅ `daily_rewards` - Own read/write only

If missing, re-run the schema SQL.

---

## 🧪 Step 6: Test Connection

1. Start your dev server:
   ```bash
   bun start
   ```

2. Check console logs for:
   ```
   [Analytics] Initialized
   ```

3. Try signing up (once UI is ready):
   - Should create user in `auth.users`
   - Should create profile in `profiles` table
   - Should auto-create `player_stats` and `daily_rewards`

---

## 📊 Step 7: Enable Realtime (Optional - for live leaderboards)

1. Go to **Database** → **Replication** (left sidebar)
2. Enable replication for:
   - ✅ `leaderboards` table
   - ✅ `profiles` table (for friend status updates)

3. Click **"Save"**

---

## 🎯 Step 8: Seed Test Data (Optional - Development)

For testing, you can manually insert data:

### Create Test User Profile
```sql
-- In SQL Editor
INSERT INTO public.profiles (id, nickname, nationality)
VALUES (
  gen_random_uuid(),
  'TestPlayer',
  'PL'
);
```

### Create Test Leaderboard Entry
```sql
INSERT INTO public.leaderboards (user_id, level_id, score, stars, completion_time, zombies_killed)
SELECT id, 'level-01', 5000, 3, 300, 50
FROM public.profiles
WHERE nickname = 'TestPlayer';
```

---

## 🔍 Monitoring & Debugging

### View Logs
- **Database** → **Logs** → Filter by table/query
- Look for RLS policy violations, slow queries, errors

### Check Auth Users
- **Authentication** → **Users**
- See all registered users, emails, last sign-in

### Query Data Directly
- **Table Editor** → Select table
- Browse, filter, edit data manually

### API Logs
- **Settings** → **API** → **Logs**
- See all API requests (helpful for debugging client calls)

---

## 🚨 Common Issues

### Issue: "Missing Supabase environment variables"
**Solution:** Ensure `.env` exists with correct `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Issue: "Row Level Security policy violation"
**Solution:**
- Check if user is authenticated (`auth.uid()` returns null if not)
- Verify RLS policies are correct (re-run schema.sql)
- Use Supabase dashboard to test queries manually

### Issue: "Failed to fetch"
**Solution:**
- Check internet connection
- Verify Supabase project is not paused (free tier pauses after 1 week inactivity)
- Check Supabase status page: https://status.supabase.com/

### Issue: "Unique constraint violation" (nickname)
**Solution:** Nickname already taken. Implement client-side uniqueness check (covered in Phase 2)

---

## 📈 Production Checklist

Before launching to production:

- [ ] Enable Email Confirmations (Auth → Settings → Email Auth → Confirm email)
- [ ] Set up custom SMTP for emails (Auth → Settings → SMTP)
- [ ] Enable MFA/2FA (optional but recommended)
- [ ] Review RLS policies one more time
- [ ] Set up database backups (automatic on paid plans)
- [ ] Enable Point-in-Time Recovery (PITR) for paid plans
- [ ] Set up monitoring/alerting (e.g., Sentry integration)
- [ ] Rate limiting for auth endpoints (built-in Supabase)
- [ ] Review API usage limits (free tier: 500MB DB, 50K MAU)

---

## 🔗 Useful Links

- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client Docs**: https://supabase.com/docs/reference/javascript
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security
- **Auth Helpers**: https://supabase.com/docs/guides/auth/auth-helpers
- **React Native Guide**: https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

---

## 🆘 Support

If you encounter issues:
1. Check Supabase Discord: https://discord.supabase.com/
2. Search GitHub Issues: https://github.com/supabase/supabase/issues
3. Check Stack Overflow: `[supabase]` tag

---

**Next Steps:** Proceed to `ITERATION 2` - Implementing AuthContext and Login UI
