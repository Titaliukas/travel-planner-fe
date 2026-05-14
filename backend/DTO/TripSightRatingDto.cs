namespace backend.DTO
{
    public class TripSightRatingDto
    {
        public int SightId { get; set; }
        public string SightName { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public double AverageScore { get; set; }
        public int RatingCount { get; set; }
        public int UserScore { get; set; }  // Paskutinis vartotojo įvertinimas
        public List<RatingDto> Ratings { get; set; } = new();
    }
}