import { useEffect, useState } from 'react';
import { getAchievements } from '../lib/achievements';
import type { Achievement } from '../types';

interface AchievementWithUser extends Achievement {
  users: {
    username: string;
    display_name: string | null;
  };
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<AchievementWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getAchievements();
        setAchievements(data || []);
      } catch (err: any) {
        console.error('Error fetching achievements:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return { achievements, loading, error };
}