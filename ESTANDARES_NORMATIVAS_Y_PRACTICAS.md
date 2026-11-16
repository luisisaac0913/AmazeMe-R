# Estándares de la Industria, Normativas Web, Privacidad y Buenas Prácticas — AmazeMe

**Fecha:** 16 de noviembre de 2026  
**Proyecto:** AmazeMe (`AmazeMec.Server`, `amazemec.client`, `AmazeMec.Tests`)

Este documento responde a las preguntas sobre estándares, normativas legales, cumplimiento de avisos de privacidad y buenas prácticas de Backend/Frontend, evaluando el estado actual del proyecto.

---

## 1. Estándares de la Industria para Páginas Web

| Estándar | Qué regula / define | Estado en AmazeMe |
| :--- | :--- | :--- |
| **W3C HTML5 / CSS3 / ECMAScript** | Estructura semántica, estilos modernos y JavaScript estándar | **Cumple parcialmente:** Usa React 19 + HTML5 (`<header>`, `<main>`, `<footer>`, `<section>`), aunque varios formularios dependían de `<div>` sin `htmlFor` (ya corregido en `Login`, `Register` y `Perfil`). |
| **WCAG 2.1 / 2.2 (Accesibilidad)** | Nivel AA: contraste, etiquetas, navegación por teclado, lectores de pantalla | **Cumple parcialmente:** Se agregaron `htmlFor`/`id` en formularios y `aria-label` en botones de carrusel/modales; faltan pruebas de contraste formal y manejo de foco en modales. |
| **HTTPS / TLS 1.2+ y HSTS** | Cifrado en tránsito y prevención de downgrade | **Cumple:** `UseHttpsRedirection()`, `UseHsts()` en producción y cookies con `SecurePolicy = Always` en `Program.cs`. |
| **OWASP Top 10 / ASVS** | Seguridad en APIs y aplicaciones web (inyección, auth, headers, rate limit) | **Cumple bien:** BCrypt, EF Core parametrizado, Rate Limiting, `HttpOnly`/`SameSite`, prevención de *Session Fixation*, `CSP` y cabeceras de seguridad. |
| **REST / OpenAPI (Swagger)** | Contratos HTTP claros y documentación de API | **Cumple:** Controladores `[ApiController]`, códigos HTTP semánticos (`200`, `400`, `401`, `409`, `429`, `500`) y `MapOpenApi()` en desarrollo. |
| **Core Web Vitals / Rendimiento** | LCP, INP, CLS, carga diferida y assets optimizados | **Cumple parcialmente:** Vite genera bundles minificados y el iframe usa `loading="lazy"`, pero faltan imágenes locales optimizadas (WebP) para el carrusel y `robots.txt`/`sitemap.xml`. |

---

## 2. Normativas y Leyes Aplicables a Páginas Web

1. **LFPDPPP (México — Ley Federal de Protección de Datos Personales en Posesión de los Particulares):**
   - Exige Aviso de Privacidad integral antes de recopilar datos, especificando: identidad y domicilio del responsable, datos recabados, finalidades, transferencias a terceros y mecanismo para ejercer **Derechos ARCO** (Acceso, Rectificación, Cancelación y Oposición).
2. **RGPD / GDPR y Directiva ePrivacy (Unión Europea, aplica si hay visitantes europeos):**
   - Exige base legal para tratar datos, consentimiento **previo, libre e informado** antes de cargar cookies no esenciales (Analytics, AdSense) y derecho al olvido/portabilidad.
3. **Normativa de Consumidor / Comercio Electrónico (p. ej. PROFECO en México / LSSI en España):**
   - Exige Términos y Condiciones claros, transparencia en programas de puntos/recompensas y datos de contacto del responsable.
4. **Políticas de Plataformas de Terceros (Google AdSense / Analytics):**
   - Prohíbe cargar anuncios sin aviso de privacidad actualizado que declare cookies de terceros y, para tráfico del EEE/Reino Unido, requiere un CMP certificado compatible con Consent Mode v2 / TCF.

---

## 3. ¿Cumplimos con los Avisos de Privacidad?

Evaluación directa de [`Privacidad.jsx`](amazemec.client/src/pages/Privacidad.jsx), [`Terminos.jsx`](amazemec.client/src/pages/Terminos.jsx) y [`CookieConsent.jsx`](amazemec.client/src/components/CookieConsent.jsx):

### Lo que SÍ cumple hoy
- Explica qué datos se recopilan (nombre, correo, hash BCrypt, respuestas de cuestionario, puntos Amazings).
- Explica las finalidades de uso de la información.
- Lista las cookies y claves de almacenamiento propias (`.AmazeMec.Auth`, `.AmazeMec.Session`, `AmazeMe_CookiesAccepted`) con duraciones ya alineadas a `Program.cs` (`14 días`, `24 horas` y `1 año`).
- Incluye sección de Derechos ARCO y un correo de contacto (`amazeme@gmail.com`).
- Cuenta con página independiente de Términos y Condiciones (`/terminos`) y banner de cookies al primer ingreso.

### Lo que FALTA para cumplimiento legal completo (LFPDPPP / RGPD)
1. **Identidad completa y domicilio del responsable:** `Privacidad.jsx` solo dice *"En AmazeMe"*, pero la ley exige el **nombre completo de la persona física o razón social** y un **domicilio físico** para oír y recibir notificaciones.
2. **Procedimiento y plazos para Derechos ARCO:** Falta indicar cómo enviar la solicitud, qué datos debe incluir para acreditar identidad y los plazos legales de respuesta (20 días hábiles en México / 1 mes en RGPD). Además, en `Perfil.jsx` no existe un botón funcional para **eliminar la cuenta** (Derecho de Cancelación).
3. **Consentimiento técnico real en `CookieConsent.jsx`:** Hoy solo guarda la preferencia (`essential` / `all`). Cuando integren **Google Analytics** y **Google AdSense**, debe bloquear esos scripts si el usuario elige *"Solo esenciales"*.
4. **Declaración de proveedores / encargados de datos:** Falta mencionar que los datos se alojan en infraestructura en la nube (Azure) y, a futuro, el uso de Cloudflare, Google Analytics y Google AdSense (actualizando también la frase *"Cero venta a terceros"* para aclarar el uso de cookies publicitarias).

