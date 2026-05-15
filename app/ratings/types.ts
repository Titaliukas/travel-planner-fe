export interface Sight {
    Id: number;
    Name: string;
    City: string;
    Description: string;
    FullDescription: string;
    Address: string;
    Duration: number;
    CoordinateX: number;
    CoordinateY: number;
    PhotoUrl: string;
}

export interface Traveler {
    Id: number;
    Username: string;
    Mail: string;
}

export interface SightRating {
    sightId: number;
    averageScore: number;
    ratingCount: number;
}

export interface SaveRatingRequest {
    userId: number;
    sightId: number;
    score: number;
}