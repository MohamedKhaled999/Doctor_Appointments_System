export interface reservation {
    DoctorId : number;
    ResId : number;
    Day : number;
    StartTime : string;
    EndTime : string;
    IsAvailable : boolean;
}


export interface ReservationResponse {
    reservations : reservation[];
}