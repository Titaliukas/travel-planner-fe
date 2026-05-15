namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Mail { get; set; } = string.Empty;

        public List<Trip> OwnedTrips { get; set; } = new();
        public List<Trip> ParticipantTrips { get; set; } = new();
        public List<UserInterest> UserInterests { get; set; } = new();
    }
}
