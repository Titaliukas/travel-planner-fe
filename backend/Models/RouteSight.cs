namespace backend.Models
{
	public class RouteSight
	{
		public int Id { get; set; }
		public int RouteId { get; set; }
		public int SightId { get; set; }
		public Route Route { get; set; }
		public Sight Sight { get; set; }
		public int Day {  get; set; }
		public int VisitOrder { get; set; }
	}
}
