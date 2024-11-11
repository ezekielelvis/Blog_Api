export interface IPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category_id: string;
  views_count: number;
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}
