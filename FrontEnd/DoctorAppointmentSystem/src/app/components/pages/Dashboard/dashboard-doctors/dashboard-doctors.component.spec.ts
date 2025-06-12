import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDoctorsComponent } from './dashboard-doctors.component';

describe('DashboardDoctorsComponent', () => {
  let component: DashboardDoctorsComponent;
  let fixture: ComponentFixture<DashboardDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
