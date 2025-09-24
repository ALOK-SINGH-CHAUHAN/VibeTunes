import { Playlist } from '@shared/schema'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import TrackCard from './TrackCard'
import { Share2 } from 'lucide-react'

interface PlaylistDisplayProps {
  playlist: Playlist
  currentTrackId?: string
  isPlaying: boolean
  onPlayPause: (trackId: string) => void
  onSharePlaylist: () => void
}

export default function PlaylistDisplay({ 
  playlist, 
  currentTrackId, 
  isPlaying, 
  onPlayPause, 
  onSharePlaylist 
}: PlaylistDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{playlist.name}</CardTitle>
              <p className="text-muted-foreground mt-2">{playlist.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Based on: "{playlist.moodPrompt}"
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSharePlaylist}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playlist.tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isCurrentTrack={currentTrackId === track.id}
                isPlaying={isPlaying && currentTrackId === track.id}
                onPlayPause={() => onPlayPause(track.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}