export interface Interest {
    Id: number;
    Name: string;
}

export interface UserInterest {
    InterestId: number;
    InterestName: string;
    Score: number;
}

export interface SaveInterestDto {
    interestId: number;
    score: number;
}