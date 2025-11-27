import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

interface NeumorphicSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function NeumorphicSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: NeumorphicSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percentage = x / rect.width
    const rawValue = min + percentage * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))

    onChange(clampedValue)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleMove(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("mouseup", handleEnd)
      document.addEventListener("touchend", handleEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging])

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={trackRef}
        className="neumorphic-slider-track relative h-3 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className="neumorphic-slider-fill absolute h-full rounded-full transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="neumorphic-slider-thumb absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full cursor-grab active:cursor-grabbing transition-all"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
