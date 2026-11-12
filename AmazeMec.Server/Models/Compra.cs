namespace AmazeMec.Server.Models
{
    public class Compra
    {
        public int Id { get; set; }
        public DateTime FechaCompra { get; set; }
        public decimal Monto { get; set; }
        public int Cantidad { get; set; }

        public int UsuarioId { get; set; }
        public Usuario? Usuario { get; set; }
    }
}

