using System.ComponentModel.DataAnnotations;

namespace AmazeMec.Server.DTOs
{
    public class CrearPublicacionForoRequest
    {
        [Required(ErrorMessage = "El título es obligatorio.")]
        [MaxLength(120)]
        public string Titulo { get; set; } = string.Empty;

        [Required(ErrorMessage = "El contenido es obligatorio.")]
        [MaxLength(1500)]
        public string Contenido { get; set; } = string.Empty;

        [MaxLength(120)]
        public string? RegaloMencionado { get; set; }

        [MaxLength(50)]
        public string Categoria { get; set; } = "Experiencia";

        [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5.")]
        public int Calificacion { get; set; } = 5;

        public IFormFile? Imagen { get; set; }
        public List<IFormFile>? Imagenes { get; set; }
    }

    public class CrearComentarioForoRequest
    {
        [Required(ErrorMessage = "El comentario no puede estar vacío.")]
        [MaxLength(600)]
        public string Contenido { get; set; } = string.Empty;
    }

    public class ComentarioForoResponse
    {
        public int Id { get; set; }
        public string Contenido { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public string AutorNombre { get; set; } = string.Empty;
        public string? AutorFoto { get; set; }
        public bool EsPropio { get; set; }
    }

    public class PublicacionForoResponse
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Contenido { get; set; } = string.Empty;
        public string? RegaloMencionado { get; set; }
        public string? ImagenUrl { get; set; }
        public List<string> Imagenes { get; set; } = new();
        public string Categoria { get; set; } = string.Empty;
        public int Calificacion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string AutorNombre { get; set; } = string.Empty;
        public string? AutorFoto { get; set; }
        public bool EsPropia { get; set; }
        public int TotalLikes { get; set; }
        public bool DioLike { get; set; }
        public int TotalComentarios { get; set; }
        public List<ComentarioForoResponse> Comentarios { get; set; } = new();
    }
}

