import { Button } from './ui/button'
import type { CompanyProfile } from '../services/ai-service'

interface TagEditorProps {
  profileValue: string
  editedProfile: {
    tier1_keywords?: string[]
    tier2_keywords?: string[]
    emails?: string[]
    poc?: string[]
  }
  removeArrayField: (field: keyof CompanyProfile, index: number) => void
  item: number
  keyword: string
}

export default function TagEditor({removeArrayField, item, keyword, profileValue}: TagEditorProps) {
  return (
    <div
      className='bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2'
      key={item}
    >
      <span>{keyword}</span>
      <Button
        onClick={() =>
          removeArrayField(profileValue as keyof CompanyProfile, item)
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
  )
}
