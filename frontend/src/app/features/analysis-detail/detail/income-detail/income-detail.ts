import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AnalysisService, IncomeSummary, CategorySpending } from '../../../../core/services/analysis.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PieChartComponent } from '../../../charts/pie-chart/pie-chart';
import { BarChartComponent } from '../../../charts/bar-chart/bar-chart';

@Component({
  selector: 'app-income-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    PieChartComponent,
    BarChartComponent,
  ],
  templateUrl: './income-detail.html',
  styleUrls:['income-detail.scss']
})
export class IncomeDetailComponent implements OnChanges {
  @Input() selectedMonth!: string;

  selectedChartType: 'pie' | 'bar' = 'pie';
  incomeSummary: IncomeSummary | null = null;
  incomeByCategory: CategorySpending[] = [];
  selectedIncomeCategorySummary: IncomeSummary | null = null;

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] && this.selectedMonth) {
      this.fetchIncomeData();
    }
  }

  selectChartType(type: 'pie' | 'bar'): void {
    this.selectedChartType = type;
  }

  fetchIncomeData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const [year, month] = this.selectedMonth.split('-').map(Number);

    this.analysisService.getIncomeSummary(userId, year, month).subscribe(data => this.incomeSummary = data);
    this.analysisService.getIncomeByCategory(userId, year, month).subscribe(data => this.incomeByCategory = data);
  }

  onCategorySelected(category: string): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const [year, month] = this.selectedMonth.split('-').map(Number);

    this.analysisService.getIncomeSummaryForCategory(userId, category, year, month).subscribe(summary => {
      this.selectedIncomeCategorySummary = summary;
    });
  }
}
