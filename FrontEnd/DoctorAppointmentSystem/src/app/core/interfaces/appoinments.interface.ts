interface Appointment {
  id: number;
  specialty: string;
  startTime: Date;
  endTime: Date;
  governorate: string;
  location: string;
  doctor: string;
  doctorImagePath: string;
  isExist: boolean;
}

export type { Appointment };
