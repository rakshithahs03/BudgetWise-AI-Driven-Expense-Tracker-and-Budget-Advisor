import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./login.scss']
})

export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Username and password are required.';
      return;
    }

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.saveAuthData(res.token, res.userId, res.firstname);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.error = 'Invalid credentials';
        }
      });
  }
}
