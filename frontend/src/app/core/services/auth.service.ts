import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../../shared/models/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      // Check if the token has an expiration date and if it's in the future
      const isExpired = decoded.exp ? (decoded.exp * 1000 < Date.now()) : true;
      return !isExpired;
    } catch (error) {
      // If decoding fails, the token is invalid
      return false;
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  saveAuthData(token: string, userId: number, firstname: any): void {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('firstname', firstname);
  }
  getFirstName(){
    return localStorage.getItem("firstname");
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('firstname');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  getUsername(): string {
    const userId = this.getUserId();
    return this.http.get(`${this.apiUrl}/${userId}/username`).toString();
  }
}
