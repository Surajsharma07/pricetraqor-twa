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

  const chainOpacity = useTransform(y, [0, 50], [0.7, 1])
  const cordLength = useTransform(y, [0, 50], [60, 100])

  const toggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onCheckedChange?.(newState)
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-b-lg"
        style={{
          background: 'linear-gradient(145deg, oklch(0.16 0.03 250), oklch(0.13 0.025 250))',
          boxShadow: `
            0 4px 8px oklch(0.06 0.01 250 / 0.6),
            inset 0 -1px 2px oklch(0.20 0.04 250 / 0.3)
          `
        }}
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full"
          style={{
            background: 'linear-gradient(145deg, oklch(0.20 0.04 250), oklch(0.16 0.03 250))',
          }}
        />
      </div>

      <div className="flex flex-col items-center pt-2" ref={constraintsRef}>
        <div className="relative w-20 h-24 flex flex-col items-center">
          <motion.svg
            width="80"
            height="120"
            viewBox="0 0 80 120"
            className="absolute top-0"
            style={{ opacity: chainOpacity }}
          >
            <defs>
              <linearGradient id="cordGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="oklch(0.25 0.04 250)" />
                <stop offset="50%" stopColor="oklch(0.35 0.05 250)" />
                <stop offset="100%" stopColor="oklch(0.25 0.04 250)" />
              </linearGradient>
            </defs>
            <motion.line
              x1="40"
              y1="0"
              x2="40"
              y2={cordLength}
              stroke="url(#cordGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.svg>

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 40 }}
            dragElastic={0.25}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={toggle}
            style={{ y }}
            className="absolute top-12 cursor-grab active:cursor-grabbing z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div 
                className="w-10 h-14 rounded-full relative transition-all duration-300"
                style={{
                  background: isOn 
                    ? 'linear-gradient(145deg, oklch(0.96 0.005 250), oklch(0.92 0.005 250))'
                    : 'linear-gradient(145deg, oklch(0.18 0.04 250), oklch(0.14 0.03 250))',
                  boxShadow: isOn
                    ? `
                        6px 6px 12px oklch(0.82 0.01 250 / 0.5),
                        -3px -3px 8px oklch(1 0 0 / 0.5),
                        inset 0 1px 0 oklch(1 0 0 / 0.6)
                      `
                    : `
                        6px 6px 12px oklch(0.06 0.01 250 / 0.6),
                        -3px -3px 8px oklch(0.22 0.04 250 / 0.4),
                        inset 0 1px 0 oklch(0.95 0 0 / 0.08)
                      `
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: isOn
                      ? 'linear-gradient(135deg, oklch(1 0 0 / 0.15) 0%, transparent 50%, oklch(0 0 0 / 0.05) 100%)'
                      : 'linear-gradient(135deg, oklch(0.95 0 0 / 0.1) 0%, transparent 50%, oklch(0 0 0 / 0.15) 100%)',
                    pointerEvents: 'none'
                  }}
                />

                <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full transition-colors duration-300 ${
                  isOn ? 'bg-muted-foreground/30' : 'bg-muted-foreground/20'
                }`} />
                <div className={`absolute bottom-3.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full transition-colors duration-300 ${
                  isOn ? 'bg-muted-foreground/25' : 'bg-muted-foreground/15'
                }`} />

                <motion.div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-2.5 rounded-full"
                  style={{
                    background: isOn ? 'oklch(0.85 0.01 250)' : 'oklch(0.22 0.04 250)',
                    boxShadow: isOn 
                      ? 'inset 0 1px 2px oklch(0.70 0.01 250 / 0.4)'
                      : 'inset 0 1px 2px oklch(0 0 0 / 0.4)'
                  }}
                />

                <motion.div
                  animate={{
                    opacity: isOn ? [0.4, 0.8, 0.4] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-2 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 40% 30%, oklch(0.65 0.20 230 / 0.3), transparent 70%)',
                  }}
                />
              </div>
            </div>
          </motion.div>

          <div className="absolute -bottom-2 w-full flex justify-center">
            <motion.div
              animate={{
                opacity: isOn ? 1 : 0.4,
                scale: isOn ? 1 : 0.92,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div 
                className="w-12 h-12 rounded-full relative"
                style={{
                  background: isOn 
                    ? 'radial-gradient(circle, oklch(0.65 0.20 230) 0%, oklch(0.50 0.18 250) 100%)'
                    : 'linear-gradient(145deg, oklch(0.16 0.03 250), oklch(0.13 0.025 250))',
                  boxShadow: isOn
                    ? `
                        0 0 16px oklch(0.65 0.20 230 / 0.7),
                        0 0 32px oklch(0.65 0.20 230 / 0.5),
                        0 0 48px oklch(0.50 0.18 250 / 0.3),
                        inset 0 2px 4px oklch(0.95 0 0 / 0.25)
                      `
                    : `
                        inset 3px 3px 6px oklch(0.06 0.01 250 / 0.7),
                        inset -2px -2px 5px oklch(0.20 0.04 250 / 0.4)
                      `,
                  transition: 'all 0.3s ease'
                }}
              >
                <motion.div
                  animate={{
                    opacity: isOn ? [0.6, 1, 0.6] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 35% 30%, oklch(0.98 0 0 / 0.5), transparent 65%)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <motion.p 
            className="text-[10px] font-bold tracking-wider uppercase"
            animate={{ 
              color: isOn ? 'oklch(0.65 0.20 230)' : 'oklch(0.65 0.02 250)',
            }}
            transition={{ duration: 0.3 }}
          >
            {isOn ? 'Light' : 'Dark'}
          </motion.p>
        </div>
      </div>
    </div>
  )
}
