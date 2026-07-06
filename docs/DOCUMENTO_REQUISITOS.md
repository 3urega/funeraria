# Documento de Requisitos de Software (DRS)

## Plataforma web funeraria — Eurega Solutions

**Versión:** 1.0  
**Fecha:** 4 de julio de 2026  
**Origen:** Reverse-engineering del repositorio `funeral-template` (Angular 9)  
**Propósito:** Especificación para reimplementar el producto desde cero con arquitectura limpia y funcionalidad completa.

**Seguimiento de entrega:** [ROADMAP_ENTREGA.md](./ROADMAP_ENTREGA.md) (checklist 0→100% para PM).

---

## 1. Introducción

### 1.1 Contexto

El proyecto actual es una **plantilla frontend** para empresas de servicios funerarios. Combina:

- Una **web pública** orientada a marketing (servicios, salas, tarifas, portfolio).
- Un **módulo de esquelas/obituarios** con acceso privado para familiares mediante código.
- Un **backoffice administrativo** planificado pero **no implementado** en el código existente.

El backend no vive en este repositorio: la aplicación consume una **API REST en AWS** y servicios de **Firebase** (auth, base de datos, hosting). Las imágenes se sirven desde un **bucket S3**.

### 1.2 Problema que resuelve

Las funerarias necesitan:

1. Presencia web corporativa multilingüe y personalizable por cliente.
2. Publicación de esquelas con información de ceremonias (iglesia, cementerio, mapas).
3. Acceso restringido para familiares que consultan la esquela de su difunto mediante un código único.
4. (Objetivo) Panel de administración para gestionar contenido, esquelas y usuarios internos.

### 1.3 Objetivos del nuevo desarrollo

| ID | Objetivo |
|----|----------|
| O-01 | Entregar web pública responsive con contenido editable. |
| O-02 | Gestionar el ciclo de vida de esquelas (crear, activar, publicar, archivar). |
| O-03 | Permitir acceso familiar seguro por código de visita. |
| O-04 | Implementar backoffice completo para personal de la funeraria. |
| O-05 | Soportar múltiples idiomas (mínimo: ES, CA, EN). |
| O-06 | Permitir personalización visual (temas/colores) por despliegue o cliente. |

---

## 2. Alcance

### 2.1 Dentro del alcance (MVP + evolución)

- Web pública con landing configurable.
- Listado y detalle de esquelas públicas (visibles).
- Zona privada familiar vinculada a una esquela concreta.
- Backoffice con CRUD de esquelas y contenido web.
- Autenticación dual: familiares (código) vs administradores (email/Google).
- Integración con API REST y almacenamiento de imágenes.
- Internacionalización y theming.
- Despliegue como SPA con rewrite a `index.html`.

### 2.2 Fuera del alcance (v1)

- App móvil nativa.
- Chat o mensajería entre familiares.
- Multi-tenant complejo (varias funerarias en una sola instancia) — salvo que se decida explícitamente.
- CMS genérico tipo WordPress; el contenido es estructurado por secciones predefinidas.

> **Nota (2026):** La **compra de flores** vinculada a esquelas es un requisito nuevo pendiente de concretar. Ver [`docs/legacy/requisits-flores.md`](legacy/requisits-flores.md). Implica pasarela de pago — antes marcada genéricamente como fuera de alcance v1.

### 2.3 Estado del código legacy (referencia)

| Módulo | Estado en repo actual |
|--------|------------------------|
| Web pública `/page/home` | Implementada con datos mock |
| Componente esquelas | Implementado, no integrado en rutas |
| Servicio esquelas + API | Implementado |
| Auth familiares (código) | Parcial |
| Auth admin (email/Google) | Componente existe, sin pantallas |
| Backoffice `/admin` | Módulo vacío |
| Firebase Firestore CRUD | Servicio base, sin uso en UI |

---

## 3. Actores y roles

| Actor | Descripción | Permisos |
|-------|-------------|----------|
| **Visitante anónimo** | Usuario que navega la web pública | Ver home, esquelas visibles, información de contacto |
| **Familiar** | Persona con código de acceso a una esquela | Ver y **personalizar** la esquela (foto, poema, texto), además de datos de ceremonia |
| **Administrador** | Personal de la funeraria | CRUD esquelas, gestionar contenido web, activar/desactivar publicaciones |
| **Superadmin** (futuro) | Eurega / mantenimiento | Gestión multi-cliente, configuración global |

---

## 4. Requisitos funcionales

### 4.1 Web pública

#### RF-WEB-01 — Página de inicio
La aplicación debe mostrar una landing con las siguientes secciones configurables:

1. **Hero** — Imagen de fondo, título, subtítulo y texto descriptivo.
2. **Iconos destacados** — Grid de iconos con título y subtítulo (Material Icons o equivalente).
3. **Tarifas / pricing** — Tarjetas con título, descripción, texto destacado, listas de detalles e inclusiones.
4. **Portfolio** — Carrusel o grid de elementos con imagen, logo, título, descripción y enlace externo opcional.
5. **Lista de elementos** — Sección con imagen de fondo y listado de items.
6. **Servicios** — Cajas con imagen, título y descripción (ej.: cementerios, flores, salas).

**Criterio de aceptación:** Todas las secciones renderizan contenido en el idioma activo del navegador.

#### RF-WEB-02 — Layout común
- Header fijo al hacer scroll con logo, navegación y botón de acceso familiares.
- Barra superior con teléfono, email y dirección de la funeraria.
- Footer corporativo.
- Menú responsive para móvil (hamburguesa).

#### RF-WEB-03 — Información de contacto
El header debe mostrar datos de contacto configurables:
- Teléfono
- Email
- Dirección física

#### RF-WEB-04 — Navegación
- Ruta por defecto: `/` → redirección a home pública.
- Rutas lazy-loaded para zona pública y admin.

#### RF-WEB-05 — Contenido dinámico (objetivo)
El contenido de la home debe poder cargarse desde API o Firebase, no solo desde mocks estáticos.

---

### 4.2 Esquela y Obituario — Conceptos de dominio

> **Esquela** = avís de defunció formal (text + foto). El crea l'**empleat** des del backoffice.  
> **Obituario** = homenatge poètic personal. El personalitza el **familiar** amb codi d'accés.

Exemple d'esquela (creat per l'empleat):

```
Joan Puig Martínez
Ha mort a Berga el dia 1 als 71 anys

Enterrament i funeral dimarts dia 3 a les 11
a l'església de Gironella

Sales de vetlla: Fune Pujols
Dilluns de 17 a 20
[+ foto del difunt]
```

L'**obituari** és una secció apart: poema del catàleg i/o text d'homenatge escrit pel familiar.

#### RF-OBI-01 — Model de dades (registre per difunt)

| Campo | Qui el gestiona | Descripció |
|-------|-----------------|------------|
| `name` | Admin | Nom del difunt |
| `deathNotice` | Admin | Text de defunció (ex. «Ha mort a Berga…») |
| `funeralDetails` | Admin | Enterrament, funeral, lloc, hora |
| `wakeDetails` | Admin | Sales de vetlla, horaris |
| `imagePath` | Admin | Foto retocada i publicada (escaneig o retoc de foto digital) |
| `customImagePath` | Familiar (via web) | Original digital enviat — referència per retocar |
| `familyImageStatus` | Sistema | `pending` = pendent que l'empleat retoci \| `rejected` \| `null` |
| `obituarioPoemTemplateId` | Familiar | Poema predefinit triat |
| `obituarioText` | Familiar | Text d'homenatge personalitzat |
| `visitCode`, `isActive`, `isVisible`… | Admin | Gestió interna |

#### RF-OBI-02 — Creació de l'esquela (backoffice)
L'empleat funerari crea l'esquela amb:
- Nom del difunt
- Text de defunció, funeral i sales de vetlla
- Foto opcional (retocada i publicada a `imagePath`)
- Codi d'accés per al familiar
- Activació / publicació

#### RF-OBI-02b — Foto digital: familiar envia, empleat retoca i publica
Quan el familiar puja una foto per la web:
1. Es guarda a `customImagePath` amb `familyImageStatus = pending` (versió original).
2. L'esquela pública **continua** mostrant `imagePath` (foto anterior, si n'hi ha).
3. L'empleat agafa la foto, la retoca (crop, redimensionar, ajust amb IA…).
4. Puja la **versió retocada** a `imagePath`.
5. Neteja l'estat pendent.
6. Si la foto no serveix com a base → `familyImageStatus = rejected`.

#### RF-OBI-02c — Foto en paper: empleat escaneja i publica
Quan el familiar porta la foto físicament:
1. L'empleat l'escaneja o fotografia des del backoffice.
2. Retoca la imatge (crop, mida, ajustos…).
3. Publica directament a `imagePath`.
4. **No** passa per `customImagePath` — el backoffice és l'origen.

*(Eina admin per escanejar/pujar i publicar foto retocada: pendent d'implementació completa.)*

#### RF-OBI-03 — Listado y detalle público

> Detalle completo: [`docs/legacy/requisits-esquela-publica.md`](legacy/requisits-esquela-publica.md)

- Listado: esquelas con `isVisible = true`.
- Detalle `/esquelas/[slug]` — el visitant (sin login) ve:
  1. **Esquela impresa** — versión final (texto + foto retocada + obituario si existe).
  2. **Lugares** — iglesia (misa) y cementerio (entierro) con enlaces a Google Maps.
  3. **Missatge conmemoratiu** — formulario texto + nombre del remitente → entrega a familiares en sala de vetlla.
  4. **Compra de flores** — catálogo vinculado al difunto, con dedicatoria obligatoria en la tarjeta.

#### RF-OBI-04 — Catálogo de poemas (`poem_templates`)
Poemas per al **obituari**, no per al text formal de l'esquela.

#### RF-OBI-05 — Datatable admin
Listado con columnas: Nombre, Activo, Visible, Completado.

---

### 4.3 Acceso y gestión familiar

#### RF-AUTH-FAM-01 — Login por código
- Botón "Accés familiars" en header abre formulario.
- Campo `code` obligatorio.
- Ruta: `/acceso`.

#### RF-AUTH-FAM-02 — Validación de código
Al enviar el código:
1. Buscar esquela con `visitCode` coincidente.
2. Si no existe → error `NO_OBITUARY`.
3. Si existe pero `isActive = false` → error `NOT_ACTIVE`.
4. Si válido → cookie de sesión familiar + redirección a `/mi-esquela`.

#### RF-AUTH-FAM-03 — Sesión familiar
- Cookie JWT `family_session` (24 h).
- Logout destruye la sesión.
- Solo da acceso a **una** esquela (`obituaryId` en sesión).

#### RF-AUTH-FAM-04 — Vista (`/mi-esquela`)
El familiar ve **dues seccions separades**:

1. **Esquela** (només lectura del text creat per l'empleat + foto publicada)
2. **Obituari** (poema i text d'homenatge, si n'hi ha)
3. **Enviar foto** (formulari separat — l'empleat la retocarà abans de publicar-la)

#### RF-AUTH-FAM-05 — Familiar envia foto per a l'esquela
```
POST /api/family/esquela
Body: customImage (file)
```
- Envia la foto del difunt com a referència.
- L'empleat la retoca i publica la versió final a `imagePath`.
- La foto original **no** es mostra directament a la web.
- **No** pot modificar el text formal (defunció, funeral, vetlla).

#### RF-AUTH-FAM-06 — Familiar personalitza l'obituari
```
POST /api/family/obituario
Body: obituarioPoemTemplateId?, obituarioText?
```
- Triar poema del catàleg, text personalitzat, o **ambdós**.
- Independent del text de l'esquela.

#### RF-AUTH-FAM-07 — Permisos del familiar

| Pot | No pot |
|-----|--------|
| Veure esquela encara que no sigui pública | Editar text de l'esquela |
| Enviar foto per a l'esquela (l'empleat la retoca) | Canviar nom, codis, visibilitat |
| Personalitzar obituari (poema + text) | Accedir a altres esquelas / admin |

---

### 4.4 Pàgina pública de l'esquela (visitant)

> Detalle: [`docs/legacy/requisits-esquela-publica.md`](legacy/requisits-esquela-publica.md)

#### RF-PUB-01 — Accés des del llistat
- Visitant entra a la web → ve esquelas actives → click → `/esquelas/[slug]`.
- Sense login.

#### RF-PUB-02 — Esquela impresa
- Es mostra com quedarà impresa: text formal + foto publicada (`imagePath`) + obituari (si n'hi ha).

#### RF-PUB-03 — Llocs amb Google Maps
- Església (missa/funeral): nom, ciutat, enllaç `googleMapsUrl`.
- Cementiri (enterrament): nom, enllaç `googleMapsUrl`.

#### RF-PUB-04 — Missatge conmemoratiu
> Detalle: [`docs/legacy/requisits-missatges.md`](legacy/requisits-missatges.md)

- Formulari: `senderName` + `messageText`.
- No es publica a la web — es lliura als familiars a la **sala de vetlla**.
- Backoffice: llistat per difunt (text + nom + data).

#### RF-PUB-05 — Compra de flors
> Detalle: [`docs/legacy/requisits-flores.md`](legacy/requisits-flores.md)

- Catàleg de productes des de la mateixa pàgina.
- Comanda vinculada a `obituaryId`.
- **Dedicatòria obligatòria** amb la compra (ex. «De part dels teus cosins, amb amor»).
- Dades comprador + pagament en línia.
- Backoffice: comandes per difunt (producte + dedicatòria + comprador) per coordinar amb floristeria.
- Catàleg gestionat a `/admin/flores` (CRUD, foto, preu, actiu/inactiu).

---

### 4.5 Compra de flores (detall)

#### RF-FLR-01 — Catálogo de productos
- Productos configurables por la funeraria (corona, ram, centro…).
- Precio, imagen, descripción, activo/inactivo.

#### RF-FLR-02 — Checkout desde esquela
- Solo visitantes en `/esquelas/[slug]` (sin login).
- `dedicationText` **obligatorio** — texto de la tarjeta de flores.
- Datos del comprador: nombre, email, teléfono.

#### RF-FLR-03 — Pago en línea
- Pasarela a definir (Stripe, Redsys…).
- Estados: `pending_payment` → `paid` → `in_preparation` → `delivered`.

#### RF-FLR-04 — Gestión admin — catálogo (e-commerce)

> Detalle: [`docs/legacy/requisits-flores-admin.md`](legacy/requisits-flores-admin.md)

- Ruta `/admin/flores` — CRUD de productos.
- Campos: nombre, descripción, precio, foto (upload), activo/inactivo, orden.
- Producto inactivo → no visible en la esquela pública.
- Subida de imagen del artículo desde backoffice.

#### RF-FLR-05 — Gestión admin — comandas

- Listado global de comandas con filtros (difunto, estado, fecha).
- Por difunto: comandas con producto, dedicatoria y comprador.
- Cambio de estado: `paid` → `in_preparation` → `delivered`.
- Coordinación con floristería.

#### RF-FLR-06 — Pendiente de definir
- Pasarela de pago concreta.
- Notificaciones email.
- Facturación / IVA.

---

### 4.6 Backoffice administrativo

> **Nota:** Todo este bloque es requisito objetivo; el módulo `/admin` actual está vacío.

#### RF-ADMIN-01 — Acceso protegido
- Ruta `/admin` protegida por guard de autenticación.
- Redirección a home si no autenticado.

#### RF-ADMIN-02 — Login administrador
- Formulario email + contraseña (mín. 5 caracteres).
- Login con Google OAuth.
- Integración con Firebase Auth o proveedor equivalente.

#### RF-ADMIN-03 — Gestión de esquelas

> Formulario + vista previa: [`docs/legacy/requisits-esquela-admin-form.md`](legacy/requisits-esquela-admin-form.md)

CRUD completo:
- **Formulario estructurado** con vista previa en vivo (`EsquelaPrintLayout`).
- Campos: difunto, funeral, vetlla, foto, publicación.
- Crear en `/admin/esquelas/nueva`, editar en `/admin/esquelas/[id]`.
- Subir foto retocada / escaneada → `imagePath`.
- Gestionar foto familiar pendiente (`customImagePath`).
- Activar/desactivar (`isActive`), publicar/ocultar (`isVisible`), completada (`isReady`).
- Generar o asignar `visitCode` y `slug`.
- **Ver comandas de flores** del difunto (producto + dedicatoria + comprador).
- **Ver missatges conmemoratius** (texto + nombre remitente) para entregar en sala de vetlla.

*(Implementación: fases 1–5 documentadas en requisits-esquela-admin-form.md.)*

#### RF-ADMIN-04 — Gestión de contenido web
- Editar secciones de la home (hero, servicios, portfolio, pricing, etc.).
- Contenido multilingüe por campo.
- Previsualización antes de publicar.

#### RF-ADMIN-05 — Gestión de lugares

> Detalle: [`docs/legacy/requisits-lugares.md`](legacy/requisits-lugares.md) · Roadmap Fase 5b (RD-067–069).

- CRUD **iglesias** — nombre, ciudad, URL Google Maps, imagen.
- CRUD **cementerios** — nombre, URL Google Maps, imagen.
- CRUD **sales de vetlla** (`wake_rooms`) — nombre, dirección, URL Maps, activo/inactivo.
- Catálogos usados como `<select>` obligatorios al crear esquela (`churchId`, `cemeteryId`, `wakeRoomId`).

#### RF-ADMIN-06 — E-commerce de flores
> Detalle: [`docs/legacy/requisits-flores-admin.md`](legacy/requisits-flores-admin.md)

- CRUD productos: nombre, descripción, precio, foto, activo/inactivo.
- Upload de imagen por producto.
- Listado y gestión de comandas (estados, filtros).
- Comandas y dedicatorias visibles en la ficha de cada esquela.

#### RF-ADMIN-07 — Roles (futuro)
El código legacy incluye TODO para reconocimiento de roles. Definir al menos:
- `admin` — acceso total.
- `editor` — solo contenido web.
- `operator` — solo esquelas.

---

### 4.7 Internacionalización (i18n)

#### RF-I18N-01 — Idiomas soportados
Mínimo: **español (es)**, **catalán (ca)**, **inglés (en)**.

#### RF-I18N-02 — Detección automática
Usar idioma del navegador como default; fallback a `en`.

#### RF-I18N-03 — Contenido traducible
- Textos de UI via archivos JSON (`assets/i18n/{lang}.json`).
- Contenido de negocio con estructura `{ es: "...", ca: "...", en: "..." }` por campo.

#### RF-I18N-04 — Selector de idioma (propuesto)
Permitir cambio manual de idioma en header o footer.

---

### 4.8 Theming y personalización

#### RF-THEME-01 — Temas predefinidos
Al menos `lightTheme` y `darkTheme` con variables CSS:
- Colores de fondo, texto, primario, secundario, error, warning.

#### RF-THEME-02 — Aplicación de tema
Al iniciar la web pública, aplicar tema activo al `:root` del documento.

#### RF-THEME-03 — Personalización por despliegue
Variables de entorno por cliente/funeraria (colores, logo, contacto, bucket de imágenes).

---

## 5. Requisitos no funcionales

### 5.1 Rendimiento
- Lazy loading de módulos (web y admin).
- Caché reactiva de esquelas con `shareReplay`.
- Imágenes optimizadas y servidas desde CDN/bucket.

### 5.2 Seguridad
- Códigos de visita no predecibles (generación server-side).
- Auth admin con Firebase Auth u OAuth2 estándar.
- No exponer claves de API en frontend en producción (usar variables de entorno y restricciones de dominio).
- Guard en rutas admin; validación server-side en API para operaciones CRUD.
- Separar claramente auth familiar (código) vs auth admin (credenciales).

### 5.3 Compatibilidad
- Responsive: móvil, tablet, desktop.
- Navegadores modernos (últimas 2 versiones de Chrome, Firefox, Safari, Edge).

### 5.4 Accesibilidad (objetivo v1.1)
- Contraste mínimo WCAG AA en temas.
- Labels en formularios.
- Navegación por teclado en modales.

### 5.5 Mantenibilidad
- Separación clara: `web/`, `admin/`, `shared/`.
- Componentes reutilizables con interfaces tipadas.
- Un solo servicio de auth por tipo de usuario (evitar duplicidad legacy).
- Logging con niveles configurables (DEBUG, INFO, ERROR).

### 5.6 Despliegue
- Build de producción optimizado.
- Hosting SPA con rewrite `** → /index.html` (Firebase Hosting o equivalente).
- Entornos: `dev`, `test`, `prod` con configuración separada.

---

## 6. Arquitectura propuesta (desde cero)

### 6.1 Frontend

```
src/
├── app/
│   ├── core/           # Servicios singleton, guards, interceptors
│   ├── shared/         # Componentes UI reutilizables, pipes, modelos
│   ├── features/
│   │   ├── public/     # Web pública (home, esquelas, login familiar)
│   │   └── admin/      # Backoffice
│   └── app.routes.ts
├── assets/
│   ├── i18n/
│   └── images/
├── environments/
└── themes/
```

**Stack recomendado (actualizar respecto a legacy):**

| Capa | Legacy | Recomendación |
|------|--------|---------------|
| Framework | Angular 9 | Angular 17+ o React/Vue según equipo |
| UI | Angular Material | Mantener Material o Tailwind + headless |
| Plantillas | Pug | HTML/TSX nativo (mejor tooling) |
| Estado | BehaviorSubject | Signals, NgRx o TanStack Query |
| i18n | ngx-translate | ngx-translate o @angular/localize |
| Auth | Firebase + custom | Firebase Auth + JWT para API |

### 6.2 Backend (nuevo o existente)

El legacy asume:

```
API REST (AWS API Gateway)
  └── GET  /obituary          → listado esquelas
  └── CRUD /obituary/:id      → (inferido para admin)
  └── CRUD /churches          → (inferido)
  └── CRUD /cementeries       → (inferido)
  └── CRUD /content           → (inferido para home)

Firebase
  └── Auth (admin)
  └── Firestore (contenido dinámico, opcional)

S3
  └── Bucket de imágenes (dev.assets.pujols.cat en dev)
```

**Decisión pendiente:** ¿API serverless AWS se mantiene o se migra a Firebase Functions / NestJS / otro?

### 6.3 Diagrama de contexto

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│  Navegador  │ ◄────────────► │  SPA Frontend    │
└─────────────┘                └────────┬─────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
            ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
            │  REST API    │   │ Firebase Auth│   │  S3 / CDN    │
            │  (AWS)       │   │ + Firestore  │   │  Imágenes    │
            └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 7. Modelo de datos — Contenido web

### 7.1 Estructura i18n común

```typescript
type i18nField = {
  es: string;
  ca: string;
  en: string;
};

type imageField = {
  src: string;
  alt: string;
};
```

### 7.2 Secciones de home

| Sección | Campos principales |
|---------|-------------------|
| Hero | bgImage, title, subtitle, text, options.filter |
| Rounded icons | icon (Material), title, subtitle (i18n) |
| Pricing | title, description, strong, details[], includes[] |
| Portfolio | image, logo, title, description, link, order |
| Items list | image, title, description |
| Services (boxes) | image, title, description, rel |

---

## 8. Rutas de la aplicación

| Ruta | Módulo | Auth | Descripción |
|------|--------|------|-------------|
| `/` | — | No | Redirect → `/page/home` |
| `/page/home` | Public | No | Landing |
| `/page/obituary` | Public | No | Listado esquelas visibles |
| `/page/obituary/:id` | Public | No* | Detalle esquela |
| `/page/family` | Public | Código | Zona familiar (propuesto) |
| `/admin` | Admin | Sí | Dashboard |
| `/admin/obituaries` | Admin | Sí | CRUD esquelas |
| `/admin/content` | Admin | Sí | Editor home |
| `/admin/places` | Admin | Sí | Iglesias y cementerios |

\* Detalle puede requerir código si `isVisible = false`.

---

## 9. Integraciones y configuración

### 9.1 Variables de entorno

| Variable | Uso |
|----------|-----|
| `production` | Modo prod/dev |
| `apiURL` | Base URL API REST |
| `firebase.*` | Config Firebase |
| `ImageBucket` | URL base bucket S3 |
| `APP_LOCALSTORAGE_PREFIX` | Prefijo keys localStorage |
| `DebugLevel` | Nivel de logging |

### 9.2 LocalStorage
Servicio con prefijo configurable para persistir preferencias (idioma, sesión familiar opcional).

### 9.3 Firebase Hosting
- `public`: carpeta de build (`dist/...`).
- Rewrite SPA para todas las rutas.

---

## 10. Componentes UI reutilizables (inventario)

| Componente | Responsabilidad |
|------------|-----------------|
| `bg-image` | Sección hero con imagen de fondo y filtros |
| `rounded-icons` | Grid de iconos circulares |
| `pricing` | Tarjetas de precios/ofertas |
| `portfolio` | Carrusel/grid portfolio |
| `title-image` | Separador con imagen y títulos |
| `items-list` | Lista de elementos con fondo |
| `boxes-list` | Grid de servicios/cajas |
| `section-header` | Título + subtítulo de sección |
| `obituaries` | Listado/detalle esquelas |
| `header` / `footer` | Layout |
| `code-form` | Modal login familiar |
| `signin` | Modal login admin |

Cada componente debe aceptar `@Input()` de datos, `@Input() template` para variantes visuales, y `@Input() options` para comportamiento (bgFixed, logo, etc.).

---

## 11. Casos de uso principales

### CU-01 — Consultar web de la funeraria
1. Visitante accede a la URL.
2. Sistema detecta idioma y aplica tema.
3. Se renderiza home con secciones configuradas.

### CU-02 — Ver esquelas públicas
1. Visitante navega a listado de esquelas.
2. Sistema muestra solo `isVisible = true`.
3. Click en esquela → detalle con imagen e info de ceremonia.

### CU-03 — Acceso familiar
1. Familiar pulsa "Accés familiars".
2. Introduce código de visita.
3. Sistema valida contra esquela activa.
4. Familiar accede a contenido privado de esa esquela.

### CU-04 — Admin gestiona esquela
1. Admin inicia sesión en `/admin`.
2. Crea esquela con datos del difunto.
3. Sube imagen, asigna iglesia/cementerio.
4. Genera código de visita y activa esquela.
5. Publica en web (`isVisible = true`).

### CU-05 — Admin edita contenido web
1. Admin accede a editor de home.
2. Modifica textos en ES/CA/EN.
3. Guarda y publica cambios.

---

## 12. Criterios de aceptación globales

- [ ] La home carga sin mocks en producción (datos desde API/Firebase).
- [ ] Esquelas visibles aparecen en listado público con imágenes del bucket.
- [ ] Código de visita inválido muestra mensaje claro al usuario.
- [ ] Código válido pero esquela inactiva muestra mensaje específico.
- [ ] `/admin` es inaccesible sin login admin.
- [ ] CRUD de esquelas funciona end-to-end.
- [ ] UI responsive en móvil.
- [ ] Textos disponibles en ES, CA y EN.
- [ ] Build de producción desplegable en Firebase Hosting sin errores.

---

## 13. Fases de implementación sugeridas

### Fase 1 — Fundamentos (2-3 semanas)
- Scaffold proyecto moderno.
- Routing, i18n, theming, layout (header/footer).
- Integración API esquelas (solo lectura).
- Home con contenido estático o desde API.

### Fase 2 — Esquelas y familiares (2 semanas)
- Rutas listado/detalle esquela.
- Login por código y zona privada.
- Componente obituaries integrado.

### Fase 3 — Backoffice (3-4 semanas)
- Auth admin (Firebase).
- CRUD esquelas.
- Subida de imágenes a S3.
- Listado datatable.

### Fase 4 — CMS contenido (2 semanas)
- Editor secciones home.
- Firestore o API de contenido.
- Preview y publicación.

### Fase 5 — Calidad y despliegue (1-2 semanas)
- Tests e2e flujos críticos.
- Accesibilidad básica.
- CI/CD, entornos dev/prod.
- Documentación operativa.

---

## 14. Riesgos y decisiones pendientes

| ID | Tema | Opciones | Impacto |
|----|------|----------|---------|
| D-01 | Stack frontend | Angular nuevo vs React/Vue | Equipo y curva aprendizaje |
| D-02 | Backend | Mantener AWS API vs reescribir | Tiempo y coste |
| D-03 | Auth familiar | Solo código vs código + PIN | Seguridad |
| D-04 | Contenido home | Firestore vs API vs JSON estático | Complejidad CMS |
| D-05 | Multi-tenant | Una funeraria vs muchas | Modelo de datos |
| D-06 | Pug | Eliminar vs mantener | DX y mantenimiento |

### Riesgos técnicos del legacy
- **Doble AuthService** (local vs `@eurega/web-core`): provoca guards inconsistentes.
- **AuthGuard no registrado** en providers del módulo raíz.
- **AdminModule vacío**: rutas admin fallan en runtime.
- **Dependencia `@eurega/web-core`**: librería privada; evaluar reimplementar o reemplazar.
- **Claves Firebase en repo**: rotar y externalizar en CI/CD.

---

## 15. Glosario

| Término | Definición |
|---------|------------|
| **Esquela / Obituario** | Página conmemorativa del difunto |
| **Código de visita** | Clave alfanumérica para acceso familiar |
| **Expediente** | Referencia interna de la funeraria |
| **isVisible** | Esquela aparece en web pública |
| **isActive** | Código de visita habilitado |
| **isReady** | Datos de esquela completos |
| **ImageBucket** | URL base del almacén de imágenes |

---

## 16. Anexos

### Anexo A — Referencia API inferida

```
GET    /obituary              → Array<IObituary>
GET    /obituary/:id          → IObituary
POST   /obituary              → Crear (admin)
PUT    /obituary/:id          → Actualizar (admin)
DELETE /obituary/:id          → Eliminar (admin)
```

### Anexo B — Claves i18n existentes

```
core.LOGIN_HEADER_TITLE
core.LOGIN_FORM
home.SECTION_* (rounded, portfolio, pricing, list, services)
public.dialogs.LOGIN
public.dialogs.CLOSE
```

### Anexo C — Servicios de dominio

| Servicio | Responsabilidad |
|----------|-----------------|
| `CoreService` | Init app: debug, idioma, API URL, tema, prefetch esquelas |
| `ObituaryService` | CRUD en caché, filtros, búsqueda por código |
| `AuthService` (familiar) | Sesión por código de visita |
| `AuthService` (admin) | Firebase email/Google |
| `LocalStorageService` | Persistencia cliente |
| `FirebaseFirestoreService` | CRUD Firestore genérico |
| `ContentFirebaseService` | Contenido dinámico (sin implementar) |

---

*Documento generado a partir del análisis del código fuente de `funeral-template`. Debe revisarse con stakeholders antes de iniciar el desarrollo.*
