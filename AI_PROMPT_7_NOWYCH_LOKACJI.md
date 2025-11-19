# PROMPT: Zaprojektuj 7 Nowych Lokacji do Gry Zombie Tower Defense

## KONTEKST OBECNEJ GRY

Pracujesz nad rozszerzeniem istniejącej gry tower defense o tematyce zombie. Poniżej znajdziesz pełny opis obecnego stanu gry.

### Obecna Struktura Gry

**Tryby Gry:**
- **Campaign Mode**: 10 sekwencyjnych poziomów (level-01 do level-10) z progresją trudności
- **Classic Mode**: nieskończone fale w trybie survival

**System Poziomów:**
- Każdy poziom ma swoją własną mapę z unikalną ścieżką
- 3 poziomy trudności: Easy (poziomy 1-3), Medium (4-6), Hard (7-10)
- System gwiazdek (1-3 stars) oparty na wydajności gracza
- Sekwencyjne odblokowywanie poziomów

### Obecne Typy Wrogów

| Typ Wroga | HP | Prędkość | Obrażenia | Nagroda (scrap) | Opis |
|-----------|-------|----------|-----------|-----------------|------|
| **Shambler** | 50 | 1.0 | 1 | 5 | Podstawowy, wolny zombie |
| **Runner** | 35 | 1.8 | 1 | 7 | Szybki, ale słaby |
| **Brute** | 250 | 0.6 | 5 | 20 | Silny, wolny mini-boss |

### Obecna Progresja Wrogów w Kampanii

- **Poziomy 1-2**: Tylko Shamblers (tutorial)
- **Poziom 3**: Wprowadzenie Brutes
- **Poziomy 4+**: Mieszane fale wszystkich typów
- **Poziom 10**: Boss fight z masowymi falami

### System Wież (Obrona)

**Obecnie dostępna tylko 1 wieża: Lookout Post (Strażnica)**
- Typ: Ocalały z kuszą
- Koszt budowy: 100 scrap
- 3 poziomy ulepszeń:

| Poziom | Obrażenia | Zasięg | Szybkostrzelność | Koszt Ulepszenia |
|--------|-----------|--------|------------------|------------------|
| 1 | 10 | 3.0 | 1.0 | - |
| 2 | 15 | 3.25 | 1.2 | 75 scrap |
| 3 | 25 | 3.5 | 1.5 | 175 scrap |

### System Fal

- Każdy poziom składa się z 5-20 fal wrogów
- Każda fala ma określony skład wrogów (typ + ilość)
- Opóźnienie spawnu między wrogami (spawn delay): 0.6s - 2.0s
- Nagroda za ukończenie fali: +25 scrap
- Bonus za ręczne rozpoczęcie fali: +15 scrap

### Mechaniki Gry

**Zasoby:**
- **Scrap**: waluta do budowania/ulepszania wież (start: 120-200 scrap)
- **Hull (wytrzymałość bazy)**: zdrowie gracza (start: 20 HP)

**Akcje Gracza:**
- Budowanie wież na predefiniowanych miejscach (construction spots)
- Ulepszanie wież (3 poziomy)
- Sprzedaż wież (zwrot 50% wartości)
- Rozpoczynanie fal (opcjonalne - auto-start po 15 sekundach)

**Progresja Trudności:**
- Liczba miejsc budowy: 5-10 (w zależności od poziomu)
- Złożoność ścieżki: od prostej L-kształtnej do labiryntu
- Zasoby startowe: zmniejszają się na trudniejszych poziomach
- Wymagania na gwiazdki: od 60-90% HP (easy) do specjalnych wyzwań (hard)

### Struktura Poziomu

Każdy poziom definiuje:
```typescript
{
  id: "level-01",
  number: 1,
  name: "Nazwa poziomu",
  description: "Opis fabularny",
  difficulty: "easy" | "medium" | "hard",
  mapConfig: {
    width: 16,           // szerokość siatki
    height: 10,          // wysokość siatki
    tileSize: 48,        // rozmiar kafla w pikselach
    waypoints: [...],    // ścieżka wrogów (współrzędne)
    constructionSpots: [...], // miejsca budowy wież
    waves: [...],        // konfiguracja fal
    startingScrap: 200,  // zasoby startowe
    startingHull: 20     // HP bazy
  },
  starRequirements: {
    oneStar: { type: "complete" },
    twoStar: { type: "hull", value: 60 },
    threeStar: { type: "hull", value: 90 }
  },
  unlockRequirement: {
    previousLevel: "level-00",
    minStars: 1
  },
  rewards: {...}
}
```

