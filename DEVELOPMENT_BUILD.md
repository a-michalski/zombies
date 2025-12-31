# Development Build Setup

This project requires a **custom development build** and **does not support Expo Go**.

## Why Development Build?

This app uses native modules that are not included in Expo Go:
- **react-native-reanimated** (v3.16.x) - High-performance animations
- **react-native-gesture-handler** (v2.28.x) - Advanced gesture handling
- **Expo Router** with native Stack navigation

## Prerequisites

- Node.js 18+ and Bun installed
- iOS: Xcode 15+ and iOS Simulator or physical device
- Android: Android Studio and Android Emulator or physical device
- EAS CLI: `npm install -g eas-cli`

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Create Development Build

#### Option A: Local Build (iOS Simulator)

```bash
# Generate native projects
npx expo prebuild

# Run on iOS Simulator
bun run ios
```

#### Option B: EAS Build (Cloud)

```bash
# Configure EAS (first time only)
eas build:configure

# Build for iOS Simulator
eas build --profile development --platform ios

# Build for Android Emulator/Device
eas build --profile development --platform android

# Install the build on your device and start dev server
bun run start
```

### 3. Start Development Server

```bash
# Start with local network
bun run start

# Start with tunnel (accessible from anywhere)
bun run start:tunnel

# Web only (no native modules)
bun run start:web
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run start` | Start dev server for development build |
| `bun run start:tunnel` | Start with ngrok tunnel |
| `bun run start:web` | Web-only mode (native features disabled) |
| `bun run ios` | Run on iOS Simulator (requires prebuild) |
| `bun run android` | Run on Android Emulator (requires prebuild) |
| `bun run prebuild` | Generate native iOS/Android projects |

## Important Notes

### ⚠️ Expo Go Not Supported

**Do NOT use `expo start --go` or Expo Go app**. This project requires native modules not available in Expo Go.

### Native Module Configuration

- **Babel**: Configured in `babel.config.js` with `react-native-reanimated/plugin`
- **Gesture Handler**: Wrapped in `GestureHandlerRootView` in `app/_layout.tsx`
- **Stack Navigation**: Uses Expo Router's native `Stack` on mobile

### Web Development

Web platform uses fallbacks for native modules:
- Reanimated animations work via web compatibility layer
- Stack navigation uses `Slot` on web
- Some native features may be limited

## Troubleshooting

### "No development build found" Error

You need to create a development build first:
```bash
npx expo prebuild && bun run ios
```

### Metro Bundler Issues

Clear cache and restart:
```bash
rm -rf node_modules/.cache
bun run start --clear
```

### iOS Simulator Not Opening

Ensure Xcode Command Line Tools are installed:
```bash
xcode-select --install
```

### Reanimated Crashes

Ensure `react-native-reanimated/plugin` is the **last** plugin in `babel.config.js`:
```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin', // Must be last!
  ],
};
```

## Learn More

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)

## Production Builds

For App Store/Play Store releases:

```bash
# iOS
eas build --profile production --platform ios
eas submit --platform ios

# Android
eas build --profile production --platform android
eas submit --platform android
```
