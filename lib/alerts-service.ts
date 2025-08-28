interface PriceAlert {
  id: string
  symbol: string
  type: "bull" | "bear"
  targetPrice: number
  currentPrice: number
  isActive: boolean
  createdAt: string
  triggeredAt?: string
  message: string
}

class AlertsService {
  private alerts: Map<string, PriceAlert> = new Map()
  private subscribers: Set<(alerts: PriceAlert[]) => void> = new Set()

  subscribe(callback: (alerts: PriceAlert[]) => void) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notify() {
    const alertsList = Array.from(this.alerts.values())
    this.subscribers.forEach((callback) => callback(alertsList))
  }

  createAlert(symbol: string, type: "bull" | "bear", targetPrice: number, currentPrice: number): string {
    const id = `${symbol}-${type}-${Date.now()}`
    const alert: PriceAlert = {
      id,
      symbol,
      type,
      targetPrice,
      currentPrice,
      isActive: true,
      createdAt: new Date().toISOString(),
      message:
        type === "bull"
          ? `Alert when ${symbol} rises above ₹${targetPrice}`
          : `Alert when ${symbol} falls below ₹${targetPrice}`,
    }

    this.alerts.set(id, alert)
    this.notify()
    return id
  }

  removeAlert(id: string) {
    this.alerts.delete(id)
    this.notify()
  }

  updatePrices(priceUpdates: Record<string, number>) {
    let hasTriggered = false

    this.alerts.forEach((alert) => {
      if (!alert.isActive) return

      const newPrice = priceUpdates[alert.symbol]
      if (!newPrice) return

      let shouldTrigger = false

      if (alert.type === "bull" && newPrice >= alert.targetPrice) {
        shouldTrigger = true
      } else if (alert.type === "bear" && newPrice <= alert.targetPrice) {
        shouldTrigger = true
      }

      if (shouldTrigger) {
        alert.isActive = false
        alert.triggeredAt = new Date().toISOString()
        alert.currentPrice = newPrice
        hasTriggered = true

        // Show browser notification if supported
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Price Alert: ${alert.symbol}`, {
            body: `${alert.symbol} has ${alert.type === "bull" ? "risen above" : "fallen below"} ₹${alert.targetPrice}. Current: ₹${newPrice}`,
            icon: "/favicon.ico",
          })
        }
      }
    })

    if (hasTriggered) {
      this.notify()
    }
  }

  getActiveAlerts(): PriceAlert[] {
    return Array.from(this.alerts.values()).filter((alert) => alert.isActive)
  }

  getAllAlerts(): PriceAlert[] {
    return Array.from(this.alerts.values())
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }
}

export const alertsService = new AlertsService()
export type { PriceAlert }
