# Jak dodać wygenerowane grafiki

## Krok 1: Wrzuć grafiki do głównego folderu

Wrzuć wszystkie wygenerowane grafiki do folderu:
```
assets/images/
```

Możesz wrzucić je wszystkie na raz - nie musisz sortować ręcznie!

## Krok 2: Uruchom skrypt organizujący

Uruchom skrypt, który automatycznie:
- Zidentyfikuje każdą grafikę (na podstawie nazwy, rozmiaru, zawartości)
- Przypisze ją do odpowiedniego folderu
- Zmieni nazwę na właściwą

```bash
node scripts/organize-images.js
```

lub

```bash
bun scripts/organize-images.js
```

## Co robi skrypt?

Skrypt automatycznie:
1. ✅ Skanuje folder `assets/images/` w poszukiwaniu grafik
2. ✅ Identyfikuje je na podstawie:
   - Nazwy pliku (szuka słów kluczowych: tower, zombie, arrow, etc.)
   - Rozmiaru (64x64 = wieża, 48x48 = wróg, etc.)
   - Zawartości
3. ✅ Przenosi do odpowiednich folderów:
   - `towers/` - wieże
   - `enemies/` - wrogowie
   - `projectiles/` - pociski
   - `map/` - mapa
   - `ui/` - elementy UI
4. ✅ Zmienia nazwy na właściwe (np. `lookout-post-level-1.png`)

## Przykłady nazw, które skrypt rozpozna:

### Wieże:
- `tower-level-1.png` → `towers/lookout-post-level-1.png`
- `tower1.png` → `towers/lookout-post-level-1.png`
- `lookout-post-1.png` → `towers/lookout-post-level-1.png`
- Pliki zawierające "tower" + "1" → Level 1
- Pliki zawierające "tower" + "2" → Level 2
- Pliki zawierające "tower" + "3" → Level 3

### Wrogowie:
- `zombie-slow.png` → `enemies/shamber.png`
- `zombie-fast.png` → `enemies/runner.png`
- `zombie-heavy.png` → `enemies/brute.png`
- Pliki zawierające "shambler" → `shambler.png`
- Pliki zawierające "runner" → `runner.png`
- Pliki zawierające "brute" → `brute.png`

### Inne:
- Pliki z "arrow" lub "bolt" → `projectiles/arrow.png`
- Pliki z "ground" lub "tile" → `map/ground-tile.png`
- Pliki z "path" → `map/path-texture.png`
- Pliki z "background" → `map/background.png`
- Pliki z "button" → `ui/button-bg.png`
- Pliki z "panel" → `ui/panel-bg.png`
- Pliki z "scrap" → `ui/scrap-icon.png`

## Jeśli skrypt nie rozpozna pliku:

1. Sprawdź nazwę - czy zawiera słowa kluczowe?
2. Sprawdź rozmiar - czy pasuje do oczekiwanego?
3. Możesz ręcznie przenieść plik do odpowiedniego folderu z właściwą nazwą

## Po organizacji:

Grafiki będą automatycznie używane w grze! Kod wykryje je i użyje zamiast SVG.

## Uwagi:

- Skrypt nie nadpisuje istniejących plików (bezpieczne)
- Możesz uruchomić skrypt wielokrotnie
- Jeśli plik już istnieje w docelowym folderze, skrypt go pominie