---

## TWOJE ZADANIE: Zaprojektuj 7 Nowych Lokacji

### Wymagania Ogólne

1. **7 nowych lokacji-poziomów** (będą to poziomy 11-17)
2. **Każda lokacja ma 10 fal potworów**
3. **Stopniowa progresja trudności** - każda następna lokacja trudniejsza
4. **Nowe mechaniki wprowadzane kumulatywnie** - nowe funkcje dochodzą i zostają
5. **Nowe typy potworów** - rozszerzenie obecnych 3 typów
6. **Struktura przejść** - mogą być rozgałęzienia, ale gra pozostaje stosunkowo prosta

### Szczegółowe Wymagania

#### 1. MAPA STRUKTURY LOKACJI

Stwórz **wizualną mapę/diagram** pokazujący:
- Jak gracz przechodzi między 7 nowymi lokacjami
- Czy są rozgałęzienia (opcjonalne ścieżki)?
- Jak lokacje łączą się z obecnym poziomem 10?
- Oznacz poziomy trudności kolorami

**Format**: ASCII art, Mermaid diagram, lub opisowa mapa tekstowa

#### 2. NOWE TYPY POTWORÓW

Zaproponuj **co najmniej 4-5 nowych typów wrogów**, które:
- Pasują do estetyki zombie/post-apokalipsy
- Mają unikalne mechaniki (np. latające, regenerujące się, eksplodujące)
- Są zbalansowane z obecnymi wrogami
- Wprowadzane są stopniowo w kolejnych lokacjach

Dla każdego nowego wroga podaj:
- Nazwę i opis
- HP bazowe
- Prędkość
- Obrażenia
- Nagroda scrap
- Specjalne umiejętności (jeśli są)
- W której lokacji pojawia się po raz pierwszy

#### 3. NOWE MECHANIKI I FUNKCJE

Zaproponuj **nowe mechaniki gry**, które:
- Są wprowadzane kumulatywnie (w kolejnych lokacjach)
- Rozszerzają obecny gameplay bez jego niszczenia
- Przykłady: nowe typy wież, umiejętności specjalne, modyfikatory terenu, zdarzenia losowe, boss-fighti

Dla każdej mechaniki określ:
- Nazwę i opis
- W której lokacji się pojawia
- Jak wpływa na gameplay
- Parametry konfiguracyjne (jeśli są)

#### 4. KONFIGURACJA KAŻDEJ LOKACJI

Dla każdej z 7 lokacji zaprojektuj:

**A. Podstawowe Informacje:**
- ID (np. "level-11")
- Numer (11-17)
- Nazwa (klimatyczna, fabularnie pasująca)
- Opis fabuły (2-3 zdania)
- Poziom trudności (easy/medium/hard)

**B. Parametry Mapy:**
- Rozmiar siatki (width × height)
- Ilość waypoints (punktów ścieżki) - sugerowana złożoność
- Ilość construction spots (5-12)
- Opis ścieżki (np. "spirala", "podwójna ścieżka", "labirynt")
- Specjalne cechy terenu (jeśli są)

**C. Konfiguracja 10 Fal:**
Dla każdej z 10 fal określ:
- Numer fali
- Skład wrogów (typ + ilość)
- Opóźnienie spawnu (spawn delay w sekundach)
- Ewentualne specjalne wydarzenia w fali

**D. Zasoby i Balans:**
- Starting scrap (zasoby startowe)
- Starting hull (HP bazy)
- Sugerowane wymagania na gwiazdki (1★, 2★, 3★)

**E. Progresja Trudności:**
Dla każdej lokacji opisz, jak rośnie trudność:
- Zwiększenie HP wrogów (np. +20% względem poprzedniej lokacji)
- Zwiększenie obrażeń wrogów (np. +15%)
- Zmniejszenie opóźnienia spawnu
- Nowe kombinacje wrogów

#### 5. SYSTEM KONFIGURACJI YAML

