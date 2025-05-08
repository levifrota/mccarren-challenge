import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { generateCompanyProfile } from '../services/ai-service';
import type { CompanyProfile } from '../services/ai-service';
import { Loader2Icon } from 'lucide-react';

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
              <div className='flex justify-between items-center mb-4'>

                <h2 className='text-2xl font-bold'>{profile.company_name}</h2>

                <div>
                  {editMode && (
                    <Button
                      onClick={closeEditMode}
                      className='bg-secondary px-4 py-2 rounded-md hover:bg-secondary/90 mr-3'
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={toggleEditMode}
                    className='bg-secondary px-4 py-2 rounded-md hover:bg-secondary/90'
                  >
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
              </div>

              {/* Service Line */}
              <div className='mb-6'>

                <h3 className='text-lg font-semibold mb-2'>Service Lines</h3>

                <div className='flex flex-wrap gap-2 mb-3'>
                  {serviceLines.map((service, index) => (
                    <div
                      key={index}
                      className='bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2'
                    >
                      <span>
                        {service}
                      </span>

                      {editMode && (
                        <Button
                          onClick={() => removeServiceLine(index)}
                          className='ml-1 h-4 w-4 flex items-center justify-center rounded-full hover:border-neutral-950'
                          aria-label='Remove service line'
                          style={{
                            backgroundColor: 'var(--muted)',
                            color: 'black',
                          }}
                        >
                          x
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className='flex gap-2'>
                    <Textarea
                      value={currentServiceLine}
                      onChange={(e) => setCurrentServiceLine(e.target.value)}
                      placeholder='Add service line'
                      className='flex-1 p-2 border border-input rounded-md text-sm'
                    />
                    <Button
                      onClick={addServiceLine}
                      className='bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm'
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Company Description */}
              <div className='mb-6'>

                <h3 className='text-lg font-semibold mb-2'>
                  Company Description
                </h3>

                {editMode ? (
                  <Textarea
                    value={editedProfile.company_description}
                    onChange={(e) =>
                      updateEditedProfile('company_description', e.target.value)
                    }
                    className='w-full p-3 border border-input rounded-md min-h-[100px]'
                  />
                ) : (
                  <p className='text-muted-foreground'>
                    {profile.company_description}
                  </p>
                )}
              </div>

              {/* Tier 1 and Tier 2 Keywords */}
              {/* Tier 1 Keyword */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div>

                  <h3 className='text-lg font-semibold mb-2'>
                    Tier 1 Keywords
                  </h3>

                  {editMode ? (
                    <>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {editedProfile.tier1_keywords.map((kw, i) => (
                          <div
                            className='bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2'
                            key={i}
                          >
                            <span>{kw}</span>
                            <Button
                              onClick={() =>
                                removeArrayField('tier1_keywords', i)
                              }
                              className='ml-1 h-4 w-4 flex items-center justify-center rounded-full hover:border-neutral-950'
                              aria-label='Remove keyword'
                              style={{
                                backgroundColor: 'var(--muted)',
                                color: 'black',
                              }}
                            >
                              x
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Textarea
                        value={tier1Input}
                        onChange={(e) => setTier1Input(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ',') {
                            e.preventDefault();
                            handleArrayField('tier1_keywords', tier1Input);
                            setTier1Input('');
                          }
                        }}
                        onBlur={() => {
                          handleArrayField('tier1_keywords', tier1Input);
                          setTier1Input('');
                        }}
                        placeholder='Enter keywords separated by commas'
                        className='w-full p-3 border border-input rounded-md'
                      />
                    </>
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {Array.isArray(profile.tier1_keywords) &&
                        profile.tier1_keywords.map(
                          (keyword: string, index: number) => (
                            <div
                              className='bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2'
                              key={index}
                            >
                              <span>{keyword}</span>
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>

                {/* Tier 2 Keywords */}
                <div>

                  <h3 className='text-lg font-semibold mb-2'>
                    Tier 2 Keywords
                  </h3>

                  {editMode ? (
                    <>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {editedProfile.tier2_keywords.map((kw, i) => (
                          <div
                            className='bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2'
                            key={i}
                          >
                            <span>
                              {kw}
                            </span>

                            <Button
                              onClick={() =>
                                removeArrayField('tier2_keywords', i)
                              }
                              className='ml-1 h-4 w-4 flex items-center justify-center rounded-full hover:border-neutral-950'
                              aria-label='Remove keyword'
                              style={{
                                backgroundColor: 'var(--muted)',
                                color: 'black',
                              }}
                            >
                              x
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Textarea
                        value={tier2Input}
                        onChange={(e) => setTier2Input(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ',') {
                            e.preventDefault();
                            handleArrayField('tier2_keywords', tier2Input);
                            setTier2Input('');
                          }
                        }}
                        onBlur={() => {
                          handleArrayField('tier2_keywords', tier2Input);
                          setTier2Input('');
                        }}
                        placeholder='Enter keywords separated by commas'
                        className='w-full p-3 border border-input rounded-md'
                      />
                    </>
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {Array.isArray(profile.tier2_keywords) &&
                        profile.tier2_keywords.map(
                          (keyword: string, index: number) => (
                            <div
                              className='bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2'
                              key={index}
                            >
                              <span>{keyword}</span>
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Email */}
                <div>

                  <h3 className='text-lg font-semibold mb-2'>Email Contacts</h3>

                  {editMode ? (
                    <>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {editedProfile.emails.map((kw, i) => (
                          <div
                            className='flex bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'
                            key={i}
                          >
                            <span>
                              {kw}
                            </span>
                            <Button
                              onClick={() => removeArrayField('emails', i)}
                              className='ml-1 h-4 w-4 flex items-center justify-center rounded-full hover:border-neutral-950'
                              aria-label='Remove email'
                              style={{
                                backgroundColor: 'transparent',
                                color: 'black',
                              }}
                            >
                              x
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Textarea
                        value={emailsInput}
                        onChange={(e) => setEmailsInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ',') {
                            e.preventDefault();
                            handleArrayField('emails', emailsInput);
                            setEmailsInput('');
                          }
                        }}
                        onBlur={() => {
                          handleArrayField('emails', emailsInput);
                          setEmailsInput('');
                        }}
                        placeholder='Enter emails separated by commas'
                        className='w-full p-3 border border-input rounded-md'
                      />
                    </>
                  ) : (
                    <div>
                      {profile.emails.length > 0 ? (
                        <div className='flex flex-wrap gap-2 mb-2'>
                          {profile.emails.map(
                            (email: string, index: number) => (
                              <span
                                key={index}
                                className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'
                              >
                                {email}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p className='text-muted-foreground italic'>
                          No emails added yet
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* POC */}
                <div>

                  <h3 className='text-lg font-semibold mb-2'>
                    Points of Contact
                  </h3>

                  {editMode ? (
                    <>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {editedProfile.poc.map((kw, i) => (
                          <div
                            className='flex bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'
                            key={i}
                          >
                            <span>{kw}</span>
                            <Button
                              onClick={() => removeArrayField('poc', i)}
                              className='ml-1 h-4 w-4 flex items-center justify-center rounded-full hover:border-neutral-950'
                              aria-label='Remove point of contract'
                              style={{
                                backgroundColor: 'transparent',
                                color: 'black',
                              }}
                            >
                              x
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Textarea
                        value={pocInput}
                        onChange={(e) => setPocInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === ',') {
                            e.preventDefault();
                            handleArrayField('poc', pocInput);
                            setPocInput('');
                          }
                        }}
                        onBlur={() => {
                          handleArrayField('poc', pocInput);
                          setPocInput('');
                        }}
                        placeholder='Enter contacts separated by commas'
                        className='w-full p-3 border border-input rounded-md'
                      />
                    </>
                  ) : (
                    <div>
                      {profile.poc.length > 0 ? (
                        <div className='flex flex-wrap gap-2 mb-2'>
                          {profile.poc.map((contact: string, index: number) => (
                            <span
                              key={index}
                              className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'
                            >
                              {contact}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className='text-muted-foreground italic'>
                          No contacts added yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

    </Card>
  );
}
