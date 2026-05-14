export interface RatingDetailDto {
    id: number;
    score: number;
    date: string;
    userId: number;
    username: string;
}

export interface SightRatingDto {
    sightId: number;
    sightName: string;
    city: string;
    averageScore: number;
    ratingCount: number;
    userScore: number;
    ratings: RatingDetailDto[];
}

export interface TripRatingsResponseDto {
    sights: SightRatingDto[];
    overallAverage: number;
}

export interface SaveRatingDto {
    sightId: number;
    score: number;
}