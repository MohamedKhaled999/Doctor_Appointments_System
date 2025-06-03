import { Component ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test-swiper',
  imports: [],
  templateUrl: './test-swiper.component.html',
  styleUrl: './test-swiper.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestSwiperComponent {

  constructor(private toster: ToastrService) {
    // You can initialize any properties or services here if needed
  }

  showSuccess() {
    this.toster.success('This is a success message!', 'Success');
  }
  showError() {
    this.toster.error('This is an error message!', '');
  }
  showInfo() {
    this.toster.info('This is an info message!', 'Info');
  }
  showWarning() {
    this.toster.warning('This is a warning message!', 'Warning');
  }
  showCustom() {
    this.toster.show('This is a custom message!', 'Custom', {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-bottom-right'
    });
  }
  showToast() {
    this.toster.show('This is a toast message!', 'Toast', {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-center'
    });
  }
}
