import React, { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useChallenges } from '../hooks/useChallenges';
import ImageUploader from '../components/upload/ImageUploader';
import { submitAchievement } from '../lib/achievements';
import { Shield, Youtube } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { challenges, loading: loadingChallenges } = useChallenges();
  
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    description: '',
    challenge_id: '',
    youtube_url: ''
  });
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // If a challenge is selected, auto-fill the title and game
      if (name === 'challenge_id' && value) {
        const selectedChallenge = challenges.find(c => c.id === value);
        if (selectedChallenge) {
          return {
            ...newData,
            title: selectedChallenge.title,
            game: selectedChallenge.game,
            description: selectedChallenge.description
          };
        }
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit achievements');
      return;
    }

    if (!formData.title || !formData.game || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (!proofUrl && !formData.youtube_url) {
      setError('Please provide either an image or a YouTube video URL');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const achievementData = {
        title: formData.title,
        description: formData.description,
        game: formData.game,
        proof_url: proofUrl || null,
        youtube_url: formData.youtube_url || null,
        user_id: user.id,
        challenge_id: formData.challenge_id || null
      };

      await submitAchievement(achievementData);

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      console.error('Error submitting achievement:', err);
      setError(err.message || 'Failed to submit achievement');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">You must be logged in to submit achievements</p>
      </div>
    );
  }

  if (loadingChallenges) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-8 w-8 text-purple-500" />
        <h1 className="text-4xl font-bold">Submit Achievement</h1>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="challenge_id" className="block text-sm font-medium mb-2">
            Select Challenge (Optional)
          </label>
          <select
            id="challenge_id"
            name="challenge_id"
            value={formData.challenge_id}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Custom Achievement</option>
            {challenges.map(challenge => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title} - {challenge.game}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Achievement Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            disabled={uploading}
          />
        </div>

        <div>
          <label htmlFor="game" className="block text-sm font-medium mb-2">
            Game *
          </label>
          <input
            type="text"
            id="game"
            name="game"
            value={formData.game}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            disabled={uploading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
            disabled={uploading}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Proof of Achievement</h3>
          <p className="text-sm text-gray-400">
            Provide either a screenshot/image or a YouTube video URL as proof
          </p>
          
          <div className="space-y-6">
            <ImageUploader
              onUploadComplete={setProofUrl}
              onUploadError={setError}
            />

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Youtube className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="youtube_url"
                name="youtube_url"
                value={formData.youtube_url}
                onChange={handleChange}
                placeholder="Or paste a YouTube video URL"
                className="w-full pl-10 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={uploading}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500 rounded text-green-500 text-sm">
            Achievement submitted successfully! Redirecting to home...
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || (!proofUrl && !formData.youtube_url)}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Submitting...' : 'Submit Achievement'}
        </button>
      </form>
    </div>
  );
};

export default Upload;