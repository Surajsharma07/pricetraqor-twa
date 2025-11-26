import { EnvelopeSimple, LockKey, TelegramLogo, Eye, EyeSlash } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface LoginScreenProps {
  onNavigate: (screen: string) => void
  onLogin: () => void
}

export function LoginScreen({ onNavigate, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (email && password) {
      toast.success("Login successful!", {
        description: "Welcome back to Pricetraqor",
      })
      onLogin()
    } else {
      toast.error("Login failed", {
        description: "Please check your credentials",
      })
    }
    
    setIsLoading(false)
  }

  const handleTelegramLogin = () => {
    toast.success("Telegram login", {
      description: "Redirecting to Telegram...",
    })
    setTimeout(() => {
      onLogin()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center space-y-3">
          <div className="glass-panel w-20 h-20 mx-auto rounded-2xl flex items-center justify-center skeuo-raised bg-gradient-to-br from-primary/30 to-violet-accent/30">
            <span className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">PT</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Sign in to your Pricetraqor account</p>
          </div>
        </div>

        <Card className="glass-panel p-6 space-y-6">
          <Button 
            onClick={handleTelegramLogin}
            className="w-full h-14 text-base font-semibold skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-gradient-to-br from-[#229ED9] to-[#1B7DB8] hover:from-[#2AABEA] hover:to-[#1F8FCC] border-0 text-white transition-all duration-200"
          >
            <TelegramLogo weight="fill" className="w-6 h-6 mr-3" />
            Continue with Telegram
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 glass-panel skeuo-inset bg-secondary/20 border-border/50 focus:border-accent/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <LockKey className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 h-12 glass-panel skeuo-inset bg-secondary/20 border-border/50 focus:border-accent/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeSlash className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="text-sm text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Forgot password?
            </button>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold skeuo-raised hover:skeuo-pressed active:skeuo-pressed active:scale-[0.98] bg-gradient-to-br from-primary/60 to-accent/50 hover:from-primary/70 hover:to-accent/60 border-accent/30 transition-all duration-200"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="text-accent hover:text-accent/80 transition-colors font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
