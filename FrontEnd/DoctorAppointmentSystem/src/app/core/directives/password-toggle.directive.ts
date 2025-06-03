
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPasswordToggle]',
  standalone: true
})
export class PasswordToggleDirective {
  @Input() targetId!: string;

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    const target = document.getElementById(this.targetId);
    if (target) {
      const type = target.getAttribute('type') === 'password' ? 'text' : 'password';
      target.setAttribute('type', type);
      
  
      const icon = this.el.nativeElement.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      }
    }
  }
}