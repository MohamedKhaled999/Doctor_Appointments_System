import { Component } from '@angular/core';
import { DoctorCardComponent } from "./doctor-card/doctor-card.component";
import { DoctorFiltersComponent } from "./doctor-filters/doctor-filters.component";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-search',
  imports: [ DoctorFiltersComponent, DoctorListComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  currentUrl : any;
  constructor(private toaster: ToastrService) {}
  getCurrentUrl(): string {
    return window.location.href;
  }
  ngOnInit(){
    this.currentUrl = this.getCurrentUrl;
    if (this.currentUrl.includes('payment-success')) 
      {
      this.showSuccess();
    }
    else if(this.currentUrl.includes('payment-failed')) // Just check what it returns when failing
    {
      this.showError();
    }
  }

  showSuccess() {
    // this.toaster.success('This is a success message!', 'Success');
    this.toaster.show('Congratulations! Your payment has succeeded', 'Custom', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-bottom-right',
    });
  }
  showError() {
      this.toaster.show('Something went wrong! Your payment didn\'t succeed', 'Custom', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-bottom-right',
    });
  }
}
