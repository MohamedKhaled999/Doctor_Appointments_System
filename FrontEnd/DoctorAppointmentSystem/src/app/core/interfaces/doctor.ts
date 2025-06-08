import { reservation } from "./reservation";

export interface Doctor {
    id:number;
    name: string;
    profilePictureUrl?: string; // optional field for doctor's profile picture
    title: string;
    qualifications: string[];
    fees: number; // consultation fees
    specializations: string[]; // in db it should be enum
    rating: number;
    waitingTime: number; // in minutes
    governorate: string; // in db it should be enum
    location: string; // city or specific area
    phone: string;
    reservations: reservation[];
}

export interface DoctorResponse {
    results: Doctor[];
    total_pages: number;
    total_results: number;
    page: number;
}