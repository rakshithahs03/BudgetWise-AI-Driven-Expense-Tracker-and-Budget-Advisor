import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {AuthService} from '../core/services/auth.service';
import {BreadcrumbService} from '../core/services/breadcrumb.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit{

  constructor(
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService
  ) {
  }

  ngOnInit(): void {
    this.setupBreadcrumbs();
  }

  loggedIn() {
    return this.authService.isLoggedIn();
  }

  private setupBreadcrumbs(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Home', url: '' },
      ]);
    });
  }
}
