<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Instrucciones para agentes

## Roadmap de entrega (obligatorio)

El documento maestro de progreso del producto es:

**[`docs/ROADMAP_ENTREGA.md`](docs/ROADMAP_ENTREGA.md)**

### Al iniciar una tarea

1. Lee `docs/ROADMAP_ENTREGA.md` para ubicar el ítem (`RD-XXX`) que vas a implementar.
2. Consulta el documento de detalle enlazado en esa fase (p. ej. `docs/legacy/requisits-esquela-admin-form.md`).

### Al completar un ítem del roadmap

Cuando un ítem **`RD-XXX`** quede **realmente terminado** (código funcional, no solo documentado):

1. Abre `docs/ROADMAP_ENTREGA.md`.
2. Cambia `- [ ] **RD-XXX**` por `- [x] **RD-XXX**` en la misma línea.
3. Recalcula el **progreso global** del encabezado (`X / 88 tareas`, porcentaje).
4. Actualiza la fila de **Historial de progreso** al final con la fecha y nota breve.
5. Ajusta el **Resumen ejecutivo PM** si cambia el estado de un área.

### Criterios para marcar `[x]`

- ✅ Código implementado y verificable (`npm run build` pasa).
- ✅ Comportamiento **completo** y alineado con el documento de requisitos enlazado.
- ✅ **Entregable de producto** — no placeholder, no esqueleto Tailwind genérico, no «ruta que existe».
- ❌ No marcar si solo hay documentación o diseño sin implementación (salvo ítems explícitamente de docs en Fase 0).
- ❌ No marcar tareas parciales — si falta diseño acordado, identidad visual o funcionalidad del requisito, dejar `[ ]` y anotar qué hay hecho en la misma línea.
- ❌ No marcar UI pública/admin como hecha si usa textos genéricos («Eurega Solutions»), sin logo, sin imagen de fondo ni estilos del cliente.

### Añadir nuevas tareas

Si surge trabajo no previsto:

1. Añade `- [ ] **RD-XXX** — descripción` en la fase adecuada (siguiente número libre).
2. Incrementa el total de tareas en el encabezado.
3. No reutilices IDs `RD-XXX` ya usados.

## Issues de GitHub (repo `3urega/funeraria`)

Cuando el usuario pida **planificar**, **preparar issues** o **convertir el roadmap en issues** (sin decir «solo docs»):

1. Lee y sigue la skill **`.cursor/skills/plan-to-issues/SKILL.md`** (borradores + manifest).
2. En la **misma sesión**, sigue **`.cursor/skills/publish-github-issues/SKILL.md`** (subir con `gh`).
3. Para implementar una issue concreta: **`.cursor/skills/kanban-board/SKILL.md`**.

Atajo mental: *plan → docs/issues → GitHub → implementar*.

Ver [`docs/issues/README.md`](docs/issues/README.md).

## Documentación del dominio

| Tema | Archivo |
|------|---------|
| Roadmap 0→100% | `docs/ROADMAP_ENTREGA.md` |
| Requisitos | `docs/DOCUMENTO_REQUISITOS.md` |
| Esquela vs obituario | `docs/legacy/requisits-obituary.md` |
| Plantilla esquela | `docs/legacy/requisits-esquela-plantilla.md` |
| Plantilla home | `docs/legacy/requisits-home-plantilla.md` |
| CMS home | `docs/legacy/requisits-home-cms.md` |
| Formulario admin | `docs/legacy/requisits-esquela-admin-form.md` |
| Página pública | `docs/legacy/requisits-esquela-publica.md` |
| Lugares | `docs/legacy/requisits-lugares.md` |
| Flores | `docs/legacy/requisits-flores.md` + `requisits-flores-admin.md` |
| Mensajes | `docs/legacy/requisits-missatges.md` |

## Convenciones de código

- Stack local: SQLite + `./storage/` — ver `docs/ESTRATEGIA_DESARROLLO_LOCAL.md`.
- **Multi-cliente:** una instancia = una funerària. Variable `FUNERAL_HOME_ID` + `site_config.brand_name` (nombre visible). Ver `src/lib/site/tenant.ts`.
- Esquela impresa: reutilizar `EsquelaPrintLayout` + `buildEsquelaPrintData()`.
- Foto esquela: familiar envía → empleado retoca → publica en `imagePath` (nunca directo).
- Obituario poético: solo familiar; separado del texto formal de la esquela.
- Respuestas al usuario en **español**.

## Arranque local

```powershell
npm install
copy .env.development.example .env.development
npm run db:setup
npm run dev
```

- Admin: `admin@local.dev` / `admin123`
- Familiar: código `DEMO1234`
- Esquela demo: `/esquelas/ramon-sant-torner`
