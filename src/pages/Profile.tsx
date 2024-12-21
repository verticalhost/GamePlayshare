import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, Achievement } from '../types';
import { Trophy, Star, Award, User as UserIcon } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfilePhotoUpload from '../components/profile/ProfilePhotoUpload';

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          setError('Not authenticated');
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;
        
        if (!profile) {
          setError('Profile not found');
          return;
        }

        setProfile(profile);

        // Fetch achievements
        const { data: achievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', authUser.id);

        if (achievementsError) throw achievementsError;
        setAchievements(achievements || []);

      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: newPhotoUrl } : null);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500 rounded p-4 max-w-md mx-auto">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-500/10 border border-yellow-500 rounded p-4 max-w-md mx-auto">
          <p className="text-yellow-500">Profile not found. Please try signing out and signing in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800 rounded-lg p-8">
        <div className="flex items-center space-x-6">
          <ProfilePhotoUpload
            currentPhotoUrl={profile.avatar_url}
            onPhotoUpdate={handlePhotoUpdate}
          />
          <div>
            <h1 className="text-3xl font-bold">{profile.display_name || profile.username}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-400">
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Level {profile.level}
              </span>
              <span className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {profile.points} points
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Achievements ({achievements.length})</h2>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gray-800 rounded-lg p-4 flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <div>
                  <p className="font-medium">Challenge Completed</p>
                  <p className="text-sm text-gray-400">
                    {new Date(achievement.completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No achievements yet. Complete challenges to earn them!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;