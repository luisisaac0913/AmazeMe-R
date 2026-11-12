using AmazeMec.Server.Models;
using System.ComponentModel.DataAnnotations;
using Xunit;

namespace AmazeMec.Tests.Models
{
    public class ModelValidationTests
    {
        private IList<ValidationResult> ValidarModelo(object modelo)
        {
            var resultados = new List<ValidationResult>();
            var contexto = new ValidationContext(modelo, null, null);
            Validator.TryValidateObject(modelo, contexto, resultados, true);
            return resultados;
        }

        [Fact]
        public void Usuario_CamposRequeridosFaltantes_FallaValidacion()
        {
            var usuario = new Usuario
            {
                Nombre = "",
                Email = "email-invalido",
                Contraseña = ""
            };

            var errores = ValidarModelo(usuario);

            Assert.NotEmpty(errores);
            Assert.Contains(errores, e => e.MemberNames.Contains("Nombre"));
            Assert.Contains(errores, e => e.MemberNames.Contains("Email"));
            Assert.Contains(errores, e => e.MemberNames.Contains("Contraseña"));
        }

        [Fact]
        public void Usuario_DatosValidos_PasaValidacion()
        {
            var usuario = new Usuario
            {
                Nombre = "Carlos",
                Email = "carlos@gmail.com",
                Contraseña = "Password123!"
            };

            var errores = ValidarModelo(usuario);

            Assert.Empty(errores);
        }

        [Fact]
        public void Preguntas_CamposRequeridosFaltantes_FallaValidacion()
        {
            var preguntas = new Preguntas
            {
                relacion = "",
                ocasion = "",
                pasatiempos = "",
                personalidad = "",
                edad = 200, // Fuera de rango
                presupuesto = -10 // Fuera de rango
            };

            var errores = ValidarModelo(preguntas);

            Assert.NotEmpty(errores);
        }

        [Fact]
        public void Compra_YPuntos_PropiedadesValidas_InstancianCorrectamente()
        {
            var compra = new Compra
            {
                Id = 1,
                FechaCompra = DateTime.Now,
                Monto = 150.50m,
                Cantidad = 2,
                UsuarioId = 10
            };

            var puntos = new Puntos
            {
                Id = 1,
                PuntosObtenidos = 50,
                PuntosGastados = 0,
                CompraId = compra.Id,
                Compra = compra
            };

            Assert.Equal(150.50m, compra.Monto);
            Assert.Equal(50, puntos.PuntosObtenidos);
            Assert.Equal(compra.Id, puntos.CompraId);
        }
    }
}

