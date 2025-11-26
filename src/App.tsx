import { useState } from "react"
import { BottomNav } from "@/components/BottomNav"
import { HomeScreen } from "@/components/screens/HomeScreen"
import { ProductsScreen } from "@/components/screens/ProductsScreen"
import { AlertsScreen } from "@/components/screens/AlertsScreen"
import { ProfileScreen } from "@/components/screens/ProfileScreen"
import { LoginScreen } from "@/components/screens/LoginScreen"
import { SignupScreen } from "@/components/screens/SignupScreen"
import { ComponentDemoScreen } from "@/components/screens/ComponentDemoScreen"
import { Toaster } from "@/components/ui/sonner"
import { useKV } from "@github/spark/hooks"

function App() {
  const [activeScreen, setActiveScreen] = useState("home")
  const [authScreen, setAuthScreen] = useState<"login" | "signup" | null>("login")
  const [isAuthenticated, setIsAuthenticated] = useKV<boolean>("is-authenticated", false)
  const [showDemo, setShowDemo] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setAuthScreen(null)
  }

  const handleSignup = () => {
    setIsAuthenticated(true)
    setAuthScreen(null)
  }

  const handleAuthNavigation = (screen: string) => {
    if (screen === "login" || screen === "signup") {
      setAuthScreen(screen)
    }
  }

  if (!isAuthenticated) {
    if (authScreen === "login") {
      return (
        <>
          <LoginScreen onNavigate={handleAuthNavigation} onLogin={handleLogin} />
          <Toaster />
        </>
      )
    }
    
    if (authScreen === "signup") {
      return (
        <>
          <SignupScreen onNavigate={handleAuthNavigation} onSignup={handleSignup} />
          <Toaster />
        </>
      )
    }
  }

  if (showDemo) {
    return (
      <>
        <ComponentDemoScreen onBack={() => setShowDemo(false)} />
        <Toaster />
      </>
    )
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return <HomeScreen />
      case "products":
        return <ProductsScreen />
      case "alerts":
        return <AlertsScreen />
      case "profile":
        return <ProfileScreen onShowDemo={() => setShowDemo(true)} />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[430px] px-4 pt-6 pb-24">
        {renderScreen()}
      </div>
      <BottomNav active={activeScreen} onNavigate={setActiveScreen} />
      <Toaster />
    </div>
  )
}

export default App