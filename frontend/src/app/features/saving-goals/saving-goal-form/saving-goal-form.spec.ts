import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingGoalForm } from './saving-goal-form';

describe('SavingGoalForm', () => {
  let component: SavingGoalForm;
  let fixture: ComponentFixture<SavingGoalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingGoalForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingGoalForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
