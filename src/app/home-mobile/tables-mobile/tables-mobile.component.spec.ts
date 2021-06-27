import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesMobileComponent } from './tables-mobile.component';

describe('TablesMobileComponent', () => {
  let component: TablesMobileComponent;
  let fixture: ComponentFixture<TablesMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablesMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
