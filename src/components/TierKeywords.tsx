import { Textarea } from './ui/textarea';
import type { CompanyProfile } from '../services/ai-service';
import TagEditor from './TagEditor';

interface TierKeywordsProps {
  editMode: boolean
  editedProfile: {
    tier1_keywords: string[]
    tier2_keywords: string[]
  }
  profile: {
    tier1_keywords: string[]
    tier2_keywords: string[]
  }
  removeArrayField: (field: keyof CompanyProfile, index: number) => void
  tier1Input: string
  setTier1Input: (value: string) => void
  handleArrayField: (field: keyof CompanyProfile, value: string) => void
  tier2Input: string
  setTier2Input: (value: string) => void
}

export default function TierKeywords({editMode, editedProfile, removeArrayField, tier1Input, setTier1Input, tier2Input, setTier2Input, handleArrayField, profile}: TierKeywordsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>
          Tier 1 Keywords
        </h3>

        {editMode ? (
          <>
            <div className='flex flex-wrap gap-2 mb-2'>
              {editedProfile.tier1_keywords.map((kw, i) => (
                <TagEditor
                  editedProfile={editedProfile}
                  profileValue='tier1_keywords'
                  item={i}
                  keyword={kw}
                  removeArrayField={removeArrayField}
                />
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
                <TagEditor
                editedProfile={editedProfile}
                profileValue='tier2_keywords'
                item={i}
                keyword={kw}
                removeArrayField={removeArrayField}
              />
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
  )
}
