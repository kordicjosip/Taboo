import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogadajiComponent } from './dogadaji.component';

describe('DogadajiComponent', () => {
  let component: DogadajiComponent;
  let fixture: ComponentFixture<DogadajiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogadajiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogadajiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
