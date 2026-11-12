using System.ComponentModel.DataAnnotations;

namespace AmazeMec.Server.DTOs
{
    public class CuestionarioRequest
    {
        [Required(ErrorMessage = "La relación es requerida.")]
        [MaxLength(50)]
        public string Relacion { get; set; } = string.Empty;

        [Range(1, 120, ErrorMessage = "La edad debe ser entre 1 y 120.")]
        public int Edad { get; set; } = 18;

        [Required(ErrorMessage = "La ocasión es requerida.")]
        [MaxLength(100)]
        public string Ocasion { get; set; } = string.Empty;

        [Required(ErrorMessage = "Los pasatiempos son requeridos.")]
        [MaxLength(100)]
        public string Pasatiempos { get; set; } = string.Empty;

        [Required(ErrorMessage = "La personalidad es requerida.")]
        [MaxLength(100)]
        public string Personalidad { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? ObjetoQuerido { get; set; }

        [MaxLength(150)]
        public string? ObjetoNoquerido { get; set; }

        [Range(0, 1000000, ErrorMessage = "El presupuesto debe ser un número válido.")]
        public double Presupuesto { get; set; }

        [Range(1, 31)]
        public int Dias { get; set; } = 1;
    }

    public class CuestionarioResponse
    {
        public int Id { get; set; }
        public int PuntosGanados { get; set; }
        public bool EsAnonimo { get; set; }
        public bool MostrarModalPendientes { get; set; }
        public int AmazingsPendientes { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }

    public class ReclamarPuntosRequest
    {
        public int? RespuestaId { get; set; }
    }
}

