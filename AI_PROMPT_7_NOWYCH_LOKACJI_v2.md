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

**DPS Calculations:**
- Level 1 DPS: 10 × 1.0 = **10 DPS**
- Level 2 DPS: 15 × 1.2 = **18 DPS**
- Level 3 DPS: 25 × 1.5 = **37.5 DPS** ← Max obecnie w grze

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

### Struktura Poziomu (TypeScript)

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
    waypoints: [...],    // ścieżka wrogów (współrzędne {x, y})
    constructionSpots: [...], // miejsca budowy wież (współrzędne)
    waves: [...],        // konfiguracja fal
    startingScrap: 200,  // zasoby startowe
    startingHull: 20     // HP bazy
  },
  starRequirements: {
    oneStar: { type: "complete" },
    twoStar: { type: "hull", value: 60 },  // 60% HP pozostało
    threeStar: { type: "hull", value: 90 } // 90% HP pozostało
  },
  unlockRequirement: {
    previousLevel: "level-00",
    minStars: 1
  },
  rewards: {...}
}
```

---

## STRATEGIA MULTI-AGENT - Jak Efektywnie Podzielić Pracę

To zadanie jest złożone i obejmuje wiele dyscyplin game designu. **Rekomendowany workflow dla AI:** podziel pracę na specjalistycznych agentów działających równolegle i sekwencyjnie.

### 🎯 Przepływ Pracy (Workflow)

```
┌─────────────────┐     ┌─────────────────┐
│  Agent 1:       │     │  Agent 2:       │
│  ECONOMY        │────▶│  COMBAT         │
│  DESIGNER       │     │  BALANCER       │
└─────────────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Agent 3:       │◀────│  Agent 4:       │
│  LEVEL          │     │  NARRATIVE      │
│  DESIGNER       │     │  DESIGNER       │
└─────────────────┘     └─────────────────┘
         │                       │
         └───────┬───────────────┘
                 ▼
       ┌─────────────────┐
       │  Agent 5:       │
       │  METRICS        │
       │  VALIDATOR      │
       └─────────────────┘
                 │
                 ▼
       ┌─────────────────┐
       │  Agent 6:       │
       │  UX EXPERIENCE  │
       │  DESIGNER       │
       └─────────────────┘
```

---

### Agent 1: 💰 ECONOMY DESIGNER

**Zakres odpowiedzialności:**
- Oblicz total scrap available dla każdej lokacji (11-17)
- Określ starting scrap
- Oblicz economy ratio (zgodnie z target: easy 1.8-2.2, medium 1.4-1.6, hard 1.1-1.3)
- Zwaliduj czy gracze mogą zbudować viable defense
- Oblicz minimum tower investment needed

**Zależności:**
- INPUT: Brak (może działać jako pierwszy)
- OUTPUT: Economy metrics dla level 11-17

**Przykładowa kalkulacja:**
```
Level 11 (easy):
- Target economy ratio: 1.8
- Minimum viable defense: 4 towers lvl 2 = 700 scrap (400 build + 300 upgrade)
- Total scrap needed: 700 × 1.8 = 1260 scrap
- Starting scrap: 200
- From enemies + wave bonuses: 1260 - 200 = 1060 scrap
```

**Deliverable:** Tabela economy metrics

---

### Agent 2: ⚔️ COMBAT BALANCER

**Zakres odpowiedzialności:**
- Zaprojektuj nowe typy wrogów (HP, speed, damage, scrap rewards)
- Oblicz Time-to-Kill (TTK) dla każdego wroga
- Zaprojektuj skład 10 fal dla każdej lokacji (typ + count + spawn delay)
- Oblicz DPS requirements per wave
- Zaprojektuj nowe typy wież (jeśli potrzebne)

**Zależności:**
- INPUT: Economy metrics od Agent 1 (żeby wiedzieć ile scrap gracze mogą mieć)
- OUTPUT: Enemy configs + Wave compositions + Tower proposals

**Przykładowe obliczenia:**
```
Nowy wróg: "Spitter" (ranged zombie)
- Target TTK: 3 sekundy (medium tier)
- Max tower DPS: 37.5
- HP = TTK × DPS = 3 × 37.5 = ~110 HP
- Speed: 1.2 (szybszy niż shambler, wolniejszy niż runner)
- Damage: 2 (specjalna umiejętność: ranged attack)
- Scrap reward: 10
```

**Deliverable:** Enemy list + Wave configurations + Tower proposals

---

### Agent 3: 🗺️ LEVEL DESIGNER

**Zakres odpowiedzialności:**
- Zaprojektuj ścieżki (waypoints) - ilość i złożoność
- Rozmieść construction spots (ile i gdzie)
- Określ rozmiary map (width × height)
- Dodaj terrain modifiers (jeśli są)
- Opisz layout każdej lokacji

**Zależności:**
- INPUT: Combat data od Agent 2 (żeby wiedzieć ile DPS/coverage potrzeba)
- OUTPUT: Map configurations dla 11-17

**Przykładowy design:**
```
Level 11: "The Outskirts"
- Map size: 18 × 12 (większa niż standardowa)
- Waypoints: 8 points forming a gentle S-curve
- Construction spots: 7 (well-distributed along path)
- Path length reasoning: Longer path = more time to kill = allows for tougher enemies
```

**Deliverable:** Map layouts (descriptive)

---

### Agent 4: 📖 NARRATIVE DESIGNER

**Zakres odpowiedzialności:**
- Stwórz fabułę łączącą 7 lokacji
- Nazwy poziomów (atmospheric, fitting the theme)
- Opisy misji (2-3 zdania storytelling)
- Story arc (początek → climax → zakończenie)
- Storytelling hooks między lokacjami

**Zależności:**
- INPUT: Level themes od Agent 3 (żeby wiedzieć jaki jest setting każdej mapy)
- OUTPUT: Story content

**Przykład:**
```
Level 11: "The Outskirts"
"Dotarliście do przedmieść. Miasto wydawało się puste, ale z ciemności wyłaniają
się setki głodnych oczu. To dopiero początek koszmaru."

Level 17: "The Hive"
"To źródło zarazy. Gigantyczne gniazdo pulsujące nienaturalnym życiem. Jeśli
tego nie zniszczycie, nikt nie przeżyje. To wasza ostatnia szansa."
```

**Deliverable:** Story document

---

### Agent 5: 📊 METRICS VALIDATOR

**Zakres odpowiedzialności:**
- Oblicz Difficulty Score dla każdej lokacji (formula w sekcji poniżej)
- Sprawdź czy TTK są w target range
- Zwaliduj economy ratios
- Sprawdź progression curve (czy trudność rośnie stopniowo?)
- Wykryj potencjalne problemy balansowe

**Zależności:**
- INPUT: Wszystkie dane od Agent 1-4
- OUTPUT: Validation report + recommended adjustments

**Validation checks:**
```
✓ Level 11 Difficulty Score: 1.21 (target: 1.2) ✅
✓ Economy ratio: 1.82 (target: 1.8-2.2) ✅
✓ All TTK in range ✅
✗ Level 12: Difficulty spike too high (1.9, expected ~1.4) ❌ → ADJUST
```

**Deliverable:** Validation report

---

### Agent 6: 🎮 UX EXPERIENCE DESIGNER

**Zakres odpowiedzialności:**
- Oceń player psychology dla każdego poziomu
- Sprawdź pacing wave-by-wave (czy jest emotional arc?)
- Zidentyfikuj frustration points (unfair moments?)
- Zaproponuj satisfaction moments (peak experiences)
- Sprawdź learning curve (czy nowe mechaniki są well-introduced?)

**Zależności:**
- INPUT: Finalne designy od Agent 5
- OUTPUT: UX audit + improvement recommendations

**Przykładowa analiza:**
```
Level 11 UX Audit:
✓ Waves 1-3: Good ramp-up, player builds confidence
✓ Wave 5: Nice tension spike (first Spitter introduction)
✗ Wave 7: Potential frustration - 20 runners may overwhelm unprepared players
  → RECOMMENDATION: Add warning text "Fast wave incoming!" before wave 7
✓ Wave 10: Satisfying climax with boss + adds
✓ Learning curve: Spitter introduced gently (only 2 in wave 5)
```

**Deliverable:** UX report

---

### 🔄 Rekomendowany Workflow - Kolejność Wykonania

**FAZA 1: PARALLEL** (można robić równocześnie)
- Agent 1 (Economy Designer) - samodzielny start
- Agent 4 (Narrative Designer) - może działać niezależnie

**FAZA 2: SEQUENTIAL** (czeka na Agenta 1)
- Agent 2 (Combat Balancer) - potrzebuje economy data

**FAZA 3: SEQUENTIAL** (czeka na Agenta 2)
- Agent 3 (Level Designer) - potrzebuje combat data

**FAZA 4: SEQUENTIAL** (czeka na wszystkich)
- Agent 5 (Metrics Validator) - waliduje całość

**FAZA 5: FINAL** (czeka na Agenta 5)
- Agent 6 (UX Designer) - finalna ocena

---

### 💡 Wskazówki dla Multi-Agent Workflow

1. **Komunikacja między agentami**: Każdy agent powinien otrzymać output poprzednich
2. **Iteracja**: Jeśli Agent 5 znajdzie problemy, odpowiedni agent wraca do pracy
3. **Documentation**: Każdy agent dokumentuje swoje decyzje i reasoning
4. **Consistency**: Wszyscy agenci muszą używać tych samych zasad balansu (patrz sekcje poniżej)

---

## FILOZOFIA DESIGNU UX - Player Experience

Najlepsze gry nie są tylko dobrze zbalansowane - one rozumieją **psychologię gracza**. Każda lokacja musi być zaprojektowana z myślą o tym, co gracz **czuje**, a nie tylko co robi.

### 1. 🎭 PLAYER PSYCHOLOGY - Emotional Journey

Każda lokacja powinna prowadzić gracza przez **emotional arc**:

#### Faza 1: CONFIDENCE BUILDING (fale 1-3)
**Cel emocjonalny:** Gracz czuje się "in control"

- Łatwe pierwsze fale pozwalają graczowi zbudować ekonomię
- Gracz ma czas na eksperymentowanie z placement wież
- Małe wygrane budują pewność siebie ("Radzę sobie!")
- Brak presji czasu - gracz może planować w spokoju

**Design guidelines:**
- Pierwsze 2-3 fale: tylko podstawowe wrogowie (shambler-tier)
- Spawn delay: 1.5-2.0s (dużo czasu)
- Ilość wrogów: niska (5-10 per wave)

#### Faza 2: RISING TENSION (fale 4-7)
**Cel emocjonalny:** Stopniowo rosnący challenge, meaningful decisions

- Presja rośnie, ale nie overwhelmuje
- Gracz musi podejmować **strategic decisions**
  - "Czy powinienem ulepszyć istniejącą wieżę czy zbudować nową?"
  - "Czy stać mnie na ryzyko i czekać na więcej scrap?"
- Wprowadzenie nowych typów wrogów (jeden na raz!)
- Gracz zaczyna czuć "mogę nie dać rady" ale wciąż ma kontrolę

**Design guidelines:**
- Wprowadź nowego wroga w fali 4-5 (tylko kilka sztuk - introduction)
- Mix enemy types (nie tylko jedna nuda)
- Spawn delay: 1.0-1.5s (średnia presja)
- Economy decisions matter (wrong choices = widoczne konsekwencje)

#### Faza 3: CLIMAX & RELIEF (fale 8-10)
**Cel emocjonalny:** Peak intensity → triumphant relief

- Fala 8-9: High intensity, gracz używa wszystkich zasobów
- Fala 10: **Boss wave** lub massive horde (epic finale)
- Gracz czuje "barely made it!" (to jest **satisfying**)
- Sukces czuje się **earned**, nie lucky

**Design guidelines:**
- Fala 10: Boss (1-2 bardzo silnych wrogów) LUB massive horde (30+ wrogów)
- Wszystkie typy wrogów mieszane (full challenge)
- Spawn delay: 0.6-1.0s (high pressure)
- Jeśli gracz dobrze zaplanował obronę → wygrywa z margin for error
- Jeśli źle zaplanował → przegrywa ale widzi DLACZEGO

---

### 2. 🚫 FRUSTRATION PREVENTION - Unikaj "Unfun" Moments

**Złe emocje zabijają retencję.** Unikaj tych błędów:

#### ❌ UNFAIR DEATHS
**Problem:** Gracz przegrywa z powodów poza jego kontrolą
- Wróg pojawił się "znikąd" (brak warning)
- RNG może sprawić że przegrasz mimo perfect play
- Instant-kill mechanics (gracz nie ma czasu zareagować)

**Rozwiązanie:**
✅ Zawsze daj preview następnej fali (enemy types + counts)
✅ Consistent timing (fale zawsze startują po tym samym czasie)
✅ No instant-kills (even boss should be survivable with good defense)

#### ❌ UNCLEAR FEEDBACK
**Problem:** Gracz nie wie DLACZEGO przegrał
- "Przegrałeś" ale bez informacji co było nie tak
- Brak visibility na DPS (czy moje wieże są wystarczające?)
- Hidden mechanics (gracz nie rozumie zasad)

**Rozwiązanie:**
✅ Defeat screen z insights: "Twoje wieże miały za mało DPS na falę 7"
✅ Tower stats visible (damage numbers, kill counts)
✅ Clear rules (jeśli wróg ma ability, gracz to widzi)

#### ❌ NOOB TRAPS
**Problem:** Pozornie dobre decyzje które są actually bad
- "Zbudowałem 10 wież lvl 1" vs "4 wieże lvl 3" (drugie jest lepsze, ale noob tego nie wie)
- False choices (jedna opcja jest zawsze lepsza)

**Rozwiązanie:**
✅ Multiple viable strategies (różne buildy mogą wygrać)
✅ Tooltips/hints na trudnych decyzjach
✅ Forgiving economy (1-2 błędy != instant loss)

#### ❌ RNG BULLSHIT
**Problem:** Luck determines winner, not skill
- Losowe spawny wrogów (czasem łatwo, czasem impossible)
- Critical hits / misses (tower variance)

**Rozwiązanie:**
✅ Deterministic gameplay (te same decyzje = ten sam wynik)
✅ No randomness w combat (towers hit 100% w range)
✅ Fale zawsze identyczne (poziom = consistent challenge)

---

### 3. ✨ SATISFACTION TRIGGERS - Co Sprawia Że Gra Jest "Fun"?

#### Micro-Satisfaction (co 10-30 sekund)
**Małe nagrody** które sprawiają że gracz czuje progres:

- ✅ Wróg zabity → **+scrap notification** (visual + sound)
- ✅ Wieża ulepszona → **power spike** (widoczne więcej damage)
- ✅ Fala ukończona → **reward popup** (+25 scrap, progress bar)
- ✅ Close call → "Ostatni wróg zabity tuż przed bazą!" (thrilling!)

**Design tip:** Gracz powinien czuć "I'm getting stronger" co minutę

#### Macro-Satisfaction (koniec poziomu)
**Duże nagrody** za ukończenie:

- ✅ **Star rating** (1-3 stars) - quantified performance
- ✅ **Unlocked content** - nowa lokacja odblokowana, nowa mechanika dostępna
- ✅ **Progress bar** - "15/17 kampanii ukończone" (social proof)
- ✅ **Leaderboard / best time** (dla competitive players)

**Design tip:** Koniec poziomu = celebration moment, nie tylko "Next"

#### Mastery-Satisfaction (long-term)
**Deep satisfaction** dla hardcore players:

- ✅ Gracz znalazł **"optimal strategy"** (feel smart!)
- ✅ **3-star challenge** jest hard ale fair (prestige)
- ✅ **Replay value** - różne strategie viable (nie tylko jedna meta)
- ✅ **Speedrun potential** - skilled players mogą optimize timing

**Design tip:** Easy to learn, hard to master

---

### 4. 📚 LEARNING CURVE - Introducing New Mechanics

**Zasada #1: ONE NEW THING AT A TIME**

❌ **BAD:** Level 11 wprowadza: nowego wroga + nową wieżę + nową mechanikę terenu
→ Gracz jest overwhelmed, nie wie co jest ważne

✅ **GOOD:**
- Level 11: Wprowadź 1 nowego wroga (Spitter)
- Level 12: Wprowadź 1 nową wieżę (Cannon Tower)
- Level 13: Wprowadź 1 nową mechanikę (Terrain modifiers)
- Level 14: Kombinuj poprzednie (Spitter + Cannon + Terrain)

**Zasada #2: SAFE PRACTICE SPACE**

Nowa mechanika powinna pojawić się w **łatwym kontekście**:

```
Level 12: Wprowadzenie Cannon Tower (AOE damage)
- Fala 1-3: Standardowe shamblery (gracz testuje nową wieżę bez pressure)
- Fala 4: Horde wave (10+ shamblerów blisko siebie) → AHA MOMENT!
  → Gracz widzi "Cannon jest super vs hordes!"
