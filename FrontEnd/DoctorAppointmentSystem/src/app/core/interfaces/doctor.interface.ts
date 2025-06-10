import { Rating } from "./rating.interface";
import { Reservation } from "./reservation.interface";
import { Schedule } from "./Schedule.interface";

interface Doctor {
  id: number;
  name: string;
  title: string;
  gender: string;
  image: string;
  about: string;
  fees: number;
  specialty: string;
  speciality?: string; // Optional for backward compatibility
  rating: number;
  waitingTime: number;
  governorate: string;
  location: string;
  phone: string;
  ratings: Rating[];
  reservations: Reservation[];
  latitude: number;
  longitude: number;
  schedule?: Schedule;
  birthDate?: Date;
  email?: string;
}

export type { Doctor };
