import { Governorate } from '../../../../core/enums/governorate.enum';
import { Specialities } from '../../../../core/enums/speciality.enum';
import { Gender } from '../../../../core/enums/gender.enum';
import { Specialty } from '../../../../core/interfaces/specialty.interface';
export interface Filter {
    // id: string;
    doctorName: string;
    speciality : Specialty[];
    governorate : Governorate;
    gender : Gender;
    waitingTime?: number;
    minPrice?: number;
    maxPrice?: number;
    // type: 'text' | 'number' | 'boolean' | 'date' | 'select';
    // options?: Array<{ label: string; value: string | number }>;
    // placeholder?: string;
    // required?: boolean;
    // disabled?: boolean;
    // visible?: boolean;

    
    }

// export enum Specialities {
//     All = 'All',
//     Cardiologist = 'Cardiologist',
//     Dermatologist = 'Dermatologist',
//     Neurologist = 'Neurologist',
//     Pediatrician = 'Pediatrician',
//     Orthopedic = 'Orthopedic',
//     Ophthalmologist = 'Ophthalmologist',
//     Gastroenterologist = 'Gastroenterologist',
//     Angioplastist = 'Angioplastist',
//     Endocrinologist = 'Endocrinologist',
//     Urologist = 'Urologist',
//     Dentist = 'Dentist'
// }

// export enum Governorates {
//     All = 'All',
//     Cairo = 'Cairo',
//     Alexandria = 'Alexandria',
//     Giza = 'Giza',
//     Dakahlia = 'Dakahlia',
//     RedSea = 'RedSea',
//     Beheira = 'Beheira',
//     Fayoum = 'Fayoum',
//     Gharbia = 'Gharbia',
//     Ismailia = 'Ismailia',
//     Menofia = 'Menofia',
//     Minya = 'Minya',
//     Qaliubiya = 'Qaliubiya',
//     NewValley = 'NewValley',
//     Suez = 'Suez',
//     Aswan = 'Aswan',
//     Assiut = 'Assiut',
//     BeniSuef = 'BeniSuef',
//     PortSaid = 'PortSaid',
//     Damietta = 'Damietta'
// }

// export enum Gender {
//     All = 'All',
//     Male = 'Male',
//     Female = 'Female'
// }

