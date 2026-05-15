namespace backend.DTO
{
    public class SaveAllRatingsRequest
    {
        public int UserId { get; set; }
        public List<SightRatingDto> Ratings { get; set; } = new();
    }
}