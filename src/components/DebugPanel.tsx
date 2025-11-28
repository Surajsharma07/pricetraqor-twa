import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { authService } from '@/services/auth'
import { productService } from '@/services/products'

declare global {
  interface Window {
    Telegram?: {
      WebApp: any
    }
  }
}

export function DebugPanel() {
  const [logs, setLogs] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const addLog = (msg: string) => {
      setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`].slice(-30))
    }

    // Check Telegram WebApp
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
      addLog('✓ Telegram SDK loaded')
      addLog(`InitData: ${window.Telegram.WebApp.initData ? 'present' : 'MISSING'}`)
      addLog(`User: ${JSON.stringify(window.Telegram.WebApp.initDataUnsafe?.user || 'none')}`)
    } else {
      addLog('✗ Telegram SDK NOT loaded')
    }

    // Check localStorage
    const token = localStorage.getItem('jwt_token')
    const user = localStorage.getItem('user')
    addLog(`Token: ${token ? token.substring(0, 15) + '...' : 'NONE'}`)
    addLog(`User: ${user || 'NONE'}`)

    // Check if authenticated
    addLog(`Authenticated: ${authService.isAuthenticated()}`)

    // Try to fetch products
    if (authService.isAuthenticated()) {
      addLog('Attempting to fetch products...')
      productService.getProducts()
        .then(products => {
          addLog(`✓ Loaded ${products.length} products`)
          products.forEach((p, i) => {
            addLog(`  ${i + 1}. ${p.title?.substring(0, 30) || 'No title'}`)
          })
        })
        .catch(err => {
          addLog(`✗ Failed to load products: ${err.message}`)
          addLog(`Error: ${JSON.stringify(err.response?.data || err)}`)
        })
    }
  }, [])

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 opacity-50"
        size="sm"
      >
        Show Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-3 max-w-md max-h-96 overflow-auto bg-black/90 text-green-400 text-xs font-mono">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-cyan-400">TWA Debug</span>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="h-6 px-2"
        >
          Hide
        </Button>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="text-[10px]">
            {log}
          </div>
        ))}
      </div>
    </Card>
  )
}
