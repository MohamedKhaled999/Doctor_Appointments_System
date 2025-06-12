import { DataManagementService } from './../../core/services/data-management.service';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-blank-layout',
  imports: [RouterOutlet , FooterComponent, NavbarComponent],
  templateUrl: './blank-layout.component.html',
  styleUrl: './blank-layout.component.css'
})
export class BlankLayoutComponent {

  constructor(
    private dataService:DataManagementService
  )
  {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
        console.log("App Component ngOnInit");
        console.log("App Component ngOnInit",this.dataService.UserName());
        console.log("App Component ngOnInit",this.dataService.UserRole());
        console.log("App Component ngOnInit",this.dataService.isAuthenticated());
        

    
  }
}
