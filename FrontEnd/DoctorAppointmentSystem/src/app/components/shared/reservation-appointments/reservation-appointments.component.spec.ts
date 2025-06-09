import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAppointmentsComponent } from './reservation-appointments.component';

describe('ReservationAppointmentsComponent', () => {
  let component: ReservationAppointmentsComponent;
  let fixture: ComponentFixture<ReservationAppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAppointmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
