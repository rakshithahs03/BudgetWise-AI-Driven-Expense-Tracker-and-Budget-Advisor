import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CategorySpending } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-top-categories',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './top-categories.html',
  styleUrls: ['./top-categories.scss']
})
export class TopCategoriesComponent {
  @Input() categories: CategorySpending[] = [];
}