- Fala 5-10: Mix (gracz decyduje KIEDY Cannon jest lepszy)
```

**Zasada #3: FAIL FORWARD**

Jeśli gracz przegra, powinien:
- ✅ Wiedzieć CO poszło nie tak
- ✅ Mieć **plan** jak poprawić ("Następnym razem zbuduję Cannon wcześniej")
- ✅ Retry z nową wiedzą = **lepszy wynik** (learning!)

❌ **BAD:** "Trial and error hell" (gracz nie wie jak improve)

---

### 5. 🔁 RETENTION HOOKS - "Just One More Level..."

**Daily Hooks** (krótkoterminowa retencja):

✅ **Cliffhanger endings**
```
Koniec Level 11:
"Pokonaliście pierwszą falę, ale horda rośnie w siłę.
W głębi miasta słychać coś znacznie większego..."
→ Gracz chce wiedzieć CO jest w Level 12!
```

✅ **"Prawie miałem" moments**
- Gracz zdobył 2★, ale 3★ było "tak blisko!" (18 HP zostało, potrzeba było 18 HP)
→ "Spróbuję jeszcze raz, na pewno dam radę 3★!"

✅ **Progress visibility**
- Progress bar: "14/17 kampanii" (so close to end!)
- Unlock preview: "Level 16: ??? (unlock by completing Level 15)"

**Long-Term Hooks** (długoterminowa retencja):

✅ **Collection / Completionism**
- Bestiary: "Unlock all enemy types" (10/15 discovered)
- Achievements: "3-star all easy levels"

✅ **Mastery Challenge**
- "Can you 3-star Level 17?" (only 5% of players did it!)
- Speedrun leaderboards

✅ **Variety**
- Każdy level unikalny (nie nudzi się)
- Różne strategie viable (replay value)

---

### 6. ♿ ACCESSIBILITY - Design dla Wszystkich

**Difficulty Tiers:**
- **Easy Mode:** Economy ratio 2.0+ (dużo marginesu błędu, casual players)
- **Medium Mode:** Economy ratio 1.5 (wymaga planowania, core audience)
- **Hard Mode:** Economy ratio 1.2 (perfekcja, hardcore players)

**Quality of Life:**
- ✅ **Pause podczas budowania** (gracz może myśleć bez pressure)
- ✅ **Speed control** (1x / 2x dla experienced players)
- ✅ **Tower range preview** (hover nad construction spot → pokazuje zasięg)
- ✅ **Undo last action?** (opcjonalne - w pierwszych 3 sekundach)

**Tutorialization:**
- Level 11 (pierwszy nowy poziom) powinien mieć **subtle hints**
- Nie intrusive popups, ale gentle guidance
- "Pro tip: Spitters attack from range - prioritize them!"

---

### 📋 UX VALIDATION CHECKLIST

Dla każdej lokacji (11-17) sprawdź:

#### Emotional Flow
- [ ] Fale 1-3: Gracz czuje confidence building?
- [ ] Fale 4-7: Tension rośnie stopniowo (nie skokowo)?
- [ ] Fale 8-10: Epic climax który jest hard ale achievable?

#### Frustration Check
- [ ] Brak unfair deaths (instant kills, invisible mechanics)?
- [ ] Jasny feedback dlaczego gracz przegrał?
- [ ] Każda porażka = learning opportunity (fail forward)?
- [ ] Brak noob traps (false choices)?

#### Satisfaction Check
- [ ] Micro-rewards co 10-30s (scrap, kills, progress)?
- [ ] Macro-rewards na końcu (stars, unlocks, progress bar)?
- [ ] Sukces czuje się earned not lucky?
- [ ] Jest replay value (multiple viable strategies)?

#### Learning Curve
- [ ] Maksymalnie jedna nowa mechanika per level?
- [ ] Nowa mechanika ma safe practice space (łatwe intro)?
- [ ] Complexity rośnie stopniowo, nie exponentially?

#### Retention
- [ ] Koniec poziomu zachęca do next level (cliffhanger / unlock preview)?
- [ ] Jest "prawie miałem 3★" challenge (close call motivates retry)?
- [ ] Poziom jest unikalny, nie generic copy-paste?

---

## ZASADY EKONOMII GRY - Economy Design Rules

Economy design jest fundamentem balansu tower defense. Złą ekonomię = niegrywalny poziom.

### 💰 Economy Ratio - Kluczowa Metryka

**Economy Ratio** = Total Available Scrap / Minimum Viable Defense Cost

```
Economy Ratio = (Starting Scrap + Enemy Scrap + Wave Bonuses) / (Min Tower Investment)
```

**Target ratios dla poziomów trudności:**
- **Easy (1.8 - 2.2)**: Gracz może zrobić 1-2 błędy i nadal wygrać
- **Medium (1.4 - 1.6)**: Wymaga dobrego planowania, 1 błąd = trudniej ale możliwe
- **Hard (1.1 - 1.3)**: Prawie zero marginesu błędu, wymaga near-perfect play

### 📊 Jak Obliczyć Economy Ratio - Przykład

**Przykład: Level 11 (Easy)**

**Krok 1: Określ Minimum Viable Defense**
```
Analiza: Ile wież potrzeba żeby przeżyć wszystkie 10 fal?
- Przy obecnym max DPS (37.5) i długości ścieżki (8 waypoints)
- Potrzeba: 4 wieże lvl 2 (dobra coverage + wystarczający DPS)

Koszt:
- 4 wieże × 100 scrap build = 400 scrap
- 4 wieże × 75 scrap upgrade (lvl 1→2) = 300 scrap
- TOTAL minimum investment = 700 scrap
```

**Krok 2: Określ Target Economy Ratio**
```
Easy mode → target ratio 1.8
Total scrap needed = 700 × 1.8 = 1260 scrap
```

**Krok 3: Rozłóż na Źródła**
```
Starting scrap: 200
Wave bonuses: 10 waves × 25 scrap = 250
From enemies: 1260 - 200 - 250 = 810 scrap
```

**Krok 4: Zaprojektuj Enemy Composition**
```
810 scrap / średnia reward (załóżmy 10 scrap per enemy) = ~81 enemies total
81 enemies / 10 waves = ~8 enemies per wave (average)

Design fal:
- Fale 1-3: 5-6 enemies (light intro)
- Fale 4-7: 8-10 enemies (ramp up)
- Fale 8-10: 10-12 enemies (climax)
```

### 🔧 Economy Design Checklist

Dla każdej lokacji sprawdź:

- [ ] **Total available scrap** obliczony (starting + enemies + waves)
- [ ] **Minimum viable defense** określony (ile wież i jakich poziomów?)
- [ ] **Economy ratio** mieści się w target range dla difficulty
- [ ] **Perfect play surplus** = ratio > 1.0 (gracz może zarobić więcej niż minimum)
- [ ] **Margin for error** = (ratio - 1.0) × 100% (np. ratio 1.8 = 80% margin)

### 💡 Economy Design Tips

1. **Dont frontload zbyt mocno**: Jeśli starting scrap = 90% budżetu, early mistakes = instant loss
2. **Wave rewards matter**: 10 waves × 25 = 250 scrap (znaczący % budżetu)
3. **Early wave bonus (15 scrap) exists**: Gracze go używają → uwzględ to w budżecie
4. **Sell towers (50% value)**: Gracz może "pivot" strategię - daj na to przestrzeń

---

## ZASADY BALANSU DPS/HP - Time-to-Kill Guidelines

**Problem:** Jeśli wrogowie mają za dużo HP vs tower DPS → niegrywalny (wrogowie przechodzą)
**Rozwiązanie:** Projektuj HP wrogów bazując na Time-to-Kill (TTK)

### ⏱️ Time-to-Kill (TTK) Formula

```
TTK = Enemy HP / Tower DPS

Albo odwrotnie:
Enemy HP = TTK × Tower DPS
```

**Obecny maksymalny DPS w grze:**
- Lookout Post Level 3: 25 damage × 1.5 fire rate = **37.5 DPS**

### 🎯 Target TTK Ranges dla Typów Wrogów

| Tier Wroga | Target TTK | HP Range (vs 37.5 DPS) | Przykłady |
|------------|------------|------------------------|-----------|
| **Light** | 0.8 - 2.5s | 30 - 95 HP | Fast scouts, weak zombies |
| **Medium** | 2.5 - 6.0s | 95 - 225 HP | Standard zombies, soldiers |
| **Heavy** | 6.0 - 15s | 225 - 560 HP | Armored, mini-bosses |
| **Boss** | 15 - 30s | 560 - 1125 HP | Level finale bosses |

### 📐 Przykłady Obliczenia HP Nowych Wrogów

**Przykład 1: "Spitter" (Medium-tier ranged zombie)**
```
Design goal: Medium tier, powinien być priority target
Target TTK: 3 sekundy (1 tower lvl 2 może zabić w rozsądnym czasie)
Max DPS: 37.5
HP = 3 × 37.5 = 112 HP (zaokrąglamy do 110 HP)

Weryfikacja:
- 1 tower lvl 1 (10 DPS): TTK = 110/10 = 11s (za długo - trzeba upgrade)
- 1 tower lvl 2 (18 DPS): TTK = 110/18 = 6.1s (ok)
- 1 tower lvl 3 (37.5 DPS): TTK = 110/37.5 = 2.9s (ideal)
```

**Przykład 2: "Bloater" (Heavy-tier explosive zombie)**
```
Design goal: Heavy, slow, dangerous (explodes on death)
Target TTK: 10 sekund (wymaga focus fire)
HP = 10 × 37.5 = 375 HP

Speed: 0.5 (bardzo wolny, żeby gracz miał czas zabić)
Damage: 3 (niskie, bo główne zagrożenie = explosion)
Special ability: On death → AOE 1.5 radius, 5 damage
```

### 🔍 DPS Requirements Per Wave

Przy projektowaniu fal, oblicz **total HP** i sprawdź czy gracze mają wystarczający DPS:

```
Fala 7: 10 Shamblers (50 HP) + 5 Runners (35 HP) + 2 Brutes (250 HP)
Total HP = (10 × 50) + (5 × 35) + (2 × 250) = 500 + 175 + 500 = 1175 HP

Przy 4 wieżach lvl 2 (18 DPS each) = 72 DPS total
Time to kill całą falę = 1175 / 72 = 16.3 sekundy

Path length: 8 waypoints × 2 tiles each = 16 tiles
Slowest enemy (Brute): speed 0.6 → czas przejścia = 16 / 0.6 = 26.7s

Margin: 26.7s available - 16.3s needed = 10.4s buffer ✅ (SAFE)
```

### ⚠️ Path Length Impact on TTK

**Dłuższa ścieżka** = więcej czasu na zabijanie = można dać wrogom więcej HP

```
Adjustment formula:
Adjusted HP = Base HP × (Path Length / 8)

Przykład:
- Base HP (for 8 waypoints): 110 HP
- Your path: 12 waypoints
- Adjusted HP = 110 × (12/8) = 165 HP
```

### ✅ DPS/HP Balance Checklist

Dla każdego nowego wroga:
- [ ] TTK mieści się w target range dla swojego tier'a
- [ ] HP skaluje się odpowiednio do długości ścieżki
- [ ] Gracz z minimum viable defense może zabić wszystkich przed bazą
- [ ] Boss enemies wymagają focus fire ale są killable

---

## METRYKA TRUDNOŚCI - Difficulty Score Formula

Potrzebujemy **obiektywnej metryki** żeby zmierzyć czy poziom jest easy/medium/hard.

### 📊 Difficulty Score Formula

```
Difficulty Score =
    (Total Enemy HP × Average Enemy Speed × Enemy Damage Modifier) /
    (Available DPS × Path Length × Economy Ratio)

Gdzie:
- Total Enemy HP = suma HP wszystkich wrogów we wszystkich falach
- Average Enemy Speed = średnia prędkość wrogów (ważona ilością)
- Enemy Damage Modifier = średnie obrażenia wrogów / 1 (normalizacja)
- Available DPS = DPS który gracz może zbudować z economy
- Path Length = ilość waypoints (dłuższy = więcej czasu)
- Economy Ratio = jak dużo scrap dostępne vs potrzebne
```

### 🎯 Target Difficulty Scores

| Level | Difficulty Tier | Target Score | Interpretacja |
|-------|-----------------|--------------|---------------|
| 11 | Easy (restart) | 1.2 | Łagodny powrót po level 10 |
| 12 | Easy-Medium | 1.4 | Stopniowy wzrost |
| 13 | Medium | 1.6 | Wymaga planowania |
| 14 | Medium | 1.9 | Challenging |
| 15 | Hard | 2.2 | Trudny, wymaga optimization |
| 16 | Hard | 2.6 | Very hard, near-perfect play |
| 17 | Very Hard (finale) | 3.0+ | Epic boss fight, climax |

**Interpretacja scores:**
- **< 1.0**: Za łatwy (gracz się nudzi)
- **1.0 - 1.5**: Łatwy do średniego (casual players OK)
- **1.5 - 2.0**: Średni (core audience)
- **2.0 - 2.5**: Trudny (wymaga skillów)
- **> 2.5**: Bardzo trudny (hardcore tylko)

### 🧮 Przykład Obliczenia Difficulty Score

**Level 11 - Example Calculation:**

```
Założenia:
- Total Enemy HP: ~4000 HP (across all 10 waves)
- Average Enemy Speed: 1.1 (mix of shamblers, runners)
- Average Enemy Damage: 1.5
- Available DPS: 72 DPS (4 towers lvl 2)
- Path Length: 8 waypoints
- Economy Ratio: 1.8

Difficulty Score = (4000 × 1.1 × 1.5) / (72 × 8 × 1.8)
                 = 6600 / 1036.8
                 = 6.36...

WAIT - to za wysokie! ❌

Problem: Za dużo enemy HP albo za mało available DPS
Adjustment: Zmniejsz Total Enemy HP do 2500

Difficulty Score = (2500 × 1.1 × 1.5) / (72 × 8 × 1.8)
                 = 4125 / 1036.8
                 = 3.98...

Jeszcze za wysokie! ❌

Final adjustment: Zwiększ path length do 10 waypoints

Difficulty Score = (2500 × 1.1 × 1.5) / (72 × 10 × 1.8)
                 = 4125 / 1296
                 = 3.18...

Wciąż wysokie... Zmień enemy composition → mniej damage

Average Enemy Damage: 1.2

Difficulty Score = (2500 × 1.1 × 1.2) / (72 × 10 × 1.8)
                 = 3300 / 1296
                 = 2.55

Jeszcze adjustment: Więcej available DPS (economy)

Available DPS: 90 (gracz może zbudować 5 towers lvl 2)

Difficulty Score = (2500 × 1.1 × 1.2) / (90 × 10 × 1.8)
                 = 3300 / 1620
                 = 2.04

Lepiej, ale target to 1.2 dla easy...

FINAL ITERATION:
- Total Enemy HP: 1500
- Avg Speed: 1.1
- Avg Damage: 1.2
- Available DPS: 90
- Path Length: 10
- Economy: 1.8

Difficulty Score = (1500 × 1.1 × 1.2) / (90 × 10 × 1.8)
                 = 1980 / 1620
                 = 1.22 ✅ TARGET HIT!
```

**Wniosek:** Iteracyjnie dostosowuj parametry aż difficulty score = target

### ✅ Difficulty Validation Checklist

- [ ] Difficulty Score obliczony dla każdej lokacji
- [ ] Score mieści się w target range (± 0.2 tolerancja)
- [ ] Progression curve jest smooth (np. 1.2 → 1.4 → 1.6, nie 1.2 → 2.5 → 1.3)
- [ ] Level 17 (finale) ma najwyższy score (climax)

---

## OGRANICZENIA TECHNICZNE - Co Można i Czego Nie Można

Projektując nowe mechaniki, **musisz pamiętać o ograniczeniach implementacyjnych**.

### ✅ MECHANIKI ŁATWE DO IMPLEMENTACJI (Low Cost)

**Priorytet:** Te mechaniki można dodać bez większej przebudowy kodu

#### 1. Nowe Typy Wież z Różnymi Stats
```typescript
{
  name: "Cannon Tower",
  type: "aoe",  // single_target | aoe | slow
  buildCost: 200,
  levels: [
    { damage: 40, range: 2.5, fireRate: 0.5, splashRadius: 1.5 }
  ]
}
```

**Przykłady:**
- AOE tower (działa jak Lookout ale z splash damage)
- Slow tower (zmniejsza speed wrogów)
- Sniper tower (długi range, wysoki damage, wolny fire rate)

#### 2. Wrogowie ze Specjalnymi Pasywami
```typescript
{
  name: "Bloater",
  abilities: [
    { type: "death_explosion", radius: 1.5, damage: 5 },
    { type: "armor", damageReduction: 0.25 }
  ]
}
```

**Przykłady:**
- Resurrection (respawn once with 50% HP)
- Armor (reduce damage by X%)
- Speed boost (when HP < 50%, speed × 1.5)
- Regeneration (heal 5 HP per second)

#### 3. Modyfikatory Terenu na Construction Spots
```yaml
constructionSpots:
  - id: "spot-1"
    x: 4
    y: 5
    modifiers:
      rangeBonus: 0.5  # +0.5 range
  - id: "spot-2"
    x: 8
    y: 3
    modifiers:
      damageBonus: 1.25  # +25% damage
      costReduction: 0.85  # -15% build cost
```

#### 4. Boss Enemies (Finalne Fale)
```typescript
wave10: {
  enemies: [
    { type: "brute_boss", count: 1 }  // 3x HP, 2x damage
  ]
}
```

#### 5. Wave Modifiers
```typescript
wave5: {
  enemies: [...],
  modifiers: {
    speedMultiplier: 1.3,  // Wszyscy +30% szybsi
    hpMultiplier: 1.2      // Wszyscy +20% HP
  }
}
```

---

### ⚠️ MECHANIKI TRUDNE (Moderate Cost)

**Możliwe, ale wymagają więcej kodu**

#### 1. Nowe Typy Projektyli
- Piercing (przelatuje przez wrogów)
- Homing (sam celuje w wrogów)
- DOT (damage over time - poison, fire)

**Wymaga:** Zmian w projectile system, collision detection

#### 2. Tower Abilities z Cooldownem
```
Przykład: "Artillery Strike"
- Cooldown: 30s
- Effect: AOE 3.0 radius, 100 damage
- Wymaga: UI dla cooldown timer, ability system
```

#### 3. Multi-Path Maps
Dwie ścieżki jednocześnie → wrogowie splitują się

**Wymaga:** Zmian w spawning logic, pathfinding

#### 4. Conditional Spawning
Wrogowie spawnują się w zależności od warunków
```
Jeśli hull < 10 HP → spawn emergency wave
```

---

### ❌ MECHANIKI NIE DO ZAIMPLEMENTOWANIA (High Cost)

**Unikaj - wymagają przepisania architektury**

- ❌ **Weather/Day-Night Cycles** (całkowicie nowy render system)
- ❌ **Flying Enemies** (3D pathfinding, całkowicie nowa mechanika ruchu)
- ❌ **Player-Controlled Hero Units** (gra nie jest RTS)
- ❌ **Real-Time Tower Placement** (obecnie = pre-defined construction spots only)
- ❌ **Destructible Terrain** (zmiana mapy w runtime)
- ❌ **Resource Gathering** (mines, scavengers - nowy system ekonomii)

---

### ✅ Technical Constraints Checklist

Przed zaproponowaniem mechaniki sprawdź:

- [ ] Czy mieści się w kategorii "ŁATWE" lub maksymalnie "TRUDNE"?
- [ ] Czy nie wymaga przepisania core game loop?
- [ ] Czy jest spójna z obecnym UI/UX?
- [ ] Czy można ją opisać w ramach istniejących struktur danych?

---

## FUN FACTOR GUIDELINES - Projektowanie "Funu"

Numbers są ważne, ale **zabawa** jest najważniejsza. Poziom może być perfectly balanced ale nudny.

### 🎢 Zasada #1: PACING - Rhythm of Intensity

Każda lokacja powinna mieć **rhythm**:

```
Fala 1-2:  ▁▁ (Low intensity - gracz buduje)
Fala 3-4:  ▃▄ (Rising - pojawia się challenge)
Fala 5:    ▅  (Peak #1 - mini-climax, nowy enemy type!)
Fala 6-7:  ▄▃ (Breather - gracz dostosowuje strategię)
Fala 8-9:  ▆▇ (Rising to climax)
Fala 10:   █  (PEAK - boss wave!)
```

**BAD pacing:**
```
Wszystkie fale: ▅▅▅▅▅▅▅▅▅▅ (monotonne, męczące)
Lub: ▁▁▁▁▁▁▁▁▁█ (nudne 9 fal, potem instant death)
```

### 🌟 Zasada #2: SIGNATURE MOMENTS

Każda lokacja powinna mieć **1-2 signature moments** - coś unikalnego, zapamiętanego.

**Przykłady signature moments:**

- **Level 11: "Double Trouble"** - Fala 8: Po raz pierwszy 2 Brutes jednocześnie
- **Level 12: "The Horde"** - Fala 6: 30 shamblerów naraz (test AOE damage)
- **Level 13: "Speed Rush"** - Fala 7: 25 runners, zero innych (pure speed challenge)
- **Level 14: "Endless Spawn"** - Fala 10: Wrogowie spawnują się 2x dłużej (60s zamiast 30s)
- **Level 15: "The Gauntlet"** - Wszystkie typy wrogów w każdej fali (no breaks)
- **Level 16: "Last Stand"** - Hull = 10 (zamiast 20), każdy błąd boli
- **Level 17: "The Hive Queen"** - Boss z 3 fazami (HP thresholds zmieniają behavior)

**Signature moment powinien:**
- ✅ Być unikalny dla tej lokacji (nie powtarzać się)
- ✅ Wymagać zmiany strategii (gracz musi think)
- ✅ Być memorable ("Pamiętasz Level 13? Ta fala runnerów była szalona!")

### 🎲 Zasada #3: VARIETY - Mix It Up

**Unikaj monotonii:**

❌ **BAD: 10 Identical Waves**
```
Fala 1: 10 shamblers
Fala 2: 12 shamblers
Fala 3: 14 shamblers
... (gracz zasypia)
```

✅ **GOOD: Varied Composition**
```
Fala 1: 8 shamblers (intro)
Fala 2: 10 shamblers (ramp)
Fala 3: 5 shamblers + 3 runners (mix!)
Fala 4: 15 shamblers (horde test)
Fala 5: 2 brutes (NEW THREAT!)
Fala 6: 8 runners + 5 shamblers (speed challenge)
Fala 7: 2 brutes + 10 shamblers (combo)
Fala 8: 20 runners (pure speed)
Fala 9: 3 brutes + 15 shamblers + 5 runners (chaos)
Fala 10: 1 brute boss (finale)
```

### 💥 Zasada #4: CRESCENDO - Build to Climax

Fala 10 powinna być **najlepsza**, nie tylko "kolejna fala".

**Opcje dla epic finale:**

1. **Boss Fight**
   - 1-2 super wrogów (3-5x HP normalnego brute)
   - Może z adds (boss + 10 shamblers)

2. **Massive Horde**
   - 40-50 wrogów total
   - Mix wszystkich typów
   - Non-stop spawning (60s zamiast 30s)

3. **Multi-Wave Finale**
   - Fala 10 składa się z 3 mini-fal (bez przerwy)
   - Każda mini-fala = inna kompozycja

4. **Survival Mode**
   - Infinite spawn przez 60 sekund
   - Gracz musi przetrwać, nie zabić wszystkich

### 🎯 Zasada #5: MEANINGFUL CHOICES

Gracz powinien mieć **decyzje**, nie tylko "buduj wieże tutaj".

**Przykłady meaningful choices:**

- "Czy zbudować Lookout (single target) czy Cannon (AOE)?"
- "Czy upgrade do lvl 3 czy zbudować 2 nowe lvl 1?"
- "Czy sprzedać tower w słabym miejscu i przenieść zasób?"
- "Czy rozpocząć falę wcześniej za +15 scrap bonus?"

**BAD:** Tylko jedna viable strategy (np. zawsze 4 Lookouts lvl 3 w tych samych miejscach)

**GOOD:** Różne buildy mogą wygrać:
- "Spam build" (10 towers lvl 1)
- "Quality build" (4 towers lvl 3)
- "Mixed build" (2 Cannons + 4 Lookouts)
- "Economy build" (sell & rebuild między falami)

---

### ✅ Fun Factor Checklist

- [ ] Poziom ma **pacing** (rhythm of intensity, nie flatline)
- [ ] Jest **signature moment** (coś unikalnego i memorable)
- [ ] Fale są **varied** (nie 10 kopii tej samej fali)
- [ ] Fala 10 to **climax** (epic finale, nie generic wave)
- [ ] Gracz ma **meaningful choices** (wiele viable strategies)
- [ ] Poziom jest **fair but challenging** (hard ale nie frustrating)

---

## TWOJE ZADANIE: Zaprojektuj 7 Nowych Lokacji

Korzystając ze wszystkich powyższych zasad, zaprojektuj **7 nowych lokacji-poziomów** (level 11-17).

### 📋 Wymagania Ogólne

1. **7 nowych lokacji-poziomów** (będą to poziomy 11-17, kontynuacja po istniejącym level-10)
2. **Każda lokacja ma 10 fal potworów**
3. **Stopniowa progresja trudności** - każda następna lokacja trudniejsza (target difficulty scores: 1.2 → 3.0+)
4. **Nowe mechaniki wprowadzane kumulatywnie** - nowe funkcje dochodzą i zostają
5. **Nowe typy potworów** - min. 4-5 nowych typów, wprowadzane stopniowo
6. **Struktura przejść** - mogą być opcjonalne rozgałęzienia, ale gra pozostaje stosunkowo prosta

### 🗺️ Wymaganie 1: MAPA STRUKTURY LOKACJI

Stwórz **wizualną mapę/diagram** pokazujący:
- Jak gracz przechodzi między 7 nowymi lokacjami
- Czy są rozgałęzienia (opcjonalne ścieżki)?
- Jak lokacje łączą się z obecnym poziomem 10?
- Oznacz poziomy trudności

**Format sugerowany:** Mermaid diagram, ASCII art, lub opisowa mapa tekstowa

**Przykład:**
```
Level 10 (Last Stand)
    ↓
Level 11 (Easy - restart)
    ↓
Level 12 (Easy-Medium)
    ├──→ Level 13A (Medium - path A: urban)
    └──→ Level 13B (Medium - path B: industrial)
    ↓
Level 14 (Medium - both paths converge)
    ↓
Level 15 (Hard)
    ↓
Level 16 (Hard)
    ↓
Level 17 (Very Hard - finale boss)
```

### 🧟 Wymaganie 2: NOWE TYPY POTWORÓW

Zaproponuj **co najmniej 4-5 nowych typów wrogów**.

Dla każdego nowego wroga podaj:
- Nazwę i opis (theme: zombie/post-apocalypse)
- **HP** (oblicz używając TTK formula z sekcji DPS/HP Balance)
- **Prędkość** (speed multiplier)
- **Obrażenia** (damage to hull)
- **Nagroda scrap**
- **Specjalne umiejętności** (jeśli są - patrz Technical Constraints)
- **W której lokacji pojawia się po raz pierwszy**

**WAŻNE:** Przestrzegaj TTK ranges:
- Light: 0.8-2.5s → HP: 30-95
- Medium: 2.5-6.0s → HP: 95-225
- Heavy: 6-15s → HP: 225-560
- Boss: 15-30s → HP: 560-1125

### 🎮 Wymaganie 3: NOWE MECHANIKI

Zaproponuj nowe mechaniki zgodnie z **Technical Constraints** (priorytet = ŁATWE do implementacji).

Dla każdej mechaniki określ:
- Nazwę i opis
- W której lokacji się pojawia
- Jak wpływa na gameplay
- Parametry konfiguracyjne

**Przykłady:** Nowe typy wież (AOE, Sniper), modyfikatory terenu, boss abilities

### 📊 Wymaganie 4: SZCZEGÓŁOWA KONFIGURACJA LOKACJI

Dla **każdej z 7 lokacji** (11-17) zaprojektuj:

#### A. Podstawowe Informacje
- ID (np. "level-11")
- Numer (11-17)
- Nazwa (klimatyczna, fabularnie pasująca)
- Opis fabuły (2-3 zdania)
- Poziom trudności (easy/medium/hard)

#### B. Parametry Mapy
- Rozmiar siatki (width × height)
- Ilość waypoints (punktów ścieżki) - **OPISOWO** (np. "8 waypoints forming S-curve")
- Ilość construction spots (5-12)
- Opis ścieżki (np. "spirala", "podwójna ścieżka")
- Specjalne cechy terenu (jeśli są)

#### C. Konfiguracja 10 Fal
Dla każdej z 10 fal określ:
- Numer fali
- Skład wrogów (typ + ilość)
- Opóźnienie spawnu (spawn delay w sekundach)
- Ewentualne specjalne wydarzenia

#### D. Zasoby i Balans
- Starting scrap
- Starting hull
- Economy ratio (oblicz!)
- Difficulty score (oblicz!)
- Wymagania na gwiazdki (1★, 2★, 3★)

#### E. Signature Moment
Opisz unikalny "signature moment" tej lokacji (patrz Fun Factor Guidelines)

---

## YAML - STRUKTURA KONFIGURACYJNA + REGUŁY + PRZYKŁADY

Poniżej znajdziesz **kompletną strukturę YAML** z:
1. **Schema** - jak wygląda struktura
2. **Reguły i formuły** - jak obliczać wartości
3. **Przykłady** - level-11 i level-12 jako reference

---

### 📐 YAML SCHEMA - Struktura Pliku

```yaml
# ============================================================================
# GAME CONFIG - ZOMBIE TOWER DEFENSE
# Konfiguracja dla 7 nowych lokacji (level 11-17)
# ============================================================================

# ----------------------------------------------------------------------------
# SEKCJA 1: METRYKI TRUDNOŚCI (Difficulty Targets)
# ----------------------------------------------------------------------------
difficultyTargets:
  # Target Difficulty Score dla każdej lokacji
  # Formula: (Total Enemy HP × Avg Speed × Avg Damage) / (Available DPS × Path Length × Economy Ratio)
  level-11:
    targetScore: 1.2
    tier: "easy"
  level-12:
    targetScore: 1.4
    tier: "easy-medium"
  level-13:
    targetScore: 1.6
    tier: "medium"
  level-14:
    targetScore: 1.9
    tier: "medium"
  level-15:
    targetScore: 2.2
    tier: "hard"
  level-16:
    targetScore: 2.6
    tier: "hard"
  level-17:
    targetScore: 3.0
    tier: "very-hard"

# ----------------------------------------------------------------------------
# SEKCJA 2: ZASADY BALANSU (Balance Rules)
# ----------------------------------------------------------------------------
balanceRules:
  # DPS Guidelines
  dpsGuidelines:
    currentMaxDPS: 37.5  # Lookout Post level 3 (25 dmg × 1.5 fire rate)

    # Time-to-Kill ranges dla różnych tier'ów wrogów
    ttkRanges:
      light:
        minSeconds: 0.8
        maxSeconds: 2.5
        hpRange: [30, 95]  # Przy 37.5 DPS
      medium:
        minSeconds: 2.5
        maxSeconds: 6.0
        hpRange: [95, 225]
      heavy:
        minSeconds: 6.0
        maxSeconds: 15.0
        hpRange: [225, 560]
      boss:
        minSeconds: 15.0
        maxSeconds: 30.0
        hpRange: [560, 1125]

  # Path Length Impact
  pathLengthAdjustment:
    basePathLength: 8  # waypoints
    # Formula: Adjusted HP = Base HP × (Actual Path Length / Base Path Length)
    example:
      baseHP: 110
      actualPathLength: 12
      adjustedHP: 165  # 110 × (12/8)

# ----------------------------------------------------------------------------
# SEKCJA 3: ZASADY EKONOMII (Economy Rules)
# ----------------------------------------------------------------------------
economyRules:
  # Target Economy Ratios
  economyRatios:
    easy:
      min: 1.8
      max: 2.2
      description: "Gracz może zrobić 1-2 błędy"
    medium:
      min: 1.4
      max: 1.6
      description: "Wymaga dobrego planowania"
    hard:
      min: 1.1
      max: 1.3
      description: "Near-perfect play required"

  # Scrap Sources
  scrapSources:
    waveCompletion: 25  # Bonus za ukończenie fali
    earlyStartBonus: 15  # Bonus za ręczne rozpoczęcie fali
    totalWaves: 10

    # Obliczenie total scrap:
    # Total = Starting Scrap + (All Enemy Rewards) + (Wave Bonuses)
    # Wave Bonuses = totalWaves × waveCompletion = 10 × 25 = 250

  # Minimum Viable Defense Calculation
  minimumViableDefense:
    example:
      towers: 4
      level: 2
      buildCost: 100  # per tower
      upgradeCost: 75  # level 1 → 2
      totalCost: 700  # (4 × 100) + (4 × 75)

# ----------------------------------------------------------------------------
# SEKCJA 4: KONFIGURACJA WROGÓW (Enemies)
# ----------------------------------------------------------------------------
enemies:
  # Istniejące wrogowie (dla referencji)
  shambler:
    baseHealth: 50
    speed: 1.0
    damage: 1
    scrapReward: 5
    tier: "light"
    abilities: []

  runner:
    baseHealth: 35
    speed: 1.8
    damage: 1
    scrapReward: 7
    tier: "light"
    abilities: []

  brute:
    baseHealth: 250
    speed: 0.6
    damage: 5
    scrapReward: 20
    tier: "heavy"
    abilities: []

  # ========== NOWI WROGOWIE (DO ZAPROJEKTOWANIA) ==========
  #
  # TEMPLATE - użyj poniższego formatu dla nowych wrogów:
  #
  # new_enemy_name:
  #   baseHealth: <number>  # Oblicz: TTK × 37.5 DPS
  #   speed: <number>       # Multiplier (1.0 = standard)
  #   damage: <number>      # Damage to hull
  #   scrapReward: <number> # Wyższe HP = wyższa reward (proporcja ~1:10)
  #   tier: "light" | "medium" | "heavy" | "boss"
  #   abilities: []         # Lista abilities (patrz poniżej)
  #   introducedIn: "level-XX"  # Pierwsza lokacja
  #   description: "..."
  #
  # EXAMPLE ABILITIES:
  # abilities:
  #   - type: "death_explosion"
  #     radius: 1.5
  #     damage: 5
  #   - type: "armor"
  #     damageReduction: 0.25
  #   - type: "resurrection"
  #     respawnHP: 0.5  # 50% HP
  #   - type: "speed_boost"
  #     threshold: 0.5  # when HP < 50%
  #     speedMultiplier: 1.5
  #   - type: "regeneration"
  #     hpPerSecond: 5

# ----------------------------------------------------------------------------
# SEKCJA 5: KONFIGURACJA WIEŻ (Towers)
# ----------------------------------------------------------------------------
towers:
  # Istniejąca wieża
  lookout_post:
    type: "single_target"
    buildCost: 100
    sellValueMultiplier: 0.5  # 50% zwrotu
    levels:
      - level: 1
        damage: 10
        range: 3.0
        fireRate: 1.0
        upgradeCost: null
      - level: 2
        damage: 15
        range: 3.25
        fireRate: 1.2
        upgradeCost: 75
      - level: 3
        damage: 25
        range: 3.5
        fireRate: 1.5
        upgradeCost: 175

  # ========== NOWE WIEŻE (DO ZAPROJEKTOWANIA) ==========
  #
  # TEMPLATE:
  #
  # new_tower_name:
  #   type: "single_target" | "aoe" | "slow" | "sniper"
  #   buildCost: <number>
  #   sellValueMultiplier: 0.5
  #   introducedIn: "level-XX"
  #   description: "..."
  #   levels:
  #     - level: 1
  #       damage: <number>
  #       range: <number>
  #       fireRate: <number>
  #       # Dla AOE towers:
  #       splashRadius: <number>  # optional
  #       splashDamagePercent: <0.0-1.0>  # optional
  #       # Dla Slow towers:
  #       slowPercent: <0.0-1.0>  # optional
  #       slowDuration: <seconds>  # optional
  #       upgradeCost: null
  #     - level: 2
  #       # ... itd

# ----------------------------------------------------------------------------
# SEKCJA 6: MNOŻNIKI TRUDNOŚCI PER LOKACJA (Location Difficulty Multipliers)
# ----------------------------------------------------------------------------
locationDifficultyMultipliers:
  level-11:
    enemyHealthMultiplier: 1.0   # Bazowe HP
    enemyDamageMultiplier: 1.0   # Bazowe damage
    scrapMultiplier: 1.0         # Bazowe rewards
  level-12:
    enemyHealthMultiplier: 1.15  # +15% HP
    enemyDamageMultiplier: 1.05  # +5% damage
    scrapMultiplier: 1.0
  # ... reszta lokacji (stopniowe zwiększanie)

# ----------------------------------------------------------------------------
# SEKCJA 7: KONFIGURACJA LOKACJI (Locations 11-17)
# ----------------------------------------------------------------------------
locations:
  # ========== LEVEL 11 - PRZYKŁAD (PEŁNA KONFIGURACJA) ==========
  level-11:
    # Podstawowe info
    id: "level-11"
    number: 11
    name: "The Outskirts"
    description: "Dotarliście do przedmieść miasta. Wydawało się puste, ale z ciemności wyłaniają się setki głodnych oczu..."
    difficulty: "easy"

    # Metryki
    targetDifficultyScore: 1.2
    targetEconomyRatio: 1.8

    # Mapa
    mapConfig:
      width: 18
      height: 12
      tileSize: 48
      waypointsDescription: "8 waypoints forming gentle S-curve (easy path)"
      constructionSpots: 7
      pathComplexity: "low"

      # Terrain modifiers (opcjonalne)
      terrainModifiers: []

    # Zasoby
    resources:
      startingScrap: 200
      startingHull: 20

    # Signature Moment
    signatureMoment:
      wave: 8
      description: "Double Brute assault - pierwszy raz 2 Brutes jednocześnie"

    # Konfiguracja 10 fal
    waves:
      - waveNumber: 1
        enemies:
          - type: "shambler"
            count: 6
        spawnDelay: 1.8
        description: "Gentle intro"

      - waveNumber: 2
        enemies:
          - type: "shambler"
            count: 8
        spawnDelay: 1.6

      - waveNumber: 3
        enemies:
          - type: "shambler"
            count: 5
          - type: "runner"
            count: 3
        spawnDelay: 1.5
        description: "First mix"

      - waveNumber: 4
        enemies:
          - type: "shambler"
            count: 10
        spawnDelay: 1.4
        description: "Horde test"

      - waveNumber: 5
        enemies:
          - type: "shambler"
            count: 6
          - type: "runner"
            count: 5
        spawnDelay: 1.3
        description: "Rising tension"

      - waveNumber: 6
        enemies:
          - type: "runner"
            count: 10
        spawnDelay: 1.2
        description: "Speed challenge"

      - waveNumber: 7
        enemies:
          - type: "shambler"
            count: 8
          - type: "runner"
            count: 4
          - type: "brute"
            count: 1
        spawnDelay: 1.2
        description: "Breather before climax"

      - waveNumber: 8
        enemies:
          - type: "shambler"
            count: 10
          - type: "brute"
            count: 2
        spawnDelay: 1.0
        description: "SIGNATURE: Double Brute!"

      - waveNumber: 9
        enemies:
          - type: "runner"
            count: 12
          - type: "shambler"
            count: 6
        spawnDelay: 1.0
        description: "Final ramp"

      - waveNumber: 10
        enemies:
          - type: "brute"
            count: 1
          - type: "runner"
            count: 8
          - type: "shambler"
            count: 10
        spawnDelay: 0.8
        description: "FINALE: Mixed chaos"

    # Economy calculations (dla walidacji)
    economyCalculation:
      minimumViableDefense: 700  # 4 towers lvl 2
      totalEnemyScrap: 0  # TODO: oblicz (suma wszystkich enemies × rewards)
      waveBonuses: 250  # 10 × 25
      totalAvailableScrap: 0  # starting + enemy + wave bonuses
      calculatedEconomyRatio: 0  # total / minimum

    # Difficulty calculation (dla walidacji)
    difficultyCalculation:
      totalEnemyHP: 0  # TODO: oblicz
      avgEnemySpeed: 0  # TODO: oblicz (ważona średnia)
      avgEnemyDamage: 0  # TODO: oblicz
      availableDPS: 90  # 5 towers lvl 2 = 5 × 18
      pathLength: 8
      economyRatio: 1.8
      calculatedDifficultyScore: 0  # TODO: oblicz

    # Star requirements
    starRequirements:
      oneStar:
        type: "complete"
      twoStar:
        type: "hull"
        value: 60  # 60% HP remaining
      threeStar:
        type: "hull"
        value: 90  # 90% HP remaining

  # ========== LEVEL 12 - TEMPLATE (DO WYPEŁNIENIA) ==========
  level-12:
    id: "level-12"
    number: 12
    name: "TBD"  # TODO: Nadaj nazwę
    description: "TBD"  # TODO: Opis fabularny
    difficulty: "easy-medium"

    targetDifficultyScore: 1.4
    targetEconomyRatio: 1.7

    mapConfig:
      width: 18
      height: 12
      waypointsDescription: "TBD"  # TODO: Opisz ścieżkę
      constructionSpots: 7

    resources:
      startingScrap: 180  # Mniej niż level 11
      startingHull: 20

    signatureMoment:
      wave: 6
      description: "TBD"  # TODO: Opisz signature moment

    waves: []  # TODO: Zaprojektuj 10 fal

    starRequirements:
      oneStar:
        type: "complete"
      twoStar:
        type: "hull"
        value: 55
      threeStar:
        type: "hull"
        value: 85

  # ========== LEVELS 13-17 - TEMPLATES ==========
  # TODO: Wypełnij analogicznie jak level-11 i level-12

# ----------------------------------------------------------------------------
# SEKCJA 8: UX GUIDELINES (Player Experience)
# ----------------------------------------------------------------------------
uxGuidelines:
  # Frustration points do uniknięcia
  frustrationPrevention:
    - "No unfair deaths (always preview next wave)"
    - "No RNG (deterministic gameplay)"
    - "Clear feedback on failure"
    - "Forgiving economy (1-2 mistakes OK)"

  # Satisfaction triggers
  satisfactionTriggers:
    micro:
      - "+scrap notifications"
      - "Tower upgrade power spike"
      - "Wave completion popup"
    macro:
      - "Star rating"
      - "Unlock new content"
      - "Progress bar"

  # Pacing guidelines
  pacing:
    waves1to3: "Low intensity - confidence building"
    waves4to7: "Rising tension - strategic decisions"
    waves8to10: "Climax - peak intensity + relief"

# ============================================================================
# KONIEC PLIKU YAML
# ============================================================================
```

---

### 📝 INSTRUKCJE WYPEŁNIANIA YAML

**Krok 1:** Zaprojektuj nowe typy wrogów
- Dodaj do sekcji `enemies`
- Oblicz HP używając TTK formula
- Określ tier, speed, damage, reward

**Krok 2:** Zaprojektuj nowe wieże (jeśli są)
- Dodaj do sekcji `towers`
- Określ type, stats, upgrade path

**Krok 3:** Dla każdej lokacji (11-17):
- Wypełnij basic info (name, description, difficulty)
- Określ starting scrap (malejący trend)
- Zaprojektuj 10 fal (pamiętaj o pacing!)
- Oblicz economy metrics
- Oblicz difficulty score
- Zdefiniuj signature moment

**Krok 4:** Walidacja
- Sprawdź czy wszystkie difficulty scores są w target range
- Sprawdź czy economy ratios są OK
- Sprawdź czy progression curve jest smooth

---

## SUCCESS CRITERIA - Jak Ocenić Czy Design Jest Dobry?

Przed finalizacją designu, sprawdź czy spełnia **success criteria**:

### ✅ Metryki Techniczne

1. **Difficulty Scores** są w target range (±0.2 tolerancja):
   - Level 11: 1.2 ± 0.2
   - Level 12: 1.4 ± 0.2
   - Level 13: 1.6 ± 0.2
   - Level 14: 1.9 ± 0.2
   - Level 15: 2.2 ± 0.2
   - Level 16: 2.6 ± 0.2
   - Level 17: 3.0 ± 0.2

2. **Economy Ratios** są w target range:
   - Easy levels (11-12): 1.8 - 2.2
   - Medium levels (13-14): 1.4 - 1.6
   - Hard levels (15-17): 1.1 - 1.3

3. **TTK dla wszystkich wrogów** mieści się w ranges:
   - Light: 0.8-2.5s
   - Medium: 2.5-6.0s
   - Heavy: 6-15s
   - Boss: 15-30s

4. **Progression Curve** jest smooth:
   - Difficulty scores rosną stopniowo (nie skok z 1.2 → 2.5)
   - Economy ratios spadają stopniowo
   - Starting scrap maleje stopniowo

### ✅ Jakość Designu

5. **Variety**: Każda lokacja jest unikalna
   - Różne wave compositions (nie copy-paste)
   - Unikalne signature moments
   - Różne map layouts

6. **Pacing**: Każda lokacja ma emotional arc
   - Waves 1-3: Low intensity
   - Waves 4-7: Rising tension
   - Waves 8-10: Climax

7. **Meaningful Choices**: Multiple viable strategies
   - Nie tylko jedna "meta" strategia
   - Różne tower buildy mogą wygrać
   - Trade-offs są interesujące

8. **Fair but Challenging**:
   - Gracz ma czas na reakcję
   - Brak unfair deaths
   - Defeat = learning opportunity

---

## PRZYKŁADY ZŁYCH DESIGNÓW - Anty-Wzorce

**Unikaj tych błędów!**

### ❌ BAD DESIGN #1: "HP Sponge Level"

```
Level 15:
  Wave 10: 1 wróg z 50,000 HP
```

**Problem:**
- TTK = 50000 / 37.5 = 1333 sekundy (22 minuty!)
- Nudny, nie wymaga skillów, tylko czekanie
- Gracz się frustruje

**FIX:** Boss powinien mieć 560-1125 HP (15-30s TTK)

---

### ❌ BAD DESIGN #2: "Impossible Economics"

```
Level 12:
  Starting scrap: 50
  Minimum viable defense: 700 scrap
  Total enemy scrap: 200
  Economy ratio: (50 + 200 + 250) / 700 = 0.71
```

**Problem:**
- Ratio < 1.0 = niemożliwe do wygrania
- Gracz nie ma szans nawet przy perfect play

**FIX:** Zwiększ starting scrap lub enemy rewards żeby ratio >= 1.1

---

### ❌ BAD DESIGN #3: "10 Identical Waves"

```
Level 13:
  Każda fala: 15 shamblers, 5 runners
```

**Problem:**
- Monotonny, zero variety
- Gracz zasypia
- Brak signature moment

**FIX:** Varied composition + signature moment (patrz Fun Factor Guidelines)

---

### ❌ BAD DESIGN #4: "Speed Wall"

```
Level 14:
  Wrogowie: 30 runners (speed 1.8)
  Path length: 5 waypoints
  Time available: 5 / 1.8 = 2.8 sekundy
```

**Problem:**
- Gracz nie ma czasu na zabicie (nawet z max DPS)
- Instant loss, unfair

**FIX:** Dłuższa ścieżka (min. 8 waypoints) lub wolniejsze wrogowie

---

### ❌ BAD DESIGN #5: "Noob Trap Tower"

```
New Tower: "Useless Cannon"
  BuildCost: 300
  DPS: 5 (gorsze niż Lookout lvl 1 za 100 scrap!)
```

**Problem:**
- False choice - tower jest zawsze gorsza
- Gracz buduje, traci zasoby, przegrywa
- Frustrujące

**FIX:** Każda wieża powinna być viable w jakimś scenariuszu

---

### ❌ BAD DESIGN #6: "RNG Fiesta"

```
Wave 5: Losowo spawn 5-50 wrogów
```

**Problem:**
- Luck determines winner, nie skill
- Nieconsistent difficulty
- Gracz się frustruje ("poprzednim razem było łatwiej!")

**FIX:** Deterministic spawns (zawsze ta sama ilość)

---

## TESTING CHECKLIST - Pre-Launch Validation

Przed finalizacją designu, przejdź przez ten checklist dla **każdej lokacji**:

### 📊 Metryki i Balans

- [ ] **Time Budget**: Czy gracz ma minimum 30s przed pierwszą falą? (czas na budowanie)
- [ ] **Path Length**: Czy min. 6 waypoints? (więcej = więcej czasu na damage)
- [ ] **Tower Coverage**: Czy można pokryć 80% ścieżki z 4-5 wieżami?
- [ ] **DPS Check**: Czy 4-5 wież lvl 2 mogą zabić wszystkich wrogów w czasie?
- [ ] **Economy Check**: Czy perfect play daje 20%+ surplus scrap?
- [ ] **Fail State**: Czy 1-2 wrogowie dotarli do bazy ≠ instant game over?
- [ ] **Star Requirements**: Czy 3★ jest achievable ale trudne? (target: 10-20% graczy)

### 🎯 Jakość Designu

- [ ] **Unique Identity**: Czy poziom ma coś unikalnego? (nie jest generic)
- [ ] **Signature Moment**: Czy jest memorable "wow" moment?
- [ ] **Pacing**: Czy fale mają rhythm (nie flatline)?
- [ ] **Variety**: Czy wave compositions są różnorodne?
- [ ] **Learning Curve**: Czy nowe mechaniki są well-introduced?
- [ ] **Multiple Strategies**: Czy różne tower buildy są viable?

### 🚫 Frustration Prevention

- [ ] **Brak Unfair Deaths**: Gracz ma time to react?
- [ ] **Brak RNG**: Gameplay jest deterministyczny?
- [ ] **Clear Feedback**: Gracz wie dlaczego przegrał?
- [ ] **Brak Noob Traps**: Pozornie dobre decyzje nie są secretly bad?
- [ ] **Forgiving**: 1-2 błędy ≠ instant loss?

### ✨ Satisfaction Triggers

- [ ] **Micro-Rewards**: Co 10-30s gracz czuje progres?
- [ ] **Macro-Rewards**: Końcowe rewards są satisfying? (stars, unlocks)
- [ ] **Earned Victory**: Sukces czuje się earned, nie lucky?
- [ ] **Replay Value**: Czy chce się grać jeszcze raz? (3-star challenge, different strategy)

---

## FORMAT ODPOWIEDZI

Proszę o przedstawienie projektu w następującej strukturze:

---

### 1. EXECUTIVE SUMMARY

Krótkie podsumowanie (1-2 paragrafy):
- Główna koncepcja 7 nowych lokacji
- Key features (nowi wrogowie, nowe mechaniki)
- Storytelling hook

---

### 2. MAPA STRUKTURY LOKACJI

Diagram pokazujący jak gracz przechodzi przez 7 lokacji.

Format: Mermaid, ASCII art, lub opisowy text

---

### 3. NOWE TYPY POTWORÓW

Tabela wszystkich nowych wrogów:

| Nazwa | HP | Speed | Damage | Scrap | Tier | Abilities | Intro Level |
|-------|-----|-------|--------|-------|------|-----------|-------------|
| ... | ... | ... | ... | ... | ... | ... | ... |

Dla każdego wroga: krótki opis (1-2 zdania) + reasoning

---

### 4. NOWE MECHANIKI

Lista nowych mechanik z opisami:

**Mechanic: [Nazwa]**
- **Introduced in:** Level XX
- **Description:** ...
- **Gameplay Impact:** ...
- **Parameters:** ...

---

### 5. SZCZEGÓŁOWY OPIS LOKACJI

Dla **każdej z 7 lokacji** (11-17):

```
═══════════════════════════════════════════════════════════
LOKACJA [X]: [Nazwa]
═══════════════════════════════════════════════════════════

📌 PODSTAWOWE INFORMACJE
- ID: level-XX
- Number: XX
- Difficulty: [easy/medium/hard]
- Target Difficulty Score: X.X
- Target Economy Ratio: X.X

📖 FABUŁA
[2-3 zdania storytelling]

🗺️ MAPA
- Size: XX × XX
- Waypoints: [opis ścieżki]
- Construction Spots: X
- Special Features: [jeśli są]

💰 ZASOBY
- Starting Scrap: XXX
- Starting Hull: XX

🌟 SIGNATURE MOMENT
Wave X: [opis unikalnego momentu]

⚔️ KONFIGURACJA 10 FAL
[Tabela lub lista opisująca każdą falę]

Wave | Enemies | Spawn Delay | Description
-----|---------|-------------|------------
1    | ...     | X.Xs        | ...
...

📊 METRYKI
- Economy Ratio (calculated): X.XX
- Difficulty Score (calculated): X.XX
- Total Enemy HP: XXXX
- Total Available Scrap: XXXX

⭐ STAR REQUIREMENTS
- 1★: Complete level
- 2★: [wymaganie]
- 3★: [wymaganie]
```

---

### 6. KOMPLETNY PLIK YAML

Pełny YAML config zgodnie z szablonem powyżej, z wypełnionymi wartościami dla wszystkich 7 lokacji.

---

### 7. STORYTELLING - FABUŁA KAMPANII

- **Początek** (Level 11): Jaki jest setup?
- **Rozwój** (Levels 12-16): Jak rozwija się historia?
- **Climax** (Level 17): Jak kończy się kampania?
- **Storytelling hooks**: Jak każdy poziom łączy się z następnym?

---

### 8. VALIDATION REPORT

Dla każdej lokacji potwierdzenie że:
- ✅ Difficulty score in range
- ✅ Economy ratio in range
- ✅ All TTK values valid
- ✅ Progression curve smooth
- ✅ Signature moment defined
- ✅ UX validated

---

## STORYTELLING & FABUŁA - Klamra Narracyjna

Zaprojektuj **fabularną klamrę** łączącą 7 lokacji.

### 📖 Story Arc Guidelines

**Struktura 3-aktowa:**

**AKT 1: SETUP** (Levels 11-12)
- Gracze ukończyli Level 10 (Last Stand) - co dalej?
- Jaki jest nowy cel? Nowe zagrożenie?
- Wprowadzenie nowego antagonisty/threat

**AKT 2: CONFRONTATION** (Levels 13-15)
- Eskalacja zagrożenia
- Gracze dowiadują się więcej o źródle zarazy
- Plot twist? (opcjonalnie)

**AKT 3: RESOLUTION** (Levels 16-17)
- Finalna konfrontacja
- Boss fight (Level 17)
- Zakończenie (happy? bitter-sweet? cliffhanger dla DLC?)

### 🎬 Storytelling Hooks

Każdy poziom powinien kończyć się **hookiem** zachęcającym do next level:

```
Level 11 ending:
"Pokonaliście pierwszą falę, ale w głębi miasta słychać
przerażające wycie. Coś znacznie większego się budzi..."
→ Gracz chce wiedzieć CO to jest!

Level 16 ending:
"Dotarliście do źródła. Gigantyczne gniazdo pulsuje
nienaturalnym życiem. To wasza ostatnia szansa."
→ Setup dla finałowego boss fight w Level 17
```

### 🌍 Tematyka Lokacji

Lokacje powinny mieć **różne motywy środowiskowe**:

Przykłady:
- Urban (miasto)
- Industrial (fabryka, magazyny)
- Residential (osiedle, domy)
- Underground (kanały, metro)
- Laboratory (źródło zarazy?)
- Military Base (opuszczona baza)
- The Hive (finale - gniazdo zombie queen?)

---

## KOŃCOWE WSKAZÓWKI

### 💡 Best Practices

1. **Iteruj**: Pierwszy design nie będzie perfect - dostosowuj po obliczeniach
2. **Balansuj**: Używaj formul (TTK, economy ratio, difficulty score)
3. **Testuj**: Przechodź przez wszystkie checklisty
4. **Think Player-First**: Czy design jest fun? Fair? Memorable?
5. **Document Reasoning**: Wyjaśnij dlaczego podjąłeś decyzje

### 🚀 Gotowy? ZACZYNAJ PROJEKTOWANIE!

Powodzenia w tworzeniu 7 nowych epickich lokacji! 🎮🧟‍♂️

---

**KONIEC PROMPTU**

