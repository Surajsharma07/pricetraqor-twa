import { useEffect, useCallback, useRef, useMemo } from 'react'
import WebApp from '@twa-dev/sdk'

// Store the current button click handler references globally
let currentMainButtonHandler: (() => void) | null = null
let currentBackButtonHandler: (() => void) | null = null

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

  // Haptic feedback utilities - memoized
  const hapticImpact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred(style)
    }
  }, [])
  
  const hapticNotification = useCallback((type: 'error' | 'success' | 'warning') => {
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.notificationOccurred(type)
    }
  }, [])
  
  const hapticSelection = useCallback(() => {
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.selectionChanged()
    }
  }, [])
  
  const haptic = useMemo(() => ({
    impact: hapticImpact,
    notification: hapticNotification,
    selection: hapticSelection
  }), [hapticImpact, hapticNotification, hapticSelection])

  // MainButton utilities - memoized
  const mainButtonShow = useCallback((text: string, onClick: () => void) => {
    if (WebApp.MainButton) {
      console.log('[MainButton] Setting up with text:', text)
      
      // Remove previous handler if exists
      if (currentMainButtonHandler) {
        console.log('[MainButton] Removing previous handler')
        WebApp.MainButton.offClick(currentMainButtonHandler)
        currentMainButtonHandler = null
      }
      
      // Create wrapper that logs when called
      const wrappedHandler = () => {
        console.log('[MainButton] CLICKED! Calling handler...')
        onClick()
      }
      
      // Store new handler reference
      currentMainButtonHandler = wrappedHandler
      
      // Get button colors from theme params
      let buttonColor = WebApp.themeParams?.button_color
      let buttonTextColor = WebApp.themeParams?.button_text_color
      
      // Debug: log all theme info
      console.log('[MainButton] Theme info:', {
        colorScheme: WebApp.colorScheme,
        buttonColor,
        buttonTextColor,
        allThemeParams: WebApp.themeParams,
        currentMainButtonColor: WebApp.MainButton.color,
        currentMainButtonTextColor: WebApp.MainButton.textColor
      })
      
      // For dark mode, force proper colors if not set or if light colored
      const isDarkMode = WebApp.colorScheme === 'dark'
      const currentColor = WebApp.MainButton.color?.toLowerCase()
      const isLightColor = currentColor && (
        currentColor === '#ffffff' || 
        currentColor === '#fff' || 
        currentColor.startsWith('#f') ||
        currentColor.startsWith('#e') ||
        currentColor.startsWith('#d') ||
        currentColor.startsWith('#c')
      )
      
      if (isDarkMode && (!buttonColor || isLightColor)) {
        // Force dark mode colors - Telegram accent purple
        buttonColor = '#8774e1'
        buttonTextColor = '#ffffff'
        console.log('[MainButton] Forcing dark mode colors')
      }
      
      // IMPORTANT: Attach handler FIRST, then set params and show
      WebApp.MainButton.onClick(wrappedHandler)
      console.log('[MainButton] Handler attached')
      
      // Set text
      WebApp.MainButton.setText(text)
      
      // Set colors if available
      if (buttonColor || buttonTextColor) {
        WebApp.MainButton.setParams({
          ...(buttonColor && { color: buttonColor }),
          ...(buttonTextColor && { text_color: buttonTextColor })
        })
      }
      
      // Enable and show
      WebApp.MainButton.enable()
      WebApp.MainButton.show()
      
      console.log('[MainButton] After setup - color:', WebApp.MainButton.color, 'isVisible:', WebApp.MainButton.isVisible)
    }
  }, [])
  
  const mainButtonHide = useCallback(() => {
    if (WebApp.MainButton) {
      // Remove handler when hiding
      if (currentMainButtonHandler) {
        WebApp.MainButton.offClick(currentMainButtonHandler)
        currentMainButtonHandler = null
      }
      WebApp.MainButton.hide()
    }
  }, [])
  
  const mainButtonSetText = useCallback((text: string) => {
    if (WebApp.MainButton) {
      WebApp.MainButton.setText(text)
    }
  }, [])
  
  const mainButtonSetLoading = useCallback((isLoading: boolean) => {
    if (WebApp.MainButton) {
      if (isLoading) {
        WebApp.MainButton.showProgress()
        WebApp.MainButton.disable()
      } else {
        WebApp.MainButton.hideProgress()
        WebApp.MainButton.enable()
      }
    }
  }, [])
  
  const mainButtonSetColor = useCallback((color: string) => {
    if (WebApp.MainButton) {
      WebApp.MainButton.setParams({ color })
    }
  }, [])
  
  const mainButton = useMemo(() => ({
    show: mainButtonShow,
    hide: mainButtonHide,
    setText: mainButtonSetText,
    setLoading: mainButtonSetLoading,
    setColor: mainButtonSetColor
  }), [mainButtonShow, mainButtonHide, mainButtonSetText, mainButtonSetLoading, mainButtonSetColor])

  // BackButton utilities - memoized
  const backButtonShow = useCallback((onClick: () => void) => {
    if (WebApp.BackButton) {
      // Remove previous handler if exists
      if (currentBackButtonHandler) {
        WebApp.BackButton.offClick(currentBackButtonHandler)
      }
      // Store new handler reference
      currentBackButtonHandler = onClick
      
      WebApp.BackButton.onClick(onClick)
      WebApp.BackButton.show()
    }
  }, [])
  
  const backButtonHide = useCallback(() => {
    if (WebApp.BackButton) {
      // Remove handler when hiding
      if (currentBackButtonHandler) {
        WebApp.BackButton.offClick(currentBackButtonHandler)
        currentBackButtonHandler = null
      }
      WebApp.BackButton.hide()
    }
  }, [])
  
  const backButton = useMemo(() => ({
    show: backButtonShow,
    hide: backButtonHide
  }), [backButtonShow, backButtonHide])

  // Dialog utilities - memoized
  const dialogShowAlert = useCallback((message: string) => {
    return new Promise<void>((resolve) => {
      if (WebApp.showAlert) {
        WebApp.showAlert(message, () => resolve())
      } else {
        alert(message)
        resolve()
      }
    })
  }, [])
  
  const dialogShowConfirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      if (WebApp.showConfirm) {
        WebApp.showConfirm(message, (confirmed) => resolve(confirmed))
      } else {
        resolve(confirm(message))
      }
    })
  }, [])
  
  const dialogShowPopup = useCallback((params: {
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
  
  const dialog = useMemo(() => ({
    showAlert: dialogShowAlert,
    showConfirm: dialogShowConfirm,
    showPopup: dialogShowPopup
  }), [dialogShowAlert, dialogShowConfirm, dialogShowPopup])

  // Navigation utilities - memoized
  const navOpenLink = useCallback((url: string, options?: { try_instant_view?: boolean }) => {
    if (WebApp.openLink) {
      WebApp.openLink(url, options)
    } else {
      window.open(url, '_blank')
    }
  }, [])
  
  const navOpenTelegramLink = useCallback((url: string) => {
    if (WebApp.openTelegramLink) {
      WebApp.openTelegramLink(url)
    } else {
      window.location.href = url
    }
  }, [])
  
  const navClose = useCallback(() => {
    if (WebApp.close) {
      WebApp.close()
    }
  }, [])
  
  const navigation = useMemo(() => ({
    openLink: navOpenLink,
    openTelegramLink: navOpenTelegramLink,
    close: navClose
  }), [navOpenLink, navOpenTelegramLink, navClose])

  // Share utilities - memoized
  const shareSwitchInlineQuery = useCallback((query: string, chatTypes?: Array<'users' | 'bots' | 'groups' | 'channels'>) => {
    if (WebApp.switchInlineQuery) {
      WebApp.switchInlineQuery(query, chatTypes)
    }
  }, [])
  
  const share = useMemo(() => ({
    switchInlineQuery: shareSwitchInlineQuery
  }), [shareSwitchInlineQuery])

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

  // Theme utilities - memoized
  const themeSetBackgroundColor = useCallback((color: string) => {
    if (WebApp.setBackgroundColor) {
      WebApp.setBackgroundColor(color)
    }
  }, [])
  
  const themeSetHeaderColor = useCallback((color: string) => {
    if (WebApp.setHeaderColor) {
      WebApp.setHeaderColor(color)
    }
  }, [])
  
  const theme = useMemo(() => ({
    colorScheme: WebApp.colorScheme,
    themeParams: WebApp.themeParams,
    setBackgroundColor: themeSetBackgroundColor,
    setHeaderColor: themeSetHeaderColor
  }), [themeSetBackgroundColor, themeSetHeaderColor])

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

  // Cloud Storage - memoized
  const cloudStorageGetItem = useCallback((key: string): Promise<string> => {
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
  }, [])
  
  const cloudStorageSetItem = useCallback((key: string, value: string): Promise<void> => {
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
  }, [])
  
  const cloudStorageRemoveItem = useCallback((key: string): Promise<void> => {
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
  }, [])
  
  const cloudStorageGetKeys = useCallback((): Promise<string[]> => {
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
  
  const cloudStorage = useMemo(() => ({
    getItem: cloudStorageGetItem,
    setItem: cloudStorageSetItem,
    removeItem: cloudStorageRemoveItem,
    getKeys: cloudStorageGetKeys
  }), [cloudStorageGetItem, cloudStorageSetItem, cloudStorageRemoveItem, cloudStorageGetKeys])

  // Viewport utilities - memoized to prevent object recreation
  const viewport = useMemo(() => ({
    height: WebApp.viewportHeight,
    stableHeight: WebApp.viewportStableHeight,
    isExpanded: WebApp.isExpanded
  }), [])

  // Memoize the entire return object to prevent unnecessary re-renders
  return useMemo(() => ({
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
  }), [
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
    disableClosingConfirmation
  ])
}
