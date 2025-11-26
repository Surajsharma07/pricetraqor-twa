import { House, Package, BellRinging, User } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string; weight?: string }>
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: House },
  { id: "products", label: "Products", icon: Package },
  { id: "alerts", label: "Alerts", icon: BellRinging },
  { id: "profile", label: "Profile", icon: User },
]

interface BottomNavProps {
  active: string
  onNavigate: (id: string) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t pb-safe">
      <div className="mx-auto max-w-[430px] px-4">
        <div className="flex items-center justify-around h-[60px]">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-all duration-200",
                  isActive && "skeuo-raised bg-primary/20"
                )}
              >
                <Icon 
                  className={cn(
                    "transition-colors duration-200 w-6 h-6",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                  weight={isActive ? "duotone" : "regular"}
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-accent" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
