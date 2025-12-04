import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-48" />
      </div>

      <Card className="overflow-hidden glass-card">
        <div className="aspect-square w-full frosted-glass flex items-center justify-center neumorphic-inset relative">
          <Skeleton className="w-full h-full" />
        </div>
        
        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          </div>

          <div className="border-t border-border/50" />

          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-36 mt-1.5" />
          </div>

          <div className="border-t border-border/50" />

          <div>
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          <div className="border-t border-border/50" />

          <div>
            <Skeleton className="h-4 w-32 mb-3" />
            <div className="neumorphic-inset p-4 rounded-xl">
              <Skeleton className="w-full h-[200px]" />
            </div>
          </div>
        </div>
      </Card>

      <Skeleton className="w-full h-12 rounded-lg" />

      <div className="flex gap-3">
        <Skeleton className="flex-1 h-12 rounded-lg" />
        <Skeleton className="flex-1 h-12 rounded-lg" />
        <Skeleton className="flex-1 h-12 rounded-lg" />
      </div>
    </div>
  )
}
