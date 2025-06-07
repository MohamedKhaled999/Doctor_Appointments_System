import { Appointment } from "./appoinments.interface";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  governorate: string;
  birthDate: Date;
  appointments: Appointment[];
}

export type { Patient };
 