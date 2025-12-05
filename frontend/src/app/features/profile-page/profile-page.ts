import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import {Details} from '../../shared/models/details';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import { AlertComponent } from '../../shared/alert/alert';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AlertComponent],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss']
})
export class ProfilePageComponent implements OnInit {
  details: Partial<Details> = {};
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Profile', url: '' }
      ]);
    });
  }

  private triggerAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }

  loadUserProfile(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.getProfile(userId).subscribe(profile => {
        this.details = profile;
      });
    }
  }

  updateUserDetails(): void {
    if (!this.details.firstName?.trim() || !this.details.lastName?.trim() || !this.details.username?.trim()) {
      this.triggerAlert('First name, last name, and username are required.', 'error');
      return;
    }

    const userId = this.authService.getUserId();
    if (userId && this.details) {
      this.profileService.updateUser(userId, this.details).subscribe(response => {
        this.authService.saveAuthData(response.token, response.userId, response.firstname);
        this.triggerAlert('User details updated successfully!', 'success');
      });
    }
  }

  updateProfileDetails(): void {
    if (this.details.income === null || this.details.savings === null || this.details.targetExpenses === null) {
      this.triggerAlert('Income, savings, and target expenses are required.', 'error');
      return;
    }
    const userId = this.authService.getUserId();
    if (userId && this.details) {
      this.profileService.updateProfile(userId, this.details).subscribe(() => {
        this.triggerAlert('Profile details updated successfully!', 'success');
      });
    }
  }

  changePassword(): void {
    if (!this.currentPassword.trim() || !this.newPassword.trim() || !this.confirmPassword.trim()) {
      this.triggerAlert('All password fields are required.', 'error');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.triggerAlert("New passwords do not match.", 'error');
      return;
    }

    // Add regex validation for the new password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(this.newPassword)) {
      this.triggerAlert('Password must be at least 8 characters long and contain one uppercase letter and one special character.', 'error');
      return;
    }

    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.changePassword(userId, this.currentPassword, this.newPassword).subscribe({
        next: () => {
          this.triggerAlert('Password changed successfully!', 'success');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (err) => {
          this.triggerAlert('Error changing password: ' + (err.error?.message || 'Please try again'), 'error');
        }
      });
    }
  }
}
