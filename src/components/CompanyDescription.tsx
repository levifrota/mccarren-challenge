import { Textarea } from './ui/textarea'
import type { CompanyProfile } from '../services/ai-service';

interface CompanyDescriptionProps {
  editMode: boolean
  editedProfile: {
    company_description: string
  }
  profile: {
    company_description: string
  }
  updateEditedProfile: (key: keyof CompanyProfile, value: unknown) => void
}

export default function CompanyDescription({editMode, editedProfile, profile, updateEditedProfile}: CompanyDescriptionProps) {
  return (
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
  )
}
