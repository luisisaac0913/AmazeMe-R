using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazeMec.Server.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Contraseña { get; set; } = string.Empty;

        public DateTime Fecharegistro { get; set; } = DateTime.UtcNow;

        [NotMapped]
        public string ConfirmarContraseña { get; set; } = string.Empty;
    }
}

