import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

interface LampSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function LampSwitch({ checked = false, onCheckedChange, className = '' }: LampSwitchProps) {
  const [isOn, setIsOn] = useState(checked)
  const [isDragging, setIsDragging] = useState(false)
  const y = useMotionValue(0)
  const constraintsRef = useRef(null)

  useEffect(() => {
    setIsOn(checked)
  }, [checked])

  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    setIsDragging(false)
    if (info.offset.y > 20) {
      const newState = !isOn
      setIsOn(newState)
      onCheckedChange?.(newState)
    }
  }

  const chainOpacity = useTransform(y, [0, 50], [0.6, 1])
  const cordLength = useTransform(y, [0, 50], [80, 130])

  const toggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onCheckedChange?.(newState)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-center" ref={constraintsRef}>
        <div className="relative w-24 h-32 flex flex-col items-center">
          <motion.svg
            width="100"
            height="150"
            viewBox="0 0 100 150"
            className="absolute top-0"
            style={{ opacity: chainOpacity }}
          >
            <motion.line
              x1="50"
              y1="0"
              x2="50"
              y2={cordLength}
              stroke="oklch(0.35 0.05 250)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.svg>

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 50 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={toggle}
            style={{ y }}
            className="absolute top-16 cursor-grab active:cursor-grabbing z-10"
          >
            <div className="relative">
              <div 
                className="w-12 h-16 rounded-full relative transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, oklch(0.18 0.04 250), oklch(0.14 0.03 250))',
                  boxShadow: `
                    6px 6px 12px oklch(0.06 0.01 250 / 0.5),
                    -3px -3px 8px oklch(0.22 0.04 250 / 0.3),
                    inset 0 1px 0 oklch(0.95 0 0 / 0.08)
                  `
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.95 0 0 / 0.1) 0%, transparent 50%, oklch(0 0 0 / 0.1) 100%)',
                    pointerEvents: 'none'
                  }}
                />

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-muted-foreground/20" />
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-muted-foreground/15" />

                <motion.div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-3 rounded-full"
                  style={{
                    background: 'oklch(0.22 0.04 250)',
                    boxShadow: 'inset 0 1px 2px oklch(0 0 0 / 0.3)'
                  }}
                />
              </div>
            </div>
          </motion.div>

          <div className="absolute -bottom-8 w-full flex justify-center">
            <motion.div
              animate={{
                opacity: isOn ? 1 : 0.3,
                scale: isOn ? 1 : 0.9,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div 
                className="w-16 h-16 rounded-full relative"
                style={{
                  background: isOn 
                    ? 'radial-gradient(circle, oklch(0.65 0.20 230) 0%, oklch(0.50 0.18 250) 100%)'
                    : 'linear-gradient(145deg, oklch(0.16 0.03 250), oklch(0.13 0.025 250))',
                  boxShadow: isOn
                    ? `
                        0 0 20px oklch(0.65 0.20 230 / 0.6),
                        0 0 40px oklch(0.65 0.20 230 / 0.4),
                        0 0 60px oklch(0.50 0.18 250 / 0.3),
                        inset 0 2px 4px oklch(0.95 0 0 / 0.2)
                      `
                    : `
                        inset 4px 4px 8px oklch(0.06 0.01 250 / 0.6),
                        inset -2px -2px 6px oklch(0.20 0.04 250 / 0.3)
                      `,
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.div
                  animate={{
                    opacity: isOn ? [0.5, 1, 0.5] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, oklch(0.95 0 0 / 0.4), transparent 60%)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <motion.p 
            className="text-xs font-semibold tracking-wide"
            animate={{ 
              color: isOn ? 'oklch(0.65 0.20 230)' : 'oklch(0.70 0.02 250)',
            }}
            transition={{ duration: 0.3 }}
          >
            {isOn ? 'White Theme' : 'Dark Theme'}
          </motion.p>
        </div>
      </div>
    </div>
  )
}
