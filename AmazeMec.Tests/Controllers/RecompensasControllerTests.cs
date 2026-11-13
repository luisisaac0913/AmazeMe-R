using AmazeMec.Server.Controllers;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using AmazeMec.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AmazeMec.Tests.Controllers
{
    public class RecompensasControllerTests
    {
        [Fact]
        public async Task ObtenerBalance_CalculaCorrectamenteTotalObtenidosMenosGastados()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario { Nombre = "UserBalance", Email = "balance@gmail.com", Contraseña = "hash" };
            context.Usuario.Add(user);

            var compra1 = new Compra { UsuarioId = user.Id, FechaCompra = DateTime.Now, Monto = 0, Cantidad = 1, Usuario = user };
            var compra2 = new Compra { UsuarioId = user.Id, FechaCompra = DateTime.Now, Monto = 0, Cantidad = 1, Usuario = user };
            context.Compras.AddRange(compra1, compra2);

            // Obtiene 150, gasta 50 -> Neto = 100
            context.Puntos.Add(new Puntos { PuntosObtenidos = 150, PuntosGastados = 0, Compra = compra1 });
            context.Puntos.Add(new Puntos { PuntosObtenidos = 0, PuntosGastados = 50, Compra = compra2 });
            await context.SaveChangesAsync();

            var controller = new RecompensasController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            // Act
            var result = await controller.ObtenerBalance();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<BalanceResponse>(okResult.Value);
            Assert.Equal(100, response.BalanceDisponible);
            Assert.Equal(150, response.TotalObtenidos);
            Assert.Equal(50, response.TotalGastados);
            Assert.Equal(2, response.Historial.Count);
        }

        [Fact]
        public void ObtenerCatalogo_RetornaOpcionesDeCanje()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var controller = new RecompensasController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            // Act
            var result = controller.ObtenerCatalogo();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Canjear_BalanceSuficiente_RegistraGastoDePuntos()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario { Nombre = "UserCanjeOk", Email = "canje@gmail.com", Contraseña = "hash" };
            context.Usuario.Add(user);

            var compra = new Compra { UsuarioId = user.Id, FechaCompra = DateTime.Now, Monto = 0, Cantidad = 1, Usuario = user };
            context.Compras.Add(compra);
            context.Puntos.Add(new Puntos { PuntosObtenidos = 500, PuntosGastados = 0, Compra = compra });
            await context.SaveChangesAsync();

            var controller = new RecompensasController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new CanjeRecompensaRequest
            {
                RecompensaId = 1,
                CostoPuntos = 200 // Bono de 200 Amazings
            };

            // Act
            var result = await controller.Canjear(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);

            // Verifica que se agregó el registro de gasto
            var gasto = await context.Puntos.FirstOrDefaultAsync(p => p.PuntosGastados == 200);
            Assert.NotNull(gasto);
        }

        [Fact]
        public async Task Canjear_BalanceInsuficiente_RetornaBadRequest()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario { Nombre = "UserSinSaldo", Email = "sinsaldo@gmail.com", Contraseña = "hash" };
            context.Usuario.Add(user);

            var compra = new Compra { UsuarioId = user.Id, FechaCompra = DateTime.Now, Monto = 0, Cantidad = 1, Usuario = user };
            context.Compras.Add(compra);
            context.Puntos.Add(new Puntos { PuntosObtenidos = 50, PuntosGastados = 0, Compra = compra });
            await context.SaveChangesAsync();

            var controller = new RecompensasController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new CanjeRecompensaRequest
            {
                RecompensaId = 1,
                CostoPuntos = 200 // Requiere 200 pero solo tiene 50
            };

            // Act
            var result = await controller.Canjear(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Canjear_CostoManipuladoPorCliente_UsaCostoOficialDelServidor()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario { Nombre = "UserManipula", Email = "manipula@gmail.com", Contraseña = "hash" };
            context.Usuario.Add(user);

            var compra = new Compra { UsuarioId = user.Id, FechaCompra = DateTime.Now, Monto = 0, Cantidad = 1, Usuario = user };
            context.Compras.Add(compra);
            context.Puntos.Add(new Puntos { PuntosObtenidos = 500, PuntosGastados = 0, Compra = compra });
            await context.SaveChangesAsync();

            var controller = new RecompensasController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new CanjeRecompensaRequest
            {
                RecompensaId = 1, // Bono Nivel 1 cuesta 200 oficialmente
                CostoPuntos = 1   // Intento de manipulación
            };

            // Act
            var result = await controller.Canjear(request);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var gasto = await context.Puntos.FirstOrDefaultAsync(p => p.PuntosGastados == 200);
            Assert.NotNull(gasto);
        }

        [Fact]
        public async Task Canjear_RecompensaInexistente_RetornaBadRequest()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario { Nombre = "UserInvalido", Email = "invalido@gmail.com", Contraseña = "hash" };
            context.Usuario.Add(user);
            await context.SaveChangesAsync();

            var controller = new RecompensasController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new CanjeRecompensaRequest
            {
                RecompensaId = 999,
                CostoPuntos = 10
            };

            // Act
            var result = await controller.Canjear(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Theory]
        [InlineData(100, 5)]
        [InlineData(250, 12)]
        [InlineData(19.99, 0)]
        [InlineData(0, 0)]
        public void CalcularPuntosCompra_MantieneProporcionCincoPorCiento(decimal monto, int esperado)
        {
            Assert.Equal(esperado, RecompensasController.CalcularPuntosCompra(monto));
        }

        [Fact]
        public async Task RegistrarCompra_CalculaCincoPorCientoYApareceEnHistorial()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario { Nombre = "UserCompra", Email = "compra@gmail.com", Contraseña = "hash" };
            context.Usuario.Add(user);
            await context.SaveChangesAsync();

            var controller = new RecompensasController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new RegistrarCompraRequest
            {
                Monto = 400m,
                Cantidad = 2
            };

            // Act
            var compraResult = await controller.RegistrarCompra(request);
            var balanceResult = await controller.ObtenerBalance();

            // Assert
            Assert.IsType<OkObjectResult>(compraResult);
            var okBalance = Assert.IsType<OkObjectResult>(balanceResult);
            var balance = Assert.IsType<BalanceResponse>(okBalance.Value);

            Assert.Equal(20, balance.BalanceDisponible);
            Assert.Single(balance.Historial);
            Assert.Equal(400m, balance.Historial[0].MontoCompra);
            Assert.Equal(20, balance.Historial[0].PuntosObtenidos);
        }
    }
}

