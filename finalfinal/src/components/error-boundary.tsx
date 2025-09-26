'use client'

import { Component, ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-2xl mx-auto border-red-800 bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-200">
              Something went wrong
            </AlertTitle>
            <AlertDescription className="text-red-300">
              {this.state.error?.message || 'An unexpected error occurred while generating your playlist.'}
            </AlertDescription>
            <div className="mt-4">
              <Button 
                onClick={this.handleReset}
                variant="outline"
                className="border-red-800 text-red-300 hover:bg-red-900/20"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}