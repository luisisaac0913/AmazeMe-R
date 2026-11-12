namespace AmazeMec.Server.DTOs
{
    public class BalanceResponse
    {
        public int BalanceDisponible { get; set; }
        public int TotalObtenidos { get; set; }
        public int TotalGastados { get; set; }
        public List<TransaccionPuntosDto> Historial { get; set; } = new();
    }

    public class TransaccionPuntosDto
    {
        public int Id { get; set; }
        public int PuntosObtenidos { get; set; }
        public int PuntosGastados { get; set; }
        public DateTime Fecha { get; set; }
        public decimal MontoCompra { get; set; }
    }

    public class CanjeRecompensaRequest
    {
        public int RecompensaId { get; set; }
        public int CostoPuntos { get; set; }
    }
}

