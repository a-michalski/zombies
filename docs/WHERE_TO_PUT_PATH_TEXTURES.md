# Gdzie wrzucić tekstury ścieżki (Path Textures)

## Struktura folderów

Wszystkie tekstury ścieżki wrzucaj do folderów `*-source` w `assets/images/map/`:

### 1. Proste tekstury:

**Pozioma:**
- Folder: `assets/images/map/path-straight-horizontal-source/`
- Wrzuć tutaj: wygenerowany plik PNG (dowolna nazwa)
- Po przetworzeniu: `assets/images/map/path-straight-horizontal.png`

**Pionowa:**
- Folder: `assets/images/map/path-straight-vertical-source/`
- Wrzuć tutaj: wygenerowany plik PNG (dowolna nazwa)
- Po przetworzeniu: `assets/images/map/path-straight-vertical.png`

### 2. Zakręty (4 typy):

**Top-Left (góra-lewo):**
- Folder: `assets/images/map/path-corner-top-left-source/`
- Wrzuć tutaj: wygenerowany plik PNG (dowolna nazwa)
- Po przetworzeniu: `assets/images/map/path-corner-top-left.png`
- Opis: Ścieżka przychodzi z góry i skręca w lewo (lub z lewej i skręca w górę)

**Top-Right (góra-prawo):**
- Folder: `assets/images/map/path-corner-top-right-source/`
- Wrzuć tutaj: wygenerowany plik PNG (dowolna nazwa)
- Po przetworzeniu: `assets/images/map/path-corner-top-right.png`
- Opis: Ścieżka przychodzi z góry i skręca w prawo (lub z prawej i skręca w górę)

**Bottom-Left (dół-lewo):**
- Folder: `assets/images/map/path-corner-bottom-left-source/`
- Wrzuć tutaj: wygenerowany plik PNG (dowolna nazwa)
- Po przetworzeniu: `assets/images/map/path-corner-bottom-left.png`
- Opis: Ścieżka przychodzi z dołu i skręca w lewo (lub z lewej i skręca w dół)

**Bottom-Right (dół-prawo):**
- Folder: `assets/images/map/path-corner-bottom-right-source/`
- Wrzuć tutaj: wygenerowany plik PNG (dowolna nazwa)
- Po przetworzeniu: `assets/images/map/path-corner-bottom-right.png`
- Opis: Ścieżka przychodzi z dołu i skręca w prawo (lub z prawej i skręca w dół)

## Jak używać:

1. **Wygeneruj grafiki** używając promptów z `docs/ai-prompts-missing-elements.md`:
   - Sekcja 6a: `path-straight-horizontal.png`
   - Sekcja 6b: `path-straight-vertical.png`
   - Sekcja 6c: `path-corner-*.png` (4 typy)

2. **Wrzuć pliki** do odpowiednich folderów `*-source/` (może być dowolna nazwa pliku)

3. **Uruchom skrypt** do przetworzenia wszystkich tekstur naraz:
   ```bash
   node scripts/process-path-textures.js
   ```

   Lub przetwórz pojedynczo:
   ```bash
   # Dla każdej tekstury osobno (jeśli potrzebujesz):
   node scripts/process-path-texture.js  # stara wersja (fallback)
   ```

4. **Sprawdź wynik** - pliki powinny być w `assets/images/map/` jako:
   - `path-straight-horizontal.png`
   - `path-straight-vertical.png`
   - `path-corner-top-left.png`
   - `path-corner-top-right.png`
   - `path-corner-bottom-left.png`
   - `path-corner-bottom-right.png`

## Ważne:

- **Rozmiar**: Wszystkie tekstury będą przeskalowane do 64x64px
- **Format**: PNG
- **Tileable**: Tekstury powinny być seamless (łączyć się bez szwów)
- **Fallback**: Jeśli brakuje specjalistycznych tekstur, gra użyje starej `path-texture.png`

## Przykład struktury:

```
assets/images/map/
├── path-straight-horizontal-source/
│   └── [twój-plik.png]  ← wrzuć tutaj
├── path-straight-vertical-source/
│   └── [twój-plik.png]  ← wrzuć tutaj
├── path-corner-top-left-source/
│   └── [twój-plik.png]  ← wrzuć tutaj
├── path-corner-top-right-source/
│   └── [twój-plik.png]  ← wrzuć tutaj
├── path-corner-bottom-left-source/
│   └── [twój-plik.png]  ← wrzuć tutaj
├── path-corner-bottom-right-source/
│   └── [twój-plik.png]  ← wrzuć tutaj
└── [po przetworzeniu]:
    ├── path-straight-horizontal.png
    ├── path-straight-vertical.png
    ├── path-corner-top-left.png
    ├── path-corner-top-right.png
    ├── path-corner-bottom-left.png
    └── path-corner-bottom-right.png
```



