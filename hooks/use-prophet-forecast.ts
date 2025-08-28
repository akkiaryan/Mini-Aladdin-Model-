"use client"

import { useState, useEffect } from "react"

interface ProphetForecast {
  symbol: string
  current_price: number
  forecast_data: Array<{
    ds: string
    yhat: number
    yhat_lower: number
    yhat_upper: number
  }>
  trend: "BULLISH" | "BEARISH"
  confidence: number
  price_change_pct: number
  generated_at: string
}

export function useProphetForecast(symbol: string) {
  const [forecast, setForecast] = useState<ProphetForecast | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) return

    const fetchForecast = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/prophet-forecast/${symbol}`)
        if (!response.ok) throw new Error("Failed to fetch forecast")

        const data = await response.json()
        setForecast(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [symbol])

  return { forecast, loading, error }
}
