import { NextRequest, NextResponse } from 'next/server'
import SpotifyWebApi from 'spotify-web-api-node'

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback'
})

interface CreatePlaylistRequest {
  name: string
  description: string
  trackIds: string[]
  accessToken?: string
}

interface Track {
  id: string
  name: string
  artist: string
  album: string
  imageUrl: string
  previewUrl: string | null
  externalUrl: string
}

interface Playlist {
  id: string
  name: string
  description: string
  tracks: Track[]
  externalUrl: string
  isRealPlaylist: boolean
}

async function getSpotifyAccessToken(): Promise<string> {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials not configured')
    }

    const authResponse = await spotifyApi.clientCredentialsGrant()
    return authResponse.body['access_token']
  } catch (error) {
    console.error('Error getting Spotify access token:', error)
    throw new Error('Failed to authenticate with Spotify')
  }
}

async function searchTracksByIds(trackIds: string[], accessToken: string): Promise<Track[]> {
  try {
    spotifyApi.setAccessToken(accessToken)
    
    // Spotify API allows up to 50 tracks per request
    const chunks = []
    for (let i = 0; i < trackIds.length; i += 50) {
      chunks.push(trackIds.slice(i, i + 50))
    }
    
    const allTracks: Track[] = []
    
    for (const chunk of chunks) {
      const response = await spotifyApi.getTracks(chunk)
      const tracks = response.body.tracks || []
      
      for (const track of tracks) {
        if (track && track.id && track.name && track.artists && track.album) {
          allTracks.push({
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            imageUrl: track.album.images[0]?.url || '',
            previewUrl: track.preview_url,
            externalUrl: track.external_urls?.spotify || ''
          })
        }
      }
    }
    
    return allTracks
  } catch (error) {
    console.error('Error searching tracks by IDs:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, trackIds, accessToken }: CreatePlaylistRequest = await request.json()
    
    if (!name || !description || !trackIds || trackIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, or trackIds' },
        { status: 400 }
      )
    }

    // If no user access token provided, create a demo playlist
    if (!accessToken) {
      // Get app-level access token to fetch track details
      let appAccessToken: string
      try {
        appAccessToken = await getSpotifyAccessToken()
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to authenticate with Spotify for demo mode' },
          { status: 500 }
        )
      }
      
      // Fetch track details
      const tracks = await searchTracksByIds(trackIds, appAccessToken)
      
      if (tracks.length === 0) {
        return NextResponse.json(
          { error: 'No valid tracks found' },
          { status: 404 }
        )
      }

      // Create demo playlist response
      const playlist: Playlist = {
        id: `demo-${Date.now()}`,
        name: `Demo: ${name}`,
        description: `${description} (Demo mode - Connect Spotify to create real playlist)`,
        tracks,
        externalUrl: `https://open.spotify.com/search/${encodeURIComponent(name)}`,
        isRealPlaylist: false
      }

      return NextResponse.json({ 
        playlist,
        isRealPlaylist: false,
        message: 'This is a demo playlist. Connect your Spotify account to create real playlists.'
      })
    }

    // Create real playlist with user's access token
    try {
      spotifyApi.setAccessToken(accessToken)
      
      // Get user's profile to get their user ID
      const userResponse = await spotifyApi.getMe()
      const userId = userResponse.body.id
      
      if (!userId) {
        throw new Error('Could not get user ID from Spotify')
      }
      
      // Create the playlist
      const createPlaylistResponse = await spotifyApi.createPlaylist(userId, {
        name: name,
        description: description,
        public: false,
        collaborative: false
      })
      
      const playlistId = createPlaylistResponse.body.id
      
      // Add tracks to the playlist
      // Spotify API expects track URIs in the format 'spotify:track:TRACK_ID'
      const trackUris = trackIds.map(id => `spotify:track:${id}`)
      
      // Add tracks in chunks of 100 (Spotify's limit)
      for (let i = 0; i < trackUris.length; i += 100) {
        const chunk = trackUris.slice(i, i + 100)
        await spotifyApi.addTracksToPlaylist(playlistId, chunk)
      }
      
      // Fetch the created playlist details
      const playlistResponse = await spotifyApi.getPlaylist(playlistId)
      const playlistData = playlistResponse.body
      
      // Fetch track details
      const tracks = await searchTracksByIds(trackIds, accessToken)
      
      const playlist: Playlist = {
        id: playlistId,
        name: playlistData.name,
        description: playlistData.description || '',
        tracks,
        externalUrl: playlistData.external_urls?.spotify || '',
        isRealPlaylist: true
      }

      return NextResponse.json({ 
        playlist,
        isRealPlaylist: true,
        message: 'Playlist created successfully!'
      })
      
    } catch (error) {
      console.error('Error creating real playlist:', error)
      
      // Fallback to demo mode if real playlist creation fails
      let appAccessToken: string
      try {
        appAccessToken = await getSpotifyAccessToken()
      } catch (authError) {
        return NextResponse.json(
          { error: 'Failed to create playlist and fallback authentication failed' },
          { status: 500 }
        )
      }
      
      const tracks = await searchTracksByIds(trackIds, appAccessToken)
      
      const playlist: Playlist = {
        id: `demo-${Date.now()}`,
        name: `Demo: ${name}`,
        description: `${description} (Creation failed - showing demo)`,
        tracks,
        externalUrl: `https://open.spotify.com/search/${encodeURIComponent(name)}`,
        isRealPlaylist: false
      }

      return NextResponse.json({ 
        playlist,
        isRealPlaylist: false,
        message: 'Failed to create real playlist. Showing demo version instead.'
      })
    }
    
  } catch (error) {
    console.error('Error creating playlist:', error)
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    )
  }
}