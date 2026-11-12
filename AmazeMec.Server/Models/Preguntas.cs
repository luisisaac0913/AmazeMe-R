using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmazeMec.Server.Models
{
    public class Preguntas
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public required string relacion { get; set; }

        public int edad { get; set; }

        [Required]
        [MaxLength(100)]
        public required string ocasion { get; set; }

        [Required]
        [MaxLength(100)]
        public required string pasatiempos { get; set; }

        [Required]
        [MaxLength(100)]
        public required string personalidad { get; set; }

        [MaxLength(150)]
        public string? objetoQuerido { get; set; }

        [MaxLength(150)]
        public string? objetoNoquerido { get; set; }

        public double presupuesto { get; set; }

        public int dias { get; set; }

        public DateTime FechaRespuesta { get; set; } = DateTime.Now;

        public int? UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public Usuario? Usuario { get; set; }
    }
}

