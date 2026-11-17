using AmazeMec.Server.Data;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AmazeMec.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForoController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ForoController>? _logger;

        private static readonly HashSet<string> CategoriasValidas = new(StringComparer.OrdinalIgnoreCase)
        {
            "Regalo recibido",
            "Recomendación",
            "Experiencia",
            "Duda"
        };

        public ForoController(AppDbContext context, ILogger<ForoController>? logger = null)
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

        [HttpGet]
        public async Task<IActionResult> ObtenerPublicaciones(
            [FromQuery] string? categoria = null,
            [FromQuery] string? orden = "recientes",
            [FromQuery] string? busqueda = null)
        {
            int? usuarioActualId = ObtenerUsuarioId();

            try
            {
                var consulta = _context.PublicacionesForo
                    .Include(p => p.Usuario)
                    .Include(p => p.Likes)
                    .Include(p => p.Comentarios)
                        .ThenInclude(c => c.Usuario)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(categoria) && !categoria.Equals("Todas", StringComparison.OrdinalIgnoreCase))
                {
                    string categoriaLimpia = categoria.Trim();
                    consulta = consulta.Where(p => p.Categoria == categoriaLimpia);
                }

                if (!string.IsNullOrWhiteSpace(busqueda))
                {
                    string termino = busqueda.Trim().ToLower();
                    consulta = consulta.Where(p =>
                        p.Titulo.ToLower().Contains(termino) ||
                        p.Contenido.ToLower().Contains(termino) ||
                        (p.RegaloMencionado != null && p.RegaloMencionado.ToLower().Contains(termino)));
                }

                var lista = await consulta.ToListAsync();

                IEnumerable<PublicacionForo> ordenada = orden == "populares"
                    ? lista.OrderByDescending(p => p.Likes.Count).ThenByDescending(p => p.FechaCreacion)
                    : lista.OrderByDescending(p => p.FechaCreacion);

                var resultado = ordenada.Select(p => new PublicacionForoResponse
                {
                    Id = p.Id,
                    Titulo = p.Titulo,
                    Contenido = p.Contenido,
                    RegaloMencionado = p.RegaloMencionado,
                    ImagenUrl = p.ImagenUrl,
                    Categoria = p.Categoria,
                    Calificacion = p.Calificacion,
                    FechaCreacion = p.FechaCreacion,
                    AutorNombre = p.Usuario?.Nombre ?? "Usuario",
                    AutorFoto = p.Usuario?.FotoPerfil,
                    EsPropia = usuarioActualId.HasValue && p.UsuarioId == usuarioActualId.Value,
                    TotalLikes = p.Likes.Count,
                    DioLike = usuarioActualId.HasValue && p.Likes.Any(l => l.UsuarioId == usuarioActualId.Value),
                    TotalComentarios = p.Comentarios.Count,
                    Comentarios = p.Comentarios
                        .OrderBy(c => c.FechaCreacion)
                        .Select(c => new ComentarioForoResponse
                        {
                            Id = c.Id,
                            Contenido = c.Contenido,
                            FechaCreacion = c.FechaCreacion,
                            AutorNombre = c.Usuario?.Nombre ?? "Usuario",
                            AutorFoto = c.Usuario?.FotoPerfil,
                            EsPropio = usuarioActualId.HasValue && c.UsuarioId == usuarioActualId.Value
                        })
                        .ToList()
                }).ToList();

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al consultar publicaciones del foro");
                return StatusCode(500, new { error = "No se pudieron cargar las publicaciones del foro." });
            }
        }

        [Authorize]
        [HttpGet("mias")]
        public async Task<IActionResult> ObtenerMisPublicaciones()
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            try
            {
                var lista = await _context.PublicacionesForo
                    .Include(p => p.Usuario)
                    .Include(p => p.Likes)
                    .Include(p => p.Comentarios)
                    .Where(p => p.UsuarioId == usuarioId.Value)
                    .OrderByDescending(p => p.FechaCreacion)
                    .ToListAsync();

                var resultado = lista.Select(p => new PublicacionForoResponse
                {
                    Id = p.Id,
                    Titulo = p.Titulo,
                    Contenido = p.Contenido,
                    RegaloMencionado = p.RegaloMencionado,
                    ImagenUrl = p.ImagenUrl,
                    Categoria = p.Categoria,
                    Calificacion = p.Calificacion,
                    FechaCreacion = p.FechaCreacion,
                    AutorNombre = p.Usuario?.Nombre ?? "Usuario",
                    AutorFoto = p.Usuario?.FotoPerfil,
                    EsPropia = true,
                    TotalLikes = p.Likes.Count,
                    DioLike = p.Likes.Any(l => l.UsuarioId == usuarioId.Value),
                    TotalComentarios = p.Comentarios.Count,
                    Comentarios = new List<ComentarioForoResponse>()
                }).ToList();

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error al consultar mis publicaciones del foro para usuario {UsuarioId}", usuarioId.Value);
                return StatusCode(500, new { error = "No se pudieron cargar tus opiniones." });
            }
        }

        [Authorize]
        [HttpPost]
        [EnableRateLimiting("limiteForo")]
        public async Task<IActionResult> CrearPublicacion([FromForm] CrearPublicacionForoRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            string tituloLimpio = request.Titulo.Trim();
            string contenidoLimpio = request.Contenido.Trim();
            if (string.IsNullOrWhiteSpace(tituloLimpio) || string.IsNullOrWhiteSpace(contenidoLimpio))
            {
                return BadRequest(new { error = "El título y el contenido son obligatorios." });
            }

            string? imagenDataUrl = null;
            if (request.Imagen != null && request.Imagen.Length > 0)
            {
                const long tamanoMaximo = 3 * 1024 * 1024;
                if (request.Imagen.Length > tamanoMaximo)
                {
                    return BadRequest(new { error = "La imagen no debe superar los 3 MB." });
                }

                var tiposPermitidos = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                {
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                };

                if (!tiposPermitidos.Contains(request.Imagen.ContentType))
                {
                    return BadRequest(new { error = "Formato no admitido. Usa JPG, PNG o WEBP." });
                }

                using var memoria = new MemoryStream();
                await request.Imagen.CopyToAsync(memoria);
                byte[] bytes = memoria.ToArray();

                if (!EsImagenValida(bytes))
                {
                    return BadRequest(new { error = "El archivo no corresponde a una imagen JPG, PNG o WEBP válida." });
                }

                imagenDataUrl = $"data:{request.Imagen.ContentType};base64,{Convert.ToBase64String(bytes)}";
            }

            string categoriaFinal = CategoriasValidas.Contains(request.Categoria?.Trim() ?? "")
                ? request.Categoria!.Trim()
                : "Experiencia";

            var publicacion = new PublicacionForo
            {
                Titulo = tituloLimpio,
                Contenido = contenidoLimpio,
                RegaloMencionado = string.IsNullOrWhiteSpace(request.RegaloMencionado) ? null : request.RegaloMencionado.Trim(),
                ImagenUrl = imagenDataUrl,
                Categoria = categoriaFinal,
                Calificacion = Math.Clamp(request.Calificacion, 1, 5),
                FechaCreacion = DateTime.UtcNow,
                UsuarioId = usuarioId.Value
            };

            _context.PublicacionesForo.Add(publicacion);
            await _context.SaveChangesAsync();

            var autor = await _context.Usuario.FindAsync(usuarioId.Value);

            return Ok(new PublicacionForoResponse
            {
                Id = publicacion.Id,
                Titulo = publicacion.Titulo,
                Contenido = publicacion.Contenido,
                RegaloMencionado = publicacion.RegaloMencionado,
                ImagenUrl = publicacion.ImagenUrl,
                Categoria = publicacion.Categoria,
                Calificacion = publicacion.Calificacion,
                FechaCreacion = publicacion.FechaCreacion,
                AutorNombre = autor?.Nombre ?? "Usuario",
                AutorFoto = autor?.FotoPerfil,
                EsPropia = true,
                TotalLikes = 0,
                DioLike = false,
                TotalComentarios = 0,
                Comentarios = new List<ComentarioForoResponse>()
            });
        }

        [Authorize]
        [HttpPost("{id:int}/like")]
        public async Task<IActionResult> AlternarLike(int id)
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            var existePublicacion = await _context.PublicacionesForo.AnyAsync(p => p.Id == id);
            if (!existePublicacion)
            {
                return NotFound(new { error = "La publicación no existe." });
            }

            var likeExistente = await _context.LikesForo
                .FirstOrDefaultAsync(l => l.PublicacionId == id && l.UsuarioId == usuarioId.Value);

            bool dioLike;
            if (likeExistente != null)
            {
                _context.LikesForo.Remove(likeExistente);
                dioLike = false;
            }
            else
            {
                _context.LikesForo.Add(new LikeForo
                {
                    PublicacionId = id,
                    UsuarioId = usuarioId.Value,
                    FechaCreacion = DateTime.UtcNow
                });
                dioLike = true;
            }

            await _context.SaveChangesAsync();
            int totalLikes = await _context.LikesForo.CountAsync(l => l.PublicacionId == id);

            return Ok(new { totalLikes, dioLike });
        }

        [Authorize]
        [HttpPost("{id:int}/comentarios")]
        [EnableRateLimiting("limiteForo")]
        public async Task<IActionResult> AgregarComentario(int id, [FromBody] CrearComentarioForoRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            var existePublicacion = await _context.PublicacionesForo.AnyAsync(p => p.Id == id);
            if (!existePublicacion)
            {
                return NotFound(new { error = "La publicación no existe." });
            }

            string contenidoLimpio = request.Contenido.Trim();
            if (string.IsNullOrWhiteSpace(contenidoLimpio))
            {
                return BadRequest(new { error = "El comentario no puede estar vacío." });
            }

            var comentario = new ComentarioForo
            {
                PublicacionId = id,
                UsuarioId = usuarioId.Value,
                Contenido = contenidoLimpio,
                FechaCreacion = DateTime.UtcNow
            };

            _context.ComentariosForo.Add(comentario);
            await _context.SaveChangesAsync();

            var autor = await _context.Usuario.FindAsync(usuarioId.Value);

            return Ok(new ComentarioForoResponse
            {
                Id = comentario.Id,
                Contenido = comentario.Contenido,
                FechaCreacion = comentario.FechaCreacion,
                AutorNombre = autor?.Nombre ?? "Usuario",
                AutorFoto = autor?.FotoPerfil,
                EsPropio = true
            });
        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> EliminarPublicacion(int id)
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            var publicacion = await _context.PublicacionesForo
                .Include(p => p.Likes)
                .Include(p => p.Comentarios)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (publicacion == null)
            {
                return NotFound(new { error = "La publicación no existe." });
            }

            if (publicacion.UsuarioId != usuarioId.Value)
            {
                return Forbid();
            }

            if (publicacion.Likes.Count > 0) _context.LikesForo.RemoveRange(publicacion.Likes);
            if (publicacion.Comentarios.Count > 0) _context.ComentariosForo.RemoveRange(publicacion.Comentarios);
            _context.PublicacionesForo.Remove(publicacion);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Publicación eliminada." });
        }

        [Authorize]
        [HttpDelete("comentarios/{comentarioId:int}")]
        public async Task<IActionResult> EliminarComentario(int comentarioId)
        {
            int? usuarioId = ObtenerUsuarioId();
            if (usuarioId == null) return Unauthorized();

            var comentario = await _context.ComentariosForo.FindAsync(comentarioId);
            if (comentario == null)
            {
                return NotFound(new { error = "El comentario no existe." });
            }

            if (comentario.UsuarioId != usuarioId.Value)
            {
                return Forbid();
            }

            _context.ComentariosForo.Remove(comentario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Comentario eliminado." });
        }

        private static bool EsImagenValida(byte[] bytes)
        {
            if (bytes.Length < 12) return false;
            bool esJpeg = bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF;
            bool esPng = bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47;
            bool esWebp = bytes[0] == 0x52 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x46
                && bytes[8] == 0x57 && bytes[9] == 0x45 && bytes[10] == 0x42 && bytes[11] == 0x50;
            return esJpeg || esPng || esWebp;
        }
    }
}

