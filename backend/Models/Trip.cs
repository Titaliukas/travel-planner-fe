namespace backend.Models
{
    public class Trip
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public int DayCount { get; set; }
        public bool IsPaused { get; set; } = false;
        public bool IsCancelled { get; set; } = false;
        public int OwnerId { get; set; }
        public User? Owner { get; set; }
        public List<User> Travelers { get; set; } = [];
        public List<Route> Routes { get; set; } = [];

        public void AddSight(Sight newSight)
        {
            var route = Routes.FirstOrDefault();
            if (route == null)
            {
                route = new Route { TripId = Id, RouteSights = new List<RouteSight>() };
                Routes.Add(route);
            }

            bool alreadyAdded = Routes
                .SelectMany(r => r.RouteSights)
                .Any(rs => rs.SightId == newSight.Id);

            if (alreadyAdded)
                return;

            route.RouteSights.Add(new RouteSight
            {
                SightId = newSight.Id,
                Sight = newSight,
                Day = 0,
                VisitOrder = 0
            });
        }
    }
}
