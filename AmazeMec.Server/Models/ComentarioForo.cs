using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazeMec.Server.Models
{
    public class ComentarioForo
    {
        public int Id { get; set; }

        public int PublicacionId { get; set; }

        [ForeignKey("PublicacionId")]
        public PublicacionForo? Publicacion { get; set; }

        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        [Required]
        [MaxLength(600)]
        public string Contenido { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}

