import TrackCard from '../TrackCard'
import { Track } from '@shared/schema'

export default function TrackCardExample() {
  const sampleTrack: Track = {
    id: "example-1",
    name: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273ef6a9adba9e94940c2a3c8dc",
    duration: 200040,
    previewUrl: "https://example.com/preview.mp3",
    spotifyUrl: "https://open.spotify.com/track/example"
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-md">
        <TrackCard
          track={sampleTrack}
          isPlaying={false}
          onPlayPause={() => console.log('Play/pause clicked')}
        />
      </div>
    </div>
  )
}