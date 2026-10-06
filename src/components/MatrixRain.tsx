import { useEffect, useRef } from 'react'
import type { Theme } from '../hooks/useTheme'

const glyphs = '01アイウエオカキクケコサシスセソTEMPO{}[]<>/\\'

/** Fondo decorativo inspirado en Matrix, aislado del contenido interactivo. */
export function MatrixRain({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const fontSize = 17
    let columns = 0
    let drops: number[] = []

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      columns = Math.ceil(window.innerWidth / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -35)
    }

    const draw = () => {
      context.fillStyle = theme === 'dark' ? 'rgba(3, 8, 6, .09)' : 'rgba(245, 250, 247, .14)'
      context.fillRect(0, 0, window.innerWidth, window.innerHeight)
      context.fillStyle = theme === 'dark' ? '#35f58a' : '#0a9f55'
      context.font = `500 ${fontSize - 4}px monospace`

      drops.forEach((drop, index) => {
        const character = glyphs[Math.floor(Math.random() * glyphs.length)]
        context.fillText(character, index * fontSize, drop * fontSize)
        if (drop * fontSize > window.innerHeight && Math.random() > 0.975) drops[index] = 0
        else drops[index] = drop + 0.55
      })
    }

    resize()
    window.addEventListener('resize', resize)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    draw()
    const intervalId = reducedMotion ? undefined : window.setInterval(draw, 55)
    return () => {
      if (intervalId) window.clearInterval(intervalId)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  return <canvas aria-hidden="true" className="matrix-rain" ref={canvasRef} />
}
