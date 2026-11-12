using AmazeMec.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace AmazeMec.Tests.Helpers
{
    public static class TestDbContextFactory
    {
        public static AppDbContext Create(string? databaseName = null)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName ?? Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }
    }
}

