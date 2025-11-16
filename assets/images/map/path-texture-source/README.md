# Path Texture - Poprawiona wersja

## Instrukcja

1. **Wygeneruj grafikę** używając promptu z `docs/ai-prompts-missing-elements.md` (sekcja 5)
2. **Wrzuć tutaj** wygenerowany plik PNG (może mieć dowolną nazwę)
3. **Uruchom skrypt** do przetworzenia:
   ```bash
   node scripts/process-path-texture.js
   ```

## Wymagania

- **Rozmiar docelowy**: 64x64px (tileable - bez widocznych szwów)
- **Format**: PNG
- **Opis**: Tekstura zniszczonej drogi z detalami (nie szara!)
- **Kolory**: Ciemne brązy i szarości (#1a1a1a, #2a2a2a, #3a2a1a)
- **Ważne**: Tekstura powinna być tileable (seamless) - bez widocznych krawędzi przy powtarzaniu

## Plik docelowy

Po przetworzeniu plik zostanie zapisany jako:
`assets/images/map/path-texture.png` (nadpisze istniejący)

