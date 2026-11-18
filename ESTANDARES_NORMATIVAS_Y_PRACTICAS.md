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
