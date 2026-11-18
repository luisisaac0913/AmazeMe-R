const PALETA_CATEGORIAS = {
  'Tecnología': { fondo: '#ecfdf5', acento: '#059669', secundaria: '#a7f3d0' },
  'Hogar y Oficina': { fondo: '#f0fdf4', acento: '#15803d', secundaria: '#bbf7d0' },
  'Estilo de Vida': { fondo: '#eff6ff', acento: '#0284c7', secundaria: '#bae6fd' },
  'Accesorios': { fondo: '#f8fafc', acento: '#0f766e', secundaria: '#99f6e4' },
  'Gourmet': { fondo: '#fffbeb', acento: '#b45309', secundaria: '#fde68a' },
  'Bienestar': { fondo: '#fdf4ff', acento: '#7e22ce', secundaria: '#e9d5ff' },
  'Gaming y PC': { fondo: '#f0f9ff', acento: '#0369a1', secundaria: '#bae6fd' },
  'Entretenimiento': { fondo: '#fef2f2', acento: '#b91c1c', secundaria: '#fecaca' },
  'Lectura': { fondo: '#fffbeb', acento: '#92400e', secundaria: '#fde68a' },
  'Arte y Creatividad': { fondo: '#fff1f2', acento: '#be123c', secundaria: '#fecdd3' },
  'Audio': { fondo: '#ecfeff', acento: '#0e7490', secundaria: '#a5f3fc' },
  'Fotografía': { fondo: '#f5f3ff', acento: '#6d28d9', secundaria: '#ddd6fe' },
  'Hogar': { fondo: '#f0fdf4', acento: '#166534', secundaria: '#bbf7d0' },
  'Hogar y Jardín': { fondo: '#ecfdf5', acento: '#047857', secundaria: '#a7f3d0' },
  'Oficina': { fondo: '#f8fafc', acento: '#334155', secundaria: '#cbd5e1' },
  'Cuidado Personal': { fondo: '#eff6ff', acento: '#1d4ed8', secundaria: '#bfdbfe' },
  'Cocina': { fondo: '#fff7ed', acento: '#c2410c', secundaria: '#fed7aa' },
  'Deporte': { fondo: '#ecfdf5', acento: '#0d9488', secundaria: '#99f6e4' },
  'Productividad': { fondo: '#eef2ff', acento: '#4338ca', secundaria: '#c7d2fe' }
};

function obtenerIlustracionSvg(id, acento, secundaria) {
  const figuras = {
    1: `<path d="M90 112v-16a30 30 0 0 1 60 0v16" fill="none" stroke="${acento}" stroke-width="6" stroke-linecap="round"/><rect x="82" y="106" width="16" height="28" rx="8" fill="${acento}"/><rect x="142" y="106" width="16" height="28" rx="8" fill="${acento}"/>`,
    2: `<rect x="78" y="82" width="84" height="54" rx="10" fill="${acento}"/><circle cx="136" cy="109" r="16" fill="#fff"/><circle cx="136" cy="109" r="9" fill="${secundaria}"/><rect x="88" y="96" width="24" height="8" rx="4" fill="#fff"/>`,
    3: `<path d="M95 138h50M120 138V92l-22-18" fill="none" stroke="${acento}" stroke-width="6" stroke-linecap="round"/><path d="M84 74h32l-8 14H92z" fill="${secundaria}" stroke="${acento}" stroke-width="3"/>`,
    4: `<rect x="102" y="66" width="36" height="12" rx="4" fill="${acento}"/><rect x="98" y="78" width="44" height="64" rx="10" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><line x1="108" y1="104" x2="132" y2="104" stroke="${acento}" stroke-width="4" stroke-linecap="round"/>`,
    5: `<rect x="88" y="74" width="64" height="72" rx="14" fill="${acento}"/><path d="M106 74v-8a14 14 0 0 1 28 0v8" fill="none" stroke="${acento}" stroke-width="5"/><rect x="98" y="102" width="44" height="28" rx="6" fill="${secundaria}"/>`,
    6: `<rect x="94" y="76" width="52" height="64" rx="8" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><line x1="120" y1="64" x2="120" y2="112" stroke="${acento}" stroke-width="4"/><line x1="98" y1="112" x2="142" y2="112" stroke="${acento}" stroke-width="4"/>`,
    7: `<rect x="108" y="60" width="24" height="92" rx="10" fill="${secundaria}" stroke="${acento}" stroke-width="3"/><rect x="102" y="80" width="36" height="50" rx="12" fill="${acento}"/><circle cx="120" cy="105" r="9" fill="#fff"/>`,
    8: `<path d="M90 138c0-26 14-48 30-56 16 8 30 30 30 56z" fill="${acento}"/><path d="M114 70c0-6 6-10 6-16M126 70c0-6 6-10 6-16" stroke="${acento}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    9: `<rect x="68" y="88" width="104" height="44" rx="8" fill="${acento}"/><rect x="76" y="96" width="14" height="10" rx="2" fill="#fff"/><rect x="94" y="96" width="14" height="10" rx="2" fill="${secundaria}"/><rect x="112" y="96" width="14" height="10" rx="2" fill="#fff"/><rect x="130" y="96" width="14" height="10" rx="2" fill="${secundaria}"/><rect x="148" y="96" width="16" height="10" rx="2" fill="#fff"/><rect x="86" y="112" width="68" height="10" rx="3" fill="#fff"/>`,
    10: `<polygon points="120,66 154,86 154,126 120,146 86,126 86,86" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><circle cx="120" cy="106" r="14" fill="${acento}"/>`,
    11: `<path d="M96 136c-8-24 2-52 24-52s32 28 24 52" fill="none" stroke="${acento}" stroke-width="6" stroke-linecap="round"/><circle cx="96" cy="136" r="9" fill="${secundaria}" stroke="${acento}" stroke-width="3"/><circle cx="144" cy="136" r="9" fill="${secundaria}" stroke="${acento}" stroke-width="3"/>`,
    12: `<rect x="84" y="82" width="12" height="58" rx="3" fill="${acento}"/><rect x="102" y="74" width="12" height="66" rx="3" fill="${secundaria}" stroke="${acento}" stroke-width="2"/><rect x="120" y="78" width="12" height="62" rx="3" fill="${acento}"/><rect x="138" y="86" width="12" height="54" rx="3" fill="${secundaria}" stroke="${acento}" stroke-width="2"/>`,
    13: `<rect x="80" y="80" width="80" height="56" rx="14" fill="${acento}"/><circle cx="104" cy="108" r="14" fill="${secundaria}"/><circle cx="136" cy="108" r="14" fill="#fff"/>`,
    14: `<rect x="78" y="78" width="84" height="64" rx="12" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><circle cx="120" cy="110" r="18" fill="${acento}"/><circle cx="120" cy="110" r="9" fill="#fff"/><rect x="88" y="86" width="14" height="10" rx="3" fill="${acento}"/>`,
    15: `<rect x="78" y="82" width="84" height="56" rx="12" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><path d="M78 104h84M106 82v56M134 82v56" stroke="${acento}" stroke-width="3"/>`,
    16: `<polygon points="88,108 112,108 106,138 94,138" fill="${acento}"/><polygon points="128,108 152,108 146,138 134,138" fill="${acento}"/><circle cx="100" cy="94" r="12" fill="${secundaria}" stroke="${acento}" stroke-width="3"/><circle cx="140" cy="94" r="12" fill="${secundaria}" stroke="${acento}" stroke-width="3"/>`,
    17: `<rect x="92" y="68" width="56" height="76" rx="10" fill="${acento}"/><path d="M122 86l-10 18h10l-4 18 14-20h-10z" fill="#fff"/>`,
    18: `<rect x="76" y="96" width="88" height="40" rx="6" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><rect x="86" y="76" width="24" height="20" rx="3" fill="${acento}"/><rect x="120" y="82" width="32" height="14" rx="3" fill="${acento}"/>`,
    19: `<rect x="108" y="64" width="24" height="16" rx="3" fill="${acento}"/><rect x="92" y="80" width="56" height="62" rx="12" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><circle cx="120" cy="111" r="13" fill="#fff"/>`,
    20: `<rect x="76" y="96" width="88" height="40" rx="8" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><path d="M96 76l34 34-8 8-34-34z" fill="${acento}"/>`,
    21: `<ellipse cx="96" cy="108" rx="14" ry="26" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><rect x="96" y="82" width="54" height="52" rx="6" fill="${acento}"/>`,
    22: `<rect x="88" y="72" width="64" height="72" rx="8" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><line x1="102" y1="92" x2="138" y2="92" stroke="${acento}" stroke-width="4" stroke-linecap="round"/><line x1="102" y1="108" x2="138" y2="108" stroke="${acento}" stroke-width="4" stroke-linecap="round"/><line x1="102" y1="124" x2="126" y2="124" stroke="${acento}" stroke-width="4" stroke-linecap="round"/>`,
    23: `<rect x="88" y="128" width="64" height="12" rx="6" fill="${acento}"/><rect x="98" y="84" width="44" height="44" rx="8" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><path d="M142 94h10a8 8 0 0 1 0 16h-10" fill="none" stroke="${acento}" stroke-width="4"/>`,
    24: `<rect x="98" y="72" width="44" height="68" rx="22" fill="${acento}"/><line x1="120" y1="84" x2="120" y2="100" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
    25: `<rect x="78" y="82" width="84" height="56" rx="10" fill="${secundaria}" stroke="${acento}" stroke-width="4"/><circle cx="102" cy="110" r="11" fill="${acento}"/><circle cx="120" cy="110" r="11" fill="#fff" stroke="${acento}" stroke-width="3"/><circle cx="138" cy="110" r="11" fill="${acento}"/>`,
    26: `<path d="M84 134h72M96 134l38-44M104 90h42" fill="none" stroke="${acento}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
    27: `<circle cx="120" cy="106" r="36" fill="${acento}"/><circle cx="120" cy="106" r="24" fill="${secundaria}"/><circle cx="120" cy="106" r="10" fill="#fff"/>`,
    28: `<polygon points="104,76 136,76 130,138 110,138" fill="${acento}"/><rect x="110" y="64" width="20" height="12" rx="4" fill="${secundaria}" stroke="${acento}" stroke-width="3"/>`
  };
  return figuras[id] || `<circle cx="120" cy="106" r="30" fill="${acento}"/>`;
}

function crearImagenProductoSvg(producto) {
  const paleta = PALETA_CATEGORIAS[producto.categoria] || {
    fondo: '#ecfdf5',
    acento: '#059669',
    secundaria: '#a7f3d0'
  };
  const figura = obtenerIlustracionSvg(producto.id, paleta.acento, paleta.secundaria);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180"><rect width="240" height="180" rx="16" fill="${paleta.fondo}"/><circle cx="120" cy="104" r="56" fill="#ffffff" opacity="0.85"/>${figura}<rect x="14" y="14" width="110" height="22" rx="11" fill="${paleta.acento}" opacity="0.14"/><text x="24" y="29" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="${paleta.acento}">${producto.categoria}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const IMAGENES_AMAZON_VERIFICADAS = {
  2: 'https://m.media-amazon.com/images/I/71Z6h+gWgnL._AC_SY300_SX300_QL70_ML2_.jpg',
  19: 'https://m.media-amazon.com/images/I/51zkNhKcjkL._AC_SY300_SX300_QL70_ML2_.jpg'
};

const CATALOGO_PRODUCTOS = [
  {
    id: 1,
    nombre: 'Sony WH-CH520 Audífonos Bluetooth',
    etiquetaCorta: 'Hasta 50h de batería • Carga rápida',
    categoria: 'Tecnología',
    precio: 899,
    calificacion: 4.8,
    etiquetas: ['música', 'videojuegos', 'tecnología', 'trabajo', 'estudio', 'amigos', 'pareja', 'joven', 'introvertido', 'analítico', 'auriculares', 'audífonos']
  },
  {
    id: 2,
    nombre: 'Wanbo X7 Pro Max Proyector Portátil',
    etiquetaCorta: '1500 lúmenes ANSI • Google TV integrado',
    categoria: 'Tecnología',
    precio: 2490,
    calificacion: 4.7,
    etiquetas: ['cine', 'películas', 'pareja', 'familia', 'amigos', 'aniversario', 'navidad', 'hogar', 'entretenimiento']
  },
  {
    id: 3,
    nombre: 'Lámpara LED Escritorio Carga Qi',
    etiquetaCorta: '3 modos de luz • Puerto USB integrado',
    categoria: 'Hogar y Oficina',
    precio: 540,
    calificacion: 4.3,
    etiquetas: ['trabajo', 'estudio', 'lectura', 'minimalista', 'organizado', 'oficina', 'tecnología', 'cumpleaños']
  },
  {
    id: 4,
    nombre: 'YETI Rambler Termo Térmico 887 ml',
    etiquetaCorta: 'Acero inoxidable • Mantiene frío/calor',
    categoria: 'Estilo de Vida',
    precio: 790,
    calificacion: 4.9,
    etiquetas: ['deporte', 'gimnasio', 'trabajo', 'senderismo', 'aventurero', 'práctico', 'termo', 'viaje', 'amigos', 'familia']
  },
  {
    id: 5,
    nombre: 'Samsonite Mochila Laptop 15.6"',
    etiquetaCorta: 'Impermeable • Bolsillo antirrobo oculto',
    categoria: 'Accesorios',
    precio: 1150,
    calificacion: 4.7,
    etiquetas: ['trabajo', 'viaje', 'tecnología', 'estudio', 'mochila', 'práctico', 'minimalista', 'aventurero']
  },
  {
    id: 6,
    nombre: 'Oster Prensa Francesa + Café Garat',
    etiquetaCorta: 'Vidrio borosilicato • Tueste gourmet',
    categoria: 'Gourmet',
    precio: 620,
    calificacion: 4.6,
    etiquetas: ['café', 'cocina', 'familia', 'trabajo', 'aniversario', 'cumpleaños', 'relajado', 'hogar']
  },
  {
    id: 7,
    nombre: 'Xiaomi Smart Band 9 Reloj Deportivo',
    etiquetaCorta: 'Pantalla AMOLED • Monitor de sueño',
    categoria: 'Tecnología',
    precio: 849,
    calificacion: 4.8,
    etiquetas: ['deporte', 'salud', 'correr', 'gimnasio', 'tecnología', 'pareja', 'activo', 'cumpleaños']
  },
  {
    id: 8,
    nombre: 'Difusor Aromaterapia VicTsing 300 ml',
    etiquetaCorta: 'Niebla fría ultrasónica • 7 luces LED',
    categoria: 'Bienestar',
    precio: 490,
    calificacion: 4.4,
    etiquetas: ['relajación', 'yoga', 'hogar', 'familia', 'pareja', 'tranquilo', 'navidad', 'aniversario']
  },
  {
    id: 9,
    nombre: 'HyperX Alloy Origins 60 Mecánico',
    etiquetaCorta: 'Switches táctiles • Iluminación RGB',
    categoria: 'Gaming y PC',
    precio: 1590,
    calificacion: 4.8,
    etiquetas: ['videojuegos', 'gaming', 'computación', 'programación', 'trabajo', 'tecnología', 'amigos', 'joven']
  },
  {
    id: 10,
    nombre: 'Catan El Juego de Mesa Estratégico',
    etiquetaCorta: '3 a 4 jugadores • Edición en español',
    categoria: 'Entretenimiento',
    precio: 749,
    calificacion: 4.9,
    etiquetas: ['amigos', 'familia', 'juegos', 'extrovertido', 'divertido', 'fiesta', 'cumpleaños', 'navidad']
  },
  {
    id: 11,
    nombre: 'Glocusent Luz de Lectura Recargable',
    etiquetaCorta: '3 temperaturas de color • Cuello flexible',
    categoria: 'Lectura',
    precio: 320,
    calificacion: 4.7,
    etiquetas: ['lectura', 'libros', 'libro', 'introvertido', 'tranquilo', 'estudio', 'creativo', 'económico']
  },
  {
    id: 12,
    nombre: 'Prismacolor Premier Set 48 Lápices',
    etiquetaCorta: 'Minas suaves • Pigmentación profesional',
    categoria: 'Arte y Creatividad',
    precio: 980,
    calificacion: 4.9,
    etiquetas: ['arte', 'dibujo', 'pintura', 'creativo', 'artístico', 'manualidades', 'joven', 'cumpleaños']
  },
  {
    id: 13,
    nombre: 'JBL Go 4 Bocina Portátil IP67',
    etiquetaCorta: 'Resistente al agua y polvo • 7h audio',
    categoria: 'Audio',
    precio: 899,
    calificacion: 4.8,
    etiquetas: ['música', 'fiesta', 'viaje', 'playa', 'amigos', 'extrovertido', 'aventurero', 'pareja']
  },
  {
    id: 14,
    nombre: 'Fujifilm Instax Mini 12 Instantánea',
    etiquetaCorta: 'Espejo selfie • Exposición automática',
    categoria: 'Fotografía',
    precio: 1890,
    calificacion: 4.8,
    etiquetas: ['fotografía', 'viaje', 'recuerdos', 'pareja', 'amigos', 'aniversario', 'creativo', 'extrovertido']
  },
  {
    id: 15,
    nombre: 'Bedsure Manta Ponderada Suave',
    etiquetaCorta: 'Microfibra transpirable • Efecto calma',
    categoria: 'Hogar',
    precio: 850,
    calificacion: 4.5,
    etiquetas: ['hogar', 'descanso', 'lectura', 'películas', 'familia', 'pareja', 'tranquilo', 'navidad']
  },
  {
    id: 16,
    nombre: 'Kit Jardinería Suculentas 3 Macetas',
    etiquetaCorta: 'Cerámica blanca • Herramientas mini',
    categoria: 'Hogar y Jardín',
    precio: 460,
    calificacion: 4.2,
    etiquetas: ['jardinería', 'plantas', 'hogar', 'naturaleza', 'familia', 'tranquilo', 'ecológico']
  },
  {
    id: 17,
    nombre: 'Anker PowerCore 20,000 mAh',
    etiquetaCorta: 'Carga rápida PowerIQ • Doble puerto',
    categoria: 'Tecnología',
    precio: 799,
    calificacion: 4.8,
    etiquetas: ['viaje', 'trabajo', 'tecnología', 'estudio', 'aventurero', 'práctico', 'amigos']
  },
  {
    id: 18,
    nombre: 'Organizador Escritorio en Bambú',
    etiquetaCorta: '5 compartimentos • Acabado natural',
    categoria: 'Oficina',
    precio: 390,
    calificacion: 4.1,
    etiquetas: ['trabajo', 'oficina', 'estudio', 'minimalista', 'organizado', 'práctico', 'ecológico']
  },
  {
    id: 19,
    nombre: 'Nautica Blue Eau de Toilette 100 ml',
    etiquetaCorta: 'Fragancia acuática fresca • Clásico',
    categoria: 'Cuidado Personal',
    precio: 549,
    calificacion: 4.7,
    etiquetas: ['moda', 'ropa', 'minimalista', 'pareja', 'amigos', 'navidad', 'cumpleaños', 'cómodo']
  },
  {
    id: 20,
    nombre: 'Tramontina Set Cuchillos + Tabla Bambú',
    etiquetaCorta: 'Acero inoxidable • 6 piezas cocina',
    categoria: 'Cocina',
    precio: 790,
    calificacion: 4.6,
    etiquetas: ['cocina', 'gastronomía', 'familia', 'pareja', 'aniversario', 'boda', 'hogar']
  },
  {
    id: 21,
    nombre: 'Gaiam Tapete Yoga Antideslizante 6mm',
    etiquetaCorta: 'Espuma alta densidad • Incluye correa',
    categoria: 'Deporte',
    precio: 520,
    calificacion: 4.4,
    etiquetas: ['deporte', 'yoga', 'gimnasio', 'salud', 'activo', 'bienestar', 'amigos']
  },
  {
    id: 22,
    nombre: 'Rocketbook Core Libreta Inteligente',
    etiquetaCorta: 'Páginas reutilizables • Escaneo a nube',
    categoria: 'Productividad',
    precio: 680,
    calificacion: 4.5,
    etiquetas: ['estudio', 'trabajo', 'lectura', 'analítico', 'organizado', 'tecnología', 'graduación']
  },
  {
    id: 23,
    nombre: 'Calentador de Taza USB Escritorio',
    etiquetaCorta: '3 niveles de calor • Apagado automático',
    categoria: 'Hogar y Oficina',
    precio: 420,
    calificacion: 3.9,
    etiquetas: ['café', 'té', 'trabajo', 'oficina', 'lectura', 'invierno', 'navidad', 'práctico']
  },
  {
    id: 24,
    nombre: 'Logitech G305 Lightspeed Inalámbrico',
    etiquetaCorta: 'Sensor HERO 12K • 250h por batería',
    categoria: 'Tecnología',
    precio: 849,
    calificacion: 4.9,
    etiquetas: ['trabajo', 'computación', 'videojuegos', 'oficina', 'estudio', 'práctico', 'minimalista']
  },
  {
    id: 25,
    nombre: 'Ferrero Rocher Colección 24 Piezas',
    etiquetaCorta: 'Avellana y chocolate • Estuche regalo',
    categoria: 'Gourmet',
    precio: 360,
    calificacion: 4.9,
    etiquetas: ['dulces', 'pareja', 'familia', 'amigos', 'san valentín', 'cumpleaños', 'aniversario', 'detalle']
  },
  {
    id: 26,
    nombre: 'UGREEN Soporte Aluminio para Laptop',
    etiquetaCorta: 'Plegable 5 ángulos • Disipa el calor',
    categoria: 'Oficina',
    precio: 380,
    calificacion: 4.7,
    etiquetas: ['trabajo', 'estudio', 'tecnología', 'oficina', 'minimalista', 'práctico']
  },
  {
    id: 27,
    nombre: 'Echo Dot 5.ª Gen Bocina Inteligente',
    etiquetaCorta: 'Alexa integrada • Audio mejorado',
    categoria: 'Tecnología',
    precio: 1299,
    calificacion: 4.8,
    etiquetas: ['música', 'hogar', 'tecnología', 'familia', 'pareja', 'navidad', 'práctico']
  },
  {
    id: 28,
    nombre: 'Cuisinart Set Coctelería 10 Piezas',
    etiquetaCorta: 'Coctelera acero inox • Base de madera',
    categoria: 'Entretenimiento',
    precio: 740,
    calificacion: 4.6,
    etiquetas: ['fiesta', 'amigos', 'cocina', 'extrovertido', 'cumpleaños', 'reuniones']
  }
];

function normalizarTexto(valor) {
  return (valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function acortarTexto(texto, maximo) {
  if (!texto || texto.length <= maximo) return texto;
  return `${texto.slice(0, maximo - 1).trim()}…`;
}

export function generarRecomendaciones(datosFormulario) {
  const relacion = normalizarTexto(datosFormulario.relacion);
  const ocasion = normalizarTexto(datosFormulario.ocasion);
  const pasatiempos = normalizarTexto(datosFormulario.pasatiempos);
  const personalidad = normalizarTexto(datosFormulario.personalidad);
  const objetoQuerido = normalizarTexto(datosFormulario.objetoQuerido);
  const objetoNoquerido = normalizarTexto(datosFormulario.objetoNoquerido);
  const presupuesto = Number(datosFormulario.presupuesto) || 500;
  const dias = Number(datosFormulario.dias) || 7;

  const palabrasNoQueridas = objetoNoquerido
    .split(/[\s,;]+/)
    .map((palabra) => palabra.trim())
    .filter((palabra) => palabra.length >= 3);

  const textoPerfil = `${relacion} ${ocasion} ${pasatiempos} ${personalidad} ${objetoQuerido}`;

  const evaluarProducto = (producto, ignorarFiltro) => {
    const nombreNorm = normalizarTexto(producto.nombre);
    const categoriaNorm = normalizarTexto(producto.categoria);

    if (!ignorarFiltro) {
      const bloqueado = palabrasNoQueridas.some(
        (palabra) => nombreNorm.includes(palabra) || categoriaNorm.includes(palabra)
      );
      if (bloqueado) return null;
    }

    let puntaje = 74;

    const coincidencias = producto.etiquetas.filter((etiqueta) =>
      textoPerfil.includes(normalizarTexto(etiqueta))
    );

    if (coincidencias.length > 0) {
      puntaje += Math.min(18, coincidencias.length * 6);
    }

    if (objetoQuerido && (nombreNorm.includes(objetoQuerido) || coincidencias.some((c) => objetoQuerido.includes(normalizarTexto(c))))) {
      puntaje += 12;
    }

    if (presupuesto > 0) {
      const proporcion = producto.precio / presupuesto;
      if (proporcion <= 1.05 && proporcion >= 0.35) {
        puntaje += 7;
      } else if (proporcion <= 1.25) {
        puntaje += 2;
      } else {
        puntaje -= 6;
      }
    }

    const entrega = dias <= 2 ? 'Envío Express (24 hrs)' : dias <= 5 ? 'Entrega en 2-3 días' : 'Envío estándar gratis';
    const coincidencia = Math.max(72, Math.min(99, puntaje));
    const imagenRespaldo = crearImagenProductoSvg(producto);
    const imagenBusqueda = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(`${producto.nombre} amazon`)}&w=480&h=480&c=7&rs=1&p=0`;
    const imagen = IMAGENES_AMAZON_VERIFICADAS[producto.id] || imagenBusqueda;

    return {
      ...producto,
      nombreCorto: acortarTexto(producto.nombre, 44),
      etiquetaCorta: acortarTexto(producto.etiquetaCorta, 48),
      coincidencia,
      entrega,
      imagen,
      imagenRespaldo,
      razon: producto.etiquetaCorta,
      enlaceAmazon: `https://www.amazon.com.mx/s?k=${encodeURIComponent(producto.nombre)}`
    };
  };

  let evaluados = CATALOGO_PRODUCTOS.map((p) => evaluarProducto(p, false)).filter(Boolean);

  if (evaluados.length < 3) {
    const idsPresentes = new Set(evaluados.map((p) => p.id));
    const extras = CATALOGO_PRODUCTOS
      .filter((p) => !idsPresentes.has(p.id))
      .map((p) => evaluarProducto(p, true));
    evaluados = [...evaluados, ...extras];
  }

  evaluados.sort((a, b) => b.coincidencia - a.coincidencia || a.precio - b.precio);

  return evaluados.slice(0, 3);
}
