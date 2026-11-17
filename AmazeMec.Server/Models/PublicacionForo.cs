using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazeMec.Server.Models
{
    public class PublicacionForo
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(120)]
        public string Titulo { get; set; } = string.Empty;

        [Required]
        [MaxLength(1500)]
        public string Contenido { get; set; } = string.Empty;

        [MaxLength(120)]
        public string? RegaloMencionado { get; set; }

        public string? ImagenUrl { get; set; }

        [Required]
        [MaxLength(50)]
        public string Categoria { get; set; } = "Experiencia";

        [Range(1, 5)]
        public int Calificacion { get; set; } = 5;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        public ICollection<LikeForo> Likes { get; set; } = new List<LikeForo>();
        public ICollection<ComentarioForo> Comentarios { get; set; } = new List<ComentarioForo>();
    }
}

