import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsCarouselComponent } from './doctors-carousel.component';

describe('DoctorsCarouselComponent', () => {
  let component: DoctorsCarouselComponent;
  let fixture: ComponentFixture<DoctorsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
