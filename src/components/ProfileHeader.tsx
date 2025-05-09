import { Button } from './ui/button'

interface ProfileHeaderProps {
  editMode: boolean
  profile: {
    company_name: string
    service_line: string[],
    company_description: string,
    tier1_keywords: string[],
    tier2_keywords: string[],
    emails: string[],
    poc: string[],
  }
  onCloseEditMode: () => void
  onToggleEditMode: () => void
}


export default function ProfileHeader({editMode, profile, onCloseEditMode, onToggleEditMode}: ProfileHeaderProps) {
  return (
    <div className='flex justify-between items-center mb-4'>
      <h2 className='text-2xl font-bold'>{profile.company_name}</h2>

      <div>
        {editMode && (
          <Button
            onClick={onCloseEditMode}
            className='bg-secondary px-4 py-2 rounded-md hover:bg-secondary/90 mr-3'
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={onToggleEditMode}
          className='bg-secondary px-4 py-2 rounded-md hover:bg-secondary/90'
        >
          {editMode ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>
    </div>
  )
}
