import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface NeumorphicButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "icon"
  fullWidth?: boolean
  onClick?: () => void
  className?: string
}

export function NeumorphicButton({
  children,
  variant = "primary",
  fullWidth = false,
  onClick,
  className,
}: NeumorphicButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "neumorphic-btn font-medium text-[#394a56] transition-all duration-200",
        variant === "primary" && "px-8 py-4 rounded-xl text-base",
        variant === "secondary" && "px-8 py-4 rounded-xl text-base opacity-80",
        variant === "icon" && "h-14 w-14 rounded-2xl text-2xl flex items-center justify-center",
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  )
}
