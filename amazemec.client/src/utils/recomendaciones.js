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

    return {
      ...producto,
      nombreCorto: acortarTexto(producto.nombre, 44),
      etiquetaCorta: acortarTexto(producto.etiquetaCorta, 48),
      coincidencia,
      entrega,
      razon: producto.etiquetaCorta,
      enlaceAmazon: `https://www.amazon.com.mx/s?k=${encodeURIComponent(producto.nombre)}`
    };
  };

  let evaluados = CATALOGO_PRODUCTOS.map((p) => evaluarProducto(p, false)).filter(Boolean);

  if (evaluados.length < 20) {
    const idsPresentes = new Set(evaluados.map((p) => p.id));
    const extras = CATALOGO_PRODUCTOS
      .filter((p) => !idsPresentes.has(p.id))
      .map((p) => evaluarProducto(p, true));
    evaluados = [...evaluados, ...extras];
  }

  evaluados.sort((a, b) => b.coincidencia - a.coincidencia || a.precio - b.precio);

  return evaluados.slice(0, Math.max(20, Math.min(24, evaluados.length)));
}
