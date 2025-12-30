# PROMPT DLA AI - Tekstura ścieżki dla mapy Endless Mode

## CO MUSISZ NARYSOWAĆ

Narysuj teksturę ścieżki dla gry. Ścieżka to droga, po której chodzą wrogowie.

## JAK WYGLĄDA ŚCIEŻKA

Ścieżka ma kształt litery S lub Z. Zaczyna się po lewej stronie, kończy po prawej.

### PUNKT STARTU (gdzie wrogowie wchodzą)
- Pozycja: lewy brzeg mapy, środek wysokości
- Wrogowie wchodzą z lewej strony i idą w prawo

### PUNKT KONCA (gdzie wrogowie wychodzą)
- Pozycja: prawy brzeg mapy, góra mapy
- Wrogowie wychodzą tutaj

### TRASA (jak wrogowie idą)

Ścieżka składa się z 7 prostych odcinków:

1. **Poziomo w prawo** - 4 kafelki
   - Zaczyna: lewy brzeg (x=0, y=6)
   - Kończy: (x=4, y=6)

2. **Pionowo w górę** - 3 kafelki
   - Zaczyna: (x=4, y=6)
   - Kończy: (x=4, y=3)

3. **Poziomo w prawo** - 4 kafelki
   - Zaczyna: (x=4, y=3)
   - Kończy: (x=8, y=3)

4. **Pionowo w dół** - 6 kafelków
   - Zaczyna: (x=8, y=3)
   - Kończy: (x=8, y=9)

5. **Poziomo w prawo** - 6 kafelków
   - Zaczyna: (x=8, y=9)
   - Kończy: (x=14, y=9)

6. **Pionowo w górę** - 5 kafelków
   - Zaczyna: (x=14, y=9)
   - Kończy: (x=14, y=4)

7. **Poziomo w prawo** - 6 kafelków
   - Zaczyna: (x=14, y=4)
   - Kończy: prawy brzeg (x=20, y=4)

## WYMAGANIA TECHNICZNE

### Format pliku
- Format: PNG
- Przezroczystość: TAK (tło musi być przezroczyste)
- Widok: Z góry (top-down)

### Rozmiar
- Szerokość ścieżki: 36 pikseli
- Długość: Tekstura musi się powtarzać (tile'owalna)
- Jakość: Wysoka, ostra

### Rozmiar mapy (dla informacji)
- Mapa ma 20 kafelków szerokości i 12 kafelków wysokości
- Każdy kafelek ma 32 piksele
- Cała mapa to 640 pikseli szerokości i 384 piksele wysokości

## JAK MA WYGLĄDAĆ

### Styl
- Post-apokaliptyczny (po końcu świata)
- Zniszczona droga lub ścieżka
- Wygląda jak stara, zniszczona droga

### Kolory
- Główne kolory: ciemny szary, brązowy, czarny
- Możesz dodać: żółty lub brązowy (jak piasek lub kurz)
- Ścieżka musi być ciemniejsza niż tło mapy (żeby było widać różnicę)

### Tekstura (powierzchnia)
- Chropowata (nie gładka)
- Popękana (ma pęknięcia)
- Ma dziury
- Wygląda na zużytą i zniszczoną
- Możesz dodać ślady kół lub stóp (opcjonalnie)

## GOTOWY PROMPT DO SKOPIOWANIA

```
Narysuj teksturę ścieżki dla gry tower defense. 

WYMAGANIA:
- Format: PNG z przezroczystym tłem
- Szerokość: 36 pikseli
- Widok: Z góry (top-down)
- Tekstura musi się powtarzać (tile'owalna)
- Wysoka jakość

OPIS ŚCIEŻKI:
Ścieżka ma kształt litery S. Zaczyna się po lewej stronie mapy (środek wysokości) i kończy po prawej stronie (góra mapy). 
Ścieżka składa się z 7 prostych odcinków: 4 poziome (w prawo) i 3 pionowe (2 w górę, 1 w dół).

STYL:
- Post-apokaliptyczna zniszczona droga
- Kolory: ciemny szary, brązowy, czarny
- Powierzchnia: chropowata, popękana, z dziurami
- Wygląda na zużytą i zniszczoną
- Ciemniejsza niż tło mapy
```

## DODATKOWE TEKSTURY (opcjonalnie)

Jeśli chcesz, możesz też narysować:

1. **Punkt startu** (32x32 piksele)
   - Oznaczenie wejścia wrogów
   - Może być: strzałka, brama, znak

2. **Punkt końca** (32x32 piksele)
   - Oznaczenie wyjścia wrogów
   - Może być: brama, znak, cel

3. **Zakręty** (32x32 piksele każdy)
   - Tekstury dla miejsc gdzie ścieżka skręca pod kątem 90 stopni
   - Muszą płynnie łączyć się z prostymi odcinkami

