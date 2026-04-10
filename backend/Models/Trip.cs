namespace backend.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? Start { get; set; } 
        public DateTime? End { get; set; }

        public int DayCount { get; set; }
        public bool IsPaused { get; set; }
        public bool IsCancelled { get; set; }
        public int OwnerId { get; set; }
        public User? Owner { get; set; }
        public List<User> Travelers {  get; set; } = [];

    }
}
