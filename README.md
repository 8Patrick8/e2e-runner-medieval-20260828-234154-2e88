# Ritterlauf — 2D-Endless-Runner im Mittelalter-Stil

Ein simples 2D-Endless-Runner-Browserspiel im Mittelalter-Stil: Ein Ritter läuft
automatisch, springt per Leertaste/Klick über prozedural erscheinende Hindernisse
(Fässer und Zäune), das Tempo steigt mit der Zeit, die zurückgelegte Distanz wird
als Punktestand gezählt und der Highscore in LocalStorage gespeichert. Dazu ein
parallax scrollender Hintergrund (Burg, Hügel) sowie Start- und Game-Over-Screen.
Umsetzung mit Vite und Vanilla JS auf HTML5-Canvas ohne Game-Framework.

## Tech-Stack

- **Sprache:** JavaScript (Vanilla, ES-Module)
- **Framework:** keines
- **Build:** Vite
- **Rendering:** HTML5 Canvas 2D
- **Storage:** LocalStorage
- **Testing:** `node --test` (tests/*.test.mjs)

## Installation

Voraussetzung: Node.js (>= 20) und npm.

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Vite startet einen Dev-Server und gibt die URL im Terminal aus (standardmäßig
http://localhost:5173). Das Spiel nutzt ein festes logisches 800×450-
Koordinatensystem; die Canvas skaliert per Letterboxing auf die Fenstergröße.

## Produktion / Build

```bash
npm run build
```

Erzeugt den statischen Build im Ordner `dist/`. Diesen kann man mit einem
beliebigen statischen Server ausliefern, z. B.:

```bash
npm run preview
# oder
py -m http.server --directory dist
```

Die gebaute App liegt unter `dist/index.html`.

## Steuerung

- **Leertaste / Pfeil hoch / W** oder **Klick / Touch**: Spiel starten, springen,
  nach Game Over neu starten.
- Der Ritter springt nur, wenn er auf dem Boden steht (kein Doppelsprung).

## Features

- Spielschleife (`requestAnimationFrame`) mit festem logischen 800×450-System und
  Letterbox-Skalierung, inkl. Handling von Fenstergrößenänderung
- Zustandsmaschine: Start-Screen → Spiel → Game-Over → Neustart
- Automatisch laufender Ritter mit Sprungphysik und Lauf-Animation
- Parallax-Hintergrund (Himmel, Burg, Hügel, Boden)
- Prozedural spawnende Hindernisse (Fässer, Zäune)
- Kollisionserkennung mit sofortigem Game-Over
- Punktestand nach zurückgelegter Distanz, mit der Zeit steigendes Tempo
- Highscore in LocalStorage (Key `highscore`), Anzeige auf Start- und Game-Over-Screen
- Testbarkeit: `window.__TEST_API__` liefert Phase, Geschwindigkeit, Distanz,
  Hindernisanzahl, Spielerposition und Punktestand
