# GitHub Issues (draft workflow)

Repo: **[3urega/funeraria](https://github.com/3urega/funeraria)**  
Remote: `git@github.com:3urega/funeraria.git`

## Flujo en 3 pasos

| Paso | Skill | Qué hace |
|------|-------|----------|
| 1 | `plan-to-issues` | Plan / roadmap → borradores `.md` + `manifest.*.json` aquí |
| 2 | `publish-github-issues` | Sube issues a GitHub con `gh issue create` |
| 3 | `kanban-board` | Lista/planifica/implementa, marca `RD-XXX`, cierra issue, limpia drafts |

La skill **kanban-board** incluye revisión de arquitectura, slicing vertical y cleanup obligatorio de `docs/issues/` al cerrar.

**Flujo por defecto al pedir «planifica y prepara issues»:** borradores en `docs/issues/` → publicar en GitHub con `gh` (salvo que pidas solo borradores).

Skills del proyecto: `.cursor/skills/` (raíz del repo git).

## Estructura

```
docs/issues/
├── README.md
├── manifest.<batch>.json
├── rd-073-admin-esquela-form.md
└── ...
```

## Fuentes de planes

- Maestro: [`ROADMAP_ENTREGA.md`](../ROADMAP_ENTREGA.md) (`RD-001` … `RD-115`)
- Detalle: [`docs/legacy/`](../legacy/)
- Reglas agente: [`AGENTS.md`](../../AGENTS.md)

## Manifest (ejemplo)

```json
{
  "repo": "3urega/funeraria",
  "sourceDoc": "docs/ROADMAP_ENTREGA.md",
  "issues": [
    {
      "title": "RD-073: Admin esquela form + live preview",
      "bodyFile": "docs/issues/rd-073-admin-esquela-form.md",
      "roadmapId": "RD-073"
    }
  ]
}
```

## Publicar (manual)

Desde la raíz del repo:

```bash
gh issue create --repo 3urega/funeraria --title "RD-073: Admin esquela form" --body-file docs/issues/rd-073-admin-esquela-form.md
```

O pedir al agente que use la skill `publish-github-issues` con el manifest del batch.
