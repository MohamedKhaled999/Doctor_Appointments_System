import { Governorate } from "../enums/governorate.enum";

export interface Register {
    firstName: string;
    lastName: string;
    email: string;
    governorate: Governorate; // Assuming governorate is represented as a number (e.g., an ID)
    password: string;
    phoneNumber?: string; // Optional field for phone number
    address?: string; // Optional field for address
    dateOfBirth?: Date; // Optional field for
}
// {
//   "firstName": "ZcYpnSUs7xwjCb_fz0 N CZvg3bNizuTMbiqCAkP8VxAUxF1-HipdtJx1NUdIP5beEDy Wu-1I4x2SY4u",
//   "lastName": "Z",
//   "password": "7J2kHpn4!R8dKnritocM@eaL6t!rK7oTIc8usHUVsyG5eMpBN6fCQaydBeS2g9fCM@*mDm8xLHESzfETE3YG@$wpZpqJJj%o",
//   "email": "user@example.com",
//   "phoneNumber": "05311899826",
//   "governorate": 0,
//   "birthDate": "2025-06-01"
// }
