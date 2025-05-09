import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { generateCompanyProfile } from '../services/ai-service';
import type { CompanyProfile } from '../services/ai-service';
import { Loader2Icon } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import ServiceLineEditor from './ServiceLineEditor';
import CompanyDescription from './CompanyDescription';
import TierKeywords from './TierKeywords';
import ContactsSection from './ContactsSection';

const emptyProfile: CompanyProfile = {
  company_name: '',
  service_line: [],
  company_description: '',
  tier1_keywords: [],
  tier2_keywords: [],
  emails: [],
  poc: [],
};

export default function MainCard() {
  // Define state variables
  const [url, setUrl] = useState('');
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviceLines, setServiceLines] = useState<string[]>([]);
  const [currentServiceLine, setCurrentServiceLine] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] =
    useState<CompanyProfile>(emptyProfile);
  const [tier1Input, setTier1Input] = useState('');
  const [tier2Input, setTier2Input] = useState('');
  const [emailsInput, setEmailsInput] = useState('');
  const [pocInput, setPocInput] = useState('');

  // Generate profile
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
      setProfile(generatedProfile);
      setEditedProfile(generatedProfile);

      // Extract service lines from the generated profile
      const serviceLineArray = Array.isArray(generatedProfile.service_line)
        ? generatedProfile.service_line
        : [];

      // Combine all service lines
      setServiceLines([...serviceLineArray]);
      setCurrentServiceLine('');
      setLoading(false);
    } catch (error) {
      console.error('Error generating company profile:', error);
      setError('Failed to generate profile. Please try again later.');
      setLoading(false);
    }
  };

  // Function to add a service line
  const addServiceLine = () => {
    if (currentServiceLine && !serviceLines.includes(currentServiceLine)) {
      setServiceLines([...serviceLines, currentServiceLine]);
      setCurrentServiceLine('');
    }
  };

  // Function to remove a service line
  const removeServiceLine = (indexToRemove: number) => {
    setServiceLines(serviceLines.filter((_, index) => index !== indexToRemove));
  };

  // Function to handle input changes for service lines
  const removeArrayField = (
    field: keyof CompanyProfile,
    indexToRemove: number
  ) => {
    setEditedProfile((prev) => {
      const items = [...(prev[field] as string[])];
      items.splice(indexToRemove, 1);
      return { ...prev, [field]: items };
    });
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      if (tier1Input.trim()) handleArrayField('tier1_keywords', tier1Input);
      if (tier2Input.trim()) handleArrayField('tier2_keywords', tier2Input);
      if (emailsInput.trim()) handleArrayField('emails', emailsInput);
      if (pocInput.trim()) handleArrayField('poc', pocInput);
      setProfile(editedProfile);
    } else {
      const p = profile || emptyProfile;
      setEditedProfile(p);
      setTier1Input('');
      setTier2Input('');
      setEmailsInput('');
      setPocInput('');
    }
    setEditMode(!editMode);
  };

  // Function to close edit mode
  const closeEditMode = () => {
    setEditMode(false);
  };

  // Function to update the edited profile
  const updateEditedProfile = (field: keyof CompanyProfile, value: unknown) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayField = (field: keyof CompanyProfile, value: string) => {
    const newItems = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '');
    if (newItems.length === 0) return;
    setEditedProfile((prev) => {
      const prevItems = prev[field] as string[];
      const uniqueNew = newItems.filter((item) => !prevItems.includes(item));
      if (uniqueNew.length === 0) return prev;
      return {
        ...prev,
        [field]: [...prevItems, ...uniqueNew],
      };
    });
  };

  return (
    <Card className='mb-8 p-6 bg-card rounded-lg shadow-md max-w-3xl'>
      <CardHeader>
        <CardTitle>Insert a company website URL</CardTitle>
      </CardHeader>

      <CardContent>
        <Input
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Enter company website URL'
        />

        <Button onClick={generateProfile} disabled={loading} className=' mt-4'>
          {loading && <Loader2Icon className='animate-spin' />}
          Generate Profile
        </Button>

        {error && <p className='mt-2 text-destructive'>{error}</p>}

        {profile && (
          <div className='bg-card rounded-lg shadow-md overflow-hidden'>
            <div className='p-6'>
              <ProfileHeader
                editMode={editMode}
                profile={profile}
                onCloseEditMode={closeEditMode}
                onToggleEditMode={toggleEditMode}
              />

              {/* Service Line */}
              <ServiceLineEditor
                editMode={editMode}
                serviceLines={serviceLines}
                setCurrentServiceLine={setCurrentServiceLine}
                removeServiceLine={removeServiceLine}
                addServiceLine={addServiceLine}
                currentServiceLine={currentServiceLine}
              />

              {/* Company Description */}
              <CompanyDescription
                editMode={editMode}
                editedProfile={editedProfile}
                profile={profile}
                updateEditedProfile={updateEditedProfile}
              />

              {/* Tier 1 and Tier 2 Keywords */}
              <TierKeywords
                editMode={editMode}
                editedProfile={editedProfile} 
                profile={profile} 
                tier1Input={tier1Input}
                tier2Input={tier2Input}
                removeArrayField={removeArrayField}
                setTier1Input={setTier1Input}
                handleArrayField={handleArrayField}
                setTier2Input={setTier2Input}
              />

              {/* Email and POC sections */}
              <ContactsSection
                editMode={editMode}
                editedProfile={editedProfile}
                profile={profile}
                removeArrayField={removeArrayField}
                setEmailsInput={setEmailsInput}
                setPocInput={setPocInput}
                handleArrayField={handleArrayField}
                emailsInput={emailsInput}
                pocInput={pocInput}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
