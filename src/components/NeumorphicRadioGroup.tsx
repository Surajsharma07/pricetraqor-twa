import { useState } from "react"
import { cn } from "@/lib/utils"

interface RadioOption {
  value: string
  label: string
}

interface NeumorphicRadioGroupProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name: string
  className?: string
}

export function NeumorphicRadioGroup({
  options,
  value,
  onChange,
  name,
  className,
}: NeumorphicRadioGroupProps) {
  const [focusedValue, setFocusedValue] = useState<string | null>(null)

  return (
    <div
      className={cn(
        "neumorphic-radiogroup rounded-2xl p-12",
        className
      )}
    >
      {options.map((option) => (
        <div key={option.value} className="relative my-2">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocusedValue(option.value)}
            onBlur={() => setFocusedValue(null)}
            className="absolute top-0 right-0 opacity-[0.00001] pointer-events-none"
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className="inline-flex items-center cursor-pointer text-[#394a56]"
          >
            <div className="neumorphic-indicator relative rounded-full h-[30px] w-[30px] overflow-hidden">
              <div
                className={cn(
                  "neumorphic-indicator-inner",
                  value === option.value && "checked"
                )}
              />
            </div>
            <span
              className={cn(
                "ml-4 transition-all duration-200 ease-out",
                focusedValue === option.value
                  ? "opacity-100 translate-x-2"
                  : "opacity-60",
                "hover:opacity-100"
              )}
            >
              {option.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
