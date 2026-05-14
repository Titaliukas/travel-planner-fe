namespace backend.DTO
{
    public class RatingDto
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
    }
}