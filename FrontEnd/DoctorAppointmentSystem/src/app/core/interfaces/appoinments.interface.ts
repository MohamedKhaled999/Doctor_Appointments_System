interface Appointment {
  id: number;
  specialty: string;
  startTime: Date;
  endTime: Date;
  governorate: string;
  location: string;
  doctor: string;
  doctorImagePath: string;
  files?: string[];
  prescriptionUrl?: string;
  doctorReservationID?: number;
}

export type { Appointment };
