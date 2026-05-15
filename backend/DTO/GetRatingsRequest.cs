using System.Collections.Generic;

namespace backend.DTO
{
    public class GetRatingsRequest
    {
        public List<int> SightIds { get; set; } = new List<int>();
        public List<int> TravelerIds { get; set; } = new List<int>();
    }
}