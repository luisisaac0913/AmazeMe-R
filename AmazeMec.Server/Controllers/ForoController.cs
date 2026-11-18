using AmazeMec.Server.Data;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

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
            [FromQuery] string? busqueda = null,
            [FromQuery] int pagina = 1,
            [FromQuery] int tamanoPagina = 10)
        {
            int? usuarioActualId = ObtenerUsuarioId();
            int paginaSegura = Math.Max(1, pagina);
            int tamanoSeguro = Math.Clamp(tamanoPagina, 1, 30);

            try
            {
                var consulta = _context.PublicacionesForo
                    .AsNoTracking()
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

                int total = await consulta.CountAsync();
                int totalPaginas = Math.Max(1, (int)Math.Ceiling(total / (double)tamanoSeguro));

                var ordenada = orden == "populares"
                    ? consulta.OrderByDescending(p => p.Likes.Count).ThenByDescending(p => p.FechaCreacion)
                    : consulta.OrderByDescending(p => p.FechaCreacion);

                var filas = await ordenada
                    .Skip((paginaSegura - 1) * tamanoSeguro)
                    .Take(tamanoSeguro)
                    .Select(p => new
                    {
                        p.Id,
                        p.Titulo,
                        p.Contenido,
                        p.RegaloMencionado,
                        p.ImagenUrl,
                        p.Categoria,
                        p.Calificacion,
                        p.FechaCreacion,
                        p.UsuarioId,
                        AutorNombre = p.Usuario != null ? p.Usuario.Nombre : "Usuario",
                        AutorFoto = p.Usuario != null ? p.Usuario.FotoPerfil : null,
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
                                AutorNombre = c.Usuario != null ? c.Usuario.Nombre : "Usuario",
                                AutorFoto = c.Usuario != null ? c.Usuario.FotoPerfil : null,
                                EsPropio = usuarioActualId.HasValue && c.UsuarioId == usuarioActualId.Value
                            })
                            .ToList()
                    })
                    .ToListAsync();

                var publicaciones = filas.Select(p =>
                {
                    var imagenes = DeserializarImagenes(p.ImagenUrl);
                    return new PublicacionForoResponse
                    {
                        Id = p.Id,
                        Titulo = p.Titulo,
                        Contenido = p.Contenido,
                        RegaloMencionado = p.RegaloMencionado,
                        ImagenUrl = imagenes.FirstOrDefault(),
                        Imagenes = imagenes,
                        Categoria = p.Categoria,
                        Calificacion = p.Calificacion,
                        FechaCreacion = p.FechaCreacion,
                        AutorNombre = p.AutorNombre,
                        AutorFoto = p.AutorFoto,
                        EsPropia = usuarioActualId.HasValue && p.UsuarioId == usuarioActualId.Value,
                        TotalLikes = p.TotalLikes,
                        DioLike = p.DioLike,
                        TotalComentarios = p.TotalComentarios,
                        Comentarios = p.Comentarios
                    };
                }).ToList();

                return Ok(new
                {
                    publicaciones,
                    total,
                    pagina = paginaSegura,
                    totalPaginas,
                    hayMas = paginaSegura < totalPaginas
                });
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
                    .AsNoTracking()
                    .Where(p => p.UsuarioId == usuarioId.Value)
                    .OrderByDescending(p => p.FechaCreacion)
                    .Select(p => new
                    {
                        p.Id,
                        p.Titulo,
                        p.Contenido,
                        p.RegaloMencionado,
                        p.ImagenUrl,
                        p.Categoria,
                        p.Calificacion,
                        p.FechaCreacion,
                        AutorNombre = p.Usuario != null ? p.Usuario.Nombre : "Usuario",
                        AutorFoto = p.Usuario != null ? p.Usuario.FotoPerfil : null,
                        TotalLikes = p.Likes.Count,
                        DioLike = p.Likes.Any(l => l.UsuarioId == usuarioId.Value),
                        TotalComentarios = p.Comentarios.Count
                    })
                    .ToListAsync();

                var resultado = lista.Select(p =>
                {
                    var imagenes = DeserializarImagenes(p.ImagenUrl);
                    return new PublicacionForoResponse
                    {
                        Id = p.Id,
                        Titulo = p.Titulo,
                        Contenido = p.Contenido,
                        RegaloMencionado = p.RegaloMencionado,
                        ImagenUrl = imagenes.FirstOrDefault(),
                        Imagenes = imagenes,
                        Categoria = p.Categoria,
                        Calificacion = p.Calificacion,
                        FechaCreacion = p.FechaCreacion,
                        AutorNombre = p.AutorNombre,
                        AutorFoto = p.AutorFoto,
                        EsPropia = true,
                        TotalLikes = p.TotalLikes,
                        DioLike = p.DioLike,
                        TotalComentarios = p.TotalComentarios,
                    Comentarios = new List<ComentarioForoResponse>()
                    };
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

            var archivosImagen = new List<IFormFile>();
            if (request.Imagenes != null && request.Imagenes.Count > 0)
            {
                archivosImagen.AddRange(request.Imagenes.Where(a => a != null && a.Length > 0));
            }
            else if (request.Imagen != null && request.Imagen.Length > 0)
            {
                archivosImagen.Add(request.Imagen);
            }

            if (archivosImagen.Count > 4)
            {
                return BadRequest(new { error = "Puedes adjuntar máximo 4 imágenes por publicación." });
            }

            var imagenesDataUrl = new List<string>();
            if (archivosImagen.Count > 0)
            {
                const long tamanoMaximo = 3 * 1024 * 1024;
                var tiposPermitidos = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                {
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                };

                foreach (var archivo in archivosImagen)
                {
                    if (archivo.Length > tamanoMaximo)
                    {
                        return BadRequest(new { error = "Cada imagen no debe superar los 3 MB." });
                    }

                    if (!tiposPermitidos.Contains(archivo.ContentType))
                    {
                        return BadRequest(new { error = "Formato no admitido. Usa JPG, PNG o WEBP." });
                    }

                    using var memoria = new MemoryStream();
                    await archivo.CopyToAsync(memoria);
                    byte[] bytes = memoria.ToArray();

                    if (!EsImagenValida(bytes))
                    {
                        return BadRequest(new { error = "Uno de los archivos no corresponde a una imagen JPG, PNG o WEBP válida." });
                    }

                    imagenesDataUrl.Add($"data:{archivo.ContentType};base64,{Convert.ToBase64String(bytes)}");
                }
            }

            string? imagenSerializada = imagenesDataUrl.Count switch
            {
                0 => null,
                1 => imagenesDataUrl[0],
                _ => JsonSerializer.Serialize(imagenesDataUrl)
            };

            string categoriaFinal = CategoriasValidas.Contains(request.Categoria?.Trim() ?? "")
                ? request.Categoria!.Trim()
                : "Experiencia";

            var publicacion = new PublicacionForo
            {
                Titulo = tituloLimpio,
                Contenido = contenidoLimpio,
                RegaloMencionado = string.IsNullOrWhiteSpace(request.RegaloMencionado) ? null : request.RegaloMencionado.Trim(),
                ImagenUrl = imagenSerializada,
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
                ImagenUrl = imagenesDataUrl.FirstOrDefault(),
                Imagenes = imagenesDataUrl,
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

        private static List<string> DeserializarImagenes(string? valor)
        {
            if (string.IsNullOrWhiteSpace(valor)) return new List<string>();
            if (valor.TrimStart().StartsWith('['))
            {
                try
                {
                    return JsonSerializer.Deserialize<List<string>>(valor) ?? new List<string>();
                }
                catch
                {
                    return new List<string>();
                }
            }
            return new List<string> { valor };
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

