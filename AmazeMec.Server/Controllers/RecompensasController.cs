using AmazeMec.Server.Data;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AmazeMec.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecompensasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecompensasController(AppDbContext context)
        {
            _context = context;
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
                return StatusCode(500, new { error = "Error al calcular el balance.", detalle = ex.Message });
            }
        }

        [HttpGet("catalogo")]
        public IActionResult ObtenerCatalogo()
        {
            var catalogo = new[]
            {
                new { id = 1, titulo = "Cupón de Descuento 10%", costo = 100, descripcion = "Válido en tiendas afiliadas para compras mayores a $500 MXN.", categoria = "Descuento" },
                new { id = 2, titulo = "Tarjeta de Regalo $100 MXN", costo = 250, descripcion = "Canjeable en comercios electrónicos asociados.", categoria = "Tarjeta" },
                new { id = 3, titulo = "Tarjeta de Regalo $250 MXN", costo = 500, descripcion = "Saldo directo para canjear en tus compras de regalos.", categoria = "Tarjeta" },
                new { id = 4, titulo = "Envío Gratis por 1 Mes", costo = 150, descripcion = "Envíos nacionales sin costo en tiendas participantes.", categoria = "Envío" }
            };

            return Ok(catalogo);
        }

        [Authorize]
        [HttpPost("canjear")]
        public async Task<IActionResult> Canjear([FromBody] CanjeRecompensaRequest request)
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            if (request.CostoPuntos <= 0)
            {
                return BadRequest(new { error = "El costo de puntos debe ser mayor a 0." });
            }

            var puntosUsuario = await _context.Puntos
                .Include(p => p.Compra)
                .Where(p => p.Compra != null && p.Compra.UsuarioId == usuarioId.Value)
                .ToListAsync();

            int balanceActual = puntosUsuario.Sum(p => p.PuntosObtenidos - p.PuntosGastados);
            if (balanceActual < request.CostoPuntos)
            {
                return BadRequest(new { error = "No cuentas con suficientes Amazings para este canje." });
            }

            var compraCanje = new Compra
            {
                FechaCompra = DateTime.Now,
                Monto = 0,
                Cantidad = 1,
                UsuarioId = usuarioId.Value
            };
            _context.Compras.Add(compraCanje);
            await _context.SaveChangesAsync();

            var gastoPuntos = new Puntos
            {
                PuntosObtenidos = 0,
                PuntosGastados = request.CostoPuntos,
                CompraId = compraCanje.Id
            };
            _context.Puntos.Add(gastoPuntos);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Canje realizado con éxito.",
                nuevoBalance = balanceActual - request.CostoPuntos
            });
        }
    }
}

