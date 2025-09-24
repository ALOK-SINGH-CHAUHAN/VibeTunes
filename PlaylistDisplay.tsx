import PlaylistDisplay from '../PlaylistDisplay'
import { Playlist } from '@shared/schema'

export default function PlaylistDisplayExample() {
  const samplePlaylist: Playlist = {
    id: "playlist-1",
    name: "Upbeat Morning Vibes",
    description: "Energetic tracks to kickstart your productive day with positive energy and motivation",
    moodPrompt: "upbeat morning vibes for a productive day",
    createdAt: "2024-01-15T09:00:00Z",
    tracks: [
      {
        id: "track-1",
        name: "Good 4 U",
        artist: "Olivia Rodrigo",
        album: "SOUR",
        albumArt: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
        duration: 178986,
        spotifyUrl: "https://open.spotify.com/track/example1"
      },
      {
        id: "track-2", 
        name: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        albumArt: "https://i.scdn.co/image/ab67616d0000b273ef6a9adba9e94940c2a3c8dc",
        duration: 203064,
        spotifyUrl: "https://open.spotify.com/track/example2"
      },
      {
        id: "track-3",
        name: "Sunflower",
        artist: "Post Malone, Swae Lee",
        album: "Spider-Man: Into the Spider-Verse",
        albumArt: "https://i.scdn.co/image/ab67616d0000b2736d4f6c9c99291e3e72420251",
        duration: 158040,
        spotifyUrl: "https://open.spotify.com/track/example3"
      }
    ]
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      <PlaylistDisplay
        playlist={samplePlaylist}
        currentTrackId="track-1"
        isPlaying={true}
        onPlayPause={(trackId) => console.log('Play/pause track:', trackId)}
        onSharePlaylist={() => console.log('Share playlist clicked')}
      />
    </div>
  )
}