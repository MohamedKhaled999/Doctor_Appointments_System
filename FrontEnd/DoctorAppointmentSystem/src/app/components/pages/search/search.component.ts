import { Component, OnInit } from '@angular/core';
import { DoctorCardComponent } from "./doctor-card/doctor-card.component";
import { DoctorFiltersComponent } from "./doctor-filters/doctor-filters.component";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-search',
  imports: [DoctorFiltersComponent, DoctorListComponent, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const specialtyId = params['Specialty'];
      console.log('Specialty:', specialtyId);

    
    });
  }
}