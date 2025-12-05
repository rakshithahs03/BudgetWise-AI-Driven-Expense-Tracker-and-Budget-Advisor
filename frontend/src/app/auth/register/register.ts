import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {User} from '../../shared/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  username = '';
  password = '';
  confirmPassword = ''; // ✅ Add confirmPassword property
  role = 'USER';
  error = ''; // ✅ Add error property

  constructor(private authService: AuthService, private router: Router) {}

  private validateUserData(): boolean {
    if (!this.firstName?.trim()) {
      this.error = 'First name is required';
      return false;
    }
    if (!this.lastName?.trim()) {
      this.error = 'Last name is required';
      return false;
    }
    if (!this.username?.trim()) {
      this.error = 'Username is required';
      return false;
    }
    if (!this.password?.trim()) {
      this.error = 'Password is required';
      return false;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(this.password)) {
      this.error = 'Password must contain at least 8 characters including 1 uppercase letter and 1 special character';
      return false;
    }
    return true;
  }

  onSubmit(): void {
    this.error = ''; // Reset error message on new submission

    if (!this.validateUserData()) {
      return;
    }

    // ✅ Add validation check
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return; // Stop the submission if passwords don't match
    }

    const userData: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      role: this.role
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.authService.saveAuthData(res.token, res.userId, res.firstname);
        this.router.navigate(['/auth/profile']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.error = err.error;
      }
    });
  }
}
