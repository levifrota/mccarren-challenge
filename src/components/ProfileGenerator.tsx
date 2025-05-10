import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2Icon } from 'lucide-react';
import { generateCompanyProfile } from '../services/ai-service';
import type { CompanyProfile } from '../services/ai-service';

interface ProfileGeneratorProps {
  onProfileGenerated: (profile: CompanyProfile) => void;
}

export default function ProfileGenerator({ onProfileGenerated }: ProfileGeneratorProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateProfile = async () => {
    if (!url) {
      setError('Enter a company website URL');
      return;
    }

    try {
      new URL(url);
    } catch (e) {
      console.error('Invalid URL:', e);
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const generatedProfile = await generateCompanyProfile(url);
      onProfileGenerated(generatedProfile);
      setLoading(false);
    } catch (error) {
      console.error('Error generating company profile:', error);
      setError('Failed to generate profile. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div>
      <Input
        type='text'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder='Enter company website URL'
      />

      <Button onClick={generateProfile} disabled={loading} className='mt-4'>
        {loading && <Loader2Icon className='animate-spin' />}
        Generate Profile
      </Button>

      {error && <p className='mt-2 text-destructive'>{error}</p>}
    </div>
  );
}