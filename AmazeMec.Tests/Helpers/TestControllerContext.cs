using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace AmazeMec.Tests.Helpers
{
    public static class TestControllerContext
    {
        public static ControllerContext Create(int? authenticatedUserId = null, string? username = null, string? email = null)
        {
            var services = new ServiceCollection();
            services.AddAuthentication();
            var authService = new TestAuthenticationService();
            services.AddSingleton<IAuthenticationService>(authService);
            var serviceProvider = services.BuildServiceProvider();

            var httpContext = new DefaultHttpContext
            {
                RequestServices = serviceProvider,
                Session = new TestSession()
            };

            if (authenticatedUserId.HasValue)
            {
                httpContext.Session.SetInt32("UsuarioId", authenticatedUserId.Value);

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, authenticatedUserId.Value.ToString()),
                    new Claim(ClaimTypes.Name, username ?? "TestUser"),
                    new Claim(ClaimTypes.Email, email ?? "test@gmail.com")
                };
                var identity = new ClaimsIdentity(claims, "TestCookie");
                httpContext.User = new ClaimsPrincipal(identity);
            }

            return new ControllerContext
            {
                HttpContext = httpContext
            };
        }
    }

    public class TestSession : ISession
    {
        private readonly Dictionary<string, byte[]> _storage = new();

        public bool IsAvailable => true;
        public string Id => "test-session-id";
        public IEnumerable<string> Keys => _storage.Keys;

        public void Clear() => _storage.Clear();

        public Task CommitAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

        public Task LoadAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

        public void Remove(string key) => _storage.Remove(key);

        public void Set(string key, byte[] value) => _storage[key] = value;

        public bool TryGetValue(string key, out byte[] value)
        {
            return _storage.TryGetValue(key, out value!);
        }
    }

    public class TestAuthenticationService : IAuthenticationService
    {
        public Task<AuthenticateResult> AuthenticateAsync(HttpContext context, string? scheme)
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        public Task ChallengeAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
        {
            return Task.CompletedTask;
        }

        public Task ForbidAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
        {
            return Task.CompletedTask;
        }

        public Task SignInAsync(HttpContext context, string? scheme, ClaimsPrincipal principal, AuthenticationProperties? properties)
        {
            context.User = principal;
            return Task.CompletedTask;
        }

        public Task SignOutAsync(HttpContext context, string? scheme, AuthenticationProperties? properties)
        {
            context.User = new ClaimsPrincipal();
            return Task.CompletedTask;
        }
    }
}

