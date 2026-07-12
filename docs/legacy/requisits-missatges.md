# Requisitos — missatges conmemoratius

> **Estat:** **implementat** (#7, jul 2026).  
> Equivalent legacy: entitat **Condolence**.  
> Context: [`requisits-esquela-publica.md`](requisits-esquela-publica.md)

## Què és

Un visitant escriu un text per conmemorar al difunt. El missatge **no es publica a la web** — es lliura als **familiars a la sala de vetlla**.

## Actor

**Visitant qualsevol** — sense login, des de `/esquelas/[slug]`.

## Flux

```
Visitant a la pàgina de l'esquela
        ↓
Formulari: nom + text del missatge
        ↓
Enviar
        ↓
Backoffice: l'empleat ve el missatge i el lliura als familiars a la vetlla
```

## Model de dades (`commemorative_messages`)

| Camp | Descripció |
|------|------------|
| `id`, `obituaryId` | Vinculat al difunt |
| `senderName` | Nom de qui envia el missatge |
| `messageText` | Text conmemoratiu |
| `reviewed` | L'empleat marca el missatge com a revisat (legacy `checked`) |
| `createdAt` | Data d'enviament |

## Diferència amb la dedicatòria de flors

| | Missatge conmemoratiu | Dedicatòria de flors |
|---|----------------------|----------------------|
| Vinculat a | Només text | Compra de producte |
| Destí | Familiars a la vetlla | Targeta de les flors |
| Obligatori | Text + nom | Text (amb la compra) |

## Backoffice

Per cada difunt:
- Llistat de missatges rebuts
- Text + nom del remitent + data
- Per imprimir/entregar a la sala de vetlla

## API

```
POST /api/public/commemorative
Body: { obituaryId, senderName, messageText }
```

## Implementació

- [x] Schema SQLite — RD-036 *(#7)*
- [x] Formulari a `/esquelas/[slug]` — RD-055 *(#7)*
- [x] Admin: pestanya missatges per esquela — RD-079 *(#7)*
