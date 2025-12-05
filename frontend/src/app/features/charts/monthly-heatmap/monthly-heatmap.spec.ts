import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyHeatmap } from './monthly-heatmap';

describe('MonthlyHeatmap', () => {
  let component: MonthlyHeatmap;
  let fixture: ComponentFixture<MonthlyHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyHeatmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyHeatmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