Zaprojektuj **strukturę pliku YAML**, która pozwoli mi łatwo modyfikować:
- Statystyki wszystkich potworów (HP, prędkość, obrażenia, nagrody)
- Statystyki wszystkich wież (obrażenia, zasięg, szybkostrzelność, koszty)
- Mnożniki trudności dla lokacji
- Parametry fal (spawn delay, ilości wrogów)
- Nagrody i wymagania na gwiazdki

**Przykładowa struktura** (rozwiń i dostosuj):

```yaml
# game-config.yaml

# Konfiguracja wrogów
enemies:
  shambler:
    baseHealth: 50
    speed: 1.0
    damage: 1
    scrapReward: 5
  runner:
    baseHealth: 35
    speed: 1.8
    damage: 1
    scrapReward: 7
  # ... nowe typy

# Konfiguracja wież
towers:
  lookout_post:
    buildCost: 100
    levels:
      - damage: 10
        range: 3.0
        fireRate: 1.0
      # ... poziomy 2-3
  # ... nowe wieże

# Mnożniki trudności per lokacja
locationDifficultyMultipliers:
  level-11:
    enemyHealthMultiplier: 1.0
    enemyDamageMultiplier: 1.0
    scrapMultiplier: 1.0
  level-12:
    enemyHealthMultiplier: 1.2
    enemyDamageMultiplier: 1.1
    scrapMultiplier: 0.95
  # ... reszta lokacji

# Konfiguracja fal dla każdej lokacji
locations:
  level-11:
    waves:
      - waveNumber: 1
        enemies:
          - type: shambler
            count: 10
          - type: runner
            count: 5
        spawnDelay: 1.5
      # ... fale 2-10
```

#### 6. STORYTELLING I SPÓJNOŚĆ FABULARNA

Zaproponuj **fabularną klamrę** dla tych 7 lokacji:
- Jaki jest cel fabularny przejścia tych poziomów?
- Jaka jest historia łącząca te lokacje?
- Jak kończy się kampania po przejściu poziomu 17?

---

## FORMAT ODPOWIEDZI

Proszę o przedstawienie projektu w następującej strukturze:

### 1. MAPA LOKACJI
[Diagram/mapa pokazująca strukturę 7 lokacji i przejścia między nimi]

### 2. NOWE TYPY POTWORÓW
[Tabela/lista wszystkich nowych wrogów z pełnymi parametrami]

### 3. NOWE MECHANIKI
[Lista mechanik z opisami i lokacjami wprowadzenia]

### 4. SZCZEGÓŁOWY OPIS LOKACJI (dla każdej z 7)
```
LOKACJA X: [Nazwa]
- ID: level-XX
- Trudność: [easy/medium/hard]
- Opis fabularny: [...]
- Parametry mapy: [...]
- Zasoby startowe: [...]
- Nowe mechaniki wprowadzone: [...]
- Konfiguracja 10 fal: [szczegółowa tabela]
- Wymagania na gwiazdki: [...]
- Progresja trudności: [mnożniki i zmiany]
```

### 5. PLIK KONFIGURACYJNY YAML
[Kompletna struktura YAML z wartościami dla wszystkich lokacji]

### 6. FABUŁA I STORYTELLING
[Opis fabularny całej nowej kampanii]

---

## DODATKOWE WSKAZÓWKI

- **Balans**: Upewnij się, że nowe potwory i mechaniki są zbalansowane z obecnymi
- **Progresja**: Trudność powinna rosnąć stopniowo, nie skokowo
- **Różnorodność**: Każda lokacja powinna być unikalna i ciekawa
- **Playability**: Projekty powinny być możliwe do wygrania, ale wymagające
- **Rozszerzalność**: Struktura YAML powinna być łatwa do rozbudowy w przyszłości

---

## PYTANIA DO PRZEMYŚLENIA

Przy projektowaniu rozważ:
1. Czy gracze będą mieli dostęp do nowych wież od razu, czy będą je odblokowywać?
2. Czy nowe mechaniki wpłyną na poprzednie 10 poziomów, czy tylko na nowe?
3. Jaki powinien być stosunek trudności nowej kampanii do obecnej? (kontynuacja? reset?)
4. Czy lokacje 11-17 powinny mieć własny system nagród/osiągnięć?

---

**ZACZYNAJ PROJEKTOWANIE!** 🎮🧟‍♂️