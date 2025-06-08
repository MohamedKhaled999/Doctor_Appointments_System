import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DataManagementService } from './core/services/data-management.service';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'DoctorAppointmentSystem';

  constructor( private userData:DataManagementService) {
  }
  ngOnInit(): void {
   
  //  this.userData.UserRole.set(localStorage.getItem("userRole")!);
    
  }

}
