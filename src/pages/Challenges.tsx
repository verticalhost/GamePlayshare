import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Challenge } from '../types';
import { Trophy, Clock } from 'lucide-react';

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching challenges:', error);
      } else {
        setChallenges(data);
      }
      setLoading(false);
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Active Challenges</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="text-xl font-semibold">{challenge.title}</h3>
                <p className="text-sm text-gray-400">{challenge.game}</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{challenge.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span className="flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-purple-500" />
                {challenge.points} points
              </span>
              {challenge.deadline && (
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Ends: {new Date(challenge.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;