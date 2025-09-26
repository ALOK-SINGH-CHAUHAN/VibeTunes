'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useToast } from './use-toast'
import InteractiveBackground from './interactive-background'

export default function CallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        if (error) {
          throw new Error(`Spotify authorization failed: ${error}`)
        }

        if (!code) {
          throw new Error('No authorization code received')
        }

        // Exchange the code for an access token
        const response = await fetch(`/api/spotify-auth?code=${encodeURIComponent(code)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to exchange authorization code')
        }

        // Send the access token to the parent window
        window.opener?.postMessage({
          type: 'SPOTIFY_AUTH_SUCCESS',
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn
        }, '*')

        setStatus('success')
        setMessage('Successfully connected to Spotify!')
        
        toast({
          title: "Spotify Connected!",
          description: "You can now create real playlists.",
        })

        // Close the popup after a short delay
        setTimeout(() => {
          window.close()
        }, 2000)

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
        
        // Send error to parent window
        window.opener?.postMessage({
          type: 'SPOTIFY_AUTH_ERROR',
          error: errorMessage
        }, '*')

        setStatus('error')
        setMessage(errorMessage)
        
        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive"
        })

        // Close the popup after a short delay
        setTimeout(() => {
          window.close()
        }, 3000)
      }
    }

    handleCallback()
  }, [toast])

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-gray-900/80 border-gray-800 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && <Loader2 className="h-12 w-12 text-green-500 animate-spin" />}
              {status === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
              {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
            </div>
            <CardTitle className="text-xl text-white">
              {status === 'loading' && 'Connecting to Spotify...'}
              {status === 'success' && 'Successfully Connected!'}
              {status === 'error' && 'Connection Failed'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              This window will close automatically...
            </p>
            <Button 
              onClick={() => window.close()}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Close Window
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}