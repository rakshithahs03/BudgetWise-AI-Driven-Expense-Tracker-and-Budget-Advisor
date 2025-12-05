import { ForumComment } from './forum-comment';

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author: {
    username: string;
  };
  comments: ForumComment[];
}
