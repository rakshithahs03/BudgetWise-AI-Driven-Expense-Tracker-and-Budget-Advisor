import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumPost } from '../../../shared/models/forum-post';
import { ForumService } from '../../../core/services/forum.service';
import {RouterLink} from '@angular/router';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import { AlertComponent } from '../../../shared/alert/alert'; // Import the AlertComponent

@Component({
  selector: 'app-forum-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlertComponent], // Add AlertComponent
  templateUrl: './forum-page.html',
  styleUrls: ['./forum-page.scss'],
})
export class ForumPageComponent implements OnInit {
  posts: ForumPost[] = [];
  isLoading = true;
  newPost = { title: '', content: '' };

  // Properties for the custom alert
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private forumService: ForumService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.setupBreadcrumbs();
  }

  // Helper method to trigger the alert
  private triggerAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }

  private setupBreadcrumbs(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Forum', url: '' }
      ]);
    });
  }

  loadPosts(): void {
    this.isLoading = true;
    this.forumService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmitPost(): void {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      this.triggerAlert('Please provide both a title and content for your post.', 'error');
      return;
    }
    this.forumService.createPost(this.newPost).subscribe({
      next: () => {
        this.newPost = { title: '', content: '' };
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error creating post:', err);
        this.triggerAlert('Failed to create post. Please try again.', 'error');
      }
    });
  }
}
