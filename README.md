# Vape studies

Web-aplikacija i istraživački izvještaj o usporedbi e-cigareta, cigareta i cigara.

## Sadržaj

- `app/` — Astro aplikacija s interaktivnim grafovima i pregledom studija.
- `vuse-report/` — izvorni istraživački izvještaj i grafovi u PNG/SVG formatu.

## Lokalno pokretanje

Potreban je Node.js 22.12 ili noviji.

```sh
cd app
npm ci
npm run dev
```

Otvorite lokalnu adresu koju ispiše Astro.

## Produkcijski build

```sh
cd app
npm run build
npm run preview
```

Build generira statičku stranicu u `app/dist/`. Ta mapa i instalirane ovisnosti ne spremaju se u Git; generiraju se lokalno. Za objavu koristite sadržaj `app/dist/` na statičkom hostingu.

Izvorni sadržaj preuzet je iz arhive `Kimi_Agent_Vuse vs Cigar Comparison Report.zip`.
