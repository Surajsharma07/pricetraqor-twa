"use client"

import { ComponentProps } from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

}: ComponentProps<typeof SwitchP

      className={
        "bg-
      )}
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
     
          <span className="absolute inset-[0.1em] rounded-full border border-[oklch(0.50_0.04_250)]" />
      
  )
















      >
        <span className="relative h-full w-full rounded-full">
          <span className="absolute inset-[0.1em] rounded-full border border-[oklch(0.50_0.04_250)]" />
        </span>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
