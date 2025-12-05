import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:5000/api/ai';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSuggestions(userId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggest/${userId}`);
  }
}
