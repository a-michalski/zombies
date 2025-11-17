# Jak uruchomić aplikację na natywnym urządzeniu (iOS/Android)

## Opcja 1: Expo Go (najszybsza - bez budowania)

### Na telefonie:
1. Zainstaluj **Expo Go** z App Store (iOS) lub Google Play (Android)
2. Uruchom serwer deweloperski:
   ```bash
   bun run start
   ```
3. Zeskanuj kod QR, który pojawi się w terminalu, używając:
   - **iOS**: Aplikacja Kamera
   - **Android**: Aplikacja Expo Go

### Alternatywnie - przez tunnel:
```bash
bun run start
```
To uruchomi serwer z tunnel (już masz `--tunnel` w skrypcie), więc możesz połączyć się z dowolnego miejsca.

---

## Opcja 2: Emulator iOS (tylko macOS)

### Wymagania:
- Xcode zainstalowany
- iOS Simulator dostępny

### Uruchomienie:
```bash
# Uruchom serwer
bun run start

# W innym terminalu, uruchom iOS simulator:
bun run start --ios
# lub
npx expo start --ios
```

---

## Opcja 3: Emulator Android

### Wymagania:
- Android Studio zainstalowany
- Android Emulator skonfigurowany i uruchomiony

### Uruchomienie:
```bash
# Najpierw uruchom Android Emulator z Android Studio

# Potem uruchom aplikację:
bun run start --android
# lub
npx expo start --android
```

---

## Opcja 4: Development Build (dla zaawansowanych)

Jeśli potrzebujesz natywnych modułów, które nie działają w Expo Go:

### iOS:
```bash
npx expo run:ios
```

### Android:
```bash
npx expo run:android
```

---

## Sprawdzanie czy działa:

Po uruchomieniu aplikacji na natywnym urządzeniu:
1. Otwórz ekran gry
2. Sprawdź czy tekstury ścieżki są widoczne
3. Sprawdź czy style `left` i `top` są poprawnie aplikowane

---

## Troubleshooting:

### Problem: "Cannot connect to Metro"
- Upewnij się, że telefon i komputer są w tej samej sieci WiFi
- Lub użyj `--tunnel` (już masz w skrypcie)

### Problem: "Expo Go not found"
- Zainstaluj Expo Go z App Store/Google Play
- Lub użyj emulatora

### Problem: "Build failed"
- Sprawdź czy masz zainstalowane Xcode (iOS) lub Android Studio (Android)
- Uruchom `npx expo-doctor` żeby sprawdzić konfigurację



