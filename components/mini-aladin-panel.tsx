"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, TrendingDown, Minus, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface AladinSignal {
  symbol: string
  probUp5d: number
  regime: "bull" | "bear" | "sideways"
  confidence: number
  drivers: string[]
  updatedAt: string
}

interface MiniAladinPanelProps {
  signal?: AladinSignal
}

export function MiniAladinPanel({ signal }: MiniAladinPanelProps) {
  if (!signal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair">
            <Brain className="h-5 w-5 text-primary" />
            Mini-Aladin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">Select a symbol to view predictions</div>
        </CardContent>
      </Card>
    )
  }

  const getRegimeIcon = (regime: string) => {
    switch (regime) {
      case "bull":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "bear":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case "bull":
        return "text-green-600"
      case "bear":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 0.65) return "text-green-600"
    if (prob >= 0.55) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair">
            <Brain className="h-5 w-5 text-primary" />
            Mini-Aladin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Probability Score */}
          <div className="text-center space-y-2">
            <div className={`text-4xl font-mono font-bold ${getProbabilityColor(signal.probUp5d)}`}>
              {Math.round(signal.probUp5d * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">5-day upward probability</div>
            <Progress value={signal.probUp5d * 100} className="h-2" />
          </div>

          {/* Regime */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Market Regime</span>
              {getRegimeIcon(signal.regime)}
            </div>
            <Badge variant="secondary" className={`w-full justify-center ${getRegimeColor(signal.regime)}`}>
              {signal.regime.toUpperCase()}
            </Badge>
          </div>

          {/* Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence</span>
              <span className="text-sm font-mono">{(signal.confidence * 100).toFixed(0)}%</span>
            </div>
            <Progress value={signal.confidence * 100} className="h-2" />
          </div>

          {/* Key Drivers */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Key Drivers</span>
            <ul className="space-y-1">
              {signal.drivers.map((driver, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {driver}
                </li>
              ))}
            </ul>
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
            <Clock className="h-3 w-3" />
            Updated: {new Date(signal.updatedAt).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
