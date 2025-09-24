import { Track } from '@shared/schema'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Play, Pause, ExternalLink } from 'lucide-react'

interface TrackCardProps {
  track: Track
  isCurrentTrack?: boolean
  isPlaying: boolean
  onPlayPause: () => void
}

export default function TrackCard({ 
  track, 
  isCurrentTrack = false, 
  isPlaying, 
  onPlayPause 
}: TrackCardProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className={`transition-all ${isCurrentTrack ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={track.albumArt} 
            alt={`${track.album} cover`}
            className="w-12 h-12 rounded-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{track.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
            <p className="text-xs text-muted-foreground truncate">{track.album}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {formatDuration(track.duration)}
            </span>
            <Button
              variant={isCurrentTrack ? "default" : "outline"}
              size="sm"
              onClick={onPlayPause}
              className="w-8 h-8 p-0"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(track.spotifyUrl, '_blank')}
              className="w-8 h-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}