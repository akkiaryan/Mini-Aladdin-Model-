"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, TrendingUp, TrendingDown, X } from "lucide-react"
import { useAlerts } from "@/hooks/use-alerts"

interface PriceAlertsPanelProps {
  symbol: string
  currentPrice: number
}

export function PriceAlertsPanel({ symbol, currentPrice }: PriceAlertsPanelProps) {
  const { alerts, activeAlerts, createAlert, removeAlert } = useAlerts()
  const [alertPrice, setAlertPrice] = useState("")
  const [alertType, setAlertType] = useState<"bull" | "bear">("bull")

  const symbolAlerts = alerts.filter((alert) => alert.symbol === symbol)

  const handleCreateAlert = () => {
    const price = Number.parseFloat(alertPrice)
    if (isNaN(price) || price <= 0) return

    createAlert(symbol, alertType, price, currentPrice)
    setAlertPrice("")
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Price Alerts
        </CardTitle>
        <CardDescription>Set bull/bear alerts for {symbol}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create Alert */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={alertType === "bull" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlertType("bull")}
              className="flex-1"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Bull
            </Button>
            <Button
              variant={alertType === "bear" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlertType("bear")}
              className="flex-1"
            >
              <TrendingDown className="h-3 w-3 mr-1" />
              Bear
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alert-price">Alert when price {alertType === "bull" ? "rises above" : "falls below"}</Label>
            <div className="flex gap-2">
              <Input
                id="alert-price"
                type="number"
                placeholder="₹0.00"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCreateAlert} size="sm">
                Add
              </Button>
            </div>
          </div>

          <p className="text-xs text-ink-muted">Current price: ₹{currentPrice.toFixed(2)}</p>
        </div>

        {/* Active Alerts */}
        {symbolAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-ink">Active Alerts</h4>
            <div className="space-y-2">
              {symbolAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {alert.type === "bull" ? (
                      <TrendingUp className="h-3 w-3 text-positive" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-negative" />
                    )}
                    <span className="text-sm font-mono">₹{alert.targetPrice.toFixed(2)}</span>
                    <Badge variant={alert.isActive ? "default" : "secondary"} className="text-xs">
                      {alert.isActive ? "Active" : "Triggered"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeAlert(alert.id)} className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {symbolAlerts.length === 0 && (
          <p className="text-sm text-ink-muted text-center py-4">No alerts set for {symbol}</p>
        )}
      </CardContent>
    </Card>
  )
}
