# Auditoría Integral del Proyecto AmazeMe (`AmazeMec`)

**Fecha de auditoría:** 16 de noviembre de 2026  
**Alcance:** Todo el repositorio (`AmazeMec.Server`, `amazemec.client`, `AmazeMec.Tests`, `.github/workflows` y archivos de configuración en raíz).

> **Nota sobre ejecución de herramientas:** En el entorno de análisis sin acceso a red para restaurar paquetes NuGet (`project.assets.json` no generado en `obj/`) y sin `npm` en el `PATH`, la auditoría se realizó mediante inspección estática completa de todos los archivos fuente. Se recomienda ejecutar `dotnet test` y `npm run lint && npm run build` localmente tras revisar este informe.

---

## 1. Resumen Ejecutivo

**AmazeMe** es una aplicación web SPA + API REST orientada a recomendar regalos mediante un cuestionario guiado de 9 pasos y un sistema de fidelización por puntos (*Amazings*).

- **Backend:** .NET 10 (`net10.0`), ASP.NET Core Web API, Entity Framework Core 10.0.14 (SQL Server), Cookie Authentication, Session, BCrypt y Rate Limiting.
- **Frontend:** React 19, Vite 8, React Router 7, Bootstrap 5.3, Bootstrap Icons y Material Symbols Outlined.
- **Pruebas:** xUnit 2.9.3 con EF Core InMemory 10.0.14 y Coverlet.
- **CI/CD y Hosting:** GitHub Actions desplegando a Azure App Service (`amazeme`).

### Estado general
El proyecto cuenta con una base sólida en autenticación, separación de DTOs/modelos y despliegue automatizado. Durante la auditoría se detectaron y **corrigieron directamente** varios puntos de seguridad en backend y mejoras de UI/UX en frontend; quedan pendientes principalmente mejoras funcionales (recomendador real de regalos, flujo de recuperación de contraseña) y preparativos previos a las integraciones futuras (Cloudflare, Google Analytics, Google Search Console y Google AdSense).

---

## 2. Inventario de Archivos Auditados

### 2.1 Backend (`AmazeMec.Server/`)
| Archivo | Rol | Estado / Observación |
| :--- | :--- | :--- |
| `AmazeMec.Server.csproj` | Definición del proyecto .NET 10 y paquetes NuGet | Correcto. |
| `Program.cs` | Pipeline HTTP, DI, Auth, Session, Rate Limiting, CORS y Headers | **Corregido:** se añadió `Content-Security-Policy` compatible con recursos actuales. Pendiente configurar `ForwardedHeaders` antes de usar Cloudflare. |
| `appsettings.json` / `appsettings.Development.json` | Configuración y cadena de conexión | `DefaultConnection` vacía en repo (se inyecta por entorno/Azure). Correcto. |
| `Data/AppDbContext.cs` | Contexto EF Core e índices únicos (`Nombre`, `Email`) | Correcto. |
| `Controllers/AuthController.cs` | Registro, login, logout, perfil, cambio de contraseña y bono pendiente | **Corregido:** inyección opcional de `ILogger` y logging en `catch`. Pendiente unificar `DateTime.UtcNow`. |
| `Controllers/CuestionarioController.cs` | Guardado de cuestionario, bono diario e historial | **Corregido:** eliminado `ex.Message` en `500` y añadido logging en `catch`. |
| `Controllers/RecompensasController.cs` | Balance, catálogo, canje y registro de compras | **Corregido:** transacción `IsolationLevel.Serializable` en `Canjear` (relacional) y eliminado `ex.Message` en `500`. |
| `DTOs/AuthDTOs.cs` | Contratos de autenticación y perfil | Correcto. |
| `DTOs/CuestionarioDTOs.cs` | Contratos del cuestionario | `ReclamarPuntosRequest` no se usa actualmente en los controladores. |
| `DTOs/RecompensasDTOs.cs` | Contratos de balance, canje y compra | `CanjeRecompensaRequest.CostoPuntos` es ignorado por el servidor (buena práctica, aunque puede limpiarse del DTO). `RegistrarCompraRequest` carece de `[Range]`. |
| `Models/Usuario.cs` | Entidad de usuario | Correcto (`[NotMapped] ConfirmarContraseña`). |
| `Models/Compra.cs` | Entidad de compra / movimiento | Correcto. |
| `Models/Puntos.cs` | Entidad de puntos ganados/gastados | Correcto. |
| `Models/Preguntas.cs` | Entidad de respuestas del cuestionario | Nomenclatura mixta (`camelCase` en `relacion`, `ocasion`, etc. vs `PascalCase` en `FechaRespuesta`, `UsuarioId`). |

### 2.2 Frontend (`amazemec.client/`)
| Archivo | Rol | Estado / Observación |
| :--- | :--- | :--- |
| `package.json` | Dependencias React/Vite/Bootstrap/ESLint | Correcto. |
| `vite.config.js` | Proxy `/api` y HTTPS local con `dotnet dev-certs` | Correcto. |
| `index.html` | Documento base, fuentes e iconos | **Corregido:** eliminada carga duplicada por CDN de `bootstrap-icons`. |
| `src/main.jsx` | Punto de entrada, Bootstrap CSS/JS y `site.css` | Correcto. |
| `src/App.jsx` | Enrutamiento SPA y layout principal | Correcto. |
| `src/context/AuthContext.jsx` | Estado global de sesión y llamadas `/api/auth/*` | Correcto; maneja HTTP `429` y errores de validación. |
| `src/components/Navbar.jsx` | Barra de navegación responsiva | Enlace a `/recompensas` visible para anónimos (redirige a `/entrar`). |
| `src/components/Footer.jsx` | Pie de página con enlaces legales | Correcto. |
| `src/components/ProtectedRoute.jsx` | Guardia de rutas privadas | Correcto. |
| `src/components/CookieConsent.jsx` | Banner de consentimiento de cookies | Solo guarda preferencia (`essential`/`all`); aún no condiciona scripts externos. |
| `src/pages/Menu.jsx` | Landing page, métricas, carrusel, video y FAQ | **Corregido:** añadidos botones Anterior/Siguiente al carrusel. Imágenes externas de Amazon pueden romperse si cambia el CDN. |
| `src/pages/Cuestionario.jsx` | Cuestionario guiado de 9 pasos + modal de puntos | **Corregido:** cerrar modal ya no redirige a `/`. **Pendiente:** mostrar recomendaciones reales de regalos al finalizar. |
| `src/pages/Login.jsx` | Inicio de sesión | **Corregido:** sanitización de `returnUrl`, `htmlFor` en labels y botón mostrar/ocultar contraseña. Falta flujo "Olvidé mi contraseña". |
| `src/pages/Register.jsx` | Registro de usuario | **Corregido:** logo apunta a `/`, sanitización de `returnUrl`, `htmlFor` y toggle de contraseña. |
| `src/pages/Perfil.jsx` | Edición de datos y cambio de contraseña | **Corregido:** `htmlFor` e `id` en todos los campos. |
| `src/pages/Recompensas.jsx` | Balance, catálogo de canje e historial | **Corregido:** estado `canjeandoId` para evitar doble clic. Catálogo aún hardcodeado en JSX en vez de leer `/api/recompensas/catalogo`. |
| `src/pages/Privacidad.jsx` | Política de privacidad y tabla de cookies | **Corregido:** duraciones alineadas con `Program.cs` (`14 días` y `24 horas`). |
| `src/pages/Terminos.jsx` | Términos y condiciones | Correcto y claro. |
| `src/styles/site.css` | Hoja de estilos principal (tema Google/Material) | **Corregido:** eliminado `margin-bottom: 60px` en `body`. Contiene algunas clases/IDs no usados de versiones previas. |
| `src/index.css` / `src/App.css` | CSS residual de plantilla Vite | **Archivos muertos** (no se importan en `main.jsx`). |

### 2.3 Pruebas (`AmazeMec.Tests/`) y DevOps
| Archivo | Rol | Estado / Observación |
| :--- | :--- | :--- |
| `AmazeMec.Tests.csproj` | Proyecto de pruebas xUnit + Coverlet + EF InMemory | Correcto. |
| `Helpers/TestDbContextFactory.cs` | Fábrica de `AppDbContext` en memoria | Correcto. |
| `Helpers/TestControllerContext.cs` | Mock de `HttpContext`, `ISession` y `IAuthenticationService` | Correcto. |
| `Controllers/AuthControllerTests.cs` | Pruebas unitarias de `AuthController` | Buena cobertura de registro, login, perfil y validaciones. |
| `Controllers/CuestionarioControllerTests.cs` | Pruebas unitarias de `CuestionarioController` | Cubre anónimo, autenticado, bono diario e historial. |
| `Controllers/RecompensasControllerTests.cs` | Pruebas unitarias de `RecompensasController` | Cubre balance, catálogo, canje y compras. |
| `Models/ModelValidationTests.cs` | Validación de `DataAnnotations` en modelos | Correcto. |
| `.github/workflows/master_amazeme.yml` | CI/CD hacia Azure Web App | Correcto; compila, testea y despliega en `master`. |
| `.gitignore` | Reglas de exclusión de Git | No ignora `amazemec.client/dist/`. |

---

## 3. Auditoría de Seguridad y Backend

### Lo que está bien implementado
- **Hashing de contraseñas:** Uso de `BCrypt.Net-Next` y verificación contra `HashFalso` cuando el usuario no existe para mitigar enumeración por tiempo (*timing attacks*).
- **Prevención de Session Fixation:** `AuthController.Login` limpia sesión y cierra cookie previa antes de emitir la nueva sesión/cookie.
- **Cookies endurecidas:** `.AmazeMec.Auth` y `.AmazeMec.Session` configuradas con `HttpOnly`, `SecurePolicy.Always` y `SameSiteMode.Lax`.
- **Rate Limiting:** Límite global (`100 req/min`) y límite estricto en autenticación (`10 req/5 min`).
- **Cabeceras de seguridad:** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `HSTS` y `Content-Security-Policy`.
- **Validación en servidor:** Precios de catálogo y cálculo de puntos (`5%` del monto) se resuelven exclusivamente en el servidor.

### Correcciones ya aplicadas en esta auditoría
1. **Transacción en canjes (`RecompensasController.Canjear`):** Se agregó transacción `IsolationLevel.Serializable` cuando el proveedor es relacional (SQL Server) para evitar doble gasto concurrente, manteniendo compatibilidad con `InMemoryDatabase` en pruebas.
2. **Eliminación de fuga de errores internos:** Se retiró `detalle = ex.Message` de las respuestas `500` en `CuestionarioController` y `RecompensasController`.
3. **Logging en bloques `catch`:** Se inyectó `ILogger<T>?` opcional en `AuthController`, `CuestionarioController` y `RecompensasController` para registrar excepciones previamente silenciadas.
4. **CSP agregada en `Program.cs`:** Restringe orígenes a `'self'`, Google Fonts, Material Symbols, `m.media-amazon.com` (imágenes) y `youtube-nocookie.com` (iframe).

### Puntos pendientes en Backend
- **Zona horaria en bono diario:** Se usa `DateTime.Now` y `DateTime.Today` (dependiente de la hora del servidor en Azure, normalmente UTC) mientras que la cookie usa `DateTimeOffset.UtcNow`. Conviene estandarizar todo a UTC.
- **Lista blanca de correos muy estricta:** La regex de `AuthController` (`gmail|hotmail|outlook|yahoo|icloud` con terminaciones limitadas) bloquea correos corporativos, universitarios (`.edu`) o de otros proveedores.
- **Limpieza de DTOs:** Retirar `CostoPuntos` de `CanjeRecompensaRequest` (o ignorarlo explícitamente) y añadir `[Range]` en `RegistrarCompraRequest`.

---

## 4. Auditoría de UI/UX y Frontend

### Correcciones ya aplicadas en esta auditoría
1. **Cierre de modal en `Cuestionario.jsx`:** Cerrar el modal de *1 Amazing pendiente* ya no saca al usuario hacia `/`, permitiéndole permanecer en la pantalla final.
2. **Bloqueo de doble clic en `Recompensas.jsx`:** Se añadió `canjeandoId` para deshabilitar botones y mostrar `"Canjeando..."` durante el canje.
3. **Seguridad y accesibilidad en formularios (`Login.jsx`, `Register.jsx`, `Perfil.jsx`):**
   - Sanitización de `returnUrl` (solo rutas internas que inicien con `/` y no `//`).
   - Enlace del logo en `Register.jsx` unificado hacia `/`.
   - Botón **Mostrar/Ocultar contraseña** en `Login.jsx` y `Register.jsx`.
   - Asociación `htmlFor` + `id` en todos los `<label>` e `<input>`.
4. **Usabilidad del carrusel en `Menu.jsx`:** Botones de *Slide anterior* y *Slide siguiente* junto a los indicadores circulares.
5. **Limpieza visual y de carga:** Eliminado `margin-bottom: 60px` en `body` (`site.css`) y eliminada la carga duplicada de `bootstrap-icons` por CDN (`index.html`).

### Puntos pendientes de UI/UX
1. **Mostrar recomendaciones reales al terminar el cuestionario (`Cuestionario.jsx`):** Actualmente la pantalla `pRecomendaciones` solo confirma el guardado y los puntos ganados, sin listar productos sugeridos.
2. **Consumir `/api/recompensas/catalogo` en `Recompensas.jsx`:** Sustituir los 3 niveles hardcodeados en JSX por una petición al endpoint del backend, y añadir un modal/diálogo de confirmación antes de canjear.
3. **Recuperación de contraseña:** Añadir flujo o información de contacto para *"¿Olvidaste tu contraseña?"* en `Login.jsx`.
4. **Imágenes del carrusel locales:** Descargar o alojar en `public/Images/` las imágenes de `Menu.jsx` para no depender de URLs externas de `m.media-amazon.com`.
5. **Limpieza de archivos sin uso:** Eliminar `src/index.css` y `src/App.css` si no se van a utilizar.

---

## 5. Preparativos para Integraciones Futuras y DevOps

Cuando decidan incorporar los servicios planeados:
1. **Cloudflare:** Configurar `ForwardedHeadersOptions` en `Program.cs` confiando en los proxies conocidos para que el `RateLimiter` lea la IP real del visitante y no la IP del proxy de Cloudflare.
2. **Google Analytics y Google AdSense:**
   - Actualizar `CookieConsent.jsx` para que **bloquee la carga de scripts de terceros** si el usuario elige *"Solo esenciales"* (y evaluar un CMP certificado si hay tráfico del EEE/Reino Unido).
   - Actualizar la `Content-Security-Policy` en `Program.cs` con los dominios de Google Analytics y AdSense.
   - Actualizar la tabla de cookies en `Privacidad.jsx`.
3. **Google Search Console:** Crear `robots.txt` y `sitemap.xml` dentro de `amazemec.client/public/`.
4. **Repositorio:** Añadir `amazemec.client/dist/` al `.gitignore` para evitar subir artefactos compilados.

---

## 6. Checklist de Próximos Pasos Recomendados

- [ ] Ejecutar `dotnet test AmazeMec.Tests/AmazeMec.Tests.csproj` localmente para confirmar que toda la suite pasa.
- [ ] Ejecutar `npm run lint` y `npm run build` dentro de `amazemec.client`.
- [ ] Implementar la visualización real de recomendaciones de regalos al finalizar `Cuestionario.jsx`.
- [ ] Conectar `Recompensas.jsx` a `GET /api/recompensas/catalogo` y agregar confirmación de canje.
- [ ] Estandarizar fechas de negocio a `DateTime.UtcNow`.
- [ ] Eliminar `src/index.css` y `src/App.css` e incluir `amazemec.client/dist/` en `.gitignore`.

