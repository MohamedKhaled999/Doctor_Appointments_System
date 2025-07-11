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
    Male = 'Male',
    Female = 'Female'
  }
  
  
  export enum Governorate {
    Cairo = 0,
    Alexandria = 1,
   
  }