import { useState } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Textarea } from './textarea'
import { Loader2, Music } from 'lucide-react'

interface MoodInputProps {
  onSubmit: (mood: string) => void
  isLoading: boolean
}

export default function MoodInput({ onSubmit, isLoading }: MoodInputProps) {
  const [mood, setMood] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mood.trim() && !isLoading) {
      onSubmit(mood.trim())
      setMood('')
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Music className="h-6 w-6" />
          What's your vibe?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Describe your mood, what you're doing, or how you want to feel... (e.g., 'upbeat morning vibes', 'chill study session', 'workout motivation')"
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!mood.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your playlist...
              </>
            ) : (
              'Generate Playlist'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}