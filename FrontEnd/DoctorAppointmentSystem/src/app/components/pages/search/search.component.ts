import { Component } from '@angular/core';
import { DoctorCardComponent } from "./doctor-card/doctor-card.component";
import { DoctorFiltersComponent } from "./doctor-filters/doctor-filters.component";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";

@Component({
  selector: 'app-search',
  imports: [DoctorCardComponent, DoctorFiltersComponent, DoctorListComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

}
