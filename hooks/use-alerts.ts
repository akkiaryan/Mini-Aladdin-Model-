"use client"

import { useState, useEffect } from "react"
import { alertsService, type PriceAlert } from "@/lib/alerts-service"

export function useAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])

  useEffect(() => {
    // Request notification permission on mount
    alertsService.requestNotificationPermission()

    // Subscribe to alerts updates
    const unsubscribe = alertsService.subscribe(setAlerts)

    // Initialize with current alerts
    setAlerts(alertsService.getAllAlerts())

    return unsubscribe
  }, [])

  const createAlert = (symbol: string, type: "bull" | "bear", targetPrice: number, currentPrice: number) => {
    return alertsService.createAlert(symbol, type, targetPrice, currentPrice)
  }

  const removeAlert = (id: string) => {
    alertsService.removeAlert(id)
  }

  const updatePrices = (priceUpdates: Record<string, number>) => {
    alertsService.updatePrices(priceUpdates)
  }

  return {
    alerts,
    activeAlerts: alerts.filter((alert) => alert.isActive),
    createAlert,
    removeAlert,
    updatePrices,
  }
}
