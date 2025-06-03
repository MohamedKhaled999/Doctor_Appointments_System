import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GovernoratesService {

  constructor() { }

  getGovernorates(): string[] {
    return [
      'Cairo',
      'Alexandria',
      'Giza',
      'Ismailia',
      'Luxor',
      'Qalyubia',
      'Sohag',
      'Asyut',
      'Aswan',
      'Beheira',
      'Dakahlia',
      'Fayoum',
      'Gharbia',
      'Minya',
      'Monufia',
      'New Valley',
      'Port Said',
      'Qena',
      'Suez',
      'Beni Suef',
      'Damietta',
      'Kafr El Sheikh',
      'Matruh',
      'Red Sea',
      'Sharqia',
      'North Sinai',
      'South Sinai'
    ];
  }
}
