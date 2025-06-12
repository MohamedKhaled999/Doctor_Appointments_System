import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCardsContainerComponent } from './reservation-cards-container.component';

describe('ReservationCardsContainerComponent', () => {
  let component: ReservationCardsContainerComponent;
  let fixture: ComponentFixture<ReservationCardsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationCardsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationCardsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
