using AmazeMec.Server.Data;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;

namespace AmazeMec.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecompensasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<RecompensasController>? _logger;

        public RecompensasController(AppDbContext context, ILogger<RecompensasController>? logger = null)
        {
            _context = context;
            _logger = logger;
        }

        private int? ObtenerUsuarioId()
        {
            var idSesion = HttpContext.Session.GetInt32("UsuarioId");
            if (idSesion.HasValue) return idSesion.Value;

            var idReclamo = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(idReclamo, out int idParseado)) return idParseado;

            return null;
        }

        [Authorize]
        [HttpGet("balance")]
        public async Task<IActionResult> ObtenerBalance()
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized(new { error = "Debes iniciar sesión para consultar tus recompensas." });

            try
            {
                var puntosUsuario = await _context.Puntos
                    .Include(p => p.Compra)
                    .Where(p => p.Compra != null && p.Compra.UsuarioId == usuarioId.Value)
                    .OrderByDescending(p => p.Id)
                    .ToListAsync();

                int totalObtenidos = puntosUsuario.Sum(p => p.PuntosObtenidos);
                int totalGastados = puntosUsuario.Sum(p => p.PuntosGastados);
                int balanceDisponible = totalObtenidos - totalGastados;

                var historial = puntosUsuario.Select(p => new TransaccionPuntosDto
                {
                    Id = p.Id,
                    PuntosObtenidos = p.PuntosObtenidos,
                    PuntosGastados = p.PuntosGastados,
                    Fecha = p.Compra?.FechaCompra ?? DateTime.MinValue,
                    MontoCompra = p.Compra?.Monto ?? 0
                }).ToList();

                return Ok(new BalanceResponse
                {
                    BalanceDisponible = balanceDisponible,
                    TotalObtenidos = totalObtenidos,
                    TotalGastados = totalGastados,
                    Historial = historial
                });
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al calcular el balance para el usuario {UsuarioId}", usuarioId.Value);
                return StatusCode(500, new { error = "Error al calcular el balance." });
            }
        }

        private static readonly Dictionary<int, (string Titulo, int Costo, string Descripcion, string Categoria)> CatalogoOficial = new()
        {
            { 1, ("Bono Nivel 1 - $100 USD", 200, "Recibe un total de $100.00 dólares por cada 200 Amazings acumulados en tu cuenta.", "Bono") },
            { 2, ("Bono Nivel 2 - $250 USD", 500, "Recibe un total de $250.00 dólares por cada 500 Amazings acumulados en tu cuenta.", "Bono") },
            { 3, ("Bono Elite - $500 USD", 1000, "Recibe un total de $500.00 dólares por cada 1000 Amazings acumulados en tu cuenta.", "Bono") }
        };

        [HttpGet("catalogo")]
        public IActionResult ObtenerCatalogo()
        {
            var catalogo = CatalogoOficial.Select(kvp => new
            {
                id = kvp.Key,
                titulo = kvp.Value.Titulo,
                costo = kvp.Value.Costo,
                descripcion = kvp.Value.Descripcion,
                categoria = kvp.Value.Categoria
            });

            return Ok(catalogo);
        }

        [Authorize]
        [HttpPost("canjear")]
        public async Task<IActionResult> Canjear([FromBody] CanjeRecompensaRequest request)
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            if (!CatalogoOficial.TryGetValue(request.RecompensaId, out var recompensa))
            {
                return BadRequest(new { error = "La recompensa seleccionada no existe." });
            }

            int costoReal = recompensa.Costo;

            await using var transaccion = _context.Database.IsRelational()
                ? await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable)
                : null;

            var puntosUsuario = await _context.Puntos
                .Include(p => p.Compra)
                .Where(p => p.Compra != null && p.Compra.UsuarioId == usuarioId.Value)
                .ToListAsync();

            int balanceActual = puntosUsuario.Sum(p => p.PuntosObtenidos - p.PuntosGastados);
            if (balanceActual < costoReal)
            {
                return BadRequest(new { error = "No cuentas con suficientes Amazings para este canje." });
            }

            var compraCanje = new Compra
            {
                FechaCompra = DateTime.UtcNow,
                Monto = 0,
                Cantidad = 1,
                UsuarioId = usuarioId.Value
            };
            _context.Compras.Add(compraCanje);
            await _context.SaveChangesAsync();

            var gastoPuntos = new Puntos
            {
                PuntosObtenidos = 0,
                PuntosGastados = costoReal,
                CompraId = compraCanje.Id
            };
            _context.Puntos.Add(gastoPuntos);
            await _context.SaveChangesAsync();

            if (transaccion != null)
            {
                await transaccion.CommitAsync();
            }

            return Ok(new
            {
                mensaje = $"Canje realizado con éxito: {recompensa.Titulo}.",
                nuevoBalance = balanceActual - costoReal
            });
        }

        [Authorize]
        [HttpPost("compra")]
        public async Task<IActionResult> RegistrarCompra([FromBody] RegistrarCompraRequest request)
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            if (request.Monto <= 0 || request.Cantidad <= 0)
            {
                return BadRequest(new { error = "El monto y la cantidad de la compra deben ser mayores a 0." });
            }

            // Proporción de 5/100 sobre el monto de compra
            int puntosGenerados = CalcularPuntosCompra(request.Monto);

            var compra = new Compra
            {
                FechaCompra = DateTime.UtcNow,
                Monto = request.Monto,
                Cantidad = request.Cantidad,
                UsuarioId = usuarioId.Value
            };
            _context.Compras.Add(compra);
            await _context.SaveChangesAsync();

            if (puntosGenerados > 0)
            {
                var registroPuntos = new Puntos
                {
                    PuntosObtenidos = puntosGenerados,
                    PuntosGastados = 0,
                    CompraId = compra.Id
                };
                _context.Puntos.Add(registroPuntos);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                compraId = compra.Id,
                monto = compra.Monto,
                puntosObtenidos = puntosGenerados
            });
        }

        public static int CalcularPuntosCompra(decimal monto)
        {
            if (monto <= 0) return 0;
            return (int)Math.Floor(monto * 5m / 100m);
        }
    }
}

