namespace backend.DTO
{
    public class GetRatingsRequestDto
    {
        public List<int> SightIds { get; set; } = new();
        public List<int> TravelerIds { get; set; } = new();
    }
}