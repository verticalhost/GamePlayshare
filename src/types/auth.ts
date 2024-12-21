export interface AuthUser {
  id: string;
  email: string;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  points: number;
  level: number;
  created_at: string;
}