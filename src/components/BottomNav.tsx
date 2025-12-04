import { useRef, useEffect } from 'react'
import { House, User, Gear, Bell } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface BottomNavProps {
  active: 'watchlist' | 'profile' | 'settings' | 'notifications'
  onNavigate: (screen: 'watchlist' | 'profile' | 'settings' | 'notifications') => void
  notificationCount?: number
}

export function BottomNav({ active, onNavigate, notificationCount = 0 }: BottomNavProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const isLightTheme = document.documentElement.classList.contains('light-theme')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return
      const isLight = document.documentElement.classList.contains('light-theme')
      
      const rect = navRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const angle = Math.atan2(deltaY, deltaX)
      const maxOffset = 2
      const detectionRadius = rect.width * 1.5
      const distance = Math.min(maxOffset, Math.sqrt(deltaX ** 2 + deltaY ** 2) / detectionRadius * maxOffset)
      const offsetX = Math.cos(angle) * distance
      const offsetY = Math.sin(angle) * distance
      
      navRef.current.style.boxShadow = isLight
        ? `
          ${-offsetX * 4}px ${-offsetY * 4}px 12px oklch(0.68 0.022 60 / 0.4),
          ${offsetX * 3}px ${offsetY * 3}px 8px oklch(0.96 0.008 60 / 0.5),
          inset 0 1px 0 oklch(1 0 0 / 0.7),
          0 -4px 16px oklch(0 0 0 / 0.2)
        `
        : `
          ${-offsetX * 3}px ${-offsetY * 3}px 8px oklch(0.06 0.01 250 / 0.6),
          ${offsetX * 2}px ${offsetY * 2}px 6px oklch(0.22 0.04 250 / 0.3),
          inset 0 1px 0 oklch(0.95 0 0 / 0.06),
          0 -4px 16px oklch(0 0 0 / 0.4)
        `
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 safe-area-bottom backdrop-blur-3xl">
      <div 
        ref={navRef}
        className="mx-auto max-w-[430px] px-4 pb-2 pt-1 neumorphic-raised border-t transition-shadow duration-300"
        style={{
          background: isLightTheme
            ? 'linear-gradient(145deg, oklch(0.94 0.010 60 / 0.98), oklch(0.90 0.012 60 / 0.98))'
            : 'linear-gradient(145deg, oklch(0.16 0.03 250 / 0.95), oklch(0.12 0.025 250 / 0.95))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderTopColor: isLightTheme ? 'oklch(0.78 0.018 60 / 0.3)' : 'oklch(0.95 0 0 / 0.05)',
        }}
      >
        <nav className="flex items-center justify-around h-18">
          <button
            onClick={() => onNavigate('watchlist')}
            className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all duration-200 relative overflow-hidden group ${
              active === 'watchlist'
                ? 'text-accent scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95'
            }`}
          >
            <div className={`relative transition-all duration-200 ${
              active === 'watchlist' 
                ? 'neumorphic-inset w-14 h-14 rounded-full flex items-center justify-center glow-accent' 
                : 'neumorphic-button w-12 h-12 rounded-full flex items-center justify-center group-hover:glow-accent group-hover:w-14 group-hover:h-14'
            }`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <House className={`relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 ${
                active === 'watchlist' ? 'w-7 h-7' : 'w-6 h-6 group-hover:w-7 group-hover:h-7'
              }`} weight={active === 'watchlist' ? 'fill' : 'regular'} />
            </div>
            <span className="text-[10px] font-bold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all duration-200 relative overflow-hidden group ${
              active === 'profile'
                ? 'text-accent scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95'
            }`}
          >
            <div className={`relative transition-all duration-200 ${
              active === 'profile' 
                ? 'neumorphic-inset w-14 h-14 rounded-full flex items-center justify-center glow-accent' 
                : 'neumorphic-button w-12 h-12 rounded-full flex items-center justify-center group-hover:glow-accent group-hover:w-14 group-hover:h-14'
            }`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <User className={`relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 ${
                active === 'profile' ? 'w-7 h-7' : 'w-6 h-6 group-hover:w-7 group-hover:h-7'
              }`} weight={active === 'profile' ? 'fill' : 'regular'} />
            </div>
            <span className="text-[10px] font-bold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] mt-0.5">Profile</span>
          </button>

          <button
            onClick={() => onNavigate('notifications')}
            className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all duration-200 relative overflow-hidden group ${
              active === 'notifications'
                ? 'text-accent scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95'
            }`}
          >
            <div className={`relative transition-all duration-200 ${
              active === 'notifications' 
                ? 'neumorphic-inset w-14 h-14 rounded-full flex items-center justify-center glow-accent' 
                : 'neumorphic-button w-12 h-12 rounded-full flex items-center justify-center group-hover:glow-accent group-hover:w-14 group-hover:h-14'
            }`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <Bell className={`relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 ${
                active === 'notifications' ? 'w-7 h-7' : 'w-6 h-6 group-hover:w-7 group-hover:h-7'
              }`} weight={active === 'notifications' ? 'fill' : 'regular'} />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 z-20">
                  <Badge variant="destructive" className="h-5 min-w-5 px-1 text-[10px] font-bold rounded-full">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Badge>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] mt-0.5">Alerts</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all duration-200 relative overflow-hidden group ${
              active === 'settings'
                ? 'text-accent scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95'
            }`}
          >
            <div className={`relative transition-all duration-200 ${
              active === 'settings' 
                ? 'neumorphic-inset w-14 h-14 rounded-full flex items-center justify-center glow-accent' 
                : 'neumorphic-button w-12 h-12 rounded-full flex items-center justify-center group-hover:glow-accent group-hover:w-14 group-hover:h-14'
            }`}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <Gear className={`relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 ${
                active === 'settings' ? 'w-7 h-7' : 'w-6 h-6 group-hover:w-7 group-hover:h-7'
              }`} weight={active === 'settings' ? 'fill' : 'regular'} />
            </div>
            <span className="text-[10px] font-bold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] mt-0.5">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
