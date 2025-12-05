import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForumPost } from '../../shared/models/forum-post';
import { ForumComment } from '../../shared/models/forum-comment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = 'http://localhost:5000/api/forum/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(this.apiUrl);
  }

  // ✅ ADD THIS METHOD
  getPostById(postId: number): Observable<ForumPost> {
    return this.http.get<ForumPost>(`${this.apiUrl}/${postId}`);
  }

  createPost(post: { title: string; content: string }): Observable<ForumPost> {
    return this.http.post<ForumPost>(this.apiUrl, post);
  }

  // ✅ ADD THIS METHOD
  addComment(postId: number, content: string): Observable<ForumComment> {
    return this.http.post<ForumComment>(`${this.apiUrl}/${postId}/comments`, { content });
  }
}
