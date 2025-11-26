import { MagnifyingGlass, Plus, Funnel, Sparkle } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GlowCard } from "@/components/ui/spotlight-card"
import { useState } from "react"

export function ProductsScreen() {
  const [showGlowDemo, setShowGlowDemo] = useState(false)

  const products = [
    {
      id: 1,
      name: "Sony WH-1000XM5 Wireless Headphones",
      currentPrice: 24990,
      lastDrop: 3,
      status: "active",
    },
    {
      id: 2,
      name: "Apple AirPods Pro (2nd Gen)",
      currentPrice: 21990,
      lastDrop: 7,
      status: "active",
    },
    {
      id: 3,
      name: "Samsung Galaxy Buds2 Pro",
      currentPrice: 12990,
      lastDrop: 1,
      status: "muted",
    },
    {
      id: 4,
      name: "JBL Flip 6 Bluetooth Speaker",
      currentPrice: 9999,
      lastDrop: 14,
      status: "active",
    },
    {
      id: 5,
      name: "Bose QuietComfort 45",
      currentPrice: 22900,
      lastDrop: 5,
      status: "active",
    },
    {
      id: 6,
      name: "Anker Soundcore Liberty 3 Pro",
      currentPrice: 8999,
      lastDrop: 2,
      status: "muted",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowGlowDemo(!showGlowDemo)}
            className="glass-panel w-10 h-10 rounded-full flex items-center justify-center skeuo-raised active:skeuo-pressed transition-all duration-150 active:scale-95"
          >
            <Sparkle weight="bold" className={`w-4 h-4 ${showGlowDemo ? 'text-accent' : ''}`} />
          </button>
          <button className="glass-panel w-10 h-10 rounded-full flex items-center justify-center skeuo-raised active:skeuo-pressed transition-all duration-150 active:scale-95">
            <Funnel weight="bold" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <MagnifyingGlass
          weight="bold"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Search products or URLs"
          className="pl-11 h-12 glass-panel skeuo-inset border-input/50 bg-secondary/30 placeholder:text-muted-foreground/50"
        />
      </div>

      {showGlowDemo && (
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max px-2">
            <GlowCard glowColor="blue" size="sm" className="!aspect-[4/3]">
              <div className="flex flex-col justify-end">
                <h3 className="text-sm font-semibold text-white">Blue Glow</h3>
                <p className="text-xs text-white/70">Hover effect demo</p>
              </div>
            </GlowCard>
            <GlowCard glowColor="purple" size="sm" className="!aspect-[4/3]">
              <div className="flex flex-col justify-end">
                <h3 className="text-sm font-semibold text-white">Purple Glow</h3>
                <p className="text-xs text-white/70">Interactive card</p>
              </div>
            </GlowCard>
            <GlowCard glowColor="green" size="sm" className="!aspect-[4/3]">
              <div className="flex flex-col justify-end">
                <h3 className="text-sm font-semibold text-white">Green Glow</h3>
                <p className="text-xs text-white/70">Spotlight effect</p>
              </div>
            </GlowCard>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <Card
            key={product.id}
            className="glass-panel p-4 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(112,172,255,0.15)] transition-all duration-200 active:scale-[0.98] group"
          >
            <div className="space-y-3">
              <h3 className="font-medium text-sm line-clamp-2 leading-snug">
                {product.name}
              </h3>

              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <div className="skeuo-inset px-3 py-1.5 rounded-lg bg-secondary/30 inline-block">
                    <span className="text-lg font-semibold text-numeric">
                      {formatPrice(product.currentPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last drop: {product.lastDrop} {product.lastDrop === 1 ? "day" : "days"} ago
                  </p>
                </div>

                <Badge
                  variant={product.status === "active" ? "default" : "secondary"}
                  className={`text-[10px] ${
                    product.status === "active"
                      ? "bg-accent/20 text-accent border-accent/30 skeuo-raised"
                      : "skeuo-inset"
                  }`}
                >
                  {product.status === "active" ? "Alert active" : "Muted"}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button className="w-full h-14 glass-panel skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-gradient-to-br from-accent/40 to-violet-accent/30 hover:from-accent/50 hover:to-violet-accent/40 border-accent/30 text-base font-semibold">
        <Plus weight="bold" className="w-5 h-5 mr-2" />
        Add new product
      </Button>
    </div>
  )
}
