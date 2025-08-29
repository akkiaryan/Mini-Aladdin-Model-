"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain } from "lucide-react"

interface AladdinSignal {
  symbol: string
  probUp5d: number
  regime: "bull" | "bear" | "sideways"
  confidence: number
  drivers: string[]
  updatedAt: string
}

interface MiniAladdinPanelProps {
  signal?: AladdinSignal
}

export function MiniAladdinPanel({ signal }: MiniAladdinPanelProps) {
  if (!signal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair">
            <Brain className="h-5 w-5 text-primary" />
            Mini-Aladdin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">Select a symbol to view predictions</div>
        </CardContent>
      </Card>
    )
  }

  // Helper functions for proper number and date formatting
  const formatPercentage = (value: number): string => {
    return Math.round(value * 100).toString()
  }

  const formatConfidence = (value: number): string => {
    return Math.round(value * 100).toString()
  }

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    } catch {
      return timestamp
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-playfair">
          <Brain className="h-5 w-5 text-primary" />
          Mini-Aladdin
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Probability Display */}
        <div className="text-center">
          <div
            className={`text-4xl font-bold font-mono ${
              signal.probUp5d >= 0.6 ? "text-green-600" : signal.probUp5d <= 0.4 ? "text-red-600" : "text-amber-600"
            }`}
          >
            {formatPercentage(signal.probUp5d)}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">5-day upward probability</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                signal.probUp5d >= 0.6 ? "bg-green-600" : signal.probUp5d <= 0.4 ? "bg-red-600" : "bg-amber-600"
              }`}
              style={{ width: `${formatPercentage(signal.probUp5d)}%` }}
            />
          </div>
        </div>

        {/* Market Regime */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Regime</span>
            <span className="text-xs text-muted-foreground">—</span>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <span className="text-sm font-mono uppercase tracking-wider text-muted-foreground">{signal.regime}</span>
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm font-mono">{formatConfidence(signal.confidence)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-foreground h-2 rounded-full transition-all duration-300"
              style={{ width: `${formatConfidence(signal.confidence)}%` }}
            />
          </div>
        </div>

        {/* Key Drivers */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Key Drivers</span>
          <ul className="space-y-1">
            {signal.drivers.map((driver, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                {driver}
              </li>
            ))}
          </ul>
        </div>

        {/* Updated timestamp */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
          <span>Updated: {formatTimestamp(signal.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
