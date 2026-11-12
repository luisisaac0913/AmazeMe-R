using System.ComponentModel.DataAnnotations;

namespace AmazeMec.Server.DTOs
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Rellene todos los campos.")]
        public string Identificador { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rellene todos los campos.")]
        public string Contraseña { get; set; } = string.Empty;

        public int? UltimaRespuestaId { get; set; }
    }

    public class RegisterRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(50)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio.")]
        [EmailAddress(ErrorMessage = "El correo es inválido.")]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        public string Contraseña { get; set; } = string.Empty;

        [Required(ErrorMessage = "La confirmación de contraseña es obligatoria.")]
        public string ConfirmarContraseña { get; set; } = string.Empty;

        public int? UltimaRespuestaId { get; set; }
    }

    public class AuthUserResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; }
        public int? PuntosReclamados { get; set; }
    }

    public class PerfilUpdateRequest
    {
        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
    }

    public class CambiarPasswordRequest
    {
        [Required(ErrorMessage = "Coloca la contraseña actual.")]
        public string ContraseñaActual { get; set; } = string.Empty;

        [Required(ErrorMessage = "Coloca la nueva contraseña.")]
        public string ContraseñaNueva { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirma la nueva contraseña.")]
        public string ConfirmarContraseñaNueva { get; set; } = string.Empty;
    }
}

