import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { DoctorFiltersComponent } from "./doctor-filters/doctor-filters.component";
import { DoctorListComponent } from "./doctor-list/doctor-list.component";
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [DoctorFiltersComponent, DoctorListComponent, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  currentUrl: any;
  isBrowser: boolean = false;
  isToasterShownFirstTime: boolean = false
  constructor(@Inject(PLATFORM_ID) private platformId: any, private toaster: ToastrService
    , private route: ActivatedRoute) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getCurrentUrl(): string {
    if (this.isBrowser)
      return window.location.href;
    else
      return this.route.toString();
  }

  ngOnInit(): void {
    this.currentUrl = this.getCurrentUrl()
    if (this.isBrowser && !this.isToasterShownFirstTime) {
      if (this.currentUrl.includes('payment-success')) {
        this.showSuccess();
        this.isToasterShownFirstTime = true;
      } else if (this.currentUrl.includes('payment-failed')) {
        this.showError();
        this.isToasterShownFirstTime = true;
      }
    }
  }

  showSuccess() {
    // this.toaster.success('This is a success message!', 'Success');
    this.toaster.success('Congratulations! Your payment has succeeded', 'Success', {
      timeOut: 10000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      easeTime: 400, // optional
      progressAnimation: 'decreasing',
      tapToDismiss: true
    });
  }

  showError() {
    this.toaster.error('Something went wrong! Your payment didn\'t succeed', 'Payment Failed', {
      timeOut: 10000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      easeTime: 400, // optional
      progressAnimation: 'decreasing',
      tapToDismiss: true
    });
  }
}
