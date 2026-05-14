namespace backend.DTO
{
    public class UserInterestDto
    {
        public int InterestId { get; set; }
        public string InterestName { get; set; } = string.Empty;
        public int Score { get; set; }
    }
}