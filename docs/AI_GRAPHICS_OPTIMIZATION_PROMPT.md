# AI Prompt: Optymalizacja Systemu Graficznego - Zombie Fleet Bastion

## Kontekst

Jesteś ekspertem od optymalizacji assetów graficznych w projektach React Native/Expo. Pracujesz nad projektem tower defense game "Zombie Fleet Bastion" i musisz zoptymalizować system graficzny zgodnie z profesjonalną oceną.

## Twoje Zadanie

Zoptymalizuj system graficzny zgodnie z rekomendacjami z `docs/GRAPHICS_SYSTEM_REVIEW.md`. Działaj wieloagentowo - rozbij zadanie na mniejsze, równoległe podzadania.

## Struktura Projektu

- Framework: React Native z Expo Router
- Język: TypeScript
- Asset management: `utils/imageAssets.ts`
- Dokumentacja: `docs/GRAPHICS_SYSTEM_REVIEW.md` (przeczytaj najpierw!)

## Faza 1: Cleanup (Priorytet 1 - Krytyczne) 🔴

### Zadanie 1.1: Usuń nieużywane pliki extra-*.png
**Pliki do usunięcia:**
- `assets/images/extra-1.png` (1.3MB)
- `assets/images/extra-2.png` (1.8MB)
- `assets/images/extra-3.png` (1.4MB)
- `assets/images/extra-4.png` (2.1MB)
- `assets/images/extra-5.png` (1.3MB)

**Wymagania:**
- Sprawdź czy pliki nie są używane w kodzie (grep po całym repo)
- Jeśli nieużywane - usuń
- Jeśli używane - zgłoś błąd i nie usuwaj
- Oszczędność: ~8MB

### Zadanie 1.2: Usuń nieużywane pliki UI
**Pliki do sprawdzenia/usunięcia:**
- `assets/images/ui/panel-bg-2.png` (67KB)
- `assets/images/ui/panel-bg-3.png` (174KB)

**Wymagania:**
- Sprawdź czy są używane w `utils/imageAssets.ts` lub innych plikach
- Jeśli nieużywane - usuń
- Jeśli używane w `resize-ui-images.js` ale nie w kodzie - usuń i zaktualizuj skrypt

### Zadanie 1.3: Przenieś pliki źródłowe
**Akcje:**
1. Utwórz folder `assets/images/_sources/` jeśli nie istnieje
2. Przenieś `assets/images/map/ground-tile-source.png` (2.2MB) do `_sources/`
3. Sprawdź czy są inne pliki z sufiksem `-source` i przenieś je też
4. Zaktualizuj skrypty które mogą używać tych plików (sprawdź `scripts/resize-images.js`)

**Wymagania:**
- Nie usuwaj plików źródłowych - tylko przenieś
- Zaktualizuj ścieżki w skryptach jeśli potrzeba
- Dodaj komentarz w dokumentacji o lokalizacji plików źródłowych

### Zadanie 1.4: Zoptymalizuj main-menu-background.png
**Plik:** `assets/images/ui/main-menu-background.png` (2.4MB)

**Wymagania:**
1. Sprawdź aktualny rozmiar i format
2. Zoptymalizuj używając jednej z metod:
   - Konwersja do JPEG z jakością 85% (jeśli nie potrzebna przezroczystość)
   - Konwersja do WebP z jakością 85% (jeśli React Native wspiera)
   - Kompresja PNG z pngquant (jeśli potrzebna przezroczystość)
3. Cel: zmniejszyć rozmiar o minimum 50-70%
4. Zaktualizuj `utils/imageAssets.ts` jeśli zmienisz format
5. Przetestuj czy obraz się poprawnie wyświetla

### Zadanie 1.5: Pusty folder icons/
**Akcje:**
- Sprawdź `assets/images/icons/` - czy jest pusty
- Jeśli pusty:
  - Opcja A: Usuń folder
  - Opcja B: Dodaj `.gitkeep` + dokumentację w `docs/WHERE_TO_PUT_IMAGES.md` co ma tam być

## Faza 2: Optymalizacja (Priorytet 2 - Ważne) 🟡

### Zadanie 2.1: Dodaj optymalizację PNG
**Wymagania:**
1. Utwórz skrypt `scripts/optimize-png-images.js`
2. Skrypt powinien:
   - Znaleźć wszystkie PNG w `assets/images/`
   - Zoptymalizować używając pngquant (jeśli dostępne) lub optipng
   - Zachować przezroczystość
   - Pokazać raport oszczędności
3. Dodaj do `package.json`:
   ```json
   "scripts": {
     "optimize-images": "node scripts/optimize-png-images.js"
   }
   ```
4. Uruchom skrypt i zoptymalizuj wszystkie PNG
5. Sprawdź czy obrazy nadal działają poprawnie

**Uwaga:** Jeśli pngquant/optipng nie są dostępne, użyj alternatywnych metod (sharp, imagemin)

### Zadanie 2.2: Utwórz skrypt walidacji assetów
**Wymagania:**
1. Utwórz `scripts/validate-assets.js`
2. Skrypt powinien sprawdzać:
   - Czy wszystkie wymagane pliki z `utils/imageAssets.ts` istnieją
   - Czy rozmiary plików są w akceptowalnych zakresach:
     - Towers: < 50KB każdy
     - Enemies: < 20KB każdy
     - Projectiles: < 5KB
     - UI: < 500KB (oprócz background)
     - Map background: < 1MB
   - Czy nie ma nieużywanych plików w `assets/images/` (poza `_sources/`)
3. Wygeneruj raport z problemami
4. Dodaj do `package.json`:
   ```json
   "scripts": {
     "validate-assets": "node scripts/validate-assets.js"
   }
   ```

