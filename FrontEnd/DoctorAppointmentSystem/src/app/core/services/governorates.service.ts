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
      'Dakahlia',
      'Red Sea',
      'Beheira',
      'Fayoum',
      'Gharbia',
      'Ismailia',
      'Monufia',
      'Minya',
      'Qalyubia',
      'New Valley',
      'Suez',
      'Aswan',
      'Asyut',
      'Beni Suef',
      'Port Said',
      'Damietta',
      'Sharqia',
      'South Sinai',
      'Kafr El Sheikh',
      'Matruh',
      'Luxor',
      'Qena',
      'North Sinai',
      'Sohag'
    ];
  }
}
