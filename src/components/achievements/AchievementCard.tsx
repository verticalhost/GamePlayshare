import React from 'react';
import { Trophy, GamepadIcon, User, Youtube } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementCardProps {
  achievement: Achievement & {
    users: {
      username: string;
      display_name: string | null;
    };
  };
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const displayName = achievement.users?.display_name || achievement.users?.username || 'Unknown User';

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative aspect-video">
        {achievement.proof_url ? (
          <img
            src={achievement.proof_url}
            alt={achievement.title}
            className="w-full h-full object-cover"
          />
        ) : achievement.youtube_url ? (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <Youtube className="h-12 w-12 text-red-500" />
            <span className="ml-2 text-white">Watch on YouTube</span>
          </div>
        ) : null}
        <div className={`
          absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold
          ${achievement.status === 'approved' ? 'bg-green-500' : 
            achievement.status === 'rejected' ? 'bg-red-500' : 
            'bg-yellow-500'} text-white shadow-md
        `}>
          {achievement.status}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Title Section */}
        <div className="flex items-start gap-3">
          <Trophy className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-2xl font-bold text-white">
              {achievement.title}
            </h3>
          </div>
        </div>

        {/* Game Section */}
        <div className="flex items-center gap-2">
          <GamepadIcon className="h-5 w-5 text-purple-400" />
          <span className="text-lg font-semibold text-white">
            {achievement.game}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-100 text-base leading-relaxed">
          {achievement.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-white">{displayName}</span>
          </div>
          <span className="text-sm font-medium text-gray-300">
            {new Date(achievement.completed_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;