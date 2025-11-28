import { useEffect, useCallback, useRef } from 'react'
import WebApp from '@twa-dev/sdk'

/**
 * Hook for managing Telegram WebApp SDK features
 * Provides utilities for MainButton, BackButton, HapticFeedback, etc.
 */
export function useTelegramWebApp() {
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (!isInitializedRef.current) {
      WebApp.ready()
      WebApp.expand()
      isInitializedRef.current = true
    }
  }, [])

  // Haptic feedback utilities
  const haptic = {
    impact: useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
      if (WebApp.HapticFeedback) {
        WebApp.HapticFeedback.impactOccurred(style)
      }
    }, []),
    
    notification: useCallback((type: 'error' | 'success' | 'warning') => {
      if (WebApp.HapticFeedback) {
        WebApp.HapticFeedback.notificationOccurred(type)
      }
    }, []),
    
    selection: useCallback(() => {
      if (WebApp.HapticFeedback) {
        WebApp.HapticFeedback.selectionChanged()
      }
    }, [])
  }

  // MainButton utilities
  const mainButton = {
    show: useCallback((text: string, onClick: () => void) => {
      if (WebApp.MainButton) {
        WebApp.MainButton.setText(text)
        WebApp.MainButton.show()
        WebApp.MainButton.enable()
        WebApp.MainButton.onClick(onClick)
      }
    }, []),
    
    hide: useCallback(() => {
      if (WebApp.MainButton) {
        WebApp.MainButton.hide()
      }
    }, []),
    
    setText: useCallback((text: string) => {
      if (WebApp.MainButton) {
        WebApp.MainButton.setText(text)
      }
    }, []),
    
    setLoading: useCallback((isLoading: boolean) => {
      if (WebApp.MainButton) {
        if (isLoading) {
          WebApp.MainButton.showProgress()
          WebApp.MainButton.disable()
        } else {
          WebApp.MainButton.hideProgress()
          WebApp.MainButton.enable()
        }
      }
    }, []),
    
    setColor: useCallback((color: string) => {
      if (WebApp.MainButton) {
        WebApp.MainButton.setParams({ color })
      }
    }, [])
  }

  // BackButton utilities
  const backButton = {
    show: useCallback((onClick: () => void) => {
      if (WebApp.BackButton) {
        WebApp.BackButton.show()
        WebApp.BackButton.onClick(onClick)
      }
    }, []),
    
    hide: useCallback(() => {
      if (WebApp.BackButton) {
        WebApp.BackButton.hide()
      }
    }, [])
  }

  // Dialog utilities
  const dialog = {
    showAlert: useCallback((message: string) => {
      return new Promise<void>((resolve) => {
        if (WebApp.showAlert) {
          WebApp.showAlert(message, () => resolve())
        } else {
          alert(message)
          resolve()
        }
      })
    }, []),
    
    showConfirm: useCallback((message: string) => {
      return new Promise<boolean>((resolve) => {
        if (WebApp.showConfirm) {
          WebApp.showConfirm(message, (confirmed) => resolve(confirmed))
        } else {
          resolve(confirm(message))
        }
      })
    }, []),
    
    showPopup: useCallback((params: {
      title?: string
      message: string
      buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }>
    }) => {
      return new Promise<string>((resolve) => {
        if (WebApp.showPopup) {
          WebApp.showPopup(params, (buttonId) => resolve(buttonId || ''))
        } else {
          alert(params.message)
          resolve('')
        }
      })
    }, [])
  }

  // Navigation utilities
  const navigation = {
    openLink: useCallback((url: string, options?: { try_instant_view?: boolean }) => {
      if (WebApp.openLink) {
        WebApp.openLink(url, options)
      } else {
        window.open(url, '_blank')
      }
    }, []),
    
    openTelegramLink: useCallback((url: string) => {
      if (WebApp.openTelegramLink) {
        WebApp.openTelegramLink(url)
      } else {
        window.location.href = url
      }
    }, []),
    
    close: useCallback(() => {
      if (WebApp.close) {
        WebApp.close()
      }
    }, [])
  }

  // Share utilities
  const share = {
    switchInlineQuery: useCallback((query: string, chatTypes?: Array<'users' | 'bots' | 'groups' | 'channels'>) => {
      if (WebApp.switchInlineQuery) {
        WebApp.switchInlineQuery(query, chatTypes)
      }
    }, [])
  }

  // Closing confirmation
  const enableClosingConfirmation = useCallback(() => {
    if (WebApp.enableClosingConfirmation) {
      WebApp.enableClosingConfirmation()
    }
  }, [])

  const disableClosingConfirmation = useCallback(() => {
    if (WebApp.disableClosingConfirmation) {
      WebApp.disableClosingConfirmation()
    }
  }, [])

  // Theme utilities
  const theme = {
    colorScheme: WebApp.colorScheme,
    themeParams: WebApp.themeParams,
    setBackgroundColor: useCallback((color: string) => {
      if (WebApp.setBackgroundColor) {
        WebApp.setBackgroundColor(color)
      }
    }, []),
    setHeaderColor: useCallback((color: string) => {
      if (WebApp.setHeaderColor) {
        WebApp.setHeaderColor(color)
      }
    }, [])
  }

  // QR Scanner
  const scanQR = useCallback((text?: string) => {
    return new Promise<string>((resolve, reject) => {
      if (WebApp.showScanQrPopup) {
        WebApp.showScanQrPopup({ text: text || 'Scan QR Code' }, (data) => {
          if (data) {
            WebApp.closeScanQrPopup()
            resolve(data)
          }
        })
      } else {
        reject(new Error('QR Scanner not available'))
      }
    })
  }, [])

  // Cloud Storage
  const cloudStorage = {
    getItem: useCallback((key: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (WebApp.CloudStorage) {
          WebApp.CloudStorage.getItem(key, (error, value) => {
            if (error) reject(error)
            else resolve(value || '')
          })
        } else {
          resolve(localStorage.getItem(key) || '')
        }
      })
    }, []),
    
    setItem: useCallback((key: string, value: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (WebApp.CloudStorage) {
          WebApp.CloudStorage.setItem(key, value, (error) => {
            if (error) reject(error)
            else resolve()
          })
        } else {
          localStorage.setItem(key, value)
          resolve()
        }
      })
    }, []),
    
    removeItem: useCallback((key: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (WebApp.CloudStorage) {
          WebApp.CloudStorage.removeItem(key, (error) => {
            if (error) reject(error)
            else resolve()
          })
        } else {
          localStorage.removeItem(key)
          resolve()
        }
      })
    }, []),
    
    getKeys: useCallback((): Promise<string[]> => {
      return new Promise((resolve, reject) => {
        if (WebApp.CloudStorage) {
          WebApp.CloudStorage.getKeys((error, keys) => {
            if (error) reject(error)
            else resolve(keys || [])
          })
        } else {
          resolve(Object.keys(localStorage))
        }
      })
    }, [])
  }

  // Viewport utilities
  const viewport = {
    height: WebApp.viewportHeight,
    stableHeight: WebApp.viewportStableHeight,
    isExpanded: WebApp.isExpanded
  }

  return {
    webApp: WebApp,
    haptic,
    mainButton,
    backButton,
    dialog,
    navigation,
    share,
    theme,
    scanQR,
    cloudStorage,
    viewport,
    enableClosingConfirmation,
    disableClosingConfirmation,
    platform: WebApp.platform,
    version: WebApp.version,
    initData: WebApp.initData,
    initDataUnsafe: WebApp.initDataUnsafe
  }
}