### Zadanie 2.3: Dokumentacja rozmiarów plików
**Wymagania:**
1. Utwórz skrypt `scripts/generate-asset-sizes-report.js`
2. Skrypt generuje raport z:
   - Rozmiarem każdego pliku
   - Sumą rozmiarów per kategoria
   - Całkowitym rozmiarem bundla
3. Dodaj sekcję do `docs/graphics-requirements.md` z:
   - Oczekiwanymi rozmiarami plików
   - Maksymalnymi rozmiarami
   - Instrukcją jak wygenerować raport

## Faza 3: Weryfikacja (Priorytet 2 - Ważne) 🟡

### Zadanie 3.1: Testy po optymalizacji
**Wymagania:**
1. Uruchom aplikację i sprawdź czy wszystkie obrazy się wyświetlają
2. Przetestuj:
   - Wieże (wszystkie 3 poziomy)
   - Wrogów (wszystkie 3 typy)
   - Pociski
   - Mapę (tło, ścieżki, waypointy)
   - UI (przyciski, panele, menu)
3. Sprawdź czy nie ma błędów w konsoli
4. Sprawdź wydajność (czy nie ma spowolnienia)

### Zadanie 3.2: Aktualizuj dokumentację
**Wymagania:**
1. Zaktualizuj `docs/GRAPHICS_SYSTEM_REVIEW.md`:
   - Oznacz wykonane zadania jako ✅
   - Dodaj notatki o wykonanych zmianach
   - Zaktualizuj sekcję "Aktualny Stan Assetów"
2. Zaktualizuj `docs/WHERE_TO_PUT_IMAGES.md` jeśli zmieniłeś strukturę
3. Dodaj informacje o nowych skryptach do README jeśli potrzeba

## Instrukcje Wieloagentowe

### Agent 1: Cleanup Specialist
**Odpowiedzialność:** Faza 1 (Zadania 1.1 - 1.5)
- Usuwanie nieużywanych plików
- Przenoszenie plików źródłowych
- Optymalizacja dużych plików
- Porządkowanie struktury

### Agent 2: Optimization Specialist  
**Odpowiedzialność:** Faza 2 (Zadania 2.1 - 2.3)
- Tworzenie skryptów optymalizacji
- Tworzenie skryptów walidacji
- Aktualizacja dokumentacji technicznej

### Agent 3: QA Specialist
**Odpowiedzialność:** Faza 3 (Zadania 3.1 - 3.2)
- Testowanie po zmianach
- Weryfikacja działania
- Aktualizacja dokumentacji końcowej

## Zasady Pracy

1. **Zawsze sprawdzaj przed usunięciem:**
   - Użyj `grep -r "nazwa-pliku" .` żeby sprawdzić użycie
   - Sprawdź wszystkie pliki TypeScript/JavaScript
   - Sprawdź dokumentację

2. **Backup przed zmianami:**
   - Dla dużych zmian, stwórz backup
   - Użyj git commit przed większymi zmianami

3. **Testowanie:**
   - Po każdej fazie, przetestuj aplikację
   - Sprawdź czy obrazy się wyświetlają
   - Sprawdź czy nie ma błędów

4. **Dokumentacja:**
   - Aktualizuj dokumentację po zmianach
   - Dodawaj komentarze w kodzie jeśli potrzeba
   - Zapisuj zmiany w commit messages

5. **Komunikacja między agentami:**
   - Agent 1 kończy przed Agentem 2
   - Agent 2 może pracować równolegle z Agentem 3 (po testach Agent 1)
   - Agent 3 kończy jako ostatni

## Oczekiwane Rezultaty

### Metryki Sukcesu:
- ✅ Rozmiar bundla zmniejszony o minimum 8MB (usunięcie nieużywanych plików)
- ✅ `main-menu-background.png` zmniejszony o minimum 50%
- ✅ Wszystkie PNG zoptymalizowane
- ✅ Skrypty walidacji działają
- ✅ Dokumentacja zaktualizowana
- ✅ Aplikacja działa poprawnie po zmianach
- ✅ Brak błędów w konsoli

### Pliki do Utworzenia/Zmodyfikowania:
- `scripts/optimize-png-images.js` (nowy)
- `scripts/validate-assets.js` (nowy)
- `scripts/generate-asset-sizes-report.js` (nowy)
- `package.json` (dodaj skrypty)
- `utils/imageAssets.ts` (jeśli zmienisz formaty)
- `docs/GRAPHICS_SYSTEM_REVIEW.md` (aktualizacja)
- `docs/graphics-requirements.md` (aktualizacja)

## Rozpocznij Pracę

1. **Przeczytaj:** `docs/GRAPHICS_SYSTEM_REVIEW.md` (pełna ocena)
2. **Przeanalizuj:** Obecny stan assetów (użyj `find assets/images -type f -exec ls -lh {} \;`)
3. **Zacznij od:** Fazy 1 - Cleanup (największy impact)
4. **Dokumentuj:** Wszystkie zmiany w commit messages
5. **Testuj:** Po każdej fazie

## Ważne Uwagi

- **NIE USUWAJ** plików bez sprawdzenia użycia
- **NIE ZMIENIAJ** formatów bez aktualizacji `imageAssets.ts`
- **ZAWSZE TESTUJ** po zmianach
- **BACKUP** przed większymi zmianami
- **DOKUMENTUJ** wszystkie zmiany

---

**Gotowy do pracy? Zacznij od przeczytania `docs/GRAPHICS_SYSTEM_REVIEW.md` i rozpocznij Fazę 1!**

