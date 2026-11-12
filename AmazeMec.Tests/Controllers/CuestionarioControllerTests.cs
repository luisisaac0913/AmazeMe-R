using AmazeMec.Server.Controllers;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using AmazeMec.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AmazeMec.Tests.Controllers
{
    public class CuestionarioControllerTests
    {
        [Fact]
        public async Task EnviarCuestionario_UsuarioAnonimo_Retorna50AmazingsPendientes()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var controller = new CuestionarioController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new CuestionarioRequest
            {
                Relacion = "Amigos",
                Ocasion = "Cumpleaños",
                Edad = 28,
                Pasatiempos = "Videojuegos",
                Personalidad = "Creativo",
                ObjetoQuerido = "Audífonos",
                ObjetoNoquerido = "Ropa",
                Presupuesto = 1500,
                Dias = 5
            };

            // Act
            var result = await controller.EnviarCuestionario(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<CuestionarioResponse>(okResult.Value);
            Assert.True(response.EsAnonimo);
            Assert.True(response.MostrarModalPendientes);
            Assert.Equal(50, response.AmazingsPendientes);
            Assert.Equal(0, response.PuntosGanados);

            // Verifica que se guardó en base de datos con UsuarioId nulo
            var guardado = await context.RespuestaCuestionario.FirstOrDefaultAsync(r => r.Id == response.Id);
            Assert.NotNull(guardado);
            Assert.Null(guardado.UsuarioId);
            Assert.Equal("Amigos", guardado.relacion);
        }

        [Fact]
        public async Task EnviarCuestionario_UsuarioAutenticado_AcreditaBonoDiario50Amazings()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario
            {
                Nombre = "UserAutenticado",
                Email = "autenticado@gmail.com",
                Contraseña = "hash"
            };
            context.Usuario.Add(user);
            await context.SaveChangesAsync();

            var controller = new CuestionarioController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new CuestionarioRequest
            {
                Relacion = "Pareja",
                Ocasion = "Aniversario",
                Edad = 30,
                Pasatiempos = "Viajes",
                Personalidad = "Aventurero",
                Presupuesto = 2000,
                Dias = 10
            };

            // Act
            var result = await controller.EnviarCuestionario(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<CuestionarioResponse>(okResult.Value);
            Assert.False(response.EsAnonimo);
            Assert.Equal(50, response.PuntosGanados);

            // Verifica registro en Compras y Puntos
            var puntos = await context.Puntos.Include(p => p.Compra).FirstOrDefaultAsync(p => p.Compra!.UsuarioId == user.Id);
            Assert.NotNull(puntos);
            Assert.Equal(50, puntos.PuntosObtenidos);
        }

        [Fact]
        public async Task EnviarCuestionario_UsuarioAutenticado_SegundoEnvioMismoDia_NoDuplicaBono()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario
            {
                Nombre = "UserDobleEnvio",
                Email = "doble@gmail.com",
                Contraseña = "hash"
            };
            context.Usuario.Add(user);

            // Ya tiene un bono acreditado hoy
            var compraExistente = new Compra
            {
                FechaCompra = DateTime.Now,
                Monto = 0,
                Cantidad = 1,
                UsuarioId = user.Id
            };
            context.Compras.Add(compraExistente);
            context.Puntos.Add(new Puntos
            {
                PuntosObtenidos = 50,
                PuntosGastados = 0,
                Compra = compraExistente
            });
            await context.SaveChangesAsync();

            var controller = new CuestionarioController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new CuestionarioRequest
            {
                Relacion = "Trabajo",
                Ocasion = "Despedida",
                Edad = 35,
                Pasatiempos = "Tecnología",
                Personalidad = "Analítico",
                Presupuesto = 800,
                Dias = 3
            };

            // Act
            var result = await controller.EnviarCuestionario(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<CuestionarioResponse>(okResult.Value);
            Assert.False(response.EsAnonimo);
            Assert.Equal(0, response.PuntosGanados); // 0 puntos adicionales hoy

            // Solo existe un registro de bono
            var totalPuntos = await context.Puntos.CountAsync(p => p.Compra!.UsuarioId == user.Id);
            Assert.Equal(1, totalPuntos);
        }

        [Fact]
        public async Task ObtenerHistorial_UsuarioAutenticado_RetornaHistorialDeCuestionarios()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario { Nombre = "UserHistorial", Email = "historial@gmail.com", Contraseña = "hash" };
            context.Usuario.Add(user);
            await context.SaveChangesAsync();

            context.RespuestaCuestionario.Add(new Preguntas
            {
                relacion = "Familia",
                ocasion = "Navidad",
                edad = 40,
                pasatiempos = "Cocina",
                personalidad = "Tranquilo",
                presupuesto = 1000,
                dias = 15,
                UsuarioId = user.Id
            });
            await context.SaveChangesAsync();

            var controller = new CuestionarioController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            // Act
            var result = await controller.ObtenerHistorial();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }
    }
}

