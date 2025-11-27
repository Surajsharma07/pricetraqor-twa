import { useState } from "react"
import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface NeumorphicRadioGroupProps {
  options: RadioOption[]
  value: string
  onValueChange: (value: string) => void
  name?: string
  className?: string
}

export function NeumorphicRadioGroup({
  options,
  value,
  onValueChange,
  name = 'radio',
  className,
}: NeumorphicRadioGroupProps) {
  const [focusedValue, setFocusedValue] = useState<string | null>(null)

  return (
    <div
      className={cn(
        "neumorphic-radiogroup rounded-2xl p-8",
        className
      )}
    >
      {options.map((option, index) => (
        <div key={option.value} className={cn("relative", index > 0 && "mt-4")}>
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => setFocusedValue(option.value)}
            onBlur={() => setFocusedValue(null)}
            className="absolute top-0 right-0 opacity-[0.00001] pointer-events-none"
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className="flex items-start cursor-pointer"
          >
            <div className="neumorphic-indicator relative rounded-full h-[30px] w-[30px] overflow-hidden flex-shrink-0 mt-0.5">
              <div
                className={cn(
                  "neumorphic-indicator-inner",
                  value === option.value && "checked"
                )}
              />
            </div>
            <div className="flex-1 ml-4">
              <span
                className={cn(
                  "block text-sm font-semibold transition-all duration-200 ease-out",
                  focusedValue === option.value
                    ? "opacity-100 translate-x-2"
                    : "opacity-80",
                  "hover:opacity-100",
                  "text-foreground"
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span
                  className={cn(
                    "block text-xs mt-1 transition-all duration-200 ease-out",
                    focusedValue === option.value
                      ? "opacity-100 translate-x-2"
                      : "opacity-50",
                    "hover:opacity-80",
                    "text-muted-foreground"
                  )}
                >
                  {option.description}
                </span>
              )}
            </div>
          </label>
        </div>
      ))}
    </div>
  )
}
