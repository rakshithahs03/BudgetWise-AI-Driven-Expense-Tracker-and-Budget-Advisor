import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, PercentPipe } from '@angular/common';
import { SavingGoal } from '../../../shared/models/savingGoal';

@Component({
  selector: 'app-savings-overview',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './savings-overview.html',
  styleUrls: ['./savings-overview.scss']
})
export class SavingsOverviewComponent {
  @Input() goals: SavingGoal[] = [];
}
