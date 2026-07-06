# Requisitos — compra de flores

> **Estat:** requisit confirmat, **no implementat**.  
> Context de la pàgina pública: [`requisits-esquela-publica.md`](requisits-esquela-publica.md)

## Actor

**Visitant qualsevol** — sense login. Entra a la web, obre una esquela activa i compra flors per aquell difunt.

## Flux

```
Visitant a /esquelas/[slug]
        ↓
Triar producte del catàleg (corona, ram, centre…)
        ↓
Escriure dedicatòria (obligatòria) — ex. «De part dels teus cosins, amb amor»
        ↓
Dades del comprador (nom, email, telèfon)
        ↓
Pagament en línia
        ↓
Comanda registrada → backoffice + floristeria
        ↓
Entrega vinculada a l'esquela (església / vetlla / cementiri)
```

La dedicatòria **forma part de la compra** — no és opcional.

## Model de dades

### Catàleg (`flower_products`)

| Camp | Descripció |
|------|------------|
| `id`, `funeralHomeId` | Identificadors |
| `name`, `description` | Corona, ram… |
| `priceCents`, `currency` | Preu |
| `imagePath` | Foto del producte |
| `isActive`, `sortOrder` | Gestió admin |

### Comanda (`flower_orders`)

| Camp | Descripció |
|------|------------|
| `id`, `obituaryId` | Vinculada al difunt |
| `productId`, `quantity` | Què s'ha comprat |
| `dedicationText` | **Obligatori** — text de la targeta |
| `buyerName`, `buyerEmail`, `buyerPhone` | Qui compra |
| `status` | `pending_payment` → `paid` → `in_preparation` → `delivered` |
| `paymentReference` | Id pasarel·la de pagament |
| `createdAt` | Data |

## Backoffice

### Comandes per difunt

A la fitxa de cada esquela:

- Llistat de comandes de flors
- Producte + dedicatòria + comprador + estat
- Per **gestionar-ho amb la floristeria**

### Mini e-commerce (catàleg)

L'empleat gestiona el catàleg des del backoffice:

- **CRUD productes** — nom, descripció, preu, foto
- **Pujar foto** de cada article
- **Activar / desactivar** — només els actius es veuen a la web
- **Ordre** d'aparició al catàleg

Detall complet: [`requisits-flores-admin.md`](requisits-flores-admin.md)

## Decisions pendents

1. **Pasarel·la de pagament:** Stripe, Redsys…
2. **Floristeria:** pròpia fune o proveïdor extern
3. **Notificacions email** a fune / comprador
4. **Facturació / IVA**

## Relació amb altres mòduls

- Usa `churchId`, `cemeteryId`, `funeralDetails`, `wakeDetails` de l'esquela
- Independent del missatge conmemoratiu (acció separada del visitant)
- Independent de l'obituari poètic i de la zona familiar

## Implementació (futur)

- [ ] Schema + seed productes demo
- [ ] UI catàleg + checkout a `/esquelas/[slug]`
- [ ] Integració pagament
- [ ] Admin catàleg: [`requisits-flores-admin.md`](requisits-flores-admin.md)
- [ ] Admin comandes per esquela
