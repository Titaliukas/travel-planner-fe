namespace backend.Models
{
    public class UserInterest
    {
        public int Id { get; set; }
        public int Score { get; set; }

        public int UserId { get; set; }
        public int InterestId { get; set; }

        public User User { get; set; }
        public Interest Interest { get; set; }
    }
}
