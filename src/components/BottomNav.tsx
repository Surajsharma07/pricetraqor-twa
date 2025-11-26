import { House, User, Gear } from '@phosphor-icons/react'

interface BottomNavProps {
  active: 'watchlist' | 'profile' | 'settings'
  onNavigate: (screen: 'watchlist' | 'profile' | 'settings') => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-overlay border-t border-white/10 safe-area-bottom backdrop-blur-3xl">
      <div className="mx-auto max-w-[430px] px-6">
        <nav className="flex items-center justify-around h-20">
          <button
            onClick={() => onNavigate('watchlist')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
              active === 'watchlist'
                ? 'text-accent neumorphic-inset scale-95 glow-accent before:absolute before:inset-0 before:bg-gradient-to-tr before:from-accent/20 before:via-transparent before:to-transparent'
                : 'text-muted-foreground hover:text-foreground active:scale-95 neumorphic-button hover:glow-accent before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
            }`}
          >
            <House className="w-7 h-7 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" weight={active === 'watchlist' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Home</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
              active === 'profile'
                ? 'text-accent neumorphic-inset scale-95 glow-accent before:absolute before:inset-0 before:bg-gradient-to-tr before:from-accent/20 before:via-transparent before:to-transparent'
                : 'text-muted-foreground hover:text-foreground active:scale-95 neumorphic-button hover:glow-accent before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
            }`}
          >
            <User className="w-7 h-7 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" weight={active === 'profile' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Profile</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
              active === 'settings'
                ? 'text-accent neumorphic-inset scale-95 glow-accent before:absolute before:inset-0 before:bg-gradient-to-tr before:from-accent/20 before:via-transparent before:to-transparent'
                : 'text-muted-foreground hover:text-foreground active:scale-95 neumorphic-button hover:glow-accent before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
            }`}
          >
            <Gear className="w-7 h-7 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" weight={active === 'settings' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
