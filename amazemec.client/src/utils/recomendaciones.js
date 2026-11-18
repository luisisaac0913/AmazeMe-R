const CATALOGO_PRODUCTOS = [
  {
    id: 1,
    nombre: 'Audífonos Inalámbricos Bluetooth ANC',
    categoria: 'Tecnología',
    precio: 899,
    calificacion: 4.8,
    icono: 'headphones',
    etiquetas: ['música', 'videojuegos', 'tecnología', 'trabajo', 'estudio', 'amigos', 'pareja', 'joven', 'introvertido', 'analítico', 'auriculares', 'audífonos']
  },
  {
    id: 2,
    nombre: 'Proyector Portátil HD para Cine en Casa',
    categoria: 'Tecnología',
    precio: 1650,
    calificacion: 4.7,
    icono: 'videocam',
    etiquetas: ['cine', 'películas', 'pareja', 'familia', 'amigos', 'aniversario', 'navidad', 'hogar', 'entretenimiento']
  },
  {
    id: 3,
    nombre: 'Lámpara de Escritorio LED con Carga Inalámbrica',
    categoria: 'Hogar y Oficina',
    precio: 540,
    calificacion: 4.6,
    icono: 'light',
    etiquetas: ['trabajo', 'estudio', 'lectura', 'minimalista', 'organizado', 'oficina', 'tecnología', 'cumpleaños']
  },
  {
    id: 4,
    nombre: 'Termo Térmico Acero Inoxidable 900ml',
    categoria: 'Estilo de Vida',
    precio: 420,
    calificacion: 4.9,
    icono: 'local_drink',
    etiquetas: ['deporte', 'gimnasio', 'trabajo', 'senderismo', 'aventurero', 'práctico', 'termo', 'viaje', 'amigos', 'familia']
  },
  {
    id: 5,
    nombre: 'Mochila Antirrobo Impermeable para Laptop',
    categoria: 'Accesorios',
    precio: 780,
    calificacion: 4.7,
    icono: 'backpack',
    etiquetas: ['trabajo', 'viaje', 'tecnología', 'estudio', 'mochila', 'práctico', 'minimalista', 'aventurero']
  },
  {
    id: 6,
    nombre: 'Kit Barista: Prensa Francesa y Café de Especialidad',
    categoria: 'Gourmet',
    precio: 620,
    calificacion: 4.8,
    icono: 'coffee',
    etiquetas: ['café', 'cocina', 'familia', 'trabajo', 'aniversario', 'cumpleaños', 'relajado', 'hogar']
  },
  {
    id: 7,
    nombre: 'Reloj Inteligente Deportivo con Monitor de Sueño',
    categoria: 'Tecnología',
    precio: 1190,
    calificacion: 4.6,
    icono: 'watch',
    etiquetas: ['deporte', 'salud', 'correr', 'gimnasio', 'tecnología', 'pareja', 'activo', 'cumpleaños']
  },
  {
    id: 8,
    nombre: 'Set de Aromaterapia con Difusor Ultrasónico',
    categoria: 'Bienestar',
    precio: 490,
    calificacion: 4.8,
    icono: 'spa',
    etiquetas: ['relajación', 'yoga', 'hogar', 'familia', 'pareja', 'tranquilo', 'navidad', 'aniversario']
  },
  {
    id: 9,
    nombre: 'Teclado Mecánico Compacto Retroiluminado',
    categoria: 'Gaming y PC',
    precio: 950,
    calificacion: 4.8,
    icono: 'keyboard',
    etiquetas: ['videojuegos', 'gaming', 'computación', 'programación', 'trabajo', 'tecnología', 'amigos', 'joven']
  },
  {
    id: 10,
    nombre: 'Juego de Mesa Estratégico para Reuniones',
    categoria: 'Entretenimiento',
    precio: 580,
    calificacion: 4.9,
    icono: 'casino',
    etiquetas: ['amigos', 'familia', 'juegos', 'extrovertido', 'divertido', 'fiesta', 'cumpleaños', 'navidad']
  },
  {
    id: 11,
    nombre: 'Luz de Lectura Recargable + Separador Magnético',
    categoria: 'Lectura',
    precio: 290,
    calificacion: 4.7,
    icono: 'menu_book',
    etiquetas: ['lectura', 'libros', 'libro', 'introvertido', 'tranquilo', 'estudio', 'creativo', 'económico']
  },
  {
    id: 12,
    nombre: 'Set Profesional de Dibujo y Acuarelas 48 Piezas',
    categoria: 'Arte y Creatividad',
    precio: 530,
    calificacion: 4.8,
    icono: 'palette',
    etiquetas: ['arte', 'dibujo', 'pintura', 'creativo', 'artístico', 'manualidades', 'joven', 'cumpleaños']
  },
  {
    id: 13,
    nombre: 'Bocina Portátil Resistente al Agua IPX7',
    categoria: 'Audio',
    precio: 740,
    calificacion: 4.7,
    icono: 'speaker',
    etiquetas: ['música', 'fiesta', 'viaje', 'playa', 'amigos', 'extrovertido', 'aventurero', 'pareja']
  },
  {
    id: 14,
    nombre: 'Cámara Instantánea Retro con Paquete de Películas',
    categoria: 'Fotografía',
    precio: 1890,
    calificacion: 4.8,
    icono: 'photo_camera',
    etiquetas: ['fotografía', 'viaje', 'recuerdos', 'pareja', 'amigos', 'aniversario', 'creativo', 'extrovertido']
  },
  {
    id: 15,
    nombre: 'Manta Ponderada Suave para Descanso Profundo',
    categoria: 'Hogar',
    precio: 850,
    calificacion: 4.7,
    icono: 'bed',
    etiquetas: ['hogar', 'descanso', 'lectura', 'películas', 'familia', 'pareja', 'tranquilo', 'navidad']
  },
  {
    id: 16,
    nombre: 'Kit de Jardinería Urbana y Macetas Cerámicas',
    categoria: 'Hogar y Jardín',
    precio: 460,
    calificacion: 4.6,
    icono: 'potted_plant',
    etiquetas: ['jardinería', 'plantas', 'hogar', 'naturaleza', 'familia', 'tranquilo', 'ecológico']
  },
  {
    id: 17,
    nombre: 'Batería Portátil Carga Rápida 20,000 mAh',
    categoria: 'Tecnología',
    precio: 520,
    calificacion: 4.8,
    icono: 'battery_charging_full',
    etiquetas: ['viaje', 'trabajo', 'tecnología', 'estudio', 'aventurero', 'práctico', 'amigos']
  },
  {
    id: 18,
    nombre: 'Organizador de Escritorio Modular en Bambú',
    categoria: 'Oficina',
    precio: 390,
    calificacion: 4.6,
    icono: 'desk',
    etiquetas: ['trabajo', 'oficina', 'estudio', 'minimalista', 'organizado', 'práctico', 'ecológico']
  },
  {
    id: 19,
    nombre: 'Sudadera Minimalista de Algodón Orgánico',
    categoria: 'Moda',
    precio: 680,
    calificacion: 4.7,
    icono: 'checkroom',
    etiquetas: ['moda', 'ropa', 'minimalista', 'pareja', 'amigos', 'navidad', 'cumpleaños', 'cómodo']
  },
  {
    id: 20,
    nombre: 'Set de Cuchillos y Tabla de Quesos Gourmet',
    categoria: 'Cocina',
    precio: 790,
    calificacion: 4.8,
    icono: 'restaurant',
    etiquetas: ['cocina', 'gastronomía', 'familia', 'pareja', 'aniversario', 'boda', 'hogar']
  },
  {
    id: 21,
    nombre: 'Tapete Antideslizante para Yoga y Entrenamiento',
    categoria: 'Deporte',
    precio: 480,
    calificacion: 4.7,
    icono: 'fitness_center',
    etiquetas: ['deporte', 'yoga', 'gimnasio', 'salud', 'activo', 'bienestar', 'amigos']
  },
  {
    id: 22,
    nombre: 'Libreta Inteligente Reutilizable con Pluma',
    categoria: 'Productividad',
    precio: 610,
    calificacion: 4.6,
    icono: 'edit_note',
    etiquetas: ['estudio', 'trabajo', 'lectura', 'analítico', 'organizado', 'tecnología', 'graduación']
  },
  {
    id: 23,
    nombre: 'Taza Eléctrica Calentadora para Escritorio',
    categoria: 'Hogar y Oficina',
    precio: 450,
    calificacion: 4.7,
    icono: 'emoji_food_beverage',
    etiquetas: ['café', 'té', 'trabajo', 'oficina', 'lectura', 'invierno', 'navidad', 'práctico']
  },
  {
    id: 24,
    nombre: 'Mouse Ergonómico Inalámbrico Silencioso',
    categoria: 'Tecnología',
    precio: 430,
    calificacion: 4.7,
    icono: 'mouse',
    etiquetas: ['trabajo', 'computación', 'videojuegos', 'oficina', 'estudio', 'práctico', 'minimalista']
  },
  {
    id: 25,
    nombre: 'Caja de Chocolates Artesanales Surtidos',
    categoria: 'Gourmet',
    precio: 360,
    calificacion: 4.9,
    icono: 'cake',
    etiquetas: ['dulces', 'pareja', 'familia', 'amigos', 'san valentín', 'cumpleaños', 'aniversario', 'detalle']
  },
  {
    id: 26,
    nombre: 'Soporte Plegable de Aluminio para Laptop',
    categoria: 'Oficina',
    precio: 340,
    calificacion: 4.8,
    icono: 'laptop_mac',
    etiquetas: ['trabajo', 'estudio', 'tecnología', 'oficina', 'minimalista', 'práctico']
  },
  {
    id: 27,
    nombre: 'Mini Huerto Hidropónico con Luz LED',
    categoria: 'Hogar y Jardín',
    precio: 1120,
    calificacion: 4.7,
    icono: 'eco',
    etiquetas: ['jardinería', 'cocina', 'plantas', 'hogar', 'familia', 'tecnología', 'ecológico']
  },
  {
    id: 28,
    nombre: 'Set de Coctelería en Acero Inoxidable 10 Piezas',
    categoria: 'Entretenimiento',
    precio: 690,
    calificacion: 4.8,
    icono: 'local_bar',
    etiquetas: ['fiesta', 'amigos', 'cocina', 'extrovertido', 'cumpleaños', 'reuniones']
  }
];

function normalizarTexto(valor) {
  return (valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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
    const razones = [];

    const coincidencias = producto.etiquetas.filter((etiqueta) =>
      textoPerfil.includes(normalizarTexto(etiqueta))
    );

    if (coincidencias.length > 0) {
      puntaje += Math.min(18, coincidencias.length * 6);
      razones.push(`Afín a ${coincidencias.slice(0, 2).join(' y ')}`);
    }

    if (objetoQuerido && (nombreNorm.includes(objetoQuerido) || coincidencias.some((c) => objetoQuerido.includes(normalizarTexto(c))))) {
      puntaje += 12;
      razones.push('Coincide con lo que desea');
    }

    if (presupuesto > 0) {
      const proporcion = producto.precio / presupuesto;
      if (proporcion <= 1.05 && proporcion >= 0.35) {
        puntaje += 7;
        razones.push('Ideal para tu presupuesto');
      } else if (proporcion <= 1.25) {
        puntaje += 2;
      } else {
        puntaje -= 6;
      }
    }

    const entrega = dias <= 2 ? 'Envío Express (24 hrs)' : dias <= 5 ? 'Entrega en 2-3 días' : 'Envío estándar gratis';
    const coincidencia = Math.max(72, Math.min(99, puntaje));

    if (razones.length === 0) {
      razones.push(`Popular para ${datosFormulario.relacion || 'regalar'}`);
    }

    return {
      ...producto,
      coincidencia,
      entrega,
      razon: razones.join(' • '),
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

