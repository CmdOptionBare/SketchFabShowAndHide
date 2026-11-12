# Sketchfab Part Lab

Viewer-API Playground: Modelle per URL/Favorit laden, Teile im Hierarchy-Tree zeigen/verstecken, per Klick picken, transformieren, annotieren und inspecten.

## Start

Statisch hosten oder lokal öffnen:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen.

Live (nach Deploy): Vercel-Projekt `sketchfabshowandhide`.

## Features

- Favoriten gruppiert (`Cars/BMW/E46`, `Cars/Fiat`, `Electronics/Apple/Mac Mini`) plus freies URL/UID-Feld
- Scene-Graph Tree mit Show/Hide inkl. Kinder
- Pick-Modi: Auswählen · Show/Hide · Annotieren
- Auswahl-Panel: Solo, Translate/Rotate, Matrix-Reset
- Kamera: Recenter, Focus, Autospin-Emulation, FOV
- Look: Wireframe, Shading, Post-FX, Background, Screenshot
- Materialien highlighten, Annotations setzen/goto/löschen
- `?id=<uid>` Deep-Link

## Hinweis

Die sichtbaren Gruppen kommen aus der Modell-Hierarchie (MatrixTransform-Nodes). Eigene logische Gruppen wären nur UI-seitig möglich.
