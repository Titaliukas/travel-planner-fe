export interface Traveler {
    id: number;
    username: string;
    mail: string;
}

export interface TripTravelersResponse {
    travelers: Traveler[];
    totalCount: number;
}

export interface AddTravelersDto {
    userIds: number[];
}

export interface RemoveTravelersDto {
    userIds: number[];
}