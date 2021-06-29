import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtkazaniComponent } from './otkazani.component';

describe('OtkazaniComponent', () => {
  let component: OtkazaniComponent;
  let fixture: ComponentFixture<OtkazaniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtkazaniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtkazaniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
