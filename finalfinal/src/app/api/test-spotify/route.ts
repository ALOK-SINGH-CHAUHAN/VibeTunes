import { NextRequest, NextResponse } from 'next/server'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback'
})

export async function GET() {
  try {
    console.log('Testing Spotify API connection...')
    console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID ? '✓ Configured' : '✗ Missing')
    console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? '✓ Configured' : '✗ Missing')
    
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Spotify credentials not configured',
        config: {
          clientId: process.env.SPOTIFY_CLIENT_ID ? '✓' : '✗',
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? '✓' : '✗'
        }
      }, { status: 400 })
    }

    const authResponse = await spotifyApi.clientCredentialsGrant()
    const accessToken = authResponse.body['access_token']
    
    console.log('✓ Spotify authentication successful')
    console.log('Access token obtained:', accessToken ? '✓' : '✗')
    
    // Test a simple search
    spotifyApi.setAccessToken(accessToken)
    const searchResponse = await spotifyApi.searchTracks('happy', {
      limit: 3,
      market: 'US'
    })
    
    const tracks = searchResponse.body.tracks?.items || []
    console.log(`✓ Found ${tracks.length} tracks for test search`)
    
    return NextResponse.json({
      success: true,
      message: 'Spotify API integration working correctly',
      config: {
        clientId: '✓ Configured',
        clientSecret: '✓ Configured'
      },
      authentication: '✓ Successful',
      testSearch: {
        query: 'happy',
        tracksFound: tracks.length,
        sampleTracks: tracks.slice(0, 2).map(track => ({
          name: track.name,
          artist: track.artists[0]?.name || 'Unknown'
        }))
      }
    })
    
  } catch (error) {
    console.error('❌ Spotify API test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        clientId: process.env.SPOTIFY_CLIENT_ID ? '✓' : '✗',
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? '✓' : '✗'
      }
    }, { status: 500 })
  }
}