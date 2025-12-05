import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/ai/chat';

  constructor(private http: HttpClient) {}

  sendMessage(userId: number, prompt: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(`${this.apiUrl}/${userId}`, { prompt });
  }
}
