namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Mail { get; set; }

        public List<Trip> OwnedTrips { get; set; } = new();
        public List<Trip> ParticipantTrips { get; set; } = new();
    }
}
