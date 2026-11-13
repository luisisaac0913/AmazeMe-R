using AmazeMec.Server.Controllers;
using AmazeMec.Server.DTOs;
using AmazeMec.Server.Models;
using AmazeMec.Tests.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AmazeMec.Tests.Controllers
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task Register_ValidData_ReturnsOkAndHashesPassword()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new RegisterRequest
            {
                Nombre = "UsuarioTest",
                Email = "test@gmail.com",
                Contraseña = "Password123!",
                ConfirmarContraseña = "Password123!"
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthUserResponse>(okResult.Value);
            Assert.Equal("UsuarioTest", response.Nombre);
            Assert.Equal("test@gmail.com", response.Email);

            var usuarioGuardado = await context.Usuario.FirstOrDefaultAsync(u => u.Nombre == "UsuarioTest");
            Assert.NotNull(usuarioGuardado);
            Assert.True(BCrypt.Net.BCrypt.Verify("Password123!", usuarioGuardado.Contraseña));
        }

        [Fact]
        public async Task Register_DisallowedEmailDomain_ReturnsBadRequest()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new RegisterRequest
            {
                Nombre = "UsuarioDominioInvalido",
                Email = "usuario@correo-desconocido.xyz",
                Contraseña = "Password123!",
                ConfirmarContraseña = "Password123!"
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Register_WeakPassword_ReturnsBadRequest()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new RegisterRequest
            {
                Nombre = "UsuarioPassDebil",
                Email = "test@gmail.com",
                Contraseña = "sololetrasyminusculas",
                ConfirmarContraseña = "sololetrasyminusculas"
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Register_MismatchedPasswords_ReturnsBadRequest()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new RegisterRequest
            {
                Nombre = "UsuarioMismatch",
                Email = "test@gmail.com",
                Contraseña = "Password123!",
                ConfirmarContraseña = "OtraPassword123!"
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Register_DuplicateUsernameOrEmail_ReturnsConflict()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            context.Usuario.Add(new Usuario
            {
                Nombre = "UsuarioExistente",
                Email = "existente@gmail.com",
                Contraseña = BCrypt.Net.BCrypt.HashPassword("Password123!")
            });
            await context.SaveChangesAsync();

            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new RegisterRequest
            {
                Nombre = "UsuarioExistente",
                Email = "otro@gmail.com",
                Contraseña = "Password123!",
                ConfirmarContraseña = "Password123!"
            };

            // Act
            var result = await controller.Register(request);

            // Assert
            Assert.IsType<ConflictObjectResult>(result);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            context.Usuario.Add(new Usuario
            {
                Nombre = "UsuarioLogin",
                Email = "login@gmail.com",
                Contraseña = BCrypt.Net.BCrypt.HashPassword("MiPasswordSegura1#")
            });
            await context.SaveChangesAsync();

            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new LoginRequest
            {
                Identificador = "UsuarioLogin",
                Contraseña = "MiPasswordSegura1#"
            };

            // Act
            var result = await controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthUserResponse>(okResult.Value);
            Assert.Equal("UsuarioLogin", response.Nombre);
        }

        [Fact]
        public async Task Login_NonExistentUser_ReturnsUnauthorized()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new LoginRequest
            {
                Identificador = "NoExisto",
                Contraseña = "CualquierPassword1!"
            };

            // Act
            var result = await controller.Login(request);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_WrongPassword_ReturnsUnauthorized()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            context.Usuario.Add(new Usuario
            {
                Nombre = "UsuarioLoginFail",
                Email = "fail@gmail.com",
                Contraseña = BCrypt.Net.BCrypt.HashPassword("CorrectPassword1!")
            });
            await context.SaveChangesAsync();

            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create()
            };

            var request = new LoginRequest
            {
                Identificador = "UsuarioLoginFail",
                Contraseña = "WrongPassword1!"
            };

            // Act
            var result = await controller.Login(request);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_WithPendingAmazingsInSession_ClaimsPointsAutomatically()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario
            {
                Nombre = "UsuarioReclamo",
                Email = "reclamo@gmail.com",
                Contraseña = BCrypt.Net.BCrypt.HashPassword("Password123!")
            };
            context.Usuario.Add(user);
            await context.SaveChangesAsync();

            var controllerContext = TestControllerContext.Create();
            controllerContext.HttpContext.Session.SetInt32("AmazingsPendientes", 1);

            var controller = new AuthController(context)
            {
                ControllerContext = controllerContext
            };

            var request = new LoginRequest
            {
                Identificador = "UsuarioReclamo",
                Contraseña = "Password123!"
            };

            // Act
            var result = await controller.Login(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthUserResponse>(okResult.Value);
            Assert.Equal(1, response.PuntosReclamados);

            // Check database points created
            var puntos = await context.Puntos.Include(p => p.Compra).FirstOrDefaultAsync(p => p.Compra!.UsuarioId == user.Id);
            Assert.NotNull(puntos);
            Assert.Equal(1, puntos.PuntosObtenidos);
        }

        [Fact]
        public async Task Me_WhenAuthenticated_ReturnsCurrentUserInfo()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario
            {
                Nombre = "UsuarioMe",
                Email = "me@gmail.com",
                Contraseña = "hash"
            };
            context.Usuario.Add(user);
            await context.SaveChangesAsync();

            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            // Act
            var result = await controller.Me();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<AuthUserResponse>(okResult.Value);
            Assert.Equal(user.Id, response.Id);
            Assert.Equal("UsuarioMe", response.Nombre);
        }

        [Fact]
        public async Task CambiarPassword_WithCorrectCurrentPassword_UpdatesHash()
        {
            // Arrange
            var context = TestDbContextFactory.Create();
            var user = new Usuario
            {
                Nombre = "UsuarioCambio",
                Email = "cambio@gmail.com",
                Contraseña = BCrypt.Net.BCrypt.HashPassword("ActualPassword1!")
            };
            context.Usuario.Add(user);
            await context.SaveChangesAsync();

            var controller = new AuthController(context)
            {
                ControllerContext = TestControllerContext.Create(user.Id, user.Nombre, user.Email)
            };

            var request = new CambiarPasswordRequest
            {
                ContraseñaActual = "ActualPassword1!",
                ContraseñaNueva = "NuevaPasswordSegura2@",
                ConfirmarContraseñaNueva = "NuevaPasswordSegura2@"
            };

            // Act
            var result = await controller.CambiarPassword(request);

            // Assert
            Assert.IsType<OkObjectResult>(result);

            var usuarioActualizado = await context.Usuario.FindAsync(user.Id);
            Assert.True(BCrypt.Net.BCrypt.Verify("NuevaPasswordSegura2@", usuarioActualizado!.Contraseña));
        }
    }
}

