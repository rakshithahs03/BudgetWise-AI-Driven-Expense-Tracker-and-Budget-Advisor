import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AnalysisService, SavingsSummary } from '../../../../core/services/analysis.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SavingGoal } from '../../../../shared/models/savingGoal';
import { SavingGoalService } from '../../../../core/services/saving-goal.service';
import { SavingGoalsComponent } from '../../../saving-goals/saving-goals';

@Component({
  selector: 'app-savings-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    SavingGoalsComponent
  ],
  templateUrl: './savings-detail.html',
  styleUrls: ['savings-detail.scss'],
})
export class SavingsDetailComponent implements OnChanges {
  @Input() selectedMonth!: string;

  savingsSummary: SavingsSummary | null = null;
  savingGoals: SavingGoal[] = [];

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService,
    private savingGoalService: SavingGoalService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] && this.selectedMonth) {
      this.fetchSavingsData();
    }
  }

  fetchSavingsData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const [year, month] = this.selectedMonth.split('-').map(Number);

    this.analysisService.getSavingsSummary(userId, year, month).subscribe(data => this.savingsSummary = data);

    // Saving goals are not dependent on the selected month, so this call is correct as-is.
    this.savingGoalService.getGoals(userId).subscribe(goals => {
      this.savingGoals = goals.sort((a, b) => (a.savedAmount / a.targetAmount) - (b.savedAmount / b.targetAmount));
    });
  }
}
