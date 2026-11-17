using AmazeMec.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeMec.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opciones) : base(opciones) { }

        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<Puntos> Puntos { get; set; }
        public DbSet<Preguntas> RespuestaCuestionario { get; set; }
        public DbSet<PublicacionForo> PublicacionesForo { get; set; }
        public DbSet<LikeForo> LikesForo { get; set; }
        public DbSet<ComentarioForo> ComentariosForo { get; set; }

        protected override void OnModelCreating(ModelBuilder constructorModelos)
        {
            base.OnModelCreating(constructorModelos);

            constructorModelos.Entity<Usuario>()
                .HasIndex(usuario => usuario.Nombre)
                .IsUnique();

            constructorModelos.Entity<Usuario>()
                .HasIndex(usuario => usuario.Email)
                .IsUnique();

            constructorModelos.Entity<LikeForo>()
                .HasIndex(like => new { like.PublicacionId, like.UsuarioId })
                .IsUnique();
        }
    }
}

