VERDICT: CHANGES_REQUESTED

## Prüfumfang

Geprüft wurde der vollständig gemergte Stand des 2D-Endless-Runner-Browserspiels „Ritterlauf“ (Vite, Vanilla JS, HTML5-Canvas, LocalStorage). Relevant sind DSGVO/ePrivacy, EU Cyber Resilience Act, EU AI Act, Pflichttexte und Barrierefreiheit, da es sich um eine öffentliche Web-UI handelt.

---

## 1. DSGVO / ePrivacy

**Befund**
- Verarbeitet werden ausschließlich der numerische Highscore in `localStorage` (`src/storage.js`).
- Es werden keine personenbezogenen Daten erhoben, gespeichert oder übertragen.
- Es gibt keine Cookies, kein Tracking, keine Serverkommunikation und keine Logs.
- Die Speicherung in `localStorage` ist technisch sauber abgesichert (try/catch, Validierung, nur ein Schlüssel `highscore`).
- Einwilligung nach Art. 5 Abs. 3 ePrivacy-RL ist **nicht erforderlich**, da die Speicherung für die vom Nutzer ausdrücklich gewünschte Spielfunktion (Highscore) unbedingt erforderlich ist.

**Anmerkung (niedrig)**
- Es fehlt eine kurze Datenschutzinformation, die transparent macht, dass keine personenbezogenen Daten verarbeitet werden und der Highscore rein lokal im Browser liegt.

**Konkrete Maßnahme**
- Neue Datei `datenschutz.html` anlegen, z. B. mit dem Text:
  > „Es werden keine personenbezogenen Daten verarbeitet. Der Highscore wird ausschließlich lokal in Ihrem Browser gespeichert und nicht an Server übertragen.“
- Sichtbaren Link aus `index.html` auf diese Seite setzen (siehe Abschnitt 4).

---

## 2. EU Cyber Resilience Act (CRA)

**Befund**
- Das Produkt ist eine Software mit digitalen Elementen (Web-Game). Für den sichtbaren Stand fehlen dokumentierte Sicherheitseigenschaften, eine dokumentierte Update-/Patch-Strategie und ein SBOM-Nachweis.
- Positiv: Es gibt keine externen Laufzeitabhängigkeiten; Vite ist nur Dev-Dependency.

**Findings (mittel)**
1. **Fehlende Sicherheitsdokumentation**
   - **Maßnahme:** Neue Datei `SECURITY.md` anlegen mit:
     - Zweck und Sicherheitszielen (kein Netzwerkzugriff, keine personenbezogenen Daten, keine persistenten Serverdaten)
     - Bedrohungsmodell (lokal ausgeführte Canvas-App, keine serverseitigen Angriffspunkte)
     - Update-Konzept: Statische Assets werden bei jedem Deployment ersetzt; Versionierung erfolgt über das Repo.
     - Meldeweg für Sicherheitshinweise (z. B. E-Mail-Adresse des Betreibers).
2. **Kein expliziter SBOM-Nachweis**
   - **Maßnahme:** Die bereits vorhandene `package-lock.json` als minimales SBOM referenzieren. In `README.md` einen Abschnitt „SBOM“ ergänzen, der auf `package-lock.json` verweist und darauf hinweist, dass `vite` die einzige Build-Abhängigkeit ist.
3. **Projektlizenz fehlt**
   - **Maßnahme:** In `package.json` das Feld `license` ergänzen (z. B. `"license": "MIT"` oder eine proprietäre Lizenzangabe), damit die rechtliche Verbreitungsbasis eindeutig ist.

---

## 3. EU AI Act

**Befund**  
Keine KI-Funktion vorhanden. Der AI Act ist daher nicht anwendbar.

---

## 4. Pflichttexte & UI

**Finding (mittel)**
- Es fehlen Impressum und Datenschutzinformation. Für eine öffentliche, geschäftsmäßig angebotene Web-UI in Deutschland/EU sind diese rechtlich erforderlich.
- Ein Cookie-/Consent-Banner ist **nicht** erforderlich, da keine einwilligungspflichtigen Cookies oder Tracking-Techniken verwendet werden.

**Konkrete Maßnahme**
- In `index.html` einen sichtbaren, tastaturbedienbaren Link außerhalb des Canvas ergänzen, z. B.:
  ```html
  <footer class="site-links">
    <a href="/impressum.html">Impressum</a>
    <a href="/datenschutz.html">Datenschutz</a>
  </footer>
  ```
- In `src/style.css` für `.site-links` eine Positionierung ergänzen, die den Spielfluss nicht stört (z. B. fixiert am unteren Rand, kleine Schrift, hoher Kontrast).
- Neue Dateien `impressum.html` und `datenschutz.html` anlegen. Sie müssen ohne Spielstart erreichbar sein und dürfen das Spiel selbst nicht blockieren.

---

## 5. Barrierefreiheit

**Findings**
1. **Hoch:** Sämtliche Texte und Steuerelemente sind ausschließlich in den Canvas gezeichnet. Screenreader und assistive Technologien können sie nicht lesen. Es gibt keine semantischen HTML-Alternativen und keine `aria-live`-Ankündigungen.
   - **Maßnahme:** In `index.html` einen visuell versteckten, aber für Screenreader zugänglichen Bereich ergänzen:
     ```html
     <div id="a11y-live" aria-live="polite" class="visually-hidden"></div>
     ```
     In `src/main.js` oder in den Screen-Modulen (`startScreen.js`, `gameOverScreen.js`, `hud.js`) bei Phasenwechsel und Punktestand den Text in dieses Element schreiben. Alternativ Start- und Game-Over-Screens als DOM-Overlays statt reiner Canvas-Zeichnung umsetzen.
   - Canvas mit `aria-label="Ritterlauf – 2D-Endless-Runner"` versehen.

2. **Mittel:** Das `meta`-Tag in `index.html` verwendet `user-scalable=no`. Das verhindert Zoomen und verstößt gegen WCAG-Erfolgskriterium 1.4.4 (Textgröße anpassbar) und 1.4.10 (Reflow).
   - **Maßnahme:** `user-scalable=no` aus dem Viewport-Meta entfernen (nur `width=device-width, initial-scale=1.0`). Das Spiel bleibt weiter nutzbar; die Steuerung über Pointer/Touch ist davon unabhängig.

3. **Niedrig:** Die Farbkombinationen (insbesondere `--color-muted` `#8a94a3` auf dunklem Kartenhintergrund) sind nicht auf ausreichenden Kontrast geprüft.
   - **Maßnahme:** Kontrast nach WCAG AA prüfen und bei Bedarf hellere Textfarben für Start-/Game-Over-Screen und HUD verwenden.

---

## 6. Sonstige Hinweise

**Finding (niedrig)**
- `src/main.js` exponiert im Produktionscode eine globale Test-API über `window.__TEST_API__`. Dies stellt kein Risiko für personenbezogene Daten dar, ist aber eine unnötige Debug-Schnittstelle.
- **Maßnahme:** Die Definition hinter eine Entwicklungsbedingung legen, z. B.:
  ```js
  if (import.meta.env.DEV) {
    Object.defineProperty(window, '__TEST_API__', { get() { ... } });
  }
  ```

---

## Gesamtbewertung

Es liegen keine fundamentalen Datenschutz- oder Sicherheitsverstöße vor. Der Umgang mit LocalStorage ist datensparsam und technisch robust. Offene Lücken bestehen bei den rechtlichen Pflichttexten, der CRA-Dokumentation und der Barrierefreiheit. Diese sind behebbar und erfordern keine Eingriffe, die die Spielfunktion beeinträchtigen würden.