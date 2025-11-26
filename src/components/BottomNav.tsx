import { House, User, Gear } from '@phosphor-icons/react'

interface BottomNavProps {
  active: 'watchlist' | 'profile' | 'settings'
  onNavigate: (screen: 'watchlist' | 'profile' | 'settings') => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-card/95 to-card border-t border-border/50 safe-area-bottom shadow-[0_-8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md">
      <div className="mx-auto max-w-[430px] px-6">
        <nav className="flex items-center justify-around h-20">
          <button
            onClick={() => onNavigate('watchlist')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 ${
              active === 'watchlist'
                ? 'text-accent shadow-[inset_0_3px_12px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-accent/15 to-accent/5 scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-secondary/60 to-secondary/40 hover:from-secondary/80 hover:to-secondary/60 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.05)]'
            }`}
          >
            <House className="w-7 h-7" weight={active === 'watchlist' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide">Home</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 ${
              active === 'profile'
                ? 'text-accent shadow-[inset_0_3px_12px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-accent/15 to-accent/5 scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-secondary/60 to-secondary/40 hover:from-secondary/80 hover:to-secondary/60 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.05)]'
            }`}
          >
            <User className="w-7 h-7" weight={active === 'profile' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide">Profile</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl transition-all duration-300 ${
              active === 'settings'
                ? 'text-accent shadow-[inset_0_3px_12px_rgba(0,0,0,0.3),inset_0_-1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-accent/15 to-accent/5 scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.05)] bg-gradient-to-b from-secondary/60 to-secondary/40 hover:from-secondary/80 hover:to-secondary/60 hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.05)]'
            }`}
          >
            <Gear className="w-7 h-7" weight={active === 'settings' ? 'fill' : 'regular'} />
            <span className="text-xs font-semibold tracking-wide">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
