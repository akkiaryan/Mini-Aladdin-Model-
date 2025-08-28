"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useProphetForecast } from "@/hooks/use-prophet-forecast"

interface ProphetForecastPanelProps {
  symbol: string
}

export function ProphetForecastPanel({ symbol }: ProphetForecastPanelProps) {
  const { forecast, loading, error } = useProphetForecast(symbol)

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Prophet Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-20"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !forecast) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Prophet Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-ink-muted text-sm">{error || "No forecast available"}</p>
        </CardContent>
      </Card>
    )
  }

  const trendColor = forecast.trend === "BULLISH" ? "text-positive" : "text-negative"
  const TrendIcon = forecast.trend === "BULLISH" ? TrendingUp : TrendingDown

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Prophet Forecast
        </CardTitle>
        <CardDescription>5-day price prediction using Facebook Prophet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Price */}
        <div>
          <p className="text-sm text-ink-muted">Current Price</p>
          <p className="text-2xl font-mono font-semibold text-ink">₹{forecast.current_price.toFixed(2)}</p>
        </div>

        {/* Trend */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">5-Day Trend</p>
            <div className="flex items-center gap-2">
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
              <span className={`font-semibold ${trendColor}`}>{forecast.trend}</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-muted text-ink-muted">
            {forecast.confidence.toFixed(1)}% confidence
          </Badge>
        </div>

        {/* Price Change */}
        <div>
          <p className="text-sm text-ink-muted">Expected Change</p>
          <p className={`text-lg font-mono font-semibold ${trendColor}`}>
            {forecast.price_change_pct > 0 ? "+" : ""}
            {forecast.price_change_pct.toFixed(2)}%
          </p>
        </div>

        {/* Forecast Range */}
        <div>
          <p className="text-sm text-ink-muted mb-2">5-Day Price Range</p>
          <div className="space-y-1">
            {forecast.forecast_data.slice(-1).map((day, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-ink-muted">Target:</span>
                <span className="font-mono text-ink">₹{day.yhat.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm">
              <span className="text-ink-muted">Range:</span>
              <span className="font-mono text-ink-muted">
                ₹{forecast.forecast_data.slice(-1)[0].yhat_lower.toFixed(2)} - ₹
                {forecast.forecast_data.slice(-1)[0].yhat_upper.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
