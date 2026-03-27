import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const marioButtonVariants = {
  default: "mario-btn",
  green: "mario-btn mario-btn-green",
  gold: "mario-btn mario-btn-gold",
  chip: "mario-chip",
  chipActive: "mario-chip mario-chip-active"
}

interface MarioButtonProps extends Omit<React.ComponentProps<typeof Button>, 'variant'> {
  variant?: 'default' | 'green' | 'gold' | 'chip' | 'chipActive'
}

export function MarioButton({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}: MarioButtonProps) {
  return (
    <Button
      variant="default"
      className={cn(
        marioButtonVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
