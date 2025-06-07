import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrenalLoginComponent } from './extrenal-login.component';

describe('ExtrenalLoginComponent', () => {
  let component: ExtrenalLoginComponent;
  let fixture: ComponentFixture<ExtrenalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtrenalLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtrenalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