---

## 4. Buenas Prácticas de Backend y Frontend: ¿Cuáles existen y cuáles cumplimos?

### 4.1 Backend (ASP.NET Core / .NET 10)
| Buena Práctica | Estado en AmazeMec | Detalle |
| :--- | :--- | :--- |
| **Arquitectura por capas / DTOs** | **Cumple parcialmente** | Separa `Models` y `DTOs`, pero la lógica de negocio está directo en los `Controllers` (sin capa `Services`). |
| **ORM parametrizado (anti-SQLi)** | **Cumple** | Usa EF Core con LINQ; sin consultas SQL concatenadas. |
| **Autenticación y hashing robusto** | **Cumple** | `BCrypt.Net-Next`, `HashFalso` anti-timing, regeneración de sesión en login. |
| **Transacciones en operaciones críticas** | **Cumple (corregido)** | `RecompensasController.Canjear` ya usa `IsolationLevel.Serializable` en SQL Server. |
| **Manejo global de errores sin fugas** | **Cumple (corregido)** | `UseExceptionHandler` en producción y eliminados `ex.Message` en respuestas `500`. |
| **Logging estructurado** | **Cumple (corregido)** | `ILogger<T>` inyectado en controladores para registrar errores y `catch` previos. |
| **Fechas en UTC consistentes** | **No cumple aún** | Se mezcla `DateTime.Now`/`DateTime.Today` con `DateTimeOffset.UtcNow`. |
| **Pruebas unitarias automatizadas** | **Cumple** | Suite en `AmazeMec.Tests` con xUnit, EF InMemory y mocks de `HttpContext`/`ISession`. |

### 4.2 Frontend (React / Vite / Bootstrap)
| Buena Práctica | Estado en AmazeMec | Detalle |
| :--- | :--- | :--- |
| **Componentes modulares y Context API** | **Cumple** | Separación en `pages/`, `components/` y `AuthContext`. |
| **Rutas protegidas y sanitización** | **Cumple (corregido)** | `ProtectedRoute` y validación de `returnUrl` interno en `Login`/`Register`. |
| **Estados de carga, error y prevención de doble envío** | **Cumple (corregido)** | `canjeandoId` en `Recompensas.jsx`, manejo de error en `Cuestionario.jsx` y `loadBalance`. |
| **Accesibilidad básica en formularios** | **Cumple (corregido)** | `htmlFor`/`id` en inputs, toggle de visibilidad de contraseña, botones de carrusel. |
| **Fuente única de verdad (catálogo desde API)** | **No cumple aún** | `Recompensas.jsx` hardcodea los 3 bonos en vez de consumir `/api/recompensas/catalogo`. |
| **Limpieza de código y assets muertos** | **No cumple aún** | Existen `index.css` y `App.css` sin usar, y el carrusel depende de URLs externas de Amazon. |
| **Linting y build reproducible** | **Cumple en config** | ESLint 10 + Vite 8 configurados en `package.json` y ejecutados en CI/CD. |

---

## 5. Resumen de Correcciones Realizadas Durante la Auditoría

1. **Backend (`AmazeMec.Server`):**
   - Transacción `Serializable` en `RecompensasController.Canjear`.
   - Eliminación de `ex.Message` en respuestas `500` y agregado de `ILogger` en `AuthController`, `CuestionarioController` y `RecompensasController`.
   - Cabecera `Content-Security-Policy` agregada en `Program.cs` (permitiendo orígenes propios, Google Fonts, Material Symbols, `m.media-amazon.com` y `youtube-nocookie.com`).
2. **Frontend (`amazemec.client`):**
   - `Cuestionario.jsx`: pantalla de error real al fallar guardado (con *Volver al Resumen* / *Reintentar*), lectura de errores `ModelState`, cálculo de fecha mínima/días en hora local y cierre del modal sin expulsar a `/`.
   - `Recompensas.jsx`: visibilidad de error si falla la carga del balance y bloqueo de doble clic con `canjeandoId`.
   - `Login.jsx`, `Register.jsx`, `Perfil.jsx`: `htmlFor`/`id` en formularios, sanitización de `returnUrl`, toggle de contraseña y enlace del logo corregido en `Register.jsx`.
   - `Menu.jsx`, `site.css`, `index.html`, `Privacidad.jsx`: botones Anterior/Siguiente en carrusel, eliminación de `margin-bottom: 60px` en `body`, eliminación de CDN duplicado de `bootstrap-icons` y alineación de duraciones de cookies (`14 días` / `24 horas`).

---

## 6. Acciones Recomendadas para Cumplimiento Total

1. **Legal / Privacidad:** Agregar razón social o nombre del responsable, domicilio, plazos ARCO y opción de eliminar cuenta en `Perfil.jsx`.
2. **Técnico inmediato:** Unificar fechas a `DateTime.UtcNow`, conectar `Recompensas.jsx` a `/api/recompensas/catalogo`, implementar las recomendaciones reales al final de `Cuestionario.jsx` y eliminar `src/index.css` / `src/App.css`.
3. **Antes de lanzar servicios externos:** Configurar `ForwardedHeaders` para Cloudflare, condicionar scripts en `CookieConsent.jsx` para Analytics/AdSense y crear `robots.txt` + `sitemap.xml` para Search Console.

