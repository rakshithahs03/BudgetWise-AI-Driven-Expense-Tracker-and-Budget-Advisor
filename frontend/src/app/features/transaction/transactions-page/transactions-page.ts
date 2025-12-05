import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Transaction } from '../../../shared/models/transaction';
import { TransactionService } from '../../../core/services/transaction.service';
import { AuthService } from '../../../core/services/auth.service';
import { TransactionListComponent } from '../transaction-list/transaction-list';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';

import * as XLSX from 'xlsx'; // ✅ Import for Excel
import autoTable from 'jspdf-autotable'; // ✅ Import for saving file
import * as FileSaver from 'file-saver';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TransactionListComponent],
  templateUrl: './transactions-page.html',
  styleUrls: ['./transactions-page.scss']
})
export class TransactionsPageComponent implements OnInit {
  transactions: Transaction[] = [];
  months: { name: string, value: string }[] = [];
  categories: string[] = [];
  filters = {
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    selectedMonth: ''
  };

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Transactions', url: '' }
      ]);
    });
    this.generateMonthList();
    this.applyFilters();
    this.fetchCategories();
  }

  // ✅ NEW METHOD to handle file import
  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      alert('Cannot use multiple files');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = <any[]>(XLSX.utils.sheet_to_json(ws));

      // Map Excel data to Transaction objects
      const importedTransactions: Transaction[] = data.map(row => {
        // Basic validation and transformation
        const type = (row.Type || '').toUpperCase();
        return {
          id: 0,
          date: new Date(row.Date),
          type: type === 'INCOME' ? 'INCOME' : 'EXPENSE',
          category: row.Category || 'Uncategorized',
          amount: parseFloat(row.Amount) || 0,
          description: row.Description || ''
        };
      });

      const userId = this.authService.getUserId();
      if (userId) {
        this.transactionService.importTransactions(userId, importedTransactions).subscribe({
          next: () => {
            alert('Transactions imported successfully!');
            this.applyFilters(); // Refresh the list
          },
          error: (err) => {
            console.error('Error importing transactions:', err);
            alert('Failed to import transactions.');
          }
        });
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  fetchCategories(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.transactionService.getCategories().subscribe(data => {
        this.categories = data;
      });
    }
  }

  generateMonthList() {
    const date = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(date.getFullYear(), date.getMonth() - i, 1);
      this.months.push({
        name: month.toLocaleString('default', { month: 'long', year: 'numeric' }),
        value: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
      });
    }
  }

  onMonthChange() {
    if (this.filters.selectedMonth) {
      const [year, month] = this.filters.selectedMonth.split('-');
      this.filters.startDate = `${year}-${month}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      this.filters.endDate = `${year}-${month}-${lastDay}`;
    } else {
      this.filters.startDate = '';
      this.filters.endDate = '';
    }
  }

  applyFilters() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.transactionService.getFilteredTransactions(userId, this.filters).subscribe(data => {
        this.transactions = data;
      });
    }
  }

  clearFilters() {
    this.filters = { type: '', category: '', startDate: '', endDate: '', selectedMonth: '' };
    this.applyFilters();
  }

  refreshData() {
    this.applyFilters();
  }

  exportToExcel(): void {
    if (this.transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    // Map transactions to a flatter structure for Excel, removing unnecessary fields
    const dataForExport = this.transactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Description: t.description
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExport); //
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'BudgetWise_Transactions_Excel');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx'); //
  }

  exportToPdf(): void {
    if (this.transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const doc = new jsPDF();

    const head = [['Date', 'Type', 'Category', 'Amount (INR)', 'Description']];
    const body = this.transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      (t.type === 'EXPENSE' ? '- ' : '+ ') + t.amount.toFixed(2),
      t.description || ''
    ]);

    autoTable(doc, {
      head: head,
      body: body,
      startY: 10,
      headStyles: { fillColor: [0, 123, 255] },
      margin: { top: 15 }
    });

    doc.save('BudgetWise_Transactions_PDF.pdf');
  }

}
