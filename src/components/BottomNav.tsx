import { House, Package, User, Gear } from '@phosphor-icons/react'

interface BottomNavProps {
  active: 'watchlist' | 'products' | 'profile' | 'settings'
  onNavigate: (screen: 'watchlist' | 'products' | 'profile' | 'settings') => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-card/95 to-card border-t border-border/50 safe-area-bottom shadow-[0_-4px_16px_rgba(0,0,0,0.15)] backdrop-blur-sm">
      <div className="mx-auto max-w-[430px] px-4">
        <nav className="flex items-center justify-around h-16">
          <button
            onClick={() => onNavigate('watchlist')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              active === 'watchlist'
                ? 'text-accent shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] bg-accent/10 scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-gradient-to-b from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50'
            }`}
          >
            <House className="w-6 h-6" weight={active === 'watchlist' ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              active === 'products'
                ? 'text-accent shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] bg-accent/10 scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-gradient-to-b from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50'
            }`}
          >
            <Package className="w-6 h-6" weight={active === 'products' ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">Products</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              active === 'profile'
                ? 'text-accent shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] bg-accent/10 scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-gradient-to-b from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50'
            }`}
          >
            <User className="w-6 h-6" weight={active === 'profile' ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">Profile</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              active === 'settings'
                ? 'text-accent shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] bg-accent/10 scale-95'
                : 'text-muted-foreground hover:text-foreground active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-gradient-to-b from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50'
            }`}
          >
            <Gear className="w-6 h-6" weight={active === 'settings' ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
