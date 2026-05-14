namespace backend.DTO
{
    public class TripRatingsResponseDto
    {
        public List<TripSightRatingDto> Sights { get; set; } = new();
        public double OverallAverage { get; set; }
    }
}