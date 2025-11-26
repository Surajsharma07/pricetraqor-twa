import { House, User, Gear } from '@phosphor-icons/react'

interface BottomNavProps {
  active: 'watchlist' | 'profile' | 'settings'
  onNavigate: (screen: 'watchlist' | 'profile' | 'settings') => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/98 to-card/95 border-t border-border/60 safe-area-bottom shadow-[0_-12px_48px_rgba(0,0,0,0.35),0_-4px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="mx-auto max-w-[430px] px-6">
        <nav className="flex items-center justify-around h-20">
          <button
            onClick={() => onNavigate('watchlist')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
              active === 'watchlist'
                ? 'text-accent shadow-[inset_0_4px_16px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.1)] bg-gradient-to-b from-accent/20 via-accent/10 to-accent/5 scale-95 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-accent/20 before:via-transparent before:to-transparent'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_6px_16px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] bg-gradient-to-b from-secondary/70 via-secondary/60 to-secondary/50 hover:from-secondary/90 hover:via-secondary/80 hover:to-secondary/70 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.25)] active:shadow-[inset_0_4px_16px_rgba(0,0,0,0.35),inset_0_-1px_2px_rgba(255,255,255,0.05)] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
            }`}
          >
            <House className="w-7 h-7 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" weight={active === 'watchlist' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Home</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
              active === 'profile'
                ? 'text-accent shadow-[inset_0_4px_16px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.1)] bg-gradient-to-b from-accent/20 via-accent/10 to-accent/5 scale-95 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-accent/20 before:via-transparent before:to-transparent'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_6px_16px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] bg-gradient-to-b from-secondary/70 via-secondary/60 to-secondary/50 hover:from-secondary/90 hover:via-secondary/80 hover:to-secondary/70 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.25)] active:shadow-[inset_0_4px_16px_rgba(0,0,0,0.35),inset_0_-1px_2px_rgba(255,255,255,0.05)] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
            }`}
          >
            <User className="w-7 h-7 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" weight={active === 'profile' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Profile</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
              active === 'settings'
                ? 'text-accent shadow-[inset_0_4px_16px_rgba(0,0,0,0.4),inset_0_-2px_4px_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.1)] bg-gradient-to-b from-accent/20 via-accent/10 to-accent/5 scale-95 before:absolute before:inset-0 before:bg-gradient-to-tr before:from-accent/20 before:via-transparent before:to-transparent'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_6px_16px_rgba(0,0,0,0.2),0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] bg-gradient-to-b from-secondary/70 via-secondary/60 to-secondary/50 hover:from-secondary/90 hover:via-secondary/80 hover:to-secondary/70 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25),0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.25)] active:shadow-[inset_0_4px_16px_rgba(0,0,0,0.35),inset_0_-1px_2px_rgba(255,255,255,0.05)] before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/5 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity'
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
