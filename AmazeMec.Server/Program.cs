using AmazeMec.Server.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Eliminar cabecera Kestrel por seguridad
builder.WebHost.ConfigureKestrel(opcionesServidor =>
{
    opcionesServidor.AddServerHeader = false;
});

// 1. Controladores y OpenAPI
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// 2. Base de Datos (Entity Framework Core)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = builder.Configuration["DefaultConnection"];
}

builder.Services.AddDbContext<AppDbContext>(opciones =>
    opciones.UseSqlServer(
        connectionString,
        opcionesSql => opcionesSql.EnableRetryOnFailure()));

// 3. Caché y Sesión para estado anónimo temporal (Amazings pendientes)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(opciones =>
{
    opciones.IdleTimeout = TimeSpan.FromHours(24);
    opciones.Cookie.Name = ".AmazeMec.Session";
    opciones.Cookie.HttpOnly = true;
    opciones.Cookie.IsEssential = true;
    opciones.Cookie.SameSite = SameSiteMode.Lax;
    opciones.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// 4. Autenticación por Cookies Criptográficas (adaptada para API REST y SPA)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(opciones =>
    {
        opciones.Cookie.Name = ".AmazeMec.Auth";
        opciones.Cookie.HttpOnly = true;
        opciones.Cookie.SameSite = SameSiteMode.Lax;
        opciones.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        opciones.Cookie.IsEssential = true;
        opciones.ExpireTimeSpan = TimeSpan.FromDays(14);
        opciones.SlidingExpiration = true;

        // Responder con códigos HTTP en lugar de redirecciones 302 a páginas HTML
        opciones.Events.OnRedirectToLogin = contexto =>
        {
            contexto.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        opciones.Events.OnRedirectToAccessDenied = contexto =>
        {
            contexto.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

// 5. Rate Limiting de seguridad
builder.Services.AddRateLimiter(opciones =>
{
    opciones.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    opciones.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(contextoHttp =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: contextoHttp.Connection.RemoteIpAddress?.ToString() ?? "global",
            factory: particion => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));

    opciones.AddPolicy("limiteAutenticacion", contextoHttp =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: contextoHttp.Connection.RemoteIpAddress?.ToString() ?? "global",
            factory: particion => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(5)
            }));
});

// 6. Política de Cookies
builder.Services.Configure<CookiePolicyOptions>(opciones =>
{
    opciones.CheckConsentNeeded = contexto => false;
    opciones.MinimumSameSitePolicy = SameSiteMode.Lax;
    opciones.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
    opciones.Secure = CookieSecurePolicy.Always;
});

// 7. CORS para entorno de desarrollo local con Vite
builder.Services.AddCors(opciones =>
{
    opciones.AddPolicy("SpaCorsPolicy", politica =>
    {
        politica.WithOrigins("https://localhost:53167", "http://localhost:53167")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
else
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async contexto =>
        {
            var feature = contexto.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
            if (feature?.Error != null)
            {
                var logger = contexto.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError(feature.Error, "Excepción no controlada en {Path}", contexto.Request.Path);
            }

            contexto.Response.StatusCode = StatusCodes.Status500InternalServerError;
            if (contexto.Request.Path.StartsWithSegments("/api"))
            {
                contexto.Response.ContentType = "application/json";
                await contexto.Response.WriteAsJsonAsync(new { error = "Ocurrió un error interno en el servidor." });
            }
            else
            {
                contexto.Response.Redirect("/");
            }
        });
    });
    app.UseHsts();
}

app.UseHttpsRedirection();

// 8. Encabezados de Seguridad
app.Use(async (contexto, siguiente) =>
{
    contexto.Response.Headers.Remove("Server");
    contexto.Response.Headers.Remove("X-Powered-By");
    contexto.Response.Headers.Append("X-Frame-Options", "DENY");
    contexto.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    contexto.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    contexto.Response.Headers.Append("X-XSS-Protection", "0");
    contexto.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    await siguiente();
});

app.UseCors("SpaCorsPolicy");
app.UseRateLimiter();
app.UseCookiePolicy();
app.UseRouting();

app.UseSession();
app.UseAuthentication();

// Sincronizar reclamo de usuario con sesión si es necesario
app.Use(async (contexto, siguiente) =>
{
    if (contexto.User.Identity?.IsAuthenticated == true && contexto.Session.GetInt32("UsuarioId") == null)
    {
        var idReclamo = contexto.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(idReclamo, out int idParseado))
        {
            contexto.Session.SetInt32("UsuarioId", idParseado);
        }
    }
    await siguiente();
});

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
