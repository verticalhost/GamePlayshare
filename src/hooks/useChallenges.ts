import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Challenge } from '../types';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setChallenges(data || []);
      } catch (err: any) {
        console.error('Error fetching challenges:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return { challenges, loading, error };
}