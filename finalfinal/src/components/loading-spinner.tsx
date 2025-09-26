import { Loader2, Music } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Loader2 className="h-6 w-6 animate-spin text-green-500" />
      <Music className="h-6 w-6 text-green-500 animate-pulse" />
      <Loader2 className="h-6 w-6 animate-spin text-green-500" />
    </div>
  )
}