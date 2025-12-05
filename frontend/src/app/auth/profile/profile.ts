import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Add CommonModule
import { ProfileService } from '../../core/services/profile.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Profile} from '../../shared/models/profile';
import {AuthService} from '../../core/services/auth.service';
import {UserProfile} from '../../shared/models/userProfile';

@Component({
  selector: 'app-profile',
  standalone: true, // ✅ Make it a standalone component
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {

  profile: Profile = {
    income: 0,
    savings: 0,
    targetExpenses: 0,
  };

  constructor(private profileService: ProfileService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
  }

  onCreateProfile(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.profileService.createProfile(this.profile).subscribe({
        next: () => {
          console.log('Profile created or updated successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error creating profile:', err);
          console.log('Failed to create profile. Please try again.');
        }
      });
    } else {
      console.error('User ID not found, cannot create profile.');
    }
  }
}
