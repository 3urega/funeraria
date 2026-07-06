---
name: publish-github-issues
description: >-
  Upload issue drafts from docs/issues to GitHub (3urega/funeraria)
  using gh CLI and a manifest JSON. Automatically run after plan-to-issues in the same
  session unless user asked docs-only. Use when publishing issues, subir issues a GitHub,
  or crear issues en el repo remoto.
---

# Publish GitHub Issues

Repository: `3urega/funeraria`  
Remote: `git@github.com:3urega/funeraria.git`

**Step 2** after [plan-to-issues](../plan-to-issues/SKILL.md).

## Prerequisites

- `gh` CLI authenticated with access to `3urega/funeraria`
- Manifest at `docs/issues/manifest.<batch>.json`
- Body files referenced in manifest exist

## Workflow

1. Read manifest JSON; verify `"repo": "3urega/funeraria"`.
2. For each entry in `issues` (in order):
   - Read `bodyFile` from repo root
   - Create issue: `gh issue create --repo 3urega/funeraria --title "..." --body-file "..."`
3. Optionally rename body files to `{number}-{slug}.md` and append GitHub URLs to manifest.
4. Update source roadmap/requisits doc with published issue URLs.

## Do not

- Create issues without reading the body file
- Use `gh issue create` inside plan-to-issues skill
- Force-push or change git config

## Related

- [plan-to-issues](../plan-to-issues/SKILL.md)
- [kanban-board](../kanban-board/SKILL.md)
