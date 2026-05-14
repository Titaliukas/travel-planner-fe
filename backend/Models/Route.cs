namespace backend.Models
{
	public class Route
	{
		public int Id { get; set; }
		double Distance { get; set; }
		public TimeOnly Duration { get; set; }
		public string? StartingLocation { get; set; }
		public string? EndingLocation { get; set; }
		public ICollection<RouteSight> RouteSights { get; set; }
	}
}
