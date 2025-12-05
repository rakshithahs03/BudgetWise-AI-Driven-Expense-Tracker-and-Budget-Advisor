import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../core/services/forum.service';
import { ForumPost } from '../../../shared/models/forum-post';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';
import { AlertComponent } from '../../../shared/alert/alert'; // Import the AlertComponent

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AlertComponent], // Add AlertComponent
  templateUrl: './post-detail.html',
  styleUrls: ['./post-detail.scss'],
})
export class PostDetailComponent implements OnInit {
  post: ForumPost | null = null;
  isLoading = true;
  newCommentContent = '';

  // Properties for the custom alert
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadPost();
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
        { label: 'Forum', url: '/forum' },
        { label: 'Post', url: '' }
      ]);
    });
  }

  loadPost(): void {
    const postId = Number(this.route.snapshot.paramMap.get('postId'));
    if (postId) {
      this.isLoading = true;
      this.forumService.getPostById(postId).subscribe({
        next: (post) => {
          this.post = post;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching post:', err);
          this.isLoading = false;
        },
      });
    }
  }

  onAddComment(): void {
    if (!this.newCommentContent.trim() || !this.post) {
      this.triggerAlert('Comment content cannot be empty.', 'error');
      return;
    }
    this.forumService.addComment(this.post.id, this.newCommentContent).subscribe({
      next: () => {
        this.newCommentContent = '';
        this.loadPost();
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.triggerAlert('Failed to add comment.', 'error');
      },
    });
  }
}
