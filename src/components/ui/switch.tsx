"use client"

import { ComponentProps } from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative h-12 w-24 shrink-0 cursor-pointer rounded-full transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        "bg-[oklch(0.07_0.01_250)] shadow-[0px_2px_4px_0px_rgb(18,18,18,0.25),0px_4px_8px_0px_rgb(18,18,18,0.35)]",
        className
      )}
      {...props}
    >
      <span className="absolute inset-[0.1em] rounded-full border border-[oklch(0.25_0.04_250)] pointer-events-none" />
      
      <div className="absolute left-[0.5em] top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[inset_0px_2px_2px_0px_oklch(0.85_0_0)] pointer-events-none">
        <div className="h-6 w-6 rounded-full bg-[oklch(0.07_0.01_250)] shadow-[0px_2px_2px_0px_oklch(0.85_0_0)]" />
      </div>
      
      <div className="absolute right-[0.5em] top-1/2 h-1 w-6 -translate-y-1/2 rounded-full bg-[oklch(0.50_0.18_250)] shadow-[inset_0px_2px_1px_0px_oklch(0.40_0.15_250)] opacity-0 data-[state=checked]:opacity-100 transition-opacity pointer-events-none" 
        data-state={props.checked ? 'checked' : 'unchecked'}
      />
      
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none absolute left-[0.25em] top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full",
          "bg-[rgb(26,26,26)]",
          "shadow-[inset_4px_4px_4px_0px_rgba(64,64,64,0.25),inset_-4px_-4px_4px_0px_rgba(16,16,16,0.5)]",
          "transition-all duration-300",
          "data-[state=checked]:left-[calc(100%-2.75em)]"
        )}
      >
        <span className="relative h-full w-full rounded-full">
          <span className="absolute inset-[0.1em] rounded-full border border-[oklch(0.50_0.04_250)]" />
        </span>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
