import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  const isLightTheme = document.documentElement.classList.contains('light-theme')
  
  return (
    <Card 
      className="overflow-hidden relative neumorphic-raised"
      style={{
        background: isLightTheme 
          ? 'linear-gradient(145deg, oklch(0.95 0.010 60 / 0.98), oklch(0.92 0.012 60 / 0.95))'
          : 'linear-gradient(145deg, oklch(0.18 0.04 250 / 0.95), oklch(0.14 0.03 250 / 0.9))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isLightTheme
          ? '12px 12px 24px oklch(0.68 0.022 60 / 0.4), -6px -6px 16px oklch(0.96 0.008 60 / 0.7), inset 0 1px 0 oklch(1 0 0 / 0.8)'
          : '8px 8px 16px oklch(0.06 0.01 250 / 0.5), -4px -4px 12px oklch(0.22 0.04 250 / 0.3), inset 0 1px 0 oklch(0.95 0 0 / 0.08)',
      }}
    >
      <div className="flex gap-4 p-4 relative z-10">
        <Skeleton 
          className="w-24 h-24 flex-shrink-0 rounded-lg neumorphic-inset"
          style={{
            boxShadow: isLightTheme
              ? 'inset 8px 8px 16px oklch(0.68 0.022 60 / 0.5), inset -6px -6px 12px oklch(0.96 0.008 60 / 0.7)'
              : 'inset 6px 6px 12px oklch(0.06 0.01 250 / 0.6), inset -4px -4px 8px oklch(0.20 0.04 250 / 0.4)'
          }}
        />

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-lg" />
          </div>

          <div className="flex items-baseline gap-2.5">
            <Skeleton className="h-7 w-24" />
          </div>

          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </Card>
  )
}
