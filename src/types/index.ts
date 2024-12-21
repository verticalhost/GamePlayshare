export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  game: string;
  proof_url?: string;
  youtube_url?: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  completed_at: string;
  challenge_id?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  requirements: string;
  deadline: string;
  game: string;
  created_at: string;
}