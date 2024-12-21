import { supabase } from './supabase';

export interface AchievementSubmission {
  title: string;
  description: string;
  game: string;
  proof_url?: string | null;
  youtube_url?: string | null;
  user_id: string;
  challenge_id?: string | null;
}

export async function submitAchievement(data: AchievementSubmission) {
  // Get current user to verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('You must be logged in to submit achievements');
  }

  // Verify user_id matches authenticated user
  if (user.id !== data.user_id) {
    throw new Error('Invalid user ID');
  }

  // Verify at least one proof is provided
  if (!data.proof_url && !data.youtube_url) {
    throw new Error('Please provide either an image or a YouTube video URL');
  }

  const { data: result, error } = await supabase
    .from('achievements')
    .insert([{
      title: data.title,
      description: data.description,
      game: data.game,
      proof_url: data.proof_url,
      youtube_url: data.youtube_url,
      user_id: data.user_id,
      challenge_id: data.challenge_id,
      status: 'pending',
      completed_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to submit achievement. Please try again.');
  }

  return result;
}

export async function getAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select(`
      *,
      users (
        username,
        display_name
      )
    `)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    throw new Error('Failed to fetch achievements');
  }

  return data;
}