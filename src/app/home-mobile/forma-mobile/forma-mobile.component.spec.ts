import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaMobileComponent } from './forma-mobile.component';

describe('FormaMobileComponent', () => {
  let component: FormaMobileComponent;
  let fixture: ComponentFixture<FormaMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormaMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
