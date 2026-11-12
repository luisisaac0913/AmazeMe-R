namespace AmazeMec.Server.Models
{
    public class Puntos
    {
        public int Id { get; set; }
        public int PuntosObtenidos { get; set; }
        public int PuntosGastados { get; set; }

        public int CompraId { get; set; }
        public Compra? Compra { get; set; }
    }
}

