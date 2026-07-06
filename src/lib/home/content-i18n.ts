/** Contingut CMS home — català (principal) i castellà. */
export const HOME_CONTENT_I18N = {
  topBar: {
    availabilityText: {
      ca: "",
      es: "",
    },
    urgencyLabel: {
      ca: "",
      es: "",
    },
  },
  hero: {
    title: {
      ca: "Us acompanyem quan més ho necessiteu",
      es: "Acompañamos cuando más se necesita",
    },
    subtitle: {
      ca: "Centre funerari de referència del Baix Berguedà a Gironella",
      es: "Centro funerario de referencia del Baix Berguedà en Gironella",
    },
    text: {
      ca: "La Funerària Pujols de Gironella és el centre funerari de referència del Baix Berguedà. Dóna servei a les famílies de Gironella, Berga i els municipis del voltant.\n\nL'equip de la Funerària Pujols gestiona tots els tràmits funeraris: el certificat de defunció, la inscripció al registre civil, el trasllat i la coordinació del sepeli al cementiri de Gironella o la incineració al crematori corresponent.",
      es: "La Funeraria Pujols de Gironella es el centro funerario de referencia del Baix Berguedà. Presta servicio a las familias de Gironella, Berga y los municipios del entorno.\n\nEl equipo de la Funeraria Pujols gestiona todos los trámites funerarios: el certificado de defunción, la inscripción en el registro civil, el traslado y la coordinación del sepelio en el cementerio de Gironella o la incineración en el crematorio correspondiente.",
    },
    primaryButton: {
      ca: "Necessito ajuda ara",
      es: "Necesito ayuda ahora",
    },
    secondaryButton: {
      ca: "Veure els nostres serveis",
      es: "Ver nuestros servicios",
    },
    secondaryButtonHref: "#servicios",
  },
  services: {
    eyebrow: { ca: "ELS NOSTRES SERVEIS", es: "NUESTROS SERVICIOS" },
    heading: {
      ca: "Som al vostre costat en cada pas",
      es: "Estamos a tu lado en cada paso",
    },
    items: [
      {
        icon: "flower",
        label: { ca: "Funeral complet", es: "Funeral completo" },
      },
      { icon: "urn", label: { ca: "Incineració", es: "Incineración" } },
      {
        icon: "transfer",
        label: {
          ca: "Trasllats nacionals i internacionals",
          es: "Traslados nacionales e internacionales",
        },
      },
      { icon: "building", label: { ca: "Tanatori", es: "Tanatorio" } },
      { icon: "florist", label: { ca: "Floristeria", es: "Floristería" } },
      {
        icon: "document",
        label: { ca: "Gestió documental", es: "Gestión documental" },
      },
      {
        icon: "ceremony",
        label: {
          ca: "Cerimònies religioses i civils",
          es: "Ceremonias religiosas y civiles",
        },
      },
    ],
    ctaLabel: {
      ca: "Veure tots els serveis",
      es: "Ver todos los servicios",
    },
    ctaHref: "#servicios",
  },
  whyUs: {
    eyebrow: { ca: "PER QUÈ ESCOLLIR-NOS", es: "POR QUÉ ELEGIRNOS" },
    heading: {
      ca: "Referència funerària al Baix Berguedà des de Gironella",
      es: "Referencia funeraria en el Baix Berguedà desde Gironella",
    },
    features: [
      {
        icon: "heart-hands",
        title: { ca: "Atenció personalitzada", es: "Atención personalizada" },
        text: {
          ca: "Cada família té necessitats diferents; us escoltem i us acompanyem.",
          es: "Cada familia tiene necesidades distintas; te escuchamos y te acompañamos.",
        },
      },
      {
        icon: "people",
        title: { ca: "Proximitat i confiança", es: "Cercanía y confianza" },
        text: {
          ca: "Un equip humà que us acompanya de debò.",
          es: "Un equipo humano que te acompaña de verdad.",
        },
      },
      {
        icon: "shield",
        title: { ca: "Transparència", es: "Transparencia" },
        text: {
          ca: "Informació clara i preus sense sorpreses.",
          es: "Información clara y precios sin sorpresas.",
        },
      },
      {
        icon: "ribbon",
        title: { ca: "Experiència", es: "Experiencia" },
        text: {
          ca: "Gestió integral de tràmits funeraris a la comarca.",
          es: "Gestión integral de trámites funerarios en la comarca.",
        },
      },
    ],
  },
  obituariesIntro: {
    eyebrow: { ca: "ESQUELES RECENTS", es: "ESQUELAS RECIENTES" },
    heading: { ca: "Homenatges i records", es: "Homenajes y recuerdos" },
    ctaLabel: {
      ca: "Veure totes les esqueles",
      es: "Ver todas las esquelas",
    },
    maxItems: 4,
  },
  ctaBlocks: {
    blocks: [
      {
        variant: "muted" as const,
        icon: "leaf",
        title: {
          ca: "Planifica amb tranquil·litat",
          es: "Planifica con tranquilidad",
        },
        text: {
          ca: "Us ajudem a prendre decisions amb calma i sense presses.",
          es: "Te ayudamos a tomar decisiones con calma y sin prisas.",
        },
        linkLabel: { ca: "Més informació →", es: "Más información →" },
        linkHref: "#contacto",
      },
      {
        variant: "muted" as const,
        icon: "heart-hands",
        title: { ca: "Suport en el dol", es: "Apoyo en el duelo" },
        text: {
          ca: "Recursos i orientació per a familiars en el procés.",
          es: "Recursos y orientación para familiares en el proceso.",
        },
        linkLabel: { ca: "Veure recursos →", es: "Ver recursos →" },
        linkHref: "#contacto",
      },
      {
        variant: "dark" as const,
        icon: "phone",
        title: {
          ca: "Contacteu-nos",
          es: "Contáctanos",
        },
        text: {
          ca: "Estem a la vostra disposició per telèfon per resoldre qualsevol dubte.",
          es: "Estamos a tu disposición por teléfono para resolver cualquier duda.",
        },
        showPhone: true,
      },
    ],
  },
  footer: {
    tagline: {
      ca: "La Funerària Pujols de Gironella — centre funerari de referència del Baix Berguedà.",
      es: "La Funeraria Pujols de Gironella — centro funerario de referencia del Baix Berguedà.",
    },
    linkGroups: [
      {
        title: { ca: "Enllaços", es: "Enlaces" },
        links: [
          { label: { ca: "Inici", es: "Inicio" }, href: "/" },
          { label: { ca: "Esqueles", es: "Esquelas" }, href: "/esquelas" },
          {
            label: { ca: "Sales de vetlla", es: "Salas de velatorio" },
            href: "/sales-de-vetlla",
          },
          {
            label: { ca: "Accés familiars", es: "Acceso familiares" },
            href: "/acceso",
          },
        ],
      },
      {
        title: { ca: "Serveis", es: "Servicios" },
        links: [
          {
            label: { ca: "Funeral complet", es: "Funeral completo" },
            href: "#servicios",
          },
          {
            label: { ca: "Incineració", es: "Incineración" },
            href: "#servicios",
          },
          {
            label: { ca: "Gestió documental", es: "Gestión documental" },
            href: "#servicios",
          },
        ],
      },
    ],
    legal: [
      { label: { ca: "Avís legal", es: "Aviso legal" }, href: "#" },
      {
        label: { ca: "Política de privacitat", es: "Política de privacidad" },
        href: "#",
      },
      {
        label: { ca: "Política de cookies", es: "Política de cookies" },
        href: "#",
      },
    ],
  },
};
