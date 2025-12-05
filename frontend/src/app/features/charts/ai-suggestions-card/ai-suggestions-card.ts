import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-suggestions-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-suggestions-card.html',
  styleUrls: ['./ai-suggestions-card.scss']
})
export class AiSuggestionsCardComponent {
  @Input() suggestions: string[] = [];
  @Input() loading: boolean = false;
}
