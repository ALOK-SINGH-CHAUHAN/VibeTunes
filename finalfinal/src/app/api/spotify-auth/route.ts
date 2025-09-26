import { NextRequest, NextResponse } from 'next/server'
import SpotifyWebApi from 'spotify-web-api-node'

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback'
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    
    if (error) {
      return NextResponse.json(
        { error: `Spotify authorization failed: ${error}` },
        { status: 400 }
      )
    }
    
    if (!code) {
      // If no code, return the authorization URL
      const scopes = [
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-read-private',
        'user-read-email'
      ]
      
      const authUrl = spotifyApi.createAuthorizeURL(scopes, 'state')
      
      return NextResponse.json({
        authUrl,
        message: 'Please authorize with Spotify to create playlists'
      })
    }
    
    // Exchange code for access token
    const tokenResponse = await spotifyApi.authorizationCodeGrant(code)
    const accessToken = tokenResponse.body['access_token']
    const refreshToken = tokenResponse.body['refresh_token']
    const expiresIn = tokenResponse.body['expires_in']
    
    return NextResponse.json({
      accessToken,
      refreshToken,
      expiresIn,
      message: 'Successfully authenticated with Spotify'
    })
    
  } catch (error) {
    console.error('Error in Spotify auth:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate with Spotify' },
      { status: 500 }
    )
  }
}