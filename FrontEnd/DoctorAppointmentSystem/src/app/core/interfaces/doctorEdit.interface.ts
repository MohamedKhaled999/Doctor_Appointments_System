interface DoctorEdit {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  governorate: string;
  birthDate: Date;
  specialty: string;
  address: string;
  fees: number;
  gender: string;
  lat: number;
  lng: number;
  waitingTime: number;
  imageUrl: string;
  image: File | null;
  about: string;
}

export type { DoctorEdit };
