import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

interface ServiceLineEditorProps {
  editMode: boolean
  serviceLines: string[]
  setCurrentServiceLine: (lines: string) => void
  removeServiceLine: (index: number) => void
  addServiceLine: () => void
  currentServiceLine: string
}

export default function ServiceLineEditor({editMode, serviceLines, setCurrentServiceLine, removeServiceLine, addServiceLine, currentServiceLine}: ServiceLineEditorProps) {
  return (
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
  )
}
