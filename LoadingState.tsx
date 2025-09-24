import { useState, useEffect } from 'react'
import LoadingState from '../LoadingState'

export default function LoadingStateExample() {
  const [stage, setStage] = useState<'analyzing' | 'searching' | 'generating'>('analyzing')
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStage(current => {
        switch (current) {
          case 'analyzing': return 'searching'
          case 'searching': return 'generating'  
          case 'generating': return 'analyzing'
          default: return 'analyzing'
        }
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8 bg-background min-h-screen">
      <LoadingState stage={stage} />
    </div>
  )
}