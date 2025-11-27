import { cn } from "@/lib/utils"

interface NeumorphicSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function NeumorphicSwitch({
  checked,
  onChange,
  className,
}: NeumorphicSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300",
        "neumorphic-switch-track",
        className
      )}
    >
      <span
        className={cn(
          "neumorphic-switch-thumb inline-block h-6 w-6 transform rounded-full transition-all duration-300",
          checked ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  )
}
