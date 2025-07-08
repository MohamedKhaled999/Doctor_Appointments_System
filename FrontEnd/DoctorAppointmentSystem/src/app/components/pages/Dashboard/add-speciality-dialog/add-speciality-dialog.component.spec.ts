import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecialityDialogComponent } from './add-speciality-dialog.component';

describe('AddSpecialityDialogComponent', () => {
  let component: AddSpecialityDialogComponent;
  let fixture: ComponentFixture<AddSpecialityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpecialityDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSpecialityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
