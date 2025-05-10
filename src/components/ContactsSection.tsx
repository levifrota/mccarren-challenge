import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import type { CompanyProfile } from '../services/ai-service';
import { EmailSchema } from '../schema/email';
import { useState } from 'react';

interface TierKeywordsProps {
  editMode: boolean
  editedProfile: {
    emails: string[]
    poc: string[]
  }
  removeArrayField: (field: keyof CompanyProfile, index: number) => void
  setEmailsInput: (value: string) => void
  setPocInput: (value: string) => void
  profile: {
    emails: string[]
    poc: string[]
  }
  handleArrayField: (field: keyof CompanyProfile, value: string) => void
  emailsInput: string
  pocInput: string
}

export default function ContactsSection({editMode, editedProfile, removeArrayField, setEmailsInput, setPocInput, profile, handleArrayField, emailsInput, pocInput}: TierKeywordsProps) {
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const validateAndAddEmail = () => {    
    const trimmedEmail = emailsInput.trim();
    // Check if there's an email
    if (!trimmedEmail) {
      return;
    }

    try {
      // Validate email using zod schema
      EmailSchema.parse({ emails: trimmedEmail });
      
      handleArrayField('emails', trimmedEmail);
      setEmailsInput('');
      setEmailError(null);
    } catch (error) {
      const zodError = (error as { issues: { message: string }[] }).issues[0];
      setEmailError(zodError.message);
    }
  };
  return (
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
                  <span>{kw}</span>
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
                  validateAndAddEmail();
                }
              }}
              onBlur={() => {
                validateAndAddEmail();
              }}
              placeholder='Enter emails separated by commas'
              className={`w-full p-3 border rounded-md ${emailError ? 'border-red-500' : 'border-input'}`}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
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
  )
}
