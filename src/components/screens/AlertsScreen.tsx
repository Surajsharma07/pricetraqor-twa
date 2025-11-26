import { PencilSimple, Trash } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useKV } from "@github/spark/hooks"

type AlertRule = {
  id: number
  productName: string
  description: string
  enabled: boolean
}

export function AlertsScreen() {
  const [alertRules, setAlertRules] = useKV<AlertRule[]>("alert-rules", [
    {
      id: 1,
      productName: "Sony WH-1000XM5",
      description: "Alert when price < ₹24,999 or drops 10%+",
      enabled: true,
    },
    {
      id: 2,
      productName: "Apple AirPods Pro",
      description: "Alert when price < ₹21,000",
      enabled: true,
    },
    {
      id: 3,
      productName: "Samsung Galaxy Buds2 Pro",
      description: "Alert when back in stock",
      enabled: false,
    },
    {
      id: 4,
      productName: "JBL Flip 6",
      description: "Alert when price drops 15%+",
      enabled: true,
    },
  ])

  const [masterAlertEnabled, setMasterAlertEnabled] = useKV<boolean>("master-alert-enabled", true)

  const [activeChips, setActiveChips] = useKV<string[]>("active-alert-chips", [
    "Price drop",
    "Back in stock",
  ])

  const alertChips = ["Price drop", "Back in stock", "Deal ends soon"]

  const toggleRule = (id: number) => {
    setAlertRules((current) =>
      (current || []).map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    )
  }

  const toggleChip = (chip: string) => {
    setActiveChips((current) =>
      (current || []).includes(chip)
        ? (current || []).filter((c) => c !== chip)
        : [...(current || []), chip]
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Price thresholds · % drops · stock status
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {alertChips.map((chip) => {
          const isActive = (activeChips || []).includes(chip)
          return (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={`glass-panel px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                isActive
                  ? "skeuo-raised bg-accent/20 text-accent border-accent/30"
                  : "skeuo-inset text-muted-foreground"
              }`}
            >
              {chip}
            </button>
          )
        })}
      </div>

      <div className="space-y-3">
        {(alertRules || []).map((rule) => (
          <Card
            key={rule.id}
            className="glass-panel p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-semibold text-sm">{rule.productName}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rule.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                  className="data-[state=checked]:bg-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border/30">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel skeuo-raised hover:skeuo-pressed active:scale-95 transition-all duration-150 text-xs">
                <PencilSimple weight="bold" className="w-3.5 h-3.5" />
                Edit
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel skeuo-raised hover:skeuo-pressed active:scale-95 transition-all duration-150 text-xs text-destructive">
                <Trash weight="bold" className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-panel p-5 space-y-3 border-accent/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Master Alert Control</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Toggle all price alerts and notifications on or off globally
            </p>
          </div>
          <Switch
            checked={masterAlertEnabled}
            onCheckedChange={setMasterAlertEnabled}
            className="data-[state=checked]:bg-accent shrink-0"
          />
        </div>
        
        {masterAlertEnabled && (
          <Badge className="bg-accent/20 text-accent border-accent/30 text-[10px]">
            All alerts active
          </Badge>
        )}
      </Card>
    </div>
  )
}
