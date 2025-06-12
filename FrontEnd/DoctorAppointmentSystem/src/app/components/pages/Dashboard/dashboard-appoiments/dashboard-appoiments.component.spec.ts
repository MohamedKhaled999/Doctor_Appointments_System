import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAppoimentsComponent } from './dashboard-appoiments.component';

describe('DashboardAppoimentsComponent', () => {
  let component: DashboardAppoimentsComponent;
  let fixture: ComponentFixture<DashboardAppoimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAppoimentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAppoimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
