import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SavingGoal } from '../../shared/models/savingGoal';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SavingGoalService {
  private apiUrl = 'http://localhost:5000/api/saving-goals';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getGoals(userId: number): Observable<SavingGoal[]> {
    return this.http.get<SavingGoal[]>(`${this.apiUrl}/user/${userId}`);
  }

  createGoal(userId: number, savingGoal: SavingGoal): Observable<SavingGoal> {
    return this.http.post<SavingGoal>(`${this.apiUrl}/${userId}`, savingGoal);
  }

  updateGoal(goalId: number, savingGoal: SavingGoal): Observable<SavingGoal> {
    return this.http.put<SavingGoal>(`${this.apiUrl}/${goalId}`, savingGoal);
  }

  deleteGoal(goalId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${goalId}`);
  }
}
