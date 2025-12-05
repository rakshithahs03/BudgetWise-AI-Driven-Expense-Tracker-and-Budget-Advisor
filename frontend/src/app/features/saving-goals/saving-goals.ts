import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe, DatePipe } from '@angular/common';
import { SavingGoal } from '../../shared/models/savingGoal';
import { SavingGoalService } from '../../core/services/saving-goal.service';
import { AuthService } from '../../core/services/auth.service';
import { SavingGoalFormComponent } from './saving-goal-form/saving-goal-form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-saving-goals',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PercentPipe, DatePipe, SavingGoalFormComponent, FormsModule],
  templateUrl: './saving-goals.html',
  styleUrl: './saving-goals.scss'
})
export class SavingGoalsComponent implements OnInit {
  @Output() goalUpdated = new EventEmitter<void>();
  @Output() goalDeleted = new EventEmitter<void>();
  @Output() addTransactionForCategory = new EventEmitter<{ category: string, type: 'SAVINGS' }>();

  @Input() goals: SavingGoal[] = [];
  @Input() showActions: boolean = true;


  savingGoals: SavingGoal[] = [];
  isGoalFormVisible = false;
  editingGoal: SavingGoal | null = null;
  editData: Partial<SavingGoal> = {};
  errorMessage: string = '';

  constructor(
    private savingGoalService: SavingGoalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

  onAddTransaction(category: string): void {
    this.addTransactionForCategory.emit({ category, type: 'SAVINGS' });
  }

  fetchGoals(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.savingGoalService.getGoals(userId).subscribe(goals => {
        this.savingGoals = goals;
      });
    }
  }

  onAddGoal(): void {
    this.isGoalFormVisible = true;
  }

  onGoalAdded(newGoal: SavingGoal): void {
    this.isGoalFormVisible = false;
    this.fetchGoals();
  }

  handleEdit(goal: SavingGoal): void {
    this.editingGoal = goal;
    this.editData = { ...goal };
  }

  handleSave(): void {
    if (this.editingGoal && this.editData.id) {
      if (!this.validateGoalData()) {
        return; // Stop submission if validation fails
      }
      this.savingGoalService.updateGoal(this.editData.id, this.editData as SavingGoal).subscribe({
        next: () => {
          this.fetchGoals();
          this.editingGoal = null;
          this.editData = {};
          this.errorMessage = '';
          this.goalUpdated.emit();
        },
        error: (err) => {
          console.error("Error updating saving goal:", err);
          this.errorMessage = 'Failed to update saving goal. Please try again.';
        }
      });
    }
  }

  handleCancel(): void {
    this.editingGoal = null;
    this.editData = {};
    this.errorMessage = '';
  }

  private validateGoalData(): boolean {
    this.errorMessage = '';

    if (!this.editData.category?.trim()) {
      this.errorMessage = 'Category is required';
      return false;
    }
    if (!this.editData.targetAmount || this.editData.targetAmount <= 0) {
      this.errorMessage = 'Target amount must be greater than 0';
      return false;
    }
    if (this.editData.savedAmount === null || this.editData.savedAmount === undefined || this.editData.savedAmount < 0) {
      this.errorMessage = 'Saved amount must be 0 or greater';
      return false;
    }
    if (!this.editData.deadline) {
      this.errorMessage = 'Deadline is required';
      return false;
    }
    if (new Date(this.editData.deadline) < new Date()) {
      this.errorMessage = 'Deadline must be in the future';
      return false;
    }
    return true;
  }

  handleDelete(id: number): void {
    if (window.confirm("Delete this saving goal?")) {
      this.savingGoalService.deleteGoal(id).subscribe({
        next: () => {
          this.fetchGoals();
          this.goalDeleted.emit();
        },
        error: (err) => console.error("Error deleting saving goal:", err)
      });
    }
  }
}
