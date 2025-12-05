import {Component, OnInit, EventEmitter, Output, Injectable, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { Transaction } from '../../../shared/models/transaction';
import { AlertComponent } from '../../../shared/alert/alert'; // Import the new component

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent], // Add AlertComponent to imports
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss']
})

@Injectable({
  providedIn: 'root'
})
export class TransactionFormComponent implements OnInit {
  @Output() transactionAdded = new EventEmitter<Transaction>();
  @Output() closeForm = new EventEmitter<void>();
  @Input() prefilledCategory: string | null = null;
  @Input() prefilledType: 'EXPENSE' | 'INCOME' | 'SAVINGS' | null = null;

  categories: string[] = [];
  isNewCategory: boolean  = false;

  transaction: Partial<Transaction> = {
    amount: undefined,
    type: 'EXPENSE',
    category: '',
    description: '',
    date: new Date()
  };
  transactionTypes = ['EXPENSE', 'INCOME', 'SAVINGS'];

  // Add properties for the alert
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.transactionService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.prefilledCategory) {
          this.transaction.category = this.prefilledCategory;
        }
        if (this.prefilledType) {
          this.transaction.type = this.prefilledType;
        }
      }
    });
  }

  // Helper to show the alert
  private triggerAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'new') {
      this.isNewCategory = true;
      this.transaction.category = '';
    } else {
      this.isNewCategory = false;
    }
  }

  onSubmit(): void {
    if (!this.transaction.date || !this.transaction.type || !this.transaction.amount || !this.transaction.category?.trim()) {
      this.triggerAlert('Please fill in all required fields.', 'error');
      return;
    }

    const userId = this.authService.getUserId();
    if (userId) {
      this.transactionService.addTransaction(userId, this.transaction as Transaction).subscribe({
        next: (response) => {
          this.triggerAlert('Transaction added successfully!', 'success');
          setTimeout(() => {
            this.transactionAdded.emit(response);
            this.closeForm.emit();
          }, 1500); // Give user time to see the success message
        },
        error: (err) => {
          this.triggerAlert('Failed to add transaction. Please try again.', 'error');
        }
      });
    }
  }
}
