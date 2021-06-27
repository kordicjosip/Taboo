import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogadajiMobileComponent } from './dogadaji-mobile.component';

describe('DogadajiMobileComponent', () => {
  let component: DogadajiMobileComponent;
  let fixture: ComponentFixture<DogadajiMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogadajiMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogadajiMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
