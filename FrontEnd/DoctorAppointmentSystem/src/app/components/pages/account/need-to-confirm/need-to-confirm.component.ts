import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-need-to-confirm',
  templateUrl: './need-to-confirm.component.html',
  styleUrls: ['./need-to-confirm.component.css']
})
export class NeedToConfirmComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}