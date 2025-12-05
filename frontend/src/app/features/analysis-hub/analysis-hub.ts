import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalysisService, CategorySpending } from '../../core/services/analysis.service';
import { AuthService } from '../../core/services/auth.service';
import { LineChartComponent } from '../charts/line-chart/line-chart';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { TopCategoriesComponent } from '../charts/top-categories/top-categories';
import { SavingsOverviewComponent } from '../charts/savings-overview/savings-overview';
import { SavingGoal } from '../../shared/models/savingGoal';
import { SavingGoalService } from '../../core/services/saving-goal.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MonthlyHeatmapComponent } from '../charts/monthly-heatmap/monthly-heatmap';
import { BarChartComponent } from '../charts/bar-chart/bar-chart';
import { AiSuggestionsCardComponent } from '../charts/ai-suggestions-card/ai-suggestions-card';
import { AiService } from '../../core/services/ai.service';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analysis-hub',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LineChartComponent,
    TopCategoriesComponent,
    SavingsOverviewComponent,
    NgApexchartsModule,
    MonthlyHeatmapComponent,
    BarChartComponent,
    AiSuggestionsCardComponent,
    FormsModule
  ],
  templateUrl: './analysis-hub.html',
  styleUrls: ['./analysis-hub.scss']
})
export class AnalysisHubComponent implements OnInit {
  trendData: any = {};
  topExpenseCategories: CategorySpending[] = [];
  savingsGoals: SavingGoal[] = [];
  savingsByCategory: CategorySpending[] = [];
  heatMapData: any[] = [];
  monthlySummaryPieData: CategorySpending[] = [];
  aiSuggestions: string[] = [];
  aiSuggestionsLoading = false;

  currentYear: number;
  currentMonth: number;
  selectedMonth: string;

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private savingGoalService: SavingGoalService,
    private aiService: AiService
  ) {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
    this.selectedMonth = today.toISOString().substring(0, 7);
  }

  ngOnInit(): void {
    this.initializePage();
  }

  private initializePage(): void {
    this.setupBreadcrumbs();
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error("User ID not found. Cannot load analysis data.");
      return;
    }

    this.loadTrendData(userId);
    this.loadCategoryData(userId);
    this.loadSavingsGoals(userId);
    this.loadHeatMapData(userId);
    this.loadAiSuggestions(userId);
  }

  onMonthChange(): void {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    this.currentYear = year;
    this.currentMonth = month;
    const userId = this.authService.getUserId();
    if (userId) {
      this.loadHeatMapData(userId);
      this.loadCategoryData(userId);
    }
  }

  private setupBreadcrumbs(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Analysis', url: '' },
      ]);
    });
  }

  private loadTrendData(userId: number): void {
    this.analysisService.getIncomeVsExpenseTrend(userId).subscribe(apiData => {
      if (apiData) {
        this.trendData = {
          labels: apiData.labels,
          datasets: [
            {
              label: 'Income',
              data: apiData.incomeData,
            },
            {
              label: 'Expense',
              data: apiData.expenseData,
            }
          ]
        };
      }
    });
  }

  private loadCategoryData(userId: number): void {
    this.analysisService.getTopExpenseCategories(userId).subscribe(data => {
      this.topExpenseCategories = data;
    });
    this.analysisService.getSavingsByCategory(userId, this.currentYear, this.currentMonth).subscribe(data => {
      this.savingsByCategory = data;
    });
  }

  private loadSavingsGoals(userId: number): void {
    this.savingGoalService.getGoals(userId).subscribe(data => {
      this.savingsGoals = data;
    });
  }

  private loadHeatMapData(userId: number): void {
    this.analysisService.getExpenseHeatMapData(userId, this.currentYear, this.currentMonth)
      .subscribe(data => {
        this.heatMapData = Object.entries(data).map(([date, value]) => ({ date, value: value as number }));
      });
  }

  private loadAiSuggestions(userId: number): void {
    this.aiSuggestionsLoading = true;
    this.aiService.getSuggestions(userId)
      .pipe(
        finalize(() => this.aiSuggestionsLoading = false)
      )
      .subscribe(data => {
        this.aiSuggestions = data;
      });
  }
}
