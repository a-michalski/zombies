# Gdzie wrzucić wygenerowane grafiki

## Struktura folderów

Wrzuć swoje wygenerowane grafiki do następujących folderów:

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
│   └── arrow.png
├── map/
│   ├── ground-tile.png
│   ├── path-texture.png
│   └── background.png
├── ui/
│   ├── button-bg.png
│   ├── panel-bg.png
│   └── scrap-icon.png
├── effects/ (opcjonalnie)
│   ├── explosion-sprite-sheet.png
│   └── hit-effect.png
└── icons/ (opcjonalnie)
    └── ...
```

## Wymagane nazwy plików

### Wieże (Towers)
- `lookout-post-level-1.png` - 64x64px
- `lookout-post-level-2.png` - 64x64px
- `lookout-post-level-3.png` - 64x64px

### Wrogowie (Enemies)
- `shambler.png` - 48x48px
- `runner.png` - 44x44px
- `brute.png` - 64x64px

### Pociski (Projectiles)
- `arrow.png` - 16x32px

### Mapa (Map)
- `ground-tile.png` - 64x64px (tileable)
- `path-texture.png` - 64x64px (tileable)
- `background.png` - 640x384px

### UI
- `button-bg.png` - 200x60px
- `panel-bg.png` - 400x300px
- `scrap-icon.png` - 32x32px

## Format plików

- **Format**: PNG
- **Przezroczystość**: Tak (alpha channel) dla wszystkich elementów oprócz mapy
- **Kolory**: RGB + Alpha
- **Optymalizacja**: Zalecane (pngquant, optipng)

## Co się stanie po wrzuceniu?

1. **Automatyczna integracja**: Kod automatycznie wykryje grafiki i użyje ich zamiast SVG
2. **Fallback**: Jeśli grafika nie istnieje, użyje SVG (obecny system)
3. **Obróbka**: Jeśli potrzebujesz pomocy z optymalizacją lub dostosowaniem, daj znać!

## Uwagi

- Upewnij się, że nazwy plików są dokładnie takie jak wymienione powyżej
- Wszystkie grafiki powinny mieć przezroczyste tło (oprócz mapy)
- Rozmiary powinny być zgodne ze specyfikacją
- Po wrzuceniu grafik, kod automatycznie zacznie ich używać

## Co jeśli nie mam wszystkich grafik?

Nie ma problemu! Kod ma fallback - jeśli grafika nie istnieje, użyje obecnego systemu SVG. Możesz dodawać grafiki stopniowo.

