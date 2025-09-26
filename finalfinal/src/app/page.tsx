'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Music, Sparkles, ExternalLink, Play, Pause, TestTube, Brain, LogIn, Plus, Save, Zap, Flame, Sun, Waves, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ErrorBoundary } from '@/components/error-boundary'
import { LoadingSpinner } from '@/components/loading-spinner'
import ThemeAwareBackground from '@/components/theme-aware-background'
import { ThemeSwitcher } from '@/components/theme-switcher'

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
  isRealPlaylist?: boolean
}

export default function Home() {
  const [moodInput, setMoodInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isTestingGemini, setIsTestingGemini] = useState(false)
  const [spotifyStatus, setSpotifyStatus] = useState<string | null>(null)
  const [geminiStatus, setGeminiStatus] = useState<string | null>(null)
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [usingFallbackAI, setUsingFallbackAI] = useState(false)
  const [demoMessage, setDemoMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const { theme } = useTheme()
  const { toast } = useToast()

  // Get current theme data
  const getCurrentThemeData = () => {
    if (!theme || theme.includes('solar')) {
      return {
        name: 'Solar Harmonics',
        subtitle: 'Cosmic Music Weaver',
        description: 'Transform your emotions into cosmic soundscapes with solar-powered musical intelligence',
        icon: Sun,
        accentIcon: Waves,
        primaryColor: 'orange',
        secondaryColor: 'amber',
        gradient: 'from-orange-400 via-yellow-500 to-red-400',
        subGradient: 'from-amber-300 to-orange-300',
        emotionColor: 'orange-400',
        intelligenceColor: 'amber-400',
        vibeQuestion: 'cosmic vibe',
        testCore: 'Solar Core',
        buttonGradient: 'from-orange-500 to-amber-500',
        hoverButtonGradient: 'from-orange-600 hover:to-amber-600',
        shadowColor: 'orange-500',
        borderColor: 'orange-500',
        testBorderColor: 'amber-500',
        statusBgColor: 'orange-500',
        statusBorderColor: 'orange-500',
        geminiStatusBgColor: 'amber-500',
        geminiStatusBorderColor: 'amber-500',
        focusBorderColor: 'orange-500',
        focusRingColor: 'orange-500',
        badgeColors: [
          'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30',
          'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
          'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
        ]
      }
    } else {
      return {
        name: 'VibeSync',
        subtitle: 'AI Music Alchemist',
        description: 'Transform your emotions into sonic landscapes with intelligent playlist curation',
        icon: Flame,
        accentIcon: Zap,
        primaryColor: 'purple',
        secondaryColor: 'cyan',
        gradient: 'from-purple-400 via-pink-500 to-cyan-400',
        subGradient: 'from-purple-300 to-cyan-300',
        emotionColor: 'purple-400',
        intelligenceColor: 'cyan-400',
        vibeQuestion: 'vibe',
        testCore: 'AI Core',
        buttonGradient: 'from-purple-500 to-cyan-500',
        hoverButtonGradient: 'from-purple-600 hover:to-cyan-600',
        shadowColor: 'purple-500',
        borderColor: 'purple-500',
        testBorderColor: 'cyan-500',
        statusBgColor: 'purple-500',
        statusBorderColor: 'purple-500',
        geminiStatusBgColor: 'cyan-500',
        geminiStatusBorderColor: 'cyan-500',
        focusBorderColor: 'purple-500',
        focusRingColor: 'purple-500',
        badgeColors: [
          'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
          'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30',
          'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30',
          'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30'
        ]
      }
    }
  }

  const currentTheme = getCurrentThemeData()
  const MainIcon = currentTheme.icon
  const AccentIcon = currentTheme.accentIcon

  const handleGeneratePlaylist = async () => {
    if (!moodInput.trim()) {
      toast({
        title: "Mood required",
        description: "Please describe your mood to generate a playlist.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setPlaylist(null)
    setIsDemo(false)
    setUsingFallbackAI(false)
    setDemoMessage(null)

    try {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: moodInput }),
      })

      const data = await response.json()

      if (!response.ok && response.status !== 200) {
        throw new Error(data.error || 'Failed to generate playlist')
      }

      setPlaylist(data.playlist)
      setIsDemo(data.demo || false)
      setUsingFallbackAI(data.usingFallbackAI || false)
      setDemoMessage(data.message || null)
      
      let toastMessage = data.demo ? "Demo playlist generated!" : "Playlist generated!"
      let toastDescription = `Created "${data.playlist.name}" based on your mood.`
      
      if (data.usingFallbackAI) {
        toastMessage = "Playlist generated with fallback!"
        toastDescription = "AI service unavailable, using keyword extraction instead."
      }
      
      toast({
        title: toastMessage,
        description: toastDescription,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestSpotify = async () => {
    setIsTesting(true)
    setSpotifyStatus(null)
    
    try {
      const response = await fetch('/api/test-spotify')
      const data = await response.json()
      
      if (data.success) {
        setSpotifyStatus(`✅ Spotify API working! Found ${data.testSearch.tracksFound} tracks for "happy"`)
        toast({
          title: "Spotify API Test Successful",
          description: `Found ${data.testSearch.tracksFound} tracks. API is working correctly.`,
        })
      } else {
        setSpotifyStatus(`❌ Spotify API failed: ${data.error}`)
        toast({
          title: "Spotify API Test Failed",
          description: data.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Test failed'
      setSpotifyStatus(`❌ Test failed: ${errorMessage}`)
      toast({
        title: "Test Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleTestGemini = async () => {
    setIsTestingGemini(true)
    setGeminiStatus(null)
    
    try {
      const response = await fetch('/api/test-gemini')
      const data = await response.json()
      
      if (data.success) {
        setGeminiStatus(`✅ Gemini API working! Extracted terms: ${data.moodInterpretation.extractedTerms.join(', ')}`)
        toast({
          title: "Gemini API Test Successful",
          description: `AI interpreted mood as: ${data.moodInterpretation.extractedTerms.join(', ')}`,
        })
      } else {
        let errorMessage = data.error || 'Unknown error'
        
        // Handle specific Gemini errors
        if (errorMessage.includes('User location is not supported')) {
          errorMessage = 'Gemini API not available in your region'
        } else if (errorMessage.includes('quota') || errorMessage.includes('429')) {
          errorMessage = 'Gemini API quota exceeded. Try again later.'
        } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          errorMessage = 'Gemini model not found'
        }
        
        setGeminiStatus(`⚠️ Gemini API issue: ${errorMessage}`)
        toast({
          title: "Gemini API Issue",
          description: `${errorMessage}. App will use fallback mode.`,
          variant: "default"
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Test failed'
      setGeminiStatus(`❌ Test failed: ${errorMessage}`)
      toast({
        title: "Gemini Test Failed",
        description: "API endpoint not available. App will use fallback mode.",
        variant: "default"
      })
    } finally {
      setIsTestingGemini(false)
    }
  }

  const handlePlayPreview = (trackId: string, previewUrl: string | null) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null)
      return
    }

    if (previewUrl) {
      const audio = new Audio(previewUrl)
      audio.play()
      setCurrentlyPlaying(trackId)
      
      audio.onended = () => {
        setCurrentlyPlaying(null)
      }
    } else {
      toast({
        title: "Preview not available",
        description: "This track doesn't have a preview available.",
        variant: "destructive"
      })
    }
  }

  const handleSpotifyAuth = async () => {
    setIsAuthenticating(true)
    
    try {
      // First, get the authorization URL
      const response = await fetch('/api/spotify-auth')
      const data = await response.json()
      
      if (data.authUrl) {
        // Open the Spotify authorization URL in a new window
        const width = 500
        const height = 600
        const left = (window.innerWidth - width) / 2
        const top = (window.innerHeight - height) / 2
        
        window.open(
          data.authUrl,
          'Spotify Authorization',
          `width=${width},height=${height},left=${left},top=${top}`
        )
        
        // Listen for the message from the popup
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
            setSpotifyAccessToken(event.data.accessToken)
            window.removeEventListener('message', handleMessage)
            toast({
              title: "Spotify Connected!",
              description: "You can now create real playlists.",
            })
          } else if (event.data.type === 'SPOTIFY_AUTH_ERROR') {
            window.removeEventListener('message', handleMessage)
            toast({
              title: "Authentication Failed",
              description: event.data.error || "Failed to connect to Spotify.",
              variant: "destructive"
            })
          }
        }
        
        window.addEventListener('message', handleMessage)
      } else {
        throw new Error(data.error || 'Failed to get authorization URL')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleCreatePlaylist = async () => {
    if (!playlist) {
      toast({
        title: "No Playlist",
        description: "Please generate a playlist first.",
        variant: "destructive"
      })
      return
    }

    setIsCreatingPlaylist(true)
    
    try {
      const trackIds = playlist.tracks.map(track => track.id)
      const response = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlist.name,
          description: playlist.description,
          trackIds,
          accessToken: spotifyAccessToken
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create playlist')
      }

      setPlaylist(data.playlist)
      
      if (data.isRealPlaylist) {
        toast({
          title: "Playlist Created!",
          description: "Your playlist has been added to your Spotify library.",
        })
      } else {
        toast({
          title: "Demo Playlist",
          description: data.message || "Connect Spotify to create real playlists.",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create playlist'
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsCreatingPlaylist(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        <ThemeAwareBackground />
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            {/* Header with Theme Switcher */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <ThemeSwitcher />
              </div>
            </div>
            
            {/* Main Title Section */}
            <div className="text-center mb-12 relative">
              <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="relative">
                    <MainIcon className={`h-14 w-14 text-${currentTheme.primaryColor}-500 animate-pulse`} />
                    <div className={`absolute inset-0 bg-${currentTheme.primaryColor}-500 rounded-full blur-lg opacity-50 animate-pulse`}></div>
                  </div>
                  <div className={`absolute -top-1 -right-1 w-4 h-4 bg-${currentTheme.primaryColor}-500 rounded-full animate-ping`} />
                  <AccentIcon className={`absolute -bottom-1 -right-1 h-5 w-5 text-${currentTheme.secondaryColor}-400 animate-pulse`} />
                </div>
                <div className="text-left">
                  <h1 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent animate-gradient`}>
                    {currentTheme.name}
                  </h1>
                  <div className={`text-lg md:text-xl font-medium bg-gradient-to-r ${currentTheme.subGradient} bg-clip-text text-transparent`}>
                    {currentTheme.subtitle}
                  </div>
                </div>
              </div>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {currentTheme.description.split('with ')[0]}<span className={`text-${currentTheme.emotionColor}-400 font-medium`}> emotions</span> {currentTheme.description.includes('cosmic') ? 'into cosmic soundscapes with' : 'into sonic landscapes with'} 
                <span className={`text-${currentTheme.intelligenceColor}-400 font-medium`}> {currentTheme.description.includes('solar-powered') ? 'solar-powered' : 'intelligent'} musical intelligence</span>
              </p>
            </div>
          </div>

          {/* Mood Input Section */}
          <Card className={`max-w-2xl mx-auto mb-8 bg-gray-900/80 border-gray-800 backdrop-blur-sm shadow-2xl hover:shadow-${currentTheme.shadowColor}/10 transition-all duration-300`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-white text-xl">
                <div className="relative">
                  <Star className={`h-6 w-6 text-${currentTheme.primaryColor}-500`} />
                  <div className={`absolute -top-1 -right-1 w-2 h-2 bg-${currentTheme.primaryColor}-400 rounded-full animate-pulse`} />
                </div>
                What's your {currentTheme.vibeQuestion}?
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Describe your emotional state, activity, or desired atmosphere
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Test Section */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestSpotify}
                    disabled={isTesting}
                    className={`flex items-center gap-2 border-${currentTheme.borderColor}/30 text-${currentTheme.primaryColor}-400 hover:bg-${currentTheme.primaryColor}-500/10 hover:border-${currentTheme.borderColor} hover:text-${currentTheme.primaryColor}-300 transition-all duration-200 backdrop-blur-sm`}
                  >
                    {isTesting ? (
                      <div className={`animate-spin h-4 w-4 border-2 border-${currentTheme.primaryColor}-400 border-t-transparent rounded-full`} />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                    <span className="font-medium">Test Spotify</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestGemini}
                    disabled={isTestingGemini}
                    className={`flex items-center gap-2 border-${currentTheme.testBorderColor}/30 text-${currentTheme.secondaryColor}-400 hover:bg-${currentTheme.testBorderColor}-500/10 hover:border-${currentTheme.testBorderColor} hover:text-${currentTheme.secondaryColor}-300 transition-all duration-200 backdrop-blur-sm`}
                  >
                    {isTestingGemini ? (
                      <div className={`animate-spin h-4 w-4 border-2 border-${currentTheme.testBorderColor}-400 border-t-transparent rounded-full`} />
                    ) : (
                      <Brain className="h-4 w-4" />
                    )}
                    <span className="font-medium">Test {currentTheme.testCore}</span>
                  </Button>
                </div>
                
                {(spotifyStatus || geminiStatus) && (
                  <div className="space-y-2">
                    {spotifyStatus && (
                      <div className={`flex items-center gap-2 p-3 bg-${currentTheme.statusBgColor}/10 border border-${currentTheme.statusBorderColor}/20 rounded-lg`}>
                        <div className={`w-2 h-2 bg-${currentTheme.primaryColor}-500 rounded-full animate-pulse`} />
                        <span className={`text-${currentTheme.primaryColor}-400 text-sm font-medium`}>{spotifyStatus}</span>
                      </div>
                    )}
                    {geminiStatus && (
                      <div className={`flex items-center gap-2 p-3 bg-${currentTheme.geminiStatusBgColor}/10 border border-${currentTheme.geminiStatusBorderColor}/20 rounded-lg`}>
                        <div className={`w-2 h-2 bg-${currentTheme.secondaryColor}-500 rounded-full animate-pulse`} />
                        <span className={`text-${currentTheme.secondaryColor}-400 text-sm font-medium`}>{geminiStatus}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <Textarea
                placeholder="e.g., I need high-energy music for an intense workout session, or I want ambient sounds for deep focus..."
                value={moodInput}
                onChange={(e) => setMoodInput(e.target.value)}
                className={`min-h-[120px] resize-none bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-${currentTheme.focusBorderColor} focus:ring-2 focus:ring-${currentTheme.focusRingColor}/20 backdrop-blur-sm transition-all duration-200`}
              />
              <Button 
                onClick={handleGeneratePlaylist} 
                disabled={isLoading || !moodInput.trim()}
                className={`w-full bg-gradient-to-r ${currentTheme.buttonGradient} ${currentTheme.hoverButtonGradient} text-black font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-${currentTheme.shadowColor}/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
                    <span>Curating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5" />
                    <span>Generate Vibe</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert className="max-w-2xl mx-auto mb-8 border-red-800 bg-red-900/20">
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <Card className="max-w-2xl mx-auto mb-8 bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <LoadingSpinner />
                    <p className="text-sm text-gray-400 mt-4">
                      AI is interpreting your mood and finding the perfect tracks...
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded bg-gray-800" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4 bg-gray-800" />
                            <Skeleton className="h-3 w-1/2 bg-gray-800" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Playlist Display */}
          {playlist && (
            <Card className="max-w-4xl mx-auto bg-gray-900/80 border-gray-800 backdrop-blur-sm shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <CardTitle className="text-2xl text-white">{playlist.name}</CardTitle>
                      {isDemo && (
                        <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                          Demo Mode
                        </Badge>
                      )}
                      {usingFallbackAI && (
                        <Badge variant="outline" className="text-xs border-orange-700 text-orange-300 bg-orange-500/10">
                          Fallback AI
                        </Badge>
                      )}
                      {playlist.isRealPlaylist && (
                        <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                          Real Playlist
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2 text-gray-400 text-base">{playlist.description}</CardDescription>
                    {demoMessage && (
                      <Alert className="mt-3 border-blue-800 bg-blue-900/20">
                        <AlertDescription className="text-blue-200 text-sm">
                          {demoMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                    {usingFallbackAI && (
                      <Alert className="mt-3 border-orange-800 bg-orange-900/20">
                        <AlertDescription className="text-orange-200 text-sm">
                          AI service is currently unavailable. Using keyword extraction instead.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!spotifyAccessToken && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleSpotifyAuth}
                        disabled={isAuthenticating}
                        className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {isAuthenticating ? (
                          <LoadingSpinner />
                        ) : (
                          <LogIn className="h-4 w-4" />
                        )}
                        Connect Spotify
                      </Button>
                    )}
                    
                    {playlist && !playlist.isRealPlaylist && spotifyAccessToken && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={handleCreatePlaylist}
                        disabled={isCreatingPlaylist}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold"
                      >
                        {isCreatingPlaylist ? (
                          <LoadingSpinner />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save to Spotify
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(playlist.externalUrl, '_blank')}
                      className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Spotify
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playlist.tracks.map((track, index) => (
                    <div 
                      key={track.id}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-all duration-200 group hover:scale-[1.02] hover:shadow-lg"
                    >
                      <div className="text-sm text-gray-500 w-8 font-medium">
                        {index + 1}
                      </div>
                      <div className="relative">
                        <img
                          src={track.imageUrl}
                          alt={`${track.album} cover`}
                          className="w-12 h-12 rounded-lg object-cover shadow-md group-hover:shadow-green-500/20 transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-white truncate group-hover:text-green-400 transition-colors duration-200">
                          {track.name}
                        </h4>
                        <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-200">
                          {track.artist}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlayPreview(track.id, track.previewUrl)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          {currentlyPlaying === track.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(track.externalUrl, '_blank')}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Vibes */}
          {!playlist && !isLoading && (
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-lg font-semibold mb-6 text-center text-white">
                Explore these vibes:
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "High-energy cyberpunk workout",
                  "Neo-noir late night focus session",
                  "Euphoric sunrise festival vibes",
                  "Dystopian ambient meditation",
                  "Neon-lit city drive soundtrack",
                  "Quantum deep study flow",
                  "Synthwave dance revolution",
                  "Cosmic chill space lounge"
                ].map((example, index) => (
                  <Badge
                    key={example}
                    variant="secondary"
                    className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    index % 4 === 0 
                      ? currentTheme.badgeColors[0]
                      : index % 4 === 1 
                      ? currentTheme.badgeColors[1]
                      : index % 4 === 2
                      ? currentTheme.badgeColors[2]
                      : currentTheme.badgeColors[3]
                  }`}
                    onClick={() => setMoodInput(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ErrorBoundary>
  )
}