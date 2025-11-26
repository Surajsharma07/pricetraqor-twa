import { ArrowLeft } from "@phosphor-icons/react"
import { InteractiveNav } from "@/components/ui/skeuomorphic-nav"
import { GlowCard } from "@/components/ui/spotlight-card"
import { Button } from "@/components/ui/button"

interface ComponentDemoScreenProps {
  onBack: () => void
}

export function ComponentDemoScreen({ onBack }: ComponentDemoScreenProps) {
  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="max-w-[430px] mx-auto">
        <div className="sticky top-0 z-10 glass-panel border-b px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="glass-panel w-10 h-10 rounded-full flex items-center justify-center skeuo-raised active:skeuo-pressed transition-all duration-150 active:scale-95"
          >
            <ArrowLeft weight="bold" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold">Component Showcase</h1>
            <p className="text-xs text-muted-foreground">Interactive demos</p>
          </div>
        </div>

        <div className="p-4 space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Skeuomorphic Navigation</h2>
              <p className="text-sm text-muted-foreground">Interactive buttons with dynamic lighting effects</p>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel">
              <InteractiveNav />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Spotlight Cards</h2>
              <p className="text-sm text-muted-foreground">Glow cards with cursor-following effects</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 overflow-x-auto pb-2">
                <GlowCard glowColor="blue" size="sm">
                  <div className="flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white">Blue</h3>
                    <p className="text-xs text-white/70">Ocean vibes</p>
                  </div>
                </GlowCard>
                <GlowCard glowColor="purple" size="sm">
                  <div className="flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white">Purple</h3>
                    <p className="text-xs text-white/70">Royal touch</p>
                  </div>
                </GlowCard>
                <GlowCard glowColor="green" size="sm">
                  <div className="flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white">Green</h3>
                    <p className="text-xs text-white/70">Nature fresh</p>
                  </div>
                </GlowCard>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2">
                <GlowCard glowColor="orange" size="sm">
                  <div className="flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white">Orange</h3>
                    <p className="text-xs text-white/70">Warm energy</p>
                  </div>
                </GlowCard>
                <GlowCard glowColor="red" size="sm">
                  <div className="flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white">Red</h3>
                    <p className="text-xs text-white/70">Bold power</p>
                  </div>
                </GlowCard>
              </div>

              <div className="w-full">
                <GlowCard glowColor="purple" customSize width="100%" height="200px">
                  <div className="flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white">Custom Size</h3>
                    <p className="text-sm text-white/70">Fully responsive glow card</p>
                  </div>
                </GlowCard>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={onBack}
              className="w-full h-14 glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-gradient-to-br from-accent/40 to-violet-accent/30 hover:from-accent/50 hover:to-violet-accent/40 border-accent/30 text-base font-semibold"
            >
              Back to App
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
