using System.ComponentModel.DataAnnotations.Schema;

namespace AmazeMec.Server.Models
{
    public class LikeForo
    {
        public int Id { get; set; }

        public int PublicacionId { get; set; }

        [ForeignKey("PublicacionId")]
        public PublicacionForo? Publicacion { get; set; }

        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}

