using AmazeMec.Server.Data;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace AmazeMec.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthController>? _logger;
        private const string HashFalso = "$2a$11$000000000000000000000u6/gQp5jR9m7/k6V1h3o9h0Z6m1W3m9O";
        private const int MaxBonoReclamable = 1;

        public AuthController(AppDbContext context, ILogger<AuthController>? logger = null)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("login")]
        [EnableRateLimiting("limiteAutenticacion")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Identificador) || string.IsNullOrWhiteSpace(request.Contraseña))
            {
                return BadRequest(new { error = "Rellene todos los campos." });
            }

            if (request.Identificador.Length > 100 || request.Contraseña.Length > 128)
            {
                return Unauthorized(new { error = "Usuario o contraseña incorrectos." });
            }

            string identificadorLimpio = request.Identificador.Trim();
            string identificadorEmail = identificadorLimpio.ToLowerInvariant();

            var usuario = await _context.Usuario.FirstOrDefaultAsync(x => x.Nombre == identificadorLimpio || x.Email == identificadorEmail);

            bool contraseñaValida = usuario != null
                ? BCrypt.Net.BCrypt.Verify(request.Contraseña, usuario.Contraseña)
                : BCrypt.Net.BCrypt.Verify(request.Contraseña, HashFalso) && false;

            if (usuario == null || !contraseñaValida)
            {
                return Unauthorized(new { error = "Usuario o contraseña incorrectos." });
            }

            int? pendientes = HttpContext.Session.GetInt32("AmazingsPendientes");
            int? ultimaRespuestaId = request.UltimaRespuestaId ?? HttpContext.Session.GetInt32("UltimaRespuestaId");

            // Regenerar sesión para prevenir Session Fixation
            HttpContext.Session.Clear();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            HttpContext.Session.SetInt32("UsuarioId", usuario.Id);

            var reclamos = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nombre),
                new Claim(ClaimTypes.Email, usuario.Email)
            };

            var identidadReclamos = new ClaimsIdentity(reclamos, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identidadReclamos),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(14)
                });

            int puntosReclamados = 0;
            if (pendientes.HasValue && pendientes.Value > 0)
            {
                puntosReclamados = await ReclamarPuntosPendientesInterno(usuario.Id, pendientes.Value, ultimaRespuestaId);
            }

            return Ok(new AuthUserResponse
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                FechaRegistro = usuario.Fecharegistro,
                PuntosReclamados = puntosReclamados > 0 ? puntosReclamados : null
            });
        }

        [HttpPost("register")]
        [EnableRateLimiting("limiteAutenticacion")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre) || request.Nombre.Trim().Length > 50 ||
                string.IsNullOrEmpty(request.Contraseña) || request.Contraseña.Length > 128)
            {
                return BadRequest(new { error = "Datos de registro inválidos." });
            }

            if (request.Contraseña != request.ConfirmarContraseña)
            {
                return BadRequest(new { error = "Las contraseñas no coinciden." });
            }

            if (string.IsNullOrWhiteSpace(request.Email) ||
                !Regex.IsMatch(request.Email, @"^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud)\.(com|es|com\.mx|net|org)$", RegexOptions.IgnoreCase))
            {
                return BadRequest(new { error = "El correo es inválido o el proveedor no es admitido." });
            }

            if (!Regex.IsMatch(request.Contraseña, @"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[._%+\-!@#\$&*])[a-zA-Z0-9._%+\-!@#\$&*]{8,128}$"))
            {
                return BadRequest(new { error = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial [._%+-!@#$&*]" });
            }

            string nombreLimpio = request.Nombre.Trim();
            string emailLimpio = request.Email.Trim().ToLowerInvariant();

            var existente = await _context.Usuario.FirstOrDefaultAsync(x => x.Nombre == nombreLimpio || x.Email == emailLimpio);
            if (existente != null)
            {
                return Conflict(new { error = "El usuario o correo electrónico ya se encuentra registrado." });
            }

            var nuevoUsuario = new Usuario
            {
                Nombre = nombreLimpio,
                Email = emailLimpio,
                Contraseña = BCrypt.Net.BCrypt.HashPassword(request.Contraseña),
                Fecharegistro = DateTime.UtcNow
            };

            _context.Usuario.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            // Iniciar sesión automáticamente tras el registro
            HttpContext.Session.SetInt32("UsuarioId", nuevoUsuario.Id);
            var reclamos = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, nuevoUsuario.Id.ToString()),
                new Claim(ClaimTypes.Name, nuevoUsuario.Nombre),
                new Claim(ClaimTypes.Email, nuevoUsuario.Email)
            };

            var identidadReclamos = new ClaimsIdentity(reclamos, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identidadReclamos),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(14)
                });

            int? pendientes = HttpContext.Session.GetInt32("AmazingsPendientes");
            int? ultimaRespuestaId = request.UltimaRespuestaId ?? HttpContext.Session.GetInt32("UltimaRespuestaId");
            int puntosReclamados = 0;
            if (pendientes.HasValue && pendientes.Value > 0)
            {
                puntosReclamados = await ReclamarPuntosPendientesInterno(nuevoUsuario.Id, pendientes.Value, ultimaRespuestaId);
            }

            return Ok(new AuthUserResponse
            {
                Id = nuevoUsuario.Id,
                Nombre = nuevoUsuario.Nombre,
                Email = nuevoUsuario.Email,
                FechaRegistro = nuevoUsuario.Fecharegistro,
                PuntosReclamados = puntosReclamados > 0 ? puntosReclamados : null
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            HttpContext.Session.Clear();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { mensaje = "Sesión cerrada correctamente." });
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized(new { error = "No autenticado." });
            }

            var usuario = await _context.Usuario.FindAsync(userId);
            if (usuario == null)
            {
                return NotFound(new { error = "Usuario no encontrado." });
            }

            return Ok(new AuthUserResponse
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                FechaRegistro = usuario.Fecharegistro
            });
        }

        [Authorize]
        [HttpPut("perfil")]
        public async Task<IActionResult> ActualizarPerfil([FromBody] PerfilUpdateRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var usuario = await _context.Usuario.FindAsync(userId);
            if (usuario == null) return NotFound();

            if (string.IsNullOrWhiteSpace(request.Nombre) || request.Nombre.Trim().Length > 50)
            {
                return BadRequest(new { error = "Nombre no válido." });
            }

            string nuevoNombre = request.Nombre.Trim();
            string nuevoEmail = request.Email.Trim().ToLowerInvariant();

            if (!Regex.IsMatch(nuevoEmail, @"^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud)\.(com|es|com\.mx|net|org)$", RegexOptions.IgnoreCase))
            {
                return BadRequest(new { error = "El correo es inválido o no admitido." });
            }

            bool duplicado = await _context.Usuario.AnyAsync(u => u.Id != userId && (u.Nombre == nuevoNombre || u.Email == nuevoEmail));
            if (duplicado)
            {
                return Conflict(new { error = "El nombre de usuario o correo ya está en uso." });
            }

            usuario.Nombre = nuevoNombre;
            usuario.Email = nuevoEmail;
            await _context.SaveChangesAsync();

            // Refrescar claims
            var reclamos = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nombre),
                new Claim(ClaimTypes.Email, usuario.Email)
            };
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(new ClaimsIdentity(reclamos, CookieAuthenticationDefaults.AuthenticationScheme)),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(14)
                });

            return Ok(new AuthUserResponse
            {
                Id = usuario.Id,
                Nombre = usuario.Nombre,
                Email = usuario.Email,
                FechaRegistro = usuario.Fecharegistro
            });
        }

        [Authorize]
        [HttpPut("password")]
        public async Task<IActionResult> CambiarPassword([FromBody] CambiarPasswordRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var usuario = await _context.Usuario.FindAsync(userId);
            if (usuario == null) return NotFound();

            if (!BCrypt.Net.BCrypt.Verify(request.ContraseñaActual, usuario.Contraseña))
            {
                return BadRequest(new { error = "La contraseña actual es incorrecta." });
            }

            if (!Regex.IsMatch(request.ContraseñaNueva, @"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[._%+\-!@#\$&*])[a-zA-Z0-9._%+\-!@#\$&*]{8,128}$"))
            {
                return BadRequest(new { error = "La nueva contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y un carácter especial." });
            }

            if (request.ContraseñaNueva != request.ConfirmarContraseñaNueva)
            {
                return BadRequest(new { error = "Las nuevas contraseñas no coinciden." });
            }

            usuario.Contraseña = BCrypt.Net.BCrypt.HashPassword(request.ContraseñaNueva);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Contraseña actualizada con éxito." });
        }

        [Authorize]
        [HttpDelete("cuenta")]
        public async Task<IActionResult> EliminarCuenta()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var usuario = await _context.Usuario.FindAsync(userId);
            if (usuario == null) return NotFound(new { error = "Usuario no encontrado." });

            var respuestas = await _context.RespuestaCuestionario
                .Where(r => r.UsuarioId == userId)
                .ToListAsync();
            if (respuestas.Count > 0)
            {
                _context.RespuestaCuestionario.RemoveRange(respuestas);
            }

            var compras = await _context.Compras
                .Where(c => c.UsuarioId == userId)
                .ToListAsync();
            if (compras.Count > 0)
            {
                var compraIds = compras.Select(c => c.Id).ToList();
                var puntos = await _context.Puntos
                    .Where(p => compraIds.Contains(p.CompraId))
                    .ToListAsync();
                if (puntos.Count > 0)
                {
                    _context.Puntos.RemoveRange(puntos);
                }
                _context.Compras.RemoveRange(compras);
            }

            _context.Usuario.Remove(usuario);
            await _context.SaveChangesAsync();

            HttpContext.Session.Clear();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            return Ok(new { mensaje = "Cuenta y datos asociados eliminados permanentemente." });
        }

        private async Task<int> ReclamarPuntosPendientesInterno(int usuarioId, int puntos, int? ultimaRespuestaId)
        {
            int puntosReclamables = Math.Min(puntos, MaxBonoReclamable);
            try
            {
                bool yaRecompensadoHoy = await _context.Puntos
                    .AnyAsync(p => p.Compra != null
                        && p.Compra.UsuarioId == usuarioId
                        && p.Compra.Monto == 0
                        && p.PuntosObtenidos > 0
                        && p.Compra.FechaCompra >= DateTime.UtcNow.Date);

                if (!yaRecompensadoHoy)
                {
                    if (ultimaRespuestaId.HasValue)
                    {
                        var respuestaGuardada = await _context.RespuestaCuestionario.FirstOrDefaultAsync(r => r.Id == ultimaRespuestaId.Value);
                        if (respuestaGuardada != null && respuestaGuardada.UsuarioId == null)
                        {
                            respuestaGuardada.UsuarioId = usuarioId;
                        }
                    }

                    var compraRecompensa = new Compra
                    {
                        FechaCompra = DateTime.UtcNow,
                        Monto = 0,
                        Cantidad = 1,
                        UsuarioId = usuarioId
                    };
                    _context.Compras.Add(compraRecompensa);
                    await _context.SaveChangesAsync();

                    var registroPuntos = new Puntos
                    {
                        PuntosObtenidos = puntosReclamables,
                        PuntosGastados = 0,
                        CompraId = compraRecompensa.Id
                    };
                    _context.Puntos.Add(registroPuntos);
                    await _context.SaveChangesAsync();

                    HttpContext.Session.Remove("AmazingsPendientes");
                    HttpContext.Session.Remove("UltimaRespuestaId");

                    return puntosReclamables;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning(ex, "No se pudieron reclamar los puntos pendientes para el usuario {UsuarioId}", usuarioId);
            }
            return 0;
        }
    }
}

