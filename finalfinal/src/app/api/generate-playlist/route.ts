import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import SpotifyWebApi from 'spotify-web-api-node'

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/callback'
})

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
}

// Mood to search terms mapping
const moodToSearchTerms: Record<string, string[]> = {
  'happy': ['happy', 'upbeat', 'joyful', 'cheerful', 'positive'],
  'sad': ['sad', 'melancholy', 'emotional', 'heartbreak', 'tears'],
  'energetic': ['energetic', 'workout', 'gym', 'exercise', 'high energy'],
  'relaxing': ['relaxing', 'chill', 'calm', 'peaceful', 'meditation'],
  'focus': ['focus', 'study', 'concentration', 'work', 'productivity'],
  'romantic': ['romantic', 'love', 'romance', 'valentine', 'intimate'],
  'party': ['party', 'dance', 'club', 'celebration', 'festive'],
  'nostalgic': ['nostalgic', 'retro', 'vintage', 'memories', 'classic'],
  'angry': ['angry', 'rage', 'aggressive', 'heavy', 'intense'],
  'sleepy': ['sleepy', 'lullaby', 'bedtime', 'sleep', 'ambient']
}

async function getSpotifyAccessToken(): Promise<string> {
  try {
    // Check if we have valid credentials
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

async function interpretMoodWithAI(mood: string): Promise<string[]> {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) // Try the latest model
    
    const prompt = `You are a music recommendation expert. Based on the user's mood description, extract relevant search terms for finding music on Spotify. 

User's mood: "${mood}"

Please respond with a JSON array of 3-5 search terms that would be most effective for finding songs matching this mood. The terms should be:
- Relevant to the mood/activity described
- Common music genres, vibes, or themes
- Optimized for Spotify search
- In English

Example responses:
- For "I want to workout": ["workout", "gym", "exercise", "high energy", "motivation"]
- For "Feeling sad after breakup": ["sad", "heartbreak", "emotional", "breakup", "melancholy"]
- For "Need focus for studying": ["focus", "study", "concentration", "ambient", "instrumental"]

Respond only with the JSON array, no other text.`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    try {
      // Clean the response text to ensure it's valid JSON
      const cleanResponse = responseText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')
      const searchTerms = JSON.parse(cleanResponse)
      if (Array.isArray(searchTerms) && searchTerms.length > 0) {
        console.log('✅ Gemini AI successfully interpreted mood:', searchTerms)
        return searchTerms
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError)
      console.log('Raw response:', responseText)
    }
    
    // Fallback to simple keyword extraction
    return extractKeywordsFromMood(mood)
  } catch (error) {
    console.error('Error interpreting mood with Gemini:', error.message)
    
    // Handle specific Gemini errors
    if (error.message.includes('User location is not supported')) {
      console.log('Gemini API not available in this region, using fallback')
    } else if (error.message.includes('quota') || error.message.includes('429')) {
      console.log('Gemini API quota exceeded, using fallback')
    } else if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('Gemini model not found, using fallback')
    }
    
    return extractKeywordsFromMood(mood)
  }
}

function extractKeywordsFromMood(mood: string): string[] {
  const lowerMood = mood.toLowerCase()
  const foundTerms: string[] = []
  
  for (const [moodCategory, terms] of Object.entries(moodToSearchTerms)) {
    if (lowerMood.includes(moodCategory)) {
      foundTerms.push(...terms.slice(0, 2))
    }
  }
  
  // Add some generic terms if no specific mood found
  if (foundTerms.length === 0) {
    foundTerms.push('mood', 'vibe', 'feeling')
  }
  
  return foundTerms.slice(0, 5)
}

async function searchTracks(searchTerms: string[], accessToken: string): Promise<Track[]> {
  const allTracks: Track[] = []
  
  for (const term of searchTerms.slice(0, 3)) { // Limit to 3 search terms
    try {
      spotifyApi.setAccessToken(accessToken)
      const response = await spotifyApi.searchTracks(term, {
        limit: 10,
        market: 'US'
      })
      
      const tracks = response.body.tracks?.items || []
      
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
    } catch (error) {
      console.error(`Error searching for tracks with term "${term}":`, error)
    }
  }
  
  // Remove duplicates and limit to 20 tracks
  const uniqueTracks = allTracks.filter((track, index, self) => 
    index === self.findIndex(t => t.id === track.id)
  )
  
  return uniqueTracks.slice(0, 20)
}

export async function POST(request: NextRequest) {
  try {
    const { mood } = await request.json()
    
    if (!mood || typeof mood !== 'string') {
      return NextResponse.json(
        { error: 'Mood description is required' },
        { status: 400 }
      )
    }

    // Get Spotify access token
    let accessToken: string
    let usingFallbackAI = false
    let geminiError = null
    
    try {
      accessToken = await getSpotifyAccessToken()
    } catch (spotifyError) {
      // If Spotify fails, use demo mode
      console.log('Spotify not configured, using demo mode')
      return generateDemoPlaylist(mood)
    }
    
    // Try to interpret mood with Gemini AI, fallback to keyword extraction
    let searchTerms: string[]
    try {
      searchTerms = await interpretMoodWithAI(mood)
      console.log('Search terms:', searchTerms)
    } catch (aiError) {
      console.log('AI interpretation failed, using keyword extraction fallback')
      geminiError = aiError instanceof Error ? aiError.message : 'AI service unavailable'
      searchTerms = extractKeywordsFromMood(mood)
      usingFallbackAI = true
    }
    
    // Search for tracks based on the interpreted mood
    const tracks = await searchTracks(searchTerms, accessToken)
    
    if (tracks.length === 0) {
      return NextResponse.json(
        { error: 'No tracks found for the given mood' },
        { status: 404 }
      )
    }

    // Create playlist response
    const playlist: Playlist = {
      id: `mood-${Date.now()}`,
      name: `Mood: ${mood.substring(0, 50)}${mood.length > 50 ? '...' : ''}`,
      description: usingFallbackAI 
        ? `Generated based on: "${mood}" (Using keyword extraction - AI unavailable)`
        : `AI-generated playlist based on: "${mood}"`,
      tracks,
      externalUrl: `https://open.spotify.com/search/${encodeURIComponent(searchTerms[0])}`
    }

    return NextResponse.json({ 
      playlist,
      usingFallbackAI,
      geminiError: geminiError || null
    })
  } catch (error) {
    console.error('Error generating playlist:', error)
    
    // Check if it's a Gemini API error
    if (error instanceof Error && (error.message.includes('Gemini') || error.message.includes('quota') || error.message.includes('location'))) {
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Using keyword extraction instead.' },
        { status: 200 } // Return 200 so frontend still works with fallback
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    )
  }
}

// Demo playlist function for when APIs are not configured
async function generateDemoPlaylist(mood: string): Promise<NextResponse> {
  const lowerMood = mood.toLowerCase()
  let demoTracks: Track[] = []
  
  // Determine which demo tracks to use based on mood
  if (lowerMood.includes('happy') || lowerMood.includes('joy') || lowerMood.includes('upbeat')) {
    demoTracks = [
      {
        id: 'demo-happy-1',
        name: 'Happy',
        artist: 'Pharrell Williams',
        album: 'G I R L',
        imageUrl: 'https://via.placeholder.com/300x300/FFD700/000000?text=Happy',
        previewUrl: null,
        externalUrl: 'https://open.spotify.com/track/6bZBe1Ld7qL1e8Mq7sG6g3'
      },
      {
        id: 'demo-happy-2',
        name: "Can't Stop the Feeling",
        artist: 'Justin Timberlake',
        album: 'Trolls: Original Motion Picture Soundtrack',
        imageUrl: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Feeling',
        previewUrl: null,
        externalUrl: 'https://open.spotify.com/track/1KS2lUqL1O9XcXV4y2y5x1'
      }
    ]
  } else if (lowerMood.includes('sad') || lowerMood.includes('melancholy')) {
    demoTracks = [
      {
        id: 'demo-sad-1',
        name: 'Someone Like You',
        artist: 'Adele',
        album: '21',
        imageUrl: 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Sad',
        previewUrl: null,
        externalUrl: 'https://open.spotify.com/track/0liO22Dlh19k1dW2kcMlyD'
      }
    ]
  } else if (lowerMood.includes('energy') || lowerMood.includes('workout') || lowerMood.includes('gym')) {
    demoTracks = [
      {
        id: 'demo-energy-1',
        name: 'Eye of the Tiger',
        artist: 'Survivor',
        album: 'Eye of the Tiger',
        imageUrl: 'https://via.placeholder.com/300x300/FF4444/FFFFFF?text=Tiger',
        previewUrl: null,
        externalUrl: 'https://open.spotify.com/track/4bHsxqR3GMrXTxEPLuK5ue'
      },
      {
        id: 'demo-energy-2',
        name: 'Stronger',
        artist: 'Kanye West',
        album: 'Graduation',
        imageUrl: 'https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=Stronger',
        previewUrl: null,
        externalUrl: 'https://open.spotify.com/track/0Pcu7NpaubYqtA6y9wVwOr'
      }
    ]
  } else {
    // Default demo tracks
    demoTracks = [
      {
        id: 'demo-default-1',
        name: 'Demo Track 1',
        artist: 'Demo Artist',
        album: 'Demo Album',
        imageUrl: 'https://via.placeholder.com/300x300/666666/FFFFFF?text=Demo',
        previewUrl: null,
        externalUrl: 'https://open.spotify.com/'
      }
    ]
  }

  const playlist: Playlist = {
    id: `demo-${Date.now()}`,
    name: `Demo: ${mood.substring(0, 50)}${mood.length > 50 ? '...' : ''}`,
    description: `Demo playlist based on: "${mood}" (Configure APIs for real tracks)`,
    tracks: demoTracks,
    externalUrl: 'https://open.spotify.com/'
  }

  return NextResponse.json({ 
    playlist,
    demo: true,
    message: 'This is a demo playlist. Configure Spotify and Gemini APIs for real tracks.'
  })
}