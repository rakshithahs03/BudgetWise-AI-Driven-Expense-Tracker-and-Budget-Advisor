import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SavingGoalService} from '../../../core/services/saving-goal.service';
import {AuthService} from '../../../core/services/auth.service';
import {SavingGoal} from '../../../shared/models/savingGoal';
import {TransactionService} from '../../../core/services/transaction.service';

@Component({
  selector: 'app-saving-goal-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './saving-goal-form.html',
  styleUrls: ['./saving-goal-form.scss']
})
export class SavingGoalFormComponent implements OnInit {
  @Output() goalAdded = new EventEmitter<SavingGoal>();
  @Output() closeForm = new EventEmitter<void>();

  goal: Partial<SavingGoal> = {
    category: '',
    targetAmount: 0,
    savedAmount: 0,
    deadline: new Date()
  };

  categories: string[] = [];
  isNewCategory: boolean = false;
  errorMessage: string = '';

  constructor(
    private savingGoalService: SavingGoalService,
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
      this.goal.category = '';
    } else {
      this.isNewCategory = false;
    }
  }

  onSubmit(): void {
    if (!this.validateGoalData()) {
      return; // Stop submission if validation fails
    }

    const userId = this.authService.getUserId();
    if (userId) {
      this.savingGoalService.createGoal(userId, this.goal as SavingGoal).subscribe({
        next: (newGoal) => {
          this.errorMessage = '';
          alert('Saving goal added successfully!');
          this.goalAdded.emit(newGoal);
          this.closeForm.emit();
        },
        error: (err) => {
          console.error('Error adding saving goal:', err);
          this.errorMessage = 'Failed to add saving goal. Please try again.';
        }
      });
    }
  }

  private validateGoalData(): boolean {
    this.errorMessage = '';

    if (!this.goal.category?.trim()) {
      this.errorMessage = 'Category is required';
      return false;
    }
    if (!this.goal.targetAmount || this.goal.targetAmount <= 0) {
      this.errorMessage = 'Target amount must be greater than 0';
      return false;
    }
    if (this.goal.savedAmount === null || this.goal.savedAmount === undefined || this.goal.savedAmount < 0) {
      this.errorMessage = 'Saved amount must be 0 or greater';
      return false;
    }
    if (!this.goal.deadline) {
      this.errorMessage = 'Deadline is required';
      return false;
    }
    if (new Date(this.goal.deadline) < new Date()) {
      this.errorMessage = 'Deadline must be in the future';
      return false;
    }
    return true;
  }
}
