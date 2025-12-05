import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from '../../shared/models/budget';
import { AuthService } from './auth.service';
//import {BudgetDTO} from "../../shared/models/budgetDTO";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private apiUrl = 'http://localhost:5000/api/budgets';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getBudgets(userId: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}/user/${userId}`);
  }

  createBudget(userId: number, budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(`${this.apiUrl}/${userId}`, budget);
  }

  updateBudget(budgetId: number, budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.apiUrl}/${budgetId}`, budget);
  }

  deleteBudget(budgetId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${budgetId}`);
  }
}
