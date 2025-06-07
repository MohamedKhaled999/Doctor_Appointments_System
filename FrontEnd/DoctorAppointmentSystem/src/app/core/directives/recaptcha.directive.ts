
import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef } from '@angular/core';

declare const grecaptcha: any;

@Directive({
  selector: '[appRecaptcha]',
  standalone: true
})
export class RecaptchaDirective implements OnInit, OnDestroy {
  @Input({ required: true }) siteKey!: string;
  @Output() resolved = new EventEmitter<string>(); 
  private widgetId: number | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadRecaptcha();
  }

  ngOnDestroy(): void {
    this.resetRecaptcha();
  }

  private loadRecaptcha(): void {
    if (typeof grecaptcha === 'undefined') {
      console.error('reCAPTCHA API not loaded');
      this.resolved.emit(''); 
      return;
    }

    grecaptcha.ready(() => {
      try {
        this.widgetId = grecaptcha.render(this.elementRef.nativeElement, {
          sitekey: this.siteKey,
          callback: (token: string) => this.resolved.emit(token), 
          'expired-callback': () => this.resolved.emit(''),   
          'error-callback': () => this.resolved.emit('')    
        });
      } catch (error) {
        console.error('reCAPTCHA render error:', error);
        this.resolved.emit(''); 
      }
    });
  }

  private resetRecaptcha(): void {
    if (this.widgetId !== null && typeof grecaptcha !== 'undefined') {
      try {
        grecaptcha.reset(this.widgetId);
      } catch (error) {
        console.error('reCAPTCHA reset error:', error);
      }
    }
  }
}