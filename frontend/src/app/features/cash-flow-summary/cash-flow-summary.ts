import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AnalysisService, CashFlowSummary } from '../../core/services/analysis.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cash-flow-summary',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cash-flow-summary.html',
  styleUrls: ['./cash-flow-summary.scss']
})
export class CashFlowSummaryComponent implements OnInit {
  cashFlowSummary: CashFlowSummary | null = null;

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCashFlow();
  }

  fetchCashFlow(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.analysisService.getCashFlowSummary(userId).subscribe(summary => {
        this.cashFlowSummary = summary;
      });
    }
  }
}
