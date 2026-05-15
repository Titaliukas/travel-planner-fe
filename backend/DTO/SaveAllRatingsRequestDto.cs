namespace backend.DTO
{
    public class SaveAllRatingsRequestDto
    {
        public int UserId { get; set; }
        public List<SightRatingDto> Ratings { get; set; } = new();
    }
}