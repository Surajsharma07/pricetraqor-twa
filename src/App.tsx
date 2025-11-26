import { useState } from "react"
import { BottomNav } from "@/components/BottomNav"
import { HomeScreen } from "@/components/screens/HomeScreen"
import { ProductsScreen } from "@/components/screens/ProductsScreen"
import { AlertsScreen } from "@/components/screens/AlertsScreen"
import { ProfileScreen } from "@/components/screens/ProfileScreen"
import { Toaster } from "@/components/ui/sonner"

function App() {
  const [activeScreen, setActiveScreen] = useState("home")

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return <HomeScreen />
      case "products":
        return <ProductsScreen />
      case "alerts":
        return <AlertsScreen />
      case "profile":
        return <ProfileScreen />
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