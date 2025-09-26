'use client'

import { useEffect, useRef } from 'react'

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)

  // Solar harmonics color palette - warm cosmic theme
  const colors = [
    '#FF6B35', // Sunset orange
    '#F7931E', // Golden yellow
    '#E74C3C', // Deep coral
    '#FF8C42', // Light orange
    '#FFD700', // Bright gold
  ]

  // Solar blob class
  class SolarBlob {
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
      this.driftSpeedX = 0.2 + Math.random() * 0.3 // Slower, more cosmic movement
      this.driftSpeedY = 0.15 + Math.random() * 0.25
    }

    update() {
      const time = Date.now() * 0.00008 // Even slower for cosmic feel
      
      // Gentle pulsing effect like solar flares
      const pulse = Math.sin(time + this.phase) * 0.015
      this.size = this.size * (1 + pulse * 0.08)

      // Cosmic drift movement
      this.targetX = this.originalX + Math.sin(time * this.driftSpeedX + this.phase) * 40
      this.targetY = this.originalY + Math.cos(time * this.driftSpeedY + this.phase) * 35

      // Smooth, ethereal movement
      this.x += (this.targetX - this.x) * 0.015
      this.y += (this.targetY - this.y) * 0.015
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save()
      
      // Solar gradient effect
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      )
      
      gradient.addColorStop(0, this.color + '90') // Bright, warm center
      gradient.addColorStop(0.4, this.color + '60') // Warm mid-zone
      gradient.addColorStop(0.7, this.color + '30') // Soft edge
      gradient.addColorStop(1, this.color + '00') // Transparent edge

      ctx.fillStyle = gradient
      
      // Draw a simple circle
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

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create solar blobs with cosmic positioning
    const blobs: SolarBlob[] = []
    const numBlobs = 6 // A few more for solar richness

    for (let i = 0; i < numBlobs; i++) {
      // Position blobs in a pleasing arrangement
      const angle = (i / numBlobs) * Math.PI * 2
      const radius = Math.min(canvas.width, canvas.height) * 0.2
      const x = canvas.width / 2 + Math.cos(angle) * radius
      const y = canvas.height / 2 + Math.sin(angle) * radius
      const size = Math.random() * 120 + 180 // Large, solar-sized blobs
      const color = colors[i % colors.length]
      blobs.push(new SolarBlob(x, y, size, color))
    }

    // Animation loop
    const animate = (currentTime: number) => {
      // Limit to ~30 FPS
      if (currentTime - lastTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTimeRef.current = currentTime

      // Clear canvas with cosmic background
      ctx.fillStyle = '#0a0f1c'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw blobs
      blobs.forEach(blob => {
        blob.update()
        blob.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: 'linear-gradient(135deg, #0a0f1c 0%, #1a1f3a 30%, #2d1b69 70%, #0f1419 100%)'
      }}
    />
  )
}