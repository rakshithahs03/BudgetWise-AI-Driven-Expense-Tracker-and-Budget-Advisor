import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Adjust the import path as needed

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss'
})
export class NavBarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

// NOTE: For standalone components, you need to import the directives and pipes
// that are used in the template. These are:
// - RouterLink (for the routerLink directive)
// - RouterLinkActive (for the routerLinkActive directive)
// - NgIf (for the *ngIf structural directive)
// If you are using a module-based approach, you would not need these imports.
