export interface DoctorRegisterVM {
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
  
  export enum Gender {
    Male = 0,
    Female = 1
  }
  
  
  export enum Governorate {
    Cairo = 0,
    Alexandria = 1,
   
  }