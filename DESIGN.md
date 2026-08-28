# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Reduzierte mittelalterliche Arcade-Optik mit kühlem Dämmerhimmel, warmem Pergamentton und rotem Akzent, klar lesbar wie ein simples Pixel-Arcade-Spiel.

## Colors

- `--color-bg`: **#1f2a3a**
- `--color-fg`: **#f4ecd8**
- `--color-accent`: **#c8472e**
- `--color-border`: **#5b6b7f**
- `--color-muted`: **#8a94a3**
- `--color-sky`: **#3b556d**
- `--color-hill_far`: **#6e7b8f**
- `--color-hill_near`: **#5f7f4f**
- `--color-ground`: **#4a3828**
- `--color-ground_top`: **#7fa653**
- `--color-wood`: **#8a5a34**
- `--color-wood_dark`: **#3c2a1c**
- `--color-steel`: **#aab4c2**
- `--color-outline`: **#10141a**
- `--color-danger`: **#e05a3a**

## Typography

- `font_family`: 'Courier New', ui-monospace, Menlo, Consolas, monospace
- `heading_weight`: 700
- `body_weight`: 400
- `size_h1`: 32px
- `size_h2`: 24px
- `size_body`: 16px
- `size_hud`: 18px
- `size_hud_small`: 14px

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button

padding 12px 24px, min-height 48px, min-width 160px, radius md, bg=accent #c8472e, text=fg #f4ecd8, outline 2px #10141a, font-family monospace, weight 700; hover bg #d9563c; active bg #a63a26 plus translateY(1px); disabled opacity 0.55; Touch-Target mindestens 48px.

### Overlay-Karte

padding 24px 32px (mobil 16px), radius lg, bg rgba(15,20,25,0.72), border 1px solid #5b6b7f, max-width 520px, zentriert; optional backdrop-filter blur(2px).

### Sprite: Ritter

Logische Größe 44x56 px, Hitbox 28x44 px. Farben: Rüstung #aab4c2, Rüstungsschatten #5d6878, Helmzier #c8472e, Haut #e8c39e, Kontur #10141a. Silhouette: Helm mit rotem Federbusch, sichtbarer Schildarm, Beine in 2-Frame-Laufzyklus (vorderes/hinteres Bein versetzt, ca. 120 ms pro Frame). Mindestens 3 Töne pro Fläche + 2 px Kontur; keine einfarbigen Rechtecke.

### Sprite: Fass

Logische Größe 36x44 px, Hitbox 30x42 px. Farben: Holz #8a5a34, Fassreifen #3c2a1c, Glanzlicht #c78b4f, Kontur #10141a. Zylinderform mit zwei hellen Dauben, zwei dunklen Reifen und Bodenlinie; 3 Töne + 2 px Kontur.

### Sprite: Zaun

Logische Größe 52x40 px, Hitbox 46x36 px. Farben: Holz #9c6b3f, Pfosten dunkel #6f4a2c, Glanzlicht #c8955f, Kontur #10141a. Zwei spitze Latten, eine Querstrebe, sichtbare Nagelpunkte; 3 Töne + 2 px Kontur.

### Sprite: Boden

Bodenkachel 64 px breit, 72 px hoch, nahtlos wiederholbar. Farben: Erde #4a3828, Tiefe #2f2418, Gras #7fa653, Graslicht #9cc26a, Kontur #10141a. Oben 6-8 px Grasnarbe mit Halmen, darunter dunkle Erdschicht; 3 Töne + Kontur.

### Sprite: Burg-Parallaxe

Ferne Ebene, Scroll-Geschwindigkeit 0.15. Farben: Mauer #6e7b8f, Schatten #4b5667, Fenster #1b2330, Kontur #10141a. Silhouette aus Zinnen, rundem Turm und rechteckigem Bergfried; nahtlos kachelbar, 3 Töne + 2 px Kontur.

### Sprite: Hügel-Parallaxe

Nahe Ebene, Scroll-Geschwindigkeit 0.4. Farben: Wiese #5f7f4f, Schatten #46603c, Licht #7fa653, Kontur #10141a. Zwei sanft gerundete Hügelkuppen pro Kachel, nahtlos wiederholbar; 3 Töne + 2 px Kontur.

### HUD-Spezifikation

Score oben links, Highscore oben rechts. Schrift 'Courier New', 18 px (mobil 14 px), Farbe #f4ecd8, Kontur 2 px #10141a oder halbtransparenter Balken rgba(15,20,25,0.45). Abstand 12 px vom Rand, padding 8x12 px. Highscore ausschließlich per textContent rendern, niemals als HTML.

### Screen-Layout: Start

Vollflächiger Canvas, Hintergrund scrollt langsam. Zentrierte Overlay-Karte max 520 px, bg rgba(15,20,25,0.72), border #5b6b7f, radius lg, padding 24-32 px. Titel 'Ritterlauf' 32 px/700 in #f4ecd8, Untertitel 'Leertaste oder Klick/Touch zum Start' 16 px in #8a94a3, Highscore-Zeile, Button 'Start'.

### Screen-Layout: Game Over

Wie Start-Screen: zentrierte Overlay-Karte, 'Game Over' 24 px/700 in #c8472e, erreichter Score groß in #f4ecd8, Highscore in #8a94a3, Hinweis 'Leertaste/Klick für Neustart', Button 'Neustart'.

### Lesbarkeitsregeln

Vordergrund (Ritter, Hindernisse, HUD) gesättigt/warm und immer mit 2 px Kontur #10141a. Hintergrund (Himmel, Burg, Hügel) entsättigt/kühl und max. 60 % Helligkeit. Ritter kontrastiert gegen Gras: Stahl #aab4c2 gegen #7fa653. Hindernisse warm (#8a5a34/#9c6b3f) gegen kühlen Himmel. HUD-Text immer mit dunklem Scrim hinterlegen.

## Layout Principles

- Logische Spielfläche 960x540 im 16:9-Format; Canvas skaliert per CSS auf maximale Fenstergröße mit Letterboxing, Resize berechnet Spielfläche und Kollisionen neu.
- Overlays zentriert, max-width 520px, Mindestabstand zum Rand 12px.
- Breakpoints: unter 640px HUD 14px, Buttons volle Breite max 320px, Karten-padding 16px; ab 640px HUD 18px, Karten-padding 24-32px.
- Vertikaler Rhythmus innerhalb der Overlays: 8px zwischen Textzeilen, 16px vor Buttons, 24px vor Sektionen.
- Spiel-HUD bleibt außerhalb des zentralen Aktionsbereichs am oberen Rand, damit Ritter und Hindernisse nicht verdeckt werden.
