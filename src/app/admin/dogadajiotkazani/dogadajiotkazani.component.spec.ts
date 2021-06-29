import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogadajiotkazaniComponent } from './dogadajiotkazani.component';

describe('DogadajiotkazaniComponent', () => {
  let component: DogadajiotkazaniComponent;
  let fixture: ComponentFixture<DogadajiotkazaniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DogadajiotkazaniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogadajiotkazaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
