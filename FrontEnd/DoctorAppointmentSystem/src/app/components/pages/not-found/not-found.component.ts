import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotFoundComponent {
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      import('@dotlottie/player-component');
    }
  }
}
