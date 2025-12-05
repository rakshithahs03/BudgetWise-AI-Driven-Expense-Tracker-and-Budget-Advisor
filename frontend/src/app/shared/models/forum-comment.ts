export interface ForumComment {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    username: string;
  };
}
