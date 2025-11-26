import { House, Package, User, Gear } from '@phosphor-icons/react'

interface BottomNavProps {
  active: 'watchlist' | 'products' | 'profile' | 'settings'
  onNavigate: (screen: 'watchlist' | 'products' | 'profile' | 'settings') => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
      <div className="mx-auto max-w-[430px] px-4">
        <nav className="flex items-center justify-around h-16">
          <button
            onClick={() => onNavigate('watchlist')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              active === 'watchlist'
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <House className="w-6 h-6" weight={active === 'watchlist' ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              active === 'products'
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="w-6 h-6" weight={active === 'products' ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">Products</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              active === 'profile'
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-6 h-6" weight={active === 'profile' ? 'fill' : 'regular'} />
            <span className="text-xs font-medium">Profile</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              active === 'settings'
                ? 'text-accent'
                : 'text-muted-foreground hover:text-foreground'
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
