import { Component } from '@angular/core';
import { Filter ,Specialities, Governorates, Gender} from './filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-doctor-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-filters.component.html',
  styleUrl: './doctor-filters.component.css'
  
})
export class DoctorFiltersComponent {
  Gender = Gender;

  SpecialitiesList = Object.values(Specialities);
  GovernoratesList = Object.values(Governorates);
  GenderList = Object.values(Gender);
  filters: Filter = {
    doctorName: '',
    speciality: Specialities.All,
    governorate: Governorates.All,
    gender: Gender.All,
    waitingTime: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  };

  onFilter(): void {
    // This function will be called when the user clicks the filter button
    // You can implement the logic to filter the doctors based on the selected filters
    console.log('Filters applied:', this.filters);
  }
  onReset(): void {
    this.filters = {
      doctorName: '',
      speciality: Specialities.All,
      governorate: Governorates.All,
      gender: Gender.All,
    };
  }
}
