/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { generateCompanyProfile } from '../services/ai-service'
import type { CompanyProfile } from '../services/ai-service'

const emptyProfile: CompanyProfile = {
  company_name: '',
  service_line: [],
  company_description: '',
  tier1_keywords: [],
  tier2_keywords: [],
  emails: [],
  poc: []
};

export default function MainCard() {
  const [url, setUrl] = useState('');
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviceLines, setServiceLines] = useState<string[]>([]);
  const [currentServiceLine, setCurrentServiceLine] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CompanyProfile>(emptyProfile);

  // generate profile
  const generateProfile = async () => {
    if (!url) {
      setError('Enter a company website URL');
      return;
    };

    try {
      new URL(url);
    } catch (e) {
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

      const tier1Keywords = Array.isArray(generatedProfile.tier1_keywords)
        ? generatedProfile.tier1_keywords
        : [];

      // Generate additional service lines from tier1 keywords
      const additionalServiceLines = [
        ...new Set(
          tier1Keywords
          .filter((keyword: string) => keyword && typeof keyword === 'string' && keyword.length > 5)
          .slice(0, 2)
          .map((keyword: string) => keyword.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
          )
        )
      ];

      // Combine all service lines
      setServiceLines([...serviceLineArray, ...additionalServiceLines]);
      setCurrentServiceLine('');
      setLoading(false);
    } catch (error) {
      console.error('Error generating company profile:', error);
      setError('Failed to generate profile. Please try again later.');
      setLoading(false);
    }
  };

  const addServiceLine = () => {
    if (currentServiceLine && !serviceLines.includes(currentServiceLine)) {
      setServiceLines([...serviceLines, currentServiceLine]);
      setCurrentServiceLine('');
    };
  };

  const removeServiceLine = (indexToRemove: number) => {
    setServiceLines(serviceLines.filter((_, index) => index !== indexToRemove));
  };

  const toggleEditMode = () => {
    if (editMode) {
      setProfile(editedProfile);
    } else {
      setEditedProfile(profile || emptyProfile);
    }
    setEditMode(!editMode);
  }

  const updateEditedProfile = (field: keyof CompanyProfile, value: any) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayField = (field: keyof CompanyProfile, value: string) => {
    const values = value.split(',').map((item) => item.trim()).filter(item => item !== '');
    updateEditedProfile(field, values);
  };

  return (
    <Card className="mb-8 p-6 bg-card rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Insert a company website URL</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter company website URL"
        />
        <Button
          onClick={generateProfile}
          disabled={loading}
          className=" mt-4"
        >
          {loading ? 'Generating...' : 'Generate Profile'}
        </Button>

        {profile && (
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{profile.company_name}</h2>
                <Button
                  onClick={toggleEditMode}
                  className="bg-secondary px-4 py-2 rounded-md hover:bg-secondary/90 "
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </div>

              {/* Service Lines */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Service Lines</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {serviceLines.map((service, index) => (
                    <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <span>{service}</span>
                      {editMode && (
                        <Button 
                          onClick={() => removeServiceLine(index)}
                          className="bg-amber-50 ml-1 h-4 w-4 flex items-center justify-center rounded-full"
                          aria-label="Remove service line"
                        >
                          x
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {editMode && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentServiceLine}
                      onChange={(e) => setCurrentServiceLine(e.target.value)}
                      placeholder="Add service line"
                      className="flex-1 p-2 border border-input rounded-md text-sm"
                    />
                    <Button
                      onClick={addServiceLine}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Company Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Company Description</h3>
                {editMode ? (
                  <Textarea
                    value={editedProfile.company_description}
                    onChange={(e) => updateEditedProfile('company_description', e.target.value)}
                    className="w-full p-3 border border-input rounded-md min-h-[100px]"
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.company_description}</p>
                )}
              </div>

              {/* Tier 1 and Tier 2 Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tier 1 Keywords</h3>
                  {editMode ? (
                    <Textarea
                      value={editedProfile.tier1_keywords.join(', ')}
                      onChange={(e) => handleArrayField('tier1_keywords', e.target.value)}
                      placeholder="Enter keywords separated by commas"
                      className="w-full p-3 border border-input rounded-md"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(profile.tier1_keywords) && profile.tier1_keywords.map((keyword: string, index: number) => (
                        <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tier 2 Keywords</h3>
                  {editMode ? (
                    <Textarea
                      value={editedProfile.tier2_keywords.join(', ')}
                      onChange={(e) => handleArrayField('tier2_keywords', e.target.value)}
                      placeholder="Enter keywords separated by commas"
                      className="w-full p-3 border border-input rounded-md"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(profile.tier2_keywords) && profile.tier2_keywords.map((keyword: string, index: number) => (
                        <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Contacts</h3>
                  {editMode ? (
                    <Textarea
                      value={editedProfile.emails.join(', ')}
                      onChange={(e) => handleArrayField('emails', e.target.value)}
                      placeholder="Enter emails separated by commas"
                      className="w-full p-3 border border-input rounded-md"
                    />
                  ) : (
                    <div>
                      {profile.emails.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {profile.emails.map((email: string, index: number) => (
                            <li key={index}>{email}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">No emails added yet</p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Points of Contact</h3>
                  {editMode ? (
                    <Textarea
                      value={editedProfile.poc.join(', ')}
                      onChange={(e) => handleArrayField('poc', e.target.value)}
                      placeholder="Enter contacts separated by commas"
                      className="w-full p-3 border border-input rounded-md"
                    />
                  ) : (
                    <div>
                      {profile.poc.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {profile.poc.map((contact: string, index: number) => (
                            <li key={index}>{contact}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground italic">No contacts added yet</p>
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
  )
}
