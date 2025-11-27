import { useEffect, useRef } from 'react'

interface LampSwitchProps {
  onToggle: () => void
  isLight: boolean
}

export function LampSwitch({ onToggle, isLight }: LampSwitchProps) {
  const switchRef = useRef<HTMLButtonElement>(null)

  const handlePull = () => {
    if (switchRef.current) {
      switchRef.current.classList.add('is-pulled')
      onToggle()
      
      setTimeout(() => {
        switchRef.current?.classList.remove('is-pulled')
      }, 180)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePull()
    }
  }

  return (
    <button
      ref={switchRef}
      type="button"
      className="lamp-switch"
      aria-label="Toggle theme"
      aria-pressed={isLight}
      data-theme={isLight ? 'light' : 'dark'}
      onClick={handlePull}
      onKeyDown={handleKeyDown}
    >
      <div className="lamp-rope">
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        <span className="lamp-bead"></span>
        
        <span className="lamp-bulb"></span>
      </div>
    </button>
  )
}
