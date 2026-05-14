namespace backend.Models
{
	public class Sight
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public string City { get; set; }
		public string Description { get; set; }
		public string FullDescription { get; set; }
		public string Address { get; set; } 
		public int Duration { get; set; }
		public double CoordinateX { get; set; } 
		public double CoordinateY { get; set; } 
		public string PhotoUrl { get; set; }
	}
}
