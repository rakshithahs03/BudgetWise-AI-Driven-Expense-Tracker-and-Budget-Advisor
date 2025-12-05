import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Profile} from '../../shared/models/profile';
import {AuthService} from './auth.service';
import {UserProfile} from '../../shared/models/userProfile';
import {Details} from '../../shared/models/details';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:5000/api/profile';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ✅ THIS METHOD WAS MISSING, ADD IT NOW
  createProfile(profileData: Profile): Observable<any> {
    const userId = this.authService.getUserId();
    // Assuming a backend endpoint like POST /profiles/{userId}
    return this.http.post<any>(`${this.apiUrl}/${userId}`, profileData);
  }

  // ✅ This method is for getting the profile details
  getProfile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/username`);
  }

  getUser(id: number): Observable<Partial<Details>> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }

  // ✅ Add this method to update user details
  updateUser(userId: number, userData: Partial<UserProfile>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/${userId}`, userData);
  }

  // ✅ Add this method to update financial profile details
  updateProfile(userId: number, profileData: Partial<Details>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}`, profileData);
  }

  // ✅ Add this method to change the password
  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<void> {
    const payload = { currentPassword, newPassword };
    return this.http.post<void>(`${this.apiUrl}/change-password/${userId}`, payload);
  }

}



