namespace backend.Models
{
	public class Route
	{
		public int Id { get; set; }
		public double Distance { get; set; }
		public TimeSpan Duration { get; set; }
		public string? StartingLocation { get; set; }
		public string? EndingLocation { get; set; }
		public ICollection<RouteSight> RouteSights { get; set; }
	}
}
