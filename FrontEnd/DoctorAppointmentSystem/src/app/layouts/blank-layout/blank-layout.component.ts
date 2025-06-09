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

}
