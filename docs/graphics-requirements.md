# Wymagania graficzne - Realistyczny styl

## Ogólne wytyczne stylistyczne

**Styl**: Realistyczny/Stylizowany post-apokaliptyczny
**Temat**: Zombie Fleet - Bastion Defense
**Atmosfera**: Mroczna, industrialna, post-apokaliptyczna
**Paleta kolorów**: Ciemne odcienie, metalowe, zniszczone tekstury

### Charakterystyka wizualna:
- Wysokiej jakości, szczegółowe grafiki
- Realistyczne cienie i światło
- Metalowe/industrialne elementy
- Post-apokaliptyczne detale (rdza, zniszczenia)
- Spójny styl artystyczny w całej grze

---

## Struktura folderów

```
assets/images/
├── towers/
│   ├── lookout-post-level-1.png
│   ├── lookout-post-level-2.png
│   └── lookout-post-level-3.png
├── enemies/
│   ├── shambler.png
│   ├── runner.png
│   └── brute.png
├── projectiles/
│   ├── arrow.png
│   └── arrow-trail.png
├── map/
│   ├── ground-tile.png
│   ├── path-texture.png
│   ├── background.png
│   └── debris-overlay.png
├── ui/
│   ├── button-bg.png
│   ├── button-bg-pressed.png
│   ├── panel-bg.png
│   ├── scrap-icon.png
│   └── metal-texture.png
├── effects/
│   ├── explosion-sprite-sheet.png
│   ├── hit-effect.png
│   ├── smoke.png
│   └── sparks.png
└── icons/
    ├── tower-icon-lookout.png
    ├── enemy-icon-shambler.png
    ├── enemy-icon-runner.png
    └── enemy-icon-brute.png
```

---

## 1. WIEŻE (Towers)

### Lookout Post - Level 1
**Plik**: `towers/lookout-post-level-1.png`
**Rozmiar**: 64x64px (2x tile size)
**Format**: PNG z przezroczystością
**Opis**: 
- Podstawowa wieża obronna/bastion
- Realistyczna struktura metalowa
- Platforma z kuszą/krzyżową
- Postać survivalisty z kuszą (opcjonalnie widoczna)
- Metalowe elementy, rdza, zniszczenia
- Cienie i światło dla głębi
- Perspektywa: widok z góry (top-down) lub izometryczny

**Wymagania techniczne**:
- Rozdzielczość: minimum 64x64px, zalecane 128x128px dla Retina
- Przezroczystość: tak (alpha channel)
- Format: PNG-24
- Orientacja: wyśrodkowana, wieża w centrum

### Lookout Post - Level 2
**Plik**: `towers/lookout-post-level-2.png`
**Rozmiar**: 64x64px
**Format**: PNG z przezroczystością
**Opis**:
- Ulepszona wersja Level 1
- Większa, bardziej zaawansowana struktura
- Dodatkowe metalowe wzmocnienia
- Lepsze uzbrojenie (większa kusza)
- Więcej detali, ale spójny styl z Level 1

### Lookout Post - Level 3
**Plik**: `towers/lookout-post-level-3.png`
**Rozmiar**: 64x64px
**Format**: PNG z przezroczystością
**Opis**:
- Maksymalna wersja wieży
- Największa i najbardziej zaawansowana
- Zaawansowane uzbrojenie
- Najwięcej detali i wzmocnień
- Wizualnie wyróżnia się jako "maksymalna" wersja

**Wspólne wymagania dla wszystkich poziomów**:
- Spójny styl wizualny
- Różnica wizualna między poziomami powinna być wyraźna
- Kolorystyka może się zmieniać (np. Level 1: niebieski metal, Level 3: złoty/bronzowy)

---

## 2. WROGOWIE (Enemies)

### Shambler
**Plik**: `enemies/shambler.png`
**Rozmiar**: 48x48px (1.5x tile size)
**Format**: PNG z przezroczystością
**Opis**:
- Powolny zombie
- Realistyczna postać zombie
- Zniszczone ubrania, rany
- Post-apokaliptyczny wygląd
- Kolor: zielonkawy (#4CAF50) - ale realistyczny, nie płaski
- Perspektywa: widok z góry (top-down)
- Animacja: opcjonalnie sprite sheet z animacją chodzenia (4-8 klatek)

**Wymagania**:
- Rozdzielczość: minimum 48x48px, zalecane 96x96px
- Przezroczystość: tak
- Format: PNG-24
- Orientacja: wyśrodkowana

### Runner
**Plik**: `enemies/runner.png`
**Rozmiar**: 44x44px
**Format**: PNG z przezroczystością
**Opis**:
- Szybki zombie
- Smuklejsza sylwetka niż Shambler
- Dynamiczna postawa (gotowy do biegu)
- Kolor: żółtawy (#FFC107) - realistyczny
- Więcej ruchu w postawie
- Opcjonalnie sprite sheet z animacją biegu

### Brute
**Plik**: `enemies/brute.png`
**Rozmiar**: 64x64px (2x tile size)
**Format**: PNG z przezroczystością
**Opis**:
- Duży, silny zombie
- Masywna sylwetka
- Bardziej zniszczony, groźniejszy wygląd
- Kolor: czerwony (#F44336) - realistyczny
- Największy i najbardziej przerażający
- Opcjonalnie sprite sheet z animacją

**Wspólne wymagania**:
- Realistyczny styl zombie (nie kreskówkowy)
- Spójny styl artystyczny
- Różne rozmiary odpowiadające typom
- Opcjonalnie: sprite sheets dla animacji (8-12 klatek na animację)

---

## 3. POCISKI (Projectiles)

### Arrow/Bolt
**Plik**: `projectiles/arrow.png`
**Rozmiar**: 16x32px (lub proporcjonalnie)
**Format**: PNG z przezroczystością
**Opis**:
- Realistyczna strzała z kuszy
- Metalowy grot, drewniany trzonek
- Cienie dla głębi
- Orientacja: może być obracana w kodzie
- Kolor: brązowy (#8B4513) z metalowymi elementami

### Arrow Trail (opcjonalnie)
**Plik**: `projectiles/arrow-trail.png`
**Rozmiar**: 8x24px
**Format**: PNG z przezroczystością
**Opis**:
- Efekt smugi za strzałą
- Półprzezroczysty
- Gradient od pełnej do przezroczystej

**Wymagania**:
- Małe rozmiary (szybkie obiekty)
- Przezroczystość: tak
- Format: PNG-24

---

## 4. MAPA (Map)

### Ground Tile
**Plik**: `map/ground-tile.png`
**Rozmiar**: 64x64px (tileable)
**Format**: PNG
**Opis**:
- Tekstura ziemi/terenu
- Post-apokaliptyczna, zniszczona
- Tileable (seamless) - można powtarzać
- Ciemne odcienie, brud, zniszczenia
- Realistyczna tekstura

**Wymagania**:
- Tileable (bez widocznych szwów)
- Format: PNG-24
- Rozmiar: 64x64px lub 128x128px

### Path Texture
**Plik**: `map/path-texture.png`
**Rozmiar**: 64x64px (tileable)
**Format**: PNG
**Opis**:
- Tekstura ścieżki, po której idą wrogowie
- Ciemniejsza niż ground tile
- Może być asfalt, ziemia, zniszczona droga
- Tileable

### Background
**Plik**: `map/background.png`
**Rozmiar**: Zależny od rozmiaru mapy (640x384px dla 20x12 tiles)
**Format**: PNG
**Opis**:
- Tło mapy
- Post-apokaliptyczny krajobraz
- Może zawierać: ruiny, niebo, mgłę, zniszczenia
- Atmosferyczne, mroczne
- Nie tileable (jedna grafika dla całej mapy)

### Debris Overlay (opcjonalnie)
**Plik**: `map/debris-overlay.png`
**Rozmiar**: 64x64px (tileable)
**Format**: PNG z przezroczystością
**Opis**:
- Dodatkowe detale: gruz, kamienie, zniszczenia
- Półprzezroczysty overlay
- Może być nakładany na ground tile

---

## 5. UI (User Interface)

### Button Background
**Plik**: `ui/button-bg.png`
**Rozmiar**: 200x60px (lub 9-slice friendly)
**Format**: PNG z przezroczystością
**Opis**:
- Tło przycisku
- Metalowa/industrialna tekstura
- Post-apokaliptyczny styl
- Ciemne kolory (#222222, #333333)
- Może być 9-slice (rozdzielne rogi, boki, środek)

### Button Background Pressed
**Plik**: `ui/button-bg-pressed.png`
**Rozmiar**: 200x60px
**Format**: PNG z przezroczystością
**Opis**:
- Wersja przycisku po naciśnięciu
- Ciemniejsza lub inna wersja button-bg
- Wizualny feedback

### Panel Background
**Plik**: `ui/panel-bg.png`
**Rozmiar**: 400x300px (lub 9-slice friendly)
**Format**: PNG z przezroczystością
**Opis**:
- Tło paneli/modalów
- Metalowa tekstura
- Ciemne kolory (#2a2a2a)
- Może mieć ramkę/border
- 9-slice friendly

### Scrap Icon
**Plik**: `ui/scrap-icon.png`
**Rozmiar**: 32x32px
**Format**: PNG z przezroczystością
**Opis**:
- Ikona zasobu "scrap" (metalowy złom)
- Realistyczna ikona metalu/śrubek
- Kolor: złoty/brązowy (#FFD700)
- Wyśrodkowana

### Metal Texture
**Plik**: `ui/metal-texture.png`
**Rozmiar**: 128x128px (tileable)
**Format**: PNG
**Opis**:
- Tekstura metalu do użycia jako tło
- Tileable
- Może być używana w różnych miejscach UI

---

## 6. EFEKTY (Effects)

### Explosion Sprite Sheet
**Plik**: `effects/explosion-sprite-sheet.png`
**Rozmiar**: Zależny (np. 256x256px dla 8 klatek = 8x1 lub 4x2)
**Format**: PNG z przezroczystością
**Opis**:
- Animacja eksplozji
- Sprite sheet z 8-12 klatkami
- Realistyczna eksplozja z dymem, iskrami
- Kolor: pomarańczowy, czerwony, żółty
- Kolejne klatki pokazują rozwój eksplozji

**Wymagania**:
- Równe klatki w sprite sheet
- Dokumentacja: ile klatek, rozmiar każdej klatki

### Hit Effect
**Plik**: `effects/hit-effect.png`
**Rozmiar**: 32x32px
**Format**: PNG z przezroczystością
**Opis**:
- Efekt trafienia
- Iskry, błysk
- Półprzezroczysty
- Kolor: biały, żółty, pomarańczowy

### Smoke
**Plik**: `effects/smoke.png`
**Rozmiar**: 64x64px
**Format**: PNG z przezroczystością
**Opis**:
- Dym
- Półprzezroczysty, rozmyty
- Szary, ciemny
- Może być używany w różnych efektach

### Sparks
**Plik**: `effects/sparks.png`
**Rozmiar**: 16x16px
**Format**: PNG z przezroczystością
**Opis**:
- Iskry
- Małe, jasne punkty
- Kolor: żółty, biały
- Może być wiele instancji dla efektu cząsteczkowego

---

## 7. IKONY (Icons)

### Tower Icon - Lookout Post
**Plik**: `icons/tower-icon-lookout.png`
**Rozmiar**: 48x48px
**Format**: PNG z przezroczystością
**Opis**:
- Ikona wieży do użycia w menu
- Uproszczona wersja wieży
- Czytelna w małym rozmiarze
- Spójna z główną grafiką wieży

### Enemy Icons
**Pliki**: 
- `icons/enemy-icon-shambler.png`
- `icons/enemy-icon-runner.png`
- `icons/enemy-icon-brute.png`
**Rozmiar**: 32x32px każdy
**Format**: PNG z przezroczystością
**Opis**:
- Ikony wrogów do użycia w UI
- Uproszczone, czytelne wersje
- Spójne z głównymi grafikami wrogów

---

## Wymagania techniczne - ogólne

### Format plików:
- **Format**: PNG-24 (z alpha channel)
- **Kompresja**: Bezstratna
- **Kolory**: RGB + Alpha

### Rozdzielczości:
- **Podstawowa**: Wymienione w specyfikacji każdego elementu
- **Retina/HD**: Zalecane 2x rozdzielczość (np. 64x64px → 128x128px)
- **Web**: Można użyć srcset dla różnych rozdzielczości

### Optymalizacja:
- Pliki powinny być zoptymalizowane (np. pngquant, optipng)
- Rozmiary plików: rozsądne (nie za duże dla mobile)
- Sprite sheets dla animacji (zamiast wielu plików)

### Naming convention:
- Snake_case (małe litery, podkreślenia)
- Opisowe nazwy
- Spójne nazewnictwo

---

## Priorytety implementacji

### Faza 1 (Krytyczne):
1. Wieże (3 poziomy Lookout Post)
2. Wrogowie (3 typy)
3. Podstawowe UI (button-bg, panel-bg)

### Faza 2 (Ważne):
4. Mapa (ground-tile, path-texture, background)
5. Pociski (arrow)
6. Scrap icon

### Faza 3 (Nice to have):
7. Efekty (explosion, hit-effect)
8. Ikony (tower-icon, enemy-icons)
9. Dodatkowe efekty (smoke, sparks)

---

## Uwagi dla grafika/designera

1. **Spójność stylu**: Wszystkie grafiki powinny wyglądać jak z jednego świata
2. **Paleta kolorów**: Ciemne, post-apokaliptyczne, metalowe
3. **Detale**: Wysokiej jakości, ale nie przesadzone (mobile performance)
4. **Czytelność**: W małych rozmiarach (32x32px) elementy powinny być czytelne
5. **Perspektywa**: Spójna perspektywa (top-down lub izometryczna) dla wszystkich elementów gry
6. **Testowanie**: Grafiki powinny być testowane w kontekście gry (na tle mapy, z innymi elementami)

---

## Przykładowe referencje stylu

- Post-apokaliptyczne gry: Fallout, Metro, The Last of Us
- Tower Defense: Kingdom Rush (ale bardziej realistyczny)
- Industrialne tekstury: Metal, rdza, zniszczenia
- Kolorystyka: Ciemne szarości, brązy, zgaszone kolory, akcenty czerwieni/żółci

---

## Checklist przed finalizacją

- [ ] Wszystkie pliki w odpowiednich folderach
- [ ] Wszystkie rozmiary zgodne ze specyfikacją
- [ ] Przezroczystość (alpha channel) gdzie wymagane
- [ ] Spójny styl artystyczny
- [ ] Optymalizacja plików (rozmiary)
- [ ] Testowanie w kontekście gry
- [ ] Dokumentacja sprite sheets (jeśli używane)

