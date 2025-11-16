# Map Background - Nowa wersja ze scenografią

## Instrukcja

1. **Wygeneruj grafikę** używając promptu z `docs/ai-prompts-missing-elements.md` (sekcja 5)
2. **Wrzuć tutaj** wygenerowany plik PNG (może mieć dowolną nazwę)
3. **Uruchom skrypt** do przetworzenia:
   ```bash
   node scripts/process-map-background.js
   ```

## Wymagania

- **Rozmiar docelowy**: 640x384px (20x12 tiles, każdy tile 32px)
- **Format**: PNG
- **Opis**: Tło mapy z scenografią: las (prawa) → polana (środek) → plaża z wrakiem (lewa)
- **Kolory**: JAŚNIEJSZE niż UI - użyj stonowanych zimowych kolorów dla lepszej czytelności
- **Ważne**: Tło musi być jaśniejsze niż ciemne panele UI, aby mapa była czytelna

## Plik docelowy

Po przetworzeniu plik zostanie zapisany jako:
`assets/images/map/background.png` (nadpisze istniejący)

