import { Governorate } from "../enums/governorate.enum";

// export interface Register {
//     firstName: string;
//     lastName: string;
//     email: string;
//     governorate: Governorate; // Assuming governorate is represented as a number (e.g., an ID)
//     password: string;
//     phoneNumber?: string; // Optional field for phone number
//     // address?: string; // Optional field for address
//     dateOfBirth?: Date; // Optional field for
// }
// models/register.ts

export interface Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birthDate?: string; // لأنه سترسل كـ "yyyy-MM-dd"

    governorate: Governorate;

}
