'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeAwareBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const { theme } = useTheme()

  // Solar harmonics color palette
  const solarColors = [
    '#FF6B35', // Sunset orange
    '#F7931E', // Golden yellow
    '#E74C3C', // Deep coral
    '#FF8C42', // Light orange
    '#FFD700', // Bright gold
  ]

  // VibeSync color palette
  const vibesyncColors = [
    '#4c1d95', // Deep purple
    '#5b21b6', // Medium purple
    '#6d28d9', // Bright purple
    '#0891b2', // Cyan
    '#06b6d4', // Bright cyan
  ]

  // Get current theme colors
  const getCurrentColors = () => {
    if (!theme || theme.includes('solar')) {
      return solarColors
    } else {
      return vibesyncColors
    }
  }

  // Get current background gradient
  const getCurrentBackground = () => {
    if (!theme || theme.includes('solar')) {
      return theme?.includes('light') 
        ? 'linear-gradient(135deg, #FFF5EB 0%, #FFE4CC 30%, #FFD4A3 70%, #FFF0DB 100%)'
        : 'linear-gradient(135deg, #0a0f1c 0%, #1a1f3a 30%, #2d1b69 70%, #0f1419 100%)'
    } else {
      return theme?.includes('light')
        ? 'linear-gradient(135deg, #F8F9FF 0%, #E8F2FF 30%, #DBE9FF 70%, #F0F4FF 100%)'
        : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }
  }

  class ThemeBlob {
    x: number
    y: number
    size: number
    color: string
    originalX: number
    originalY: number
    phase: number
    targetX: number
    targetY: number
    driftSpeedX: number
    driftSpeedY: number

    constructor(x: number, y: number, size: number, color: string) {
      this.x = x
      this.y = y
      this.originalX = x
      this.originalY = y
      this.targetX = x
      this.targetY = y
      this.size = size
      this.color = color
      this.phase = Math.random() * Math.PI * 2
      this.driftSpeedX = 0.2 + Math.random() * 0.3
      this.driftSpeedY = 0.15 + Math.random() * 0.25
    }

    update() {
      const time = Date.now() * 0.00008
      
      const pulse = Math.sin(time + this.phase) * 0.015
      this.size = this.size * (1 + pulse * 0.08)

      this.targetX = this.originalX + Math.sin(time * this.driftSpeedX + this.phase) * 40
      this.targetY = this.originalY + Math.cos(time * this.driftSpeedY + this.phase) * 35

      this.x += (this.targetX - this.x) * 0.015
      this.y += (this.targetY - this.y) * 0.015
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save()
      
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      )
      
      gradient.addColorStop(0, this.color + '90')
      gradient.addColorStop(0.4, this.color + '60')
      gradient.addColorStop(0.7, this.color + '30')
      gradient.addColorStop(1, this.color + '00')

      ctx.fillStyle = gradient
      
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let blobs: ThemeBlob[] = []

    const createBlobs = () => {
      const colors = getCurrentColors()
      const numBlobs = theme?.includes('solar') ? 6 : 5
      
      blobs = []
      for (let i = 0; i < numBlobs; i++) {
        const angle = (i / numBlobs) * Math.PI * 2
        const radius = Math.min(canvas.width, canvas.height) * 0.2
        const x = canvas.width / 2 + Math.cos(angle) * radius
        const y = canvas.height / 2 + Math.sin(angle) * radius
        const size = Math.random() * 120 + 180
        const color = colors[i % colors.length]
        blobs.push(new ThemeBlob(x, y, size, color))
      }
    }

    createBlobs()

    const animate = (currentTime: number) => {
      if (currentTime - lastTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTimeRef.current = currentTime

      const isLightTheme = theme?.includes('light')
      ctx.fillStyle = isLightTheme ? '#ffffff' : (theme?.includes('solar') ? '#0a0f1c' : '#0a0a0a')
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      blobs.forEach(blob => {
        blob.update()
        blob.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-all duration-300"
      style={{ 
        background: getCurrentBackground()
      }}
    />
  )
}