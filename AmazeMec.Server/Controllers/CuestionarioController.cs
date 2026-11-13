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
    public class CuestionarioController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const int MaxBonoEncuesta = 1;

        public CuestionarioController(AppDbContext context)
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

        [HttpPost]
        public async Task<IActionResult> EnviarCuestionario([FromBody] CuestionarioRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? usuarioId = ObtenerUsuarioId();

            var respuesta = new Preguntas
            {
                relacion = string.IsNullOrWhiteSpace(request.Relacion) ? "No especificado" : request.Relacion.Trim(),
                ocasion = string.IsNullOrWhiteSpace(request.Ocasion) ? "No especificado" : request.Ocasion.Trim(),
                edad = request.Edad,
                pasatiempos = string.IsNullOrWhiteSpace(request.Pasatiempos) ? "No especificado" : request.Pasatiempos.Trim(),
                personalidad = string.IsNullOrWhiteSpace(request.Personalidad) ? "No especificado" : request.Personalidad.Trim(),
                objetoQuerido = request.ObjetoQuerido?.Trim() ?? "",
                objetoNoquerido = request.ObjetoNoquerido?.Trim() ?? "",
                presupuesto = request.Presupuesto,
                dias = request.Dias,
                FechaRespuesta = DateTime.Now,
                UsuarioId = usuarioId
            };

            try
            {
                _context.RespuestaCuestionario.Add(respuesta);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al guardar el cuestionario.", detalle = ex.Message });
            }

            // Si es usuario anónimo
            if (usuarioId == null)
            {
                HttpContext.Session.SetInt32("AmazingsPendientes", MaxBonoEncuesta);
                if (respuesta.Id > 0)
                {
                    HttpContext.Session.SetInt32("UltimaRespuestaId", respuesta.Id);
                }

                return Ok(new CuestionarioResponse
                {
                    Id = respuesta.Id,
                    EsAnonimo = true,
                    MostrarModalPendientes = true,
                    AmazingsPendientes = MaxBonoEncuesta,
                    PuntosGanados = 0,
                    Mensaje = "Cuestionario guardado con éxito. Inicia sesión o regístrate para reclamar tu Amazing pendiente."
                });
            }

            // Si es usuario autenticado, procesar bonificación diaria
            int puntosAcreditados = 0;
            try
            {
                bool yaRecompensadoHoy = await _context.Puntos
                    .AnyAsync(p => p.Compra != null
                        && p.Compra.UsuarioId == usuarioId.Value
                        && p.Compra.Monto == 0
                        && p.PuntosObtenidos > 0
                        && p.Compra.FechaCompra >= DateTime.Today);

                if (!yaRecompensadoHoy)
                {
                    var compraRecompensa = new Compra
                    {
                        FechaCompra = DateTime.Now,
                        Monto = 0,
                        Cantidad = 1,
                        UsuarioId = usuarioId.Value
                    };
                    _context.Compras.Add(compraRecompensa);
                    await _context.SaveChangesAsync();

                    var registroPuntos = new Puntos
                    {
                        PuntosObtenidos = MaxBonoEncuesta,
                        PuntosGastados = 0,
                        CompraId = compraRecompensa.Id
                    };
                    _context.Puntos.Add(registroPuntos);
                    await _context.SaveChangesAsync();

                    puntosAcreditados = MaxBonoEncuesta;
                }
            }
            catch
            {
                // El cuestionario ya se guardó; la recompensa no debe interrumpir la respuesta
            }

            return Ok(new CuestionarioResponse
            {
                Id = respuesta.Id,
                EsAnonimo = false,
                MostrarModalPendientes = false,
                AmazingsPendientes = 0,
                PuntosGanados = puntosAcreditados,
                Mensaje = puntosAcreditados > 0
                    ? $"¡Has ganado {puntosAcreditados} Amazing por completar el cuestionario de hoy!"
                    : "Cuestionario guardado exitosamente."
            });
        }

        [Authorize]
        [HttpGet("historial")]
        public async Task<IActionResult> ObtenerHistorial()
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            var historial = await _context.RespuestaCuestionario
                .Where(r => r.UsuarioId == usuarioId.Value)
                .OrderByDescending(r => r.FechaRespuesta)
                .Select(r => new
                {
                    r.Id,
                    r.relacion,
                    r.ocasion,
                    r.edad,
                    r.pasatiempos,
                    r.personalidad,
                    r.objetoQuerido,
                    r.objetoNoquerido,
                    r.presupuesto,
                    r.dias,
                    r.FechaRespuesta
                })
                .ToListAsync();

            return Ok(historial);
        }
    }
}

