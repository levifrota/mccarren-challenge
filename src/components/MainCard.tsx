import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { CompanyProfile } from '../services/ai-service';
import ProfileHeader from './ProfileHeader';
import ServiceLineEditor from './ServiceLineEditor';
import CompanyDescription from './CompanyDescription';
import TierKeywords from './TierKeywords';
import ContactsSection from './ContactsSection';
import ProfileGenerator from './ProfileGenerator';
import EditModeManager from './EditModeManager';
import ServiceLineManager from './ServiceLineManager';

export default function MainCard() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  // Handler for when a profile is generated
  const handleProfileGenerated = (generatedProfile: CompanyProfile) => {
    setProfile(generatedProfile);
  };

  return (
    <Card className='mb-8 p-6 bg-card rounded-lg shadow-md max-w-3xl'>
      <CardHeader>
        <CardTitle>Insert a company website URL</CardTitle>
      </CardHeader>

      <CardContent>
        <ProfileGenerator onProfileGenerated={handleProfileGenerated} />

        {profile && (
          <div className='bg-card rounded-lg shadow-md overflow-hidden'>
            <div className='p-6'>
              <EditModeManager profile={profile}>
                {({
                  editMode,
                  editedProfile,
                  tier1Input,
                  tier2Input,
                  emailsInput,
                  pocInput,
                  toggleEditMode,
                  closeEditMode,
                  updateEditedProfile,
                  removeArrayField,
                  handleArrayField,
                  setTier1Input,
                  setTier2Input,
                  setEmailsInput,
                  setPocInput,
                }) => (
                  <>
                    <ProfileHeader
                      editMode={editMode}
                      profile={profile}
                      onCloseEditMode={closeEditMode}
                      onToggleEditMode={toggleEditMode}
                    />

                    <ServiceLineManager
                      initialServiceLines={profile.service_line}
                    >
                      {({
                        serviceLines,
                        currentServiceLine,
                        setCurrentServiceLine,
                        addServiceLine,
                        removeServiceLine,
                      }) => (
                        <ServiceLineEditor
                          editMode={editMode}
                          serviceLines={serviceLines}
                          setCurrentServiceLine={setCurrentServiceLine}
                          removeServiceLine={removeServiceLine}
                          addServiceLine={addServiceLine}
                          currentServiceLine={currentServiceLine}
                        />
                      )}
                    </ServiceLineManager>

                    <CompanyDescription
                      editMode={editMode}
                      editedProfile={editedProfile}
                      profile={profile}
                      updateEditedProfile={updateEditedProfile}
                    />

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
                  </>
                )}
              </EditModeManager>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
