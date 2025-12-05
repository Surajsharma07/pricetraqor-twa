import { Component, ErrorInfo, ReactNode } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-twa-viewport bg-background p-4 flex items-center justify-center">
          <Card className="p-6 max-w-md">
            <h2 className="text-xl font-bold text-destructive mb-4">
              Something went wrong
            </h2>
            <pre className="text-xs bg-muted p-3 rounded mb-4 overflow-auto max-h-60">
              {this.state.error?.toString()}
            </pre>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Reload App
            </Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
