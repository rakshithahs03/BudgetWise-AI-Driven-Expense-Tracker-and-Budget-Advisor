import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { NavBarComponent } from './shared/nav-bar/nav-bar';
import { AuthService } from './core/services/auth.service';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb';
import { ChatbotComponent } from './features/chatbot/chatbot';
import { FooterComponent } from './shared/footer/footer'; // ✅ 1. Import FooterComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavBarComponent,
    BreadcrumbComponent,
    ChatbotComponent,
    FooterComponent // ✅ 2. Add it to imports
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(private authService: AuthService) {
    Chart.register(...registerables);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
