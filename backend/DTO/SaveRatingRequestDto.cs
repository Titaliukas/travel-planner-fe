namespace backend.DTO
{
    public class SaveRatingRequestDto
    {
        public int UserId { get; set; }
        public int SightId { get; set; }
        public int Score { get; set; }
    }
}