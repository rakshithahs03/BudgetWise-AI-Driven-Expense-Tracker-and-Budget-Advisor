import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { TransactionService } from '../../core/services/transaction.service';
import { UserProfile } from '../../shared/models/userProfile';
import { Transaction } from '../../shared/models/transaction';
import { TransactionFormComponent } from '../transaction/transaction-form/transaction-form';
import { TransactionListComponent } from '../transaction/transaction-list/transaction-list';
import { SavingGoalsComponent } from '../saving-goals/saving-goals';
import { BudgetTrackerComponent } from '../budget-tracker/budget-tracker';
import { CashFlowSummaryComponent } from '../cash-flow-summary/cash-flow-summary';
import { Details } from '../../shared/models/details';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TransactionFormComponent,
    TransactionListComponent,
    SavingGoalsComponent,
    BudgetTrackerComponent,
    CashFlowSummaryComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  // Get a reference to each child component
  @ViewChild('budgetTracker') budgetTracker!: BudgetTrackerComponent;
  @ViewChild('savingGoalsTracker') savingGoalsTracker!: SavingGoalsComponent;
  @ViewChild(CashFlowSummaryComponent) cashFlowSummary!: CashFlowSummaryComponent;

  userProfile: Details | null = null;
  loading = true;
  firstname: string | null = '';
  isFormVisible = false;
  transactions: Transaction[] = [];
  prefilledCategory: string | null = null;
  prefilledType: 'EXPENSE' | 'INCOME' | 'SAVINGS' | null = null;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private transactionService: TransactionService,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Dashboard', url: '' }
      ]);
    });
    const userId = this.authService.getUserId();
    if (userId) {
      this.refreshAllData(); // Use the main refresh function on initial load
    }
    this.firstname = this.authService.getFirstName();
  }

  // This function fetches the data for the top summary cards.
  fetchProfile(userId: number): void {
    this.profileService.getProfile(userId).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.loading = false;
      }
    });
  }

  // This function fetches the data for the transaction list.
  fetchDailyTransactions(userId: number): void {
    this.transactionService.getTransactions(userId).subscribe({
      next: (data) => {
        // ✅ Sort transactions by date (most recent first) and take the top 7
        this.transactions = data
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 7);
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  onAddTransaction(): void {
    this.isFormVisible = true;
    this.prefilledCategory = null;
    this.prefilledType = null;
  }

  onAddTransactionForCategory(data: { category: string, type: 'EXPENSE' | 'SAVINGS' }): void {
    this.isFormVisible = true;
    this.prefilledCategory = data.category;
    this.prefilledType = data.type; // ✅ Set type
  }

  // This is called when the transaction form emits an event.
  onTransactionAdded(newTransaction: Transaction): void {
    this.isFormVisible = false;
    this.refreshAllData();
  }

  /**
   * This is the master refresh function. It is the single source of truth
   * for updating all data on the dashboard.
   */
  refreshAllData(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      // 1. Refresh the top summary cards (Monthly Spend, Income, etc.)
      this.fetchProfile(userId);

      // 2. Refresh the cash flow summary component
      if (this.cashFlowSummary) {
        this.cashFlowSummary.fetchCashFlow();
      }

      // 3. Refresh the recent transactions list
      this.fetchDailyTransactions(userId);

      // 4. Tell the budget tracker to refresh itself
      if (this.budgetTracker) {
        this.budgetTracker.fetchBudgets();
      }

      // 5. Tell the savings goals tracker to refresh itself
      if (this.savingGoalsTracker) {
        this.savingGoalsTracker.fetchGoals();
      }
    }
  }
}
