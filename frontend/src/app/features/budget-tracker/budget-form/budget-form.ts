import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BudgetService} from '../../../core/services/budget.service';
import {AuthService} from '../../../core/services/auth.service';
import {Budget} from '../../../shared/models/budget';
import {TransactionService} from '../../../core/services/transaction.service';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './budget-form.html',
  styleUrls: ['./budget-form.scss']
})
export class BudgetFormComponent implements OnInit {
  @Output() budgetAdded = new EventEmitter<Budget>();
  @Output() closeForm = new EventEmitter<void>();

  budget: Partial<Budget> = {
    category: '',
    limitAmount: 0,
    startDate: new Date(),
    endDate: new Date()
  };

  categories: string[] = [];
  isNewCategory: boolean = false;
  errorMessage: string = '';

  constructor(
    private budgetService: BudgetService,
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.transactionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'new') {
      this.isNewCategory = true;
      this.budget.category = '';
    } else {
      this.isNewCategory = false;
    }
  }

  onSubmit(): void {
    // Validate form data
    if (!this.validateBudgetData()) {
      return;
    }

    const userId = this.authService.getUserId();
    if (userId) {
      this.budgetService.createBudget(userId, this.budget as Budget).subscribe({
        next: (newBudget) => {
          this.errorMessage = '';
          alert('Budget added successfully!');
          this.budgetAdded.emit(newBudget);
          this.closeForm.emit();
        },
        error: (err) => {
          console.error('Error adding budget:', err);
          this.errorMessage = 'Failed to add budget. Please try again.';
        }
      });
    }
  }

  private validateBudgetData(): boolean {
    this.errorMessage = '';

    if (!this.budget.category?.trim()) {
      this.errorMessage = 'Category is required';
      return false;
    }
    if (!this.budget.limitAmount || this.budget.limitAmount <= 0) {
      this.errorMessage = 'Limit amount must be greater than 0';
      return false;
    }
    if (!this.budget.startDate) {
      this.errorMessage = 'Start date is required';
      return false;
    }
    if (!this.budget.endDate) {
      this.errorMessage = 'End date is required';
      return false;
    }
    if (new Date(this.budget.endDate) < new Date(this.budget.startDate)) {
      this.errorMessage = 'End date must be after start date';
      return false;
    }
    return true;
  }
}
