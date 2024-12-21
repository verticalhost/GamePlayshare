import React from 'react';
import { useAchievements } from '../hooks/useAchievements';
import AchievementCard from '../components/achievements/AchievementCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Trophy } from 'lucide-react';

const Home = () => {
  const { achievements, loading, error } = useAchievements();

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <h1 className="text-4xl font-bold">Latest Achievements</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400">No achievements posted yet. Be the first!</p>
        </div>
      )}
    </div>
  );
};

export default Home;