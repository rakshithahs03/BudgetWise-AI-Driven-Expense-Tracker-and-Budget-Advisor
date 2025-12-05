import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService, ExpenseSummary, CategorySpending } from '../../../../core/services/analysis.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PieChartComponent } from '../../../charts/pie-chart/pie-chart';
import { BarChartComponent } from '../../../charts/bar-chart/bar-chart';
import { TopCategoriesComponent } from '../../../charts/top-categories/top-categories';
import { LineChartComponent } from '../../../charts/line-chart/line-chart';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    PieChartComponent,
    BarChartComponent,
    TopCategoriesComponent,
    LineChartComponent
  ],
  templateUrl: './expense-detail.html',
  styleUrls: ['./expense-detail.scss']
})
export class ExpenseDetailComponent implements OnChanges {
  @Input() selectedMonth!: string;

  // Properties for top charts
  selectedChartType: 'pie' | 'bar' = 'pie';
  expenseSummary: ExpenseSummary | null = null;
  expenseByCategory: CategorySpending[] = [];
  selectedExpenseCategorySummary: ExpenseSummary | null = null;

  // Properties for the daily trend line chart
  allCategories: string[] = [];
  selectedCategories: { [key: string]: boolean } = {};
  monthlyTrendData: any = {};

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] && this.selectedMonth) {
      this.fetchInitialData();
    }
  }

  fetchInitialData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const [year, month] = this.selectedMonth.split('-').map(Number);

    // Fetch summary and top categories for the selected month
    this.analysisService.getExpenseSummary(userId, year, month).subscribe(data => this.expenseSummary = data);
    this.analysisService.getExpenseByCategory(userId, year, month).subscribe(expenseCategories => {
      this.expenseByCategory = expenseCategories;
      this.allCategories = expenseCategories.map(c => c.category);

      // Reset and pre-select top 3 categories for the new month
      this.selectedCategories = {};
      this.allCategories.slice(0, 3).forEach(cat => {
        this.selectedCategories[cat] = true;
      });

      // Fetch the data for the line chart with the new month and categories
      this.updateMonthlyTrendChart();
    });
  }

  updateMonthlyTrendChart(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const [year, month] = this.selectedMonth.split('-').map(Number);
    const activeCategories = Object.keys(this.selectedCategories).filter(cat => this.selectedCategories[cat]);

    if (activeCategories.length > 0) {
      this.analysisService.getDailyExpenseTrend(userId, year, month, activeCategories).subscribe(data => {
        this.monthlyTrendData = data;
      });
    } else {
      this.monthlyTrendData = { labels: [], datasets: [] };
    }
  }

  toggleCategory(category: string): void {
    this.selectedCategories[category] = !this.selectedCategories[category];
    this.updateMonthlyTrendChart();
  }

  selectChartType(type: 'pie' | 'bar'): void {
    this.selectedChartType = type;
  }

  onCategorySelected(category: string): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    const [year, month] = this.selectedMonth.split('-').map(Number);
    this.analysisService.getExpenseSummaryForCategory(userId, category, year, month).subscribe(summary => {
      this.selectedExpenseCategorySummary = summary;
    });
  }
}
