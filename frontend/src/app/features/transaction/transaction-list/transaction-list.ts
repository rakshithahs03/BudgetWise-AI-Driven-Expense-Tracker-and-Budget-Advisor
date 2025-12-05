import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from '../../../shared/alert/alert'; // Import the AlertComponent

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent], // Add AlertComponent to imports
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionListComponent implements OnInit {
  @Input() transactions: Transaction[] = [];
  @Output() transactionUpdated = new EventEmitter<void>();
  @Output() transactionDeleted = new EventEmitter<void>();

  editingTransaction: Transaction | null = null;
  editData: Partial<Transaction> = {};
  username: string | null = '';

  // Properties for the custom alert
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername() || 'User';
  }

  // Helper method to trigger the alert
  private triggerAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }

  handleEdit(transaction: Transaction): void {
    this.editingTransaction = transaction;
    this.editData = { ...transaction };
  }

  handleSave(): void {
    // --- Validation Logic ---
    if (!this.editData.date || !this.editData.type || !this.editData.category?.trim() || this.editData.amount === null || this.editData.amount === undefined) {
      this.triggerAlert('Date, type, category, and amount are required fields.', 'error');
      return;
    }
    if (this.editData.amount <= 0) {
      this.triggerAlert('Amount must be greater than zero.', 'error');
      return;
    }
    // --- End of Validation ---

    if (this.editingTransaction && this.editData.id) {
      this.transactionService.editTransaction(this.editData.id, this.editData as Transaction).subscribe({
        next: () => {
          this.triggerAlert('Transaction updated successfully!', 'success');
          setTimeout(() => {
            this.showAlert = false;
            this.transactionUpdated.emit();
            this.editingTransaction = null;
            this.editData = {};
          }, 1500);
        },
        error: (err) => {
          console.error("Error updating transaction:", err);
          this.triggerAlert("Failed to update transaction.", 'error');
        }
      });
    }
  }

  handleCancel(): void {
    this.editingTransaction = null;
    this.editData = {};
  }

  handleDelete(id: number): void {
    // This can also be updated to use the custom alert if you wish
    if (window.confirm("Delete this transaction?")) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.transactionDeleted.emit();
        },
        error: (err) => {
          console.error("Error deleting transaction:", err);
          this.triggerAlert("Failed to delete transaction.", 'error');
        }
      });
    }
  }
}
