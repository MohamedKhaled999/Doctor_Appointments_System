export interface Doctor {
    id:number;
    name: string;
    profilePictureUrl?: string; // optional field for doctor's profile picture
    title: string;
    qualifications: string[];
    fees: number; // consultation fees
    specializations: string[]; // array of specializations
    rating: number;
    waitingTime: number; // in minutes
    governorate: string; // state or region
    location: string; // city or specific area
    phone: string;

}