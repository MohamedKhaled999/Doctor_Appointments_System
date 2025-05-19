import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedToConfirmComponent } from './need-to-confirm.component';

describe('NeedToConfirmComponent', () => {
  let component: NeedToConfirmComponent;
  let fixture: ComponentFixture<NeedToConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedToConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedToConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
