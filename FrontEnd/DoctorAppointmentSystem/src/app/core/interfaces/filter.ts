import { Governorate } from '../enums/governorate.enum';
import { Gender } from '../enums/gender.enum';
import { Specialty } from './specialty.interface';

export interface Filter {
    doctorName: string;
    speciality : Specialty[];
    governorate : Governorate;
    gender : Gender;
    waitingTime?: number;
    minPrice?: number;
    maxPrice?: number;
    }
