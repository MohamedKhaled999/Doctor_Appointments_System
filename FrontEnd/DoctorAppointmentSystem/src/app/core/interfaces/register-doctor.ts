import { Governorate } from "../enums/governorate.enum";
import { Gender } from "../models/doctor-register.model";

export interface RegisterDoctor {
     firstName: string;
        lastName: string;
        gender: Gender;
        birthDate: Date;
        image?: File;
        email: string;
        phoneNumber: string;
        governorate: Governorate;
        address: string;
        lat: number;
        lng: number;
        password: string;
        specialtyID: number;
        fees: number;
        waitingTime: number;
        about: string;
}
