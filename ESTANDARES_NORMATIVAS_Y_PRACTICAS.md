# Estándares de la Industria, Normativas Web, Privacidad y Buenas Prácticas — AmazeMe

**Última actualización:** 17 de noviembre de 2026  
**Proyecto:** AmazeMe (`AmazeMec.Server`, `amazemec.client`, `AmazeMec.Tests`)

---

## 1. Estándares de la Industria para Páginas Web

| Estándar | Qué regula / define | Estado en AmazeMe |
| :--- | :--- | :--- |
| **W3C HTML5 / CSS3 / ECMAScript** | Estructura semántica, estilos modernos y JavaScript estándar | **Cumple:** React 19 + HTML5 semántico (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<article>`, `<footer>`) y jerarquía `h1 → h2 → h3`. |
| **WCAG 2.1 / 2.2 (Accesibilidad)** | Contraste, etiquetas, navegación por teclado y lectores de pantalla | **Cumple:** `htmlFor`/`id` en formularios, `aria-label`/`aria-expanded` en controles, diseño *mobile-first* y contraste verde/blanco. |
| **HTTPS / TLS 1.2+ y HSTS** | Cifrado en tránsito y prevención de downgrade | **Cumple:** `UseHttpsRedirection()`, `UseHsts()` en producción, cookies `SecurePolicy = Always` y TLS en Cloudflare/Azure. |
| **OWASP Top 10 / ASVS** | Seguridad en APIs y aplicaciones web | **Cumple:** BCrypt, EF Core parametrizado, Rate Limiting (`global`, `limiteAutenticacion`, `limiteForo`), `HttpOnly`/`SameSite=Lax`, anti-*Session Fixation*, `CSP` y validación de *magic bytes*. |
| **REST / OpenAPI** | Contratos HTTP claros y documentación de API | **Cumple:** Controladores `[ApiController]`, códigos HTTP semánticos (`200`, `400`, `401`, `403`, `409`, `429`, `500`) y `MapOpenApi()` en desarrollo. |
| **Core Web Vitals / Rendimiento** | Carga diferida, bundles y assets optimizados | **Cumple:** Minificación con Vite, `loading="lazy"`, `Promise.all`, recorte en `<canvas>` (`256×256`), consultas asíncronas e índices en SQL Server. |

---

## 2. Normativas y Cumplimiento Legal

1. **LFPDPPP (México — Derechos ARCO):**
   - **Cumple:** [`Privacidad.jsx`](amazemec.client/src/pages/Privacidad.jsx) declara al responsable (**Luis Issac Olvera Morán**, Gómez Palacio, Durango, México), finalidades, infraestructura (Microsoft Azure) y plazos de respuesta (**20 días hábiles** / **1 mes** RGPD).
   - **Autogestión:** El usuario puede acceder, rectificar o **eliminar definitivamente su cuenta** y datos asociados desde [`Perfil.jsx`](amazemec.client/src/pages/Perfil.jsx) (`DELETE /api/auth/cuenta`).
2. **RGPD / Directiva ePrivacy (Consentimiento de Cookies):**
   - **Cumple:** [`CookieConsent.jsx`](amazemec.client/src/components/CookieConsent.jsx) y [`analitica.js`](amazemec.client/src/utils/analitica.js) bloquean la carga de Google Tag Manager / Google Analytics (`GTM-JDPX665M`) hasta que el usuario pulsa *"Aceptar todas"*.
   - Las cookies propias y analíticas (`_ga`, `_ga_*`) están documentadas con duraciones reales (`14 días`, `24 horas`, `1 año`, `hasta 2 años`).
3. **Atención a Usuarios y Anti-Spam:**
   - **Cumple:** [`Terminos.jsx`](amazemec.client/src/pages/Terminos.jsx) y buzón de quejas en [`Quejas.jsx`](amazemec.client/src/pages/Quejas.jsx) (Formspree con reCAPTCHA).

---

## 3. Buenas Prácticas de Backend y Frontend

### 3.1 Backend (`AmazeMec.Server`)
- **ORM parametrizado (EF Core 10):** Consultas LINQ seguras e índices únicos (`Usuario.Nombre`, `Usuario.Email`, `LikesForo`).
- **Hashing y Auth:** `BCrypt.Net-Next`, `HashFalso` anti-*timing attack*, regeneración de sesión en login.
- **Transacciones y Concurrencia:** `IsolationLevel.Serializable` en `RecompensasController.Canjear` y captura de `DbUpdateException` (`409 Conflict`) en registro/perfil.
- **Logging y Errores:** `ILogger<T>` en controladores y sin exposición de `ex.Message` en respuestas `500`.
- **Fechas consistentes:** Estandarizado a `DateTime.UtcNow` / `DateTime.UtcNow.Date`.
- **Pruebas unitarias:** Suite `AmazeMec.Tests` con xUnit, EF InMemory y Coverlet ejecutada en CI/CD.

### 3.2 Frontend (`amazemec.client`)
- **Modularidad:** Separación en `pages/`, `components/`, `context/`, `utils/` y `styles/`, con variables y funciones en español.
- **Seguridad y Rutas:** `ProtectedRoute`, sanitización de `returnUrl` en `Login`/`Register`, prevención de doble clic en canjes (`canjeandoId` + modal de confirmación).
- **Fuente única de verdad:** `Recompensas.jsx` consume el catálogo directamente desde `GET /api/recompensas/catalogo`.
- **Repositorio limpio:** Eliminados `index.css` y `App.css` residuales; `amazemec.client/dist/` incluido en `.gitignore`.

---

## 4. Pendientes para Etapas Futuras
- Restringir `POST /api/recompensas/compra` con clave/webhook cuando se integre el flujo de afiliados.
- Configurar `UseForwardedHeaders` en `Program.cs` al activar Cloudflare para preservar la IP real en el `RateLimiter`.
- Mostrar recomendaciones reales de productos al finalizar `Cuestionario.jsx`.
- Agregar `robots.txt` y `sitemap.xml` para Google Search Console y actualizar `CSP` / `CookieConsent` al activar Google AdSense.


---

## Ampliación de Estándares, Normativas y Buenas Prácticas (Edición Completa 2026)

### 1. Normativas de Privacidad, Comercio Electrónico y Transparencia Aplicables
El desarrollo y operación de **AmazeMe** se rige por estándares nacionales e internacionales adaptados a plataformas web de recomendación de regalos, programas de fidelidad y comunidades digitales:

| Normativa / Estándar | Ámbito de Aplicación | Cómo se Implementa en AmazeMe | Evidencia en el Proyecto |
| :--- | :--- | :--- | :--- |
| **LFPDPPP (México)** | Protección de datos personales en posesión de particulares | Aviso de privacidad integral, responsable identificado, plazos ARCO (20 días hábiles / 1 mes) y baja definitiva autogestionada | `Privacidad.jsx`, `Perfil.jsx` (`EliminarCuentaCard`) |
| **NMX-COE-001-SCFI / PROFECO** | Transparencia en comercio electrónico y enlaces afiliados | Declaración clara de precios orientativos en MXN, disponibilidad sujeta a Amazon México y aviso de programa de afiliados sin costo extra | `Terminos.jsx` (Sección 2) |
| **OWASP ASVS / Top 10** | Seguridad en aplicaciones web y APIs REST | BCrypt factor 11, cookies HTTP-Only, CSP estricta, ADO.NET parametrizado, validación de *magic bytes* en imágenes y Rate Limiting | `Program.cs`, `AuthController.cs`, `ForoController.cs` |
| **WCAG 2.1 Nivel AA** | Accesibilidad web y contraste visual | Contraste `#1e8e3e` con `#ffffff`, atributos `aria-label`, textos alternativos `alt` en imágenes de productos y fotos del foro | `Cuestionario.jsx`, `Foro.jsx`, `index.css` |
| **ISO/IEC 25010** | Calidad del producto software (usabilidad, seguridad, mantenibilidad) | Separación SPA React + Web API .NET, paginación en foro, manejo de estados de carga/error y respaldo visual en catálogo | `ForoController.cs`, `recomendaciones.js` |

### 2. Estándares de Codificación y Convenciones del Repositorio
1. **Idioma de dominio y variables en Frontend:** Toda nueva lógica de negocio, nombres de funciones auxiliares, estados y mensajes orientados al usuario en React se redactan en **español claro y consistente** (por ejemplo: `cargarPublicaciones`, `imagenesArchivos`, `generarRecomendaciones`, `establecerHayMas`), manteniendo coherencia con el equipo de desarrollo.
2. **Código limpio sin comentarios innecesarios:** Se priorizan identificadores autoexplicativos y funciones pequeñas de responsabilidad única en lugar de comentarios redundantes en JSX/JS.
3. **Diseño responsivo *Mobile-First*:** Todas las vistas utilizan rejillas Bootstrap 5 (`col-12`, `col-md-6`, `col-xl-4`) con controles táctiles accesibles, botones `text-nowrap` para evitar rupturas antiestéticas y anchos máximos adaptativos (`680px` en formularios paso a paso y `1140px` en cuadrículas de resultados).
4. **Manejo estricto de archivos multimedia:**
   * **Foto de perfil:** Máximo 1 archivo, <= 2 MB, formatos `image/jpeg`, `image/png`, `image/webp`, validado tanto en cliente como en servidor por cabecera binaria.
   * **Fotografías del Foro:** Máximo 4 archivos por publicación, <= 3 MB cada uno, mismos formatos permitidos y almacenamiento retrocompatible en `ImagenUrl` (string único o arreglo JSON serializado).

### 3. Reglas Operativas y de Moderación del Foro Comunitario
Para mantener un ambiente útil, seguro y libre de saturación, el Foro de AmazeMe opera bajo reglas técnicas y de convivencia explícitas:
* **Acceso de lectura público y escritura autenticada:** Cualquier visitante puede explorar, filtrar por categoría y buscar opiniones, pero publicar, comentar o reaccionar con *Me gusta* requiere sesión activa verificada por cookie.
* **Paginación obligatoria en listados:** `GET /api/foro` entrega bloques de **10 publicaciones por página** (`pagina`, `tamanoPagina`), evitando descargas masivas innecesarias y mejorando el tiempo de carga inicial.
* **Categorías cerradas y validadas:** Solo se admiten `"Regalo recibido"`, `"Recomendación"`, `"Experiencia"` y `"Duda"`, verificadas en servidor antes de insertar en SQL Server.
* **Prevención de abuso y spam:** La política `limiteForo` restringe a **15 acciones cada 5 minutos** por usuario/IP al crear publicaciones o comentarios; adicionalmente, la restricción única `UQ_LikesForo_Publicacion_Usuario` impide inflar artificialmente los *likes*.
* **Control de autoría:** Cada usuario puede eliminar únicamente sus propias publicaciones o comentarios (`403 Forbid` ante cualquier intento sobre contenido de terceros).

### 4. Estándares de Calidad en Recomendaciones y Monetización Ética
* **Catálogo curado y verificable:** El motor `generarRecomendaciones` evalúa **28 productos reales disponibles en Amazon México**, entregando entre **20 y 24 opciones** ordenadas por compatibilidad (`coincidencia` entre 72% y 99%) y presupuesto.
* **Transparencia visual:** Cada tarjeta muestra imagen representativa (con ilustración vectorial SVG de respaldo ante fallos de red), puntuación de 1 a 5 estrellas codificada por color, precio destacado en MXN y estimado de entrega según los días disponibles del usuario.
* **Uso responsable de Google Analytics / GTM y AdSense:** Las etiquetas de medición y monetización operan bajo consentimiento informado en la Política de Privacidad, sin interferir con el flujo principal del cuestionario ni recopilar datos sensibles de menores.
* **Buzón de Quejas y Sugerencias (`/quejas`):** Canal permanente integrado con Formspree para reportar incidencias técnicas, contenido inapropiado en el foro o ejercer derechos ARCO en los plazos legales vigentes.


### 5. Estándares de Control de Versiones, Revisión de Código y Despliegue (CI/CD)
Para mantener la estabilidad del repositorio **AmazeMec** durante entregas continuas, todo cambio debe cumplir con las siguientes prácticas de ingeniería:

1. **Convención de Ramas y Mensajes de Commit:**
   * Uso de ramas temáticas claras por funcionalidad o módulo (por ejemplo, `Blog-Foro` para el módulo comunitario y mejoras de recomendaciones).
   * Commits descriptivos que indiquen el alcance técnico real sin mezclar refactorizaciones no relacionadas.
2. **Validación Previa a Fusión:**
   * Verificar compilación limpia del cliente React (`npm run build`) sin advertencias críticas de sintaxis o importaciones rotas.
   * Verificar compilación del servidor ASP.NET Core (`dotnet build`) y revisión de advertencias de nulabilidad en C#.
   * Comprobar manualmente la navegación entre rutas principales (`/`, `/cuestionario`, `/foro`, `/recompensas`, `/perfil`, `/privacidad`, `/terminos`, `/quejas`).

### 6. Matriz de Cumplimiento de Privacidad por Funcionalidad
| Dato / Recurso | Base de Legitimación | Dónde se Almacena | Control del Usuario |
| :--- | :--- | :--- | :--- |
| Nombre y correo electrónico | Consentimiento al registrarse | `Usuarios` (SQL Server) | Edición en `/perfil` y baja total |
| Contraseña | Seguridad de acceso | `Usuarios.PasswordHash` (BCrypt) | Cambio con validación de clave actual |
| Foto de perfil (hasta 2 MB) | Consentimiento opcional | `Usuarios.FotoPerfil` (Data URL) | Reemplazo o eliminación de cuenta |
| Respuestas del cuestionario | Prestación del servicio | `Cuestionarios` (SQL Server) | Consulta de historial y borrado al dar de baja |
| Publicaciones y hasta 4 fotos | Participación voluntaria pública | `PublicacionesForo` (SQL Server) | Botón `"Eliminar"` en `/foro` y `/perfil` |
| Comentarios y likes | Interacción comunitaria | `ComentariosForo`, `LikesForo` | Toggle de like / borrado propio de comentario |
| Mensajes de `/quejas` | Atención a soporte y ARCO | Proveedor **Formspree** | Envío voluntario y seguimiento directo |

### 7. Estándares de Diseño Inclusivo y Rendimiento Web
* **Tipografía y Legibilidad:** Tamaños mínimos de cuerpo legible (`0.875rem` – `1rem`), interlineado cómodo (`1.6` – `1.8`) en textos legales y publicaciones del foro, y contraste suficiente en badges de calificación (verde `#1e8e3e`, amarillo `#fbbc04` con texto `#202124`, naranja `#fa7b17` y rojo `#d93025`).
* **Carga Diferida y Paginación:** El foro limita cada petición inicial a **10 publicaciones** para evitar transferir megabytes de imágenes en una sola carga, permitiendo al usuario decidir cuándo cargar la siguiente página.
* **Resiliencia Visual:** Las tarjetas del catálogo recomendado combinan fotografías verificadas con SVG ligeros embebidos (`data:image/svg+xml`), logrando renderizado instantáneo sin bloqueos por latencia de terceros.


### 8. Auditoría Periódica de Normativas y Actualización Documental
Todo cambio funcional relevante en **AmazeMe** (como la adición de paginación, subida múltiple de imágenes o nuevas integraciones de afiliados) debe reflejarse de forma sincronizada en tres puntos antes de considerarse terminado:
1. **Código de cumplimiento en UI:** Páginas `/privacidad` (`Privacidad.jsx`) y `/terminos` (`Terminos.jsx`).
2. **Documentación técnica de repositorio:** `ESTANDARES_NORMATIVAS_Y_PRACTICAS.md`.
3. **Respaldo documental en Google Drive:** Actualización en sitio de los archivos `.md` correspondientes dentro de la carpeta oficial `AmazeMe` sin eliminar históricos ni bitácoras previas.


### 9. Compromiso de Calidad Continua
El cumplimiento de estos estándares garantiza que **AmazeMe** mantenga una experiencia confiable, transparente y segura tanto para sus usuarios finales como para la revisión técnica y académica del proyecto, integrando buenas prácticas de desarrollo web moderno, privacidad desde el diseño y documentación viva sincronizada con el repositorio.

De esta forma, cada nueva funcionalidad incorporada al código fuente cuenta con respaldo explícito en arquitectura, pruebas y cumplimiento normativo vigente, evitando brechas entre lo implementado y lo documentado ante usuarios y evaluadores.

La revisión y actualización continua de estos lineamientos forma parte del ciclo estándar de cada entrega de AmazeMe.
