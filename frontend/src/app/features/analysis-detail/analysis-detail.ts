import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { TransactionFormComponent } from '../transaction/transaction-form/transaction-form';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { IncomeDetailComponent } from './detail/income-detail/income-detail';
import { SavingsDetailComponent } from './detail/savings-detail/savings-detail';
import { ExpenseDetailComponent } from './detail/expense-detail/expense-detail';

@Component({
  selector: 'app-analysis-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule
    TransactionFormComponent,
    IncomeDetailComponent,
    SavingsDetailComponent,
    ExpenseDetailComponent,
    RouterLink
  ],
  templateUrl: './analysis-detail.html',
  styleUrls: ['./analysis-detail.scss']
})
export class AnalysisPageComponent implements OnInit {
  activeTab: 'expenses' | 'income' | 'savings' = 'expenses';
  selectedMonth: string;
  isTransactionFormVisible = false;

  constructor(
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    const today = new Date();
    this.selectedMonth = today.toISOString().substring(0, 7); // Format: "YYYY-MM"
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type === 'income' || type === 'savings' || type === 'expenses') {
        this.selectTab(type);
      } else {
        this.selectTab('expenses');
      }
    });
  }

  onMonthChange(): void {
    // The child components will automatically detect this change
  }

  onTransactionAdded(): void {
    this.isTransactionFormVisible = false;
    // We need to re-trigger the change detection for the children
    this.selectedMonth = this.selectedMonth;
  }

  onAddTransaction(): void {
    this.isTransactionFormVisible = true;
  }

  selectTab(tab: 'expenses' | 'income' | 'savings'): void {
    this.activeTab = tab;
    const capitalizedType = tab.charAt(0).toUpperCase() + tab.slice(1);

    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Analysis', url: '/analysis' },
        { label: capitalizedType, url: '' }
      ]);
    });
  }
}
