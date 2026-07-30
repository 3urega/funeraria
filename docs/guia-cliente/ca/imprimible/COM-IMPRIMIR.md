# Versions imprimibles (català)

Aquesta carpeta conté les **guies en format per imprimir** o desar com a PDF.

## Com obrir

1. Obre **`index.html`** amb el navegador (doble clic o arrossegar al Chrome/Edge).
2. Tria una guia individual o la **guia completa** (totes les pàgines seguides).

## Com imprimir o generar PDF

1. Obre la pàgina que vulguis imprimir.
2. **Ctrl+P** (Windows) o **⌘+P** (Mac).
3. Destí: **Desar com a PDF** o impressora.
4. Configuració recomanada:
   - Paper: **A4**
   - Marge: per defecte
   - Escala: **100%**
   - Desactiva capçaleres/peus del navegador si surten URL o data

## Fitxers

| Fitxer | Contingut |
|--------|-----------|
| `index.html` | Portada i índex de totes les guies |
| `guia-completa.html` | Totes les guies en un sol document |
| `acces-admin.html` … `itinerari-demo.html` | Cada guia per separat |
| `_estils-impressio.css` | Estils d'impressió (no cal obrir-lo) |

## Actualitzar després de canvis a les guies

Des de l'arrel del projecte:

```powershell
npm run guia:imprimible:ca
```

Això regenera els HTML des de `docs/guia-cliente/ca/*.md`.

## Consell per lliurar al client

- **Formació general:** imprimeix o envia `guia-completa.pdf` (generat des de `guia-completa.html`).
- **Famílies:** imprimeix només `zona-familiar.html` (1–2 pàgines).
- **Demo amb client:** imprimeix `itinerari-demo.html` com a checklist.
