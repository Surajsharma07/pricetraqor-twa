import { cn } from "@/lib/utils"

interface NeumorphicCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function NeumorphicCheckbox({
  checked,
  onChange,
  className,
}: NeumorphicCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[30px] w-[30px] rounded-lg transition-all duration-200",
        "neumorphic-checkbox",
        className
      )}
    >
      <div className={cn(
        "neumorphic-checkbox-inner",
        checked && "checked"
      )}>
        {checked && (
          <svg
            className="absolute inset-0 m-auto h-5 w-5 text-[#394a56]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  )
}
