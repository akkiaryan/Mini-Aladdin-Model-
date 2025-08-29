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
}
