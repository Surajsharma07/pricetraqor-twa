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
  const [isPulling, setIsPulling] = useState(false)
  const y = useMotionValue(0)
  const constraintsRef = useRef(null)

  useEffect(() => {
    setIsOn(checked)
  }, [checked])

  const handleDragEnd = (_: unknown, info: { offset: { y: number } }) => {
    setIsDragging(false)
    setIsPulling(false)
    if (info.offset.y > 20) {
      const newState = !isOn
      setIsOn(newState)
      onCheckedChange?.(newState)
    }
  }

  const handleDragStart = () => {
    setIsDragging(true)
    setIsPulling(true)
  }

  const chainOpacity = useTransform(y, [0, 50], [0.8, 1])
  const cordLength = useTransform(y, [0, 50], [80, 120])

  const toggle = () => {
    setIsPulling(true)
    const newState = !isOn
    setIsOn(newState)
    onCheckedChange?.(newState)
    setTimeout(() => setIsPulling(false), 200)
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-2 rounded-b-xl"
        style={{
          background: isOn
            ? 'linear-gradient(145deg, oklch(0.95 0.005 250), oklch(0.91 0.005 250))'
            : 'linear-gradient(145deg, oklch(0.16 0.03 250), oklch(0.13 0.025 250))',
          boxShadow: isOn
            ? `
                0 4px 8px oklch(0.82 0.01 250 / 0.4),
                inset 0 -1px 2px oklch(1 0 0 / 0.3)
              `
            : `
                0 4px 8px oklch(0.06 0.01 250 / 0.6),
                inset 0 -1px 2px oklch(0.20 0.04 250 / 0.3)
              `,
          transition: 'all 0.3s ease'
        }}
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-3 rounded-b-full"
          style={{
            background: isOn
              ? 'linear-gradient(145deg, oklch(0.93 0.005 250), oklch(0.89 0.005 250))'
              : 'linear-gradient(145deg, oklch(0.20 0.04 250), oklch(0.16 0.03 250))',
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      <div className="flex flex-col items-center pt-3" ref={constraintsRef}>
        <div className="relative w-24 h-32 flex flex-col items-center">
          <motion.svg
            width="96"
            height="140"
            viewBox="0 0 96 140"
            className="absolute top-0"
            style={{ opacity: chainOpacity }}
          >
            <defs>
              <linearGradient id="cordGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isOn ? "oklch(0.85 0.01 250)" : "oklch(0.25 0.04 250)"} />
                <stop offset="50%" stopColor={isOn ? "oklch(0.90 0.01 250)" : "oklch(0.35 0.05 250)"} />
                <stop offset="100%" stopColor={isOn ? "oklch(0.85 0.01 250)" : "oklch(0.25 0.04 250)"} />
              </linearGradient>
              <filter id="cordShadow">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
                <feOffset dx="1" dy="1" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge> 
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/> 
                </feMerge>
              </filter>
            </defs>
            <motion.line
              x1="48"
              y1="0"
              x2="48"
              y2={cordLength}
              stroke="url(#cordGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#cordShadow)"
              style={{
                transition: 'stroke 0.3s ease'
              }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx="48"
                cy={10 + i * 10}
                r="1.5"
                fill={isOn ? "oklch(0.70 0.01 250)" : "oklch(0.30 0.04 250)"}
                style={{
                  transition: 'fill 0.3s ease'
                }}
              />
            ))}
          </motion.svg>

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 50 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={toggle}
            style={{ y }}
            className="absolute top-16 cursor-grab active:cursor-grabbing z-10"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            animate={{
              y: isPulling ? 8 : 0
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <div className="relative">
              <div 
                className="w-12 h-16 rounded-full relative transition-all duration-300"
                style={{
                  background: isOn 
                    ? 'linear-gradient(145deg, oklch(0.96 0.005 250), oklch(0.92 0.005 250))'
                    : 'linear-gradient(145deg, oklch(0.18 0.04 250), oklch(0.14 0.03 250))',
                  boxShadow: isOn
                    ? `
                        8px 8px 16px oklch(0.82 0.01 250 / 0.6),
                        -4px -4px 10px oklch(1 0 0 / 0.6),
                        inset 0 2px 4px oklch(1 0 0 / 0.7),
                        inset 0 -2px 4px oklch(0.82 0.01 250 / 0.4)
                      `
                    : `
                        8px 8px 16px oklch(0.06 0.01 250 / 0.7),
                        -4px -4px 10px oklch(0.22 0.04 250 / 0.5),
                        inset 0 2px 4px oklch(0.95 0 0 / 0.12),
                        inset 0 -2px 4px oklch(0 0 0 / 0.3)
                      `
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: isOn
                      ? 'linear-gradient(135deg, oklch(1 0 0 / 0.2) 0%, transparent 45%, oklch(0 0 0 / 0.08) 100%)'
                      : 'linear-gradient(135deg, oklch(0.95 0 0 / 0.15) 0%, transparent 45%, oklch(0 0 0 / 0.2) 100%)',
                    pointerEvents: 'none'
                  }}
                />

                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-300"
                    style={{
                      bottom: `${8 + i * 4}px`,
                      width: `${24 - i * 2}px`,
                      height: '1.5px',
                      background: isOn 
                        ? 'oklch(0.82 0.01 250 / 0.4)' 
                        : 'oklch(0.25 0.04 250 / 0.3)',
                      boxShadow: isOn
                        ? 'inset 0 1px 1px oklch(0.70 0.01 250 / 0.5)'
                        : 'inset 0 1px 1px oklch(0 0 0 / 0.5)'
                    }}
                  />
                ))}

                <motion.div
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-3 rounded-full"
                  style={{
                    background: isOn ? 'oklch(0.88 0.01 250)' : 'oklch(0.22 0.04 250)',
                    boxShadow: isOn 
                      ? 'inset 0 1px 2px oklch(0.70 0.01 250 / 0.5)'
                      : 'inset 0 1px 2px oklch(0 0 0 / 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                />

                <motion.div
                  animate={{
                    opacity: isOn ? [0.5, 0.9, 0.5] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-2 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 40% 30%, oklch(0.65 0.20 230 / 0.4), transparent 70%)',
                  }}
                />
              </div>
            </div>
          </motion.div>

          <div className="absolute -bottom-4 w-full flex justify-center">
            <motion.div
              animate={{
                opacity: isOn ? 1 : 0.5,
                scale: isOn ? 1.05 : 0.95,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <div 
                className="w-14 h-14 rounded-full relative"
                style={{
                  background: isOn 
                    ? 'radial-gradient(circle at 30% 30%, oklch(0.70 0.22 230) 0%, oklch(0.55 0.20 250) 60%, oklch(0.45 0.16 250) 100%)'
                    : 'linear-gradient(145deg, oklch(0.16 0.03 250), oklch(0.12 0.025 250))',
                  boxShadow: isOn
                    ? `
                        0 0 20px oklch(0.65 0.20 230 / 0.8),
                        0 0 40px oklch(0.65 0.20 230 / 0.6),
                        0 0 60px oklch(0.50 0.18 250 / 0.4),
                        0 0 80px oklch(0.50 0.18 250 / 0.2),
                        inset 0 3px 6px oklch(0.95 0 0 / 0.3),
                        inset 0 -2px 4px oklch(0.40 0.15 240 / 0.4)
                      `
                    : `
                        inset 4px 4px 8px oklch(0.06 0.01 250 / 0.8),
                        inset -3px -3px 6px oklch(0.20 0.04 250 / 0.5)
                      `,
                  transition: 'all 0.4s ease'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    background: isOn
                      ? 'radial-gradient(circle at 25% 25%, oklch(0.95 0 0 / 0.4) 0%, transparent 50%)'
                      : 'transparent'
                  }}
                />

                <motion.div
                  animate={{
                    opacity: isOn ? [0.7, 1, 0.7] : 0,
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 25%, oklch(0.98 0 0 / 0.6), transparent 60%)',
                  }}
                />

                {isOn && (
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -inset-4 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, oklch(0.65 0.20 230 / 0.3), transparent 70%)',
                      filter: 'blur(8px)',
                    }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <motion.p 
            className="text-[11px] font-bold tracking-widest uppercase"
            animate={{ 
              color: isOn ? 'oklch(0.65 0.20 230)' : 'oklch(0.65 0.02 250)',
              textShadow: isOn 
                ? '0 0 8px oklch(0.65 0.20 230 / 0.5), 0 1px 2px oklch(0 0 0 / 0.3)'
                : '0 1px 2px oklch(0 0 0 / 0.4)'
            }}
            transition={{ duration: 0.3 }}
          >
            {isOn ? 'Light Mode' : 'Dark Mode'}
          </motion.p>
        </div>
      </div>
    </div>
  )
}
