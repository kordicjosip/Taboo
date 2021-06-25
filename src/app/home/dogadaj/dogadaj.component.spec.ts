import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogadajComponent } from './dogadaj.component';

describe('DogadajComponent', () => {
  let component: DogadajComponent;
  let fixture: ComponentFixture<DogadajComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogadajComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogadajComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
