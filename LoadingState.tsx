import { Card, CardContent } from './card'
import { Loader2, Brain, Search, Music } from 'lucide-react'

type LoadingStage = 'analyzing' | 'searching' | 'generating'

interface LoadingStateProps {
  stage: LoadingStage
}

const stageConfig = {
  analyzing: {
    icon: Brain,
    title: 'Analyzing your mood...',
    description: 'Using AI to understand your vibe and musical preferences'
  },
  searching: {
    icon: Search,
    title: 'Finding perfect tracks...',
    description: 'Searching Spotify for songs that match your energy'
  },
  generating: {
    icon: Music,
    title: 'Creating your playlist...',
    description: 'Putting together the perfect collection just for you'
  }
}

export default function LoadingState({ stage }: LoadingStateProps) {
  const config = stageConfig[stage]
  const Icon = config.icon

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Icon className="h-12 w-12 text-primary" />
            <Loader2 className="h-6 w-6 animate-spin absolute -top-1 -right-1 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-muted-foreground text-sm">{config.description}</p>
      </CardContent>
    </Card>
  )
}