namespace backend.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;

        public int UserId { get; set; }
        public int SightId { get; set; }

        public User User { get; set; } = null!;
        public Sight Sight { get; set; } = null!;
    }
}