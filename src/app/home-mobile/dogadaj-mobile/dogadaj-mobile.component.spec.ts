import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogadajMobileComponent } from './dogadaj-mobile.component';

describe('DogadajMobileComponent', () => {
  let component: DogadajMobileComponent;
  let fixture: ComponentFixture<DogadajMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogadajMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogadajMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
