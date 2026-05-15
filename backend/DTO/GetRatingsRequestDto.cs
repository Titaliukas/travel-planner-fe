namespace backend.DTO
{
    public class GetRatingsRequest
    {
        public List<int> SightIds { get; set; } = new();
        public List<int> TravelerIds { get; set; } = new();
    }
}