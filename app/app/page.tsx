"use client"

import { useState, useEffect } from "react"
import { motion, MotionConfig } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, DollarSign, Target } from "lucide-react"
import { Watchlist } from "@/components/watchlist"
import { CandlestickChart } from "@/components/candlestick-chart"
import { MiniAladinPanel } from "@/components/mini-aladin-panel"
import { ProphetForecastPanel } from "@/components/prophet-forecast-panel"
import { PriceAlertsPanel } from "@/components/price-alerts-panel"
import { useBatchPredictions, useModelMetrics } from "@/hooks/use-predictions"
import { useAlerts } from "@/hooks/use-alerts"
import { AppHeader } from "@/components/app-header"

export default function AppDashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("SBIN.NS")
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const watchlistSymbols = ["SBIN.NS", "RELIANCE.NS", "HDFCBANK.NS", "INFY.NS", "TCS.NS"]
  const { signals, loading: predictionsLoading } = useBatchPredictions(watchlistSymbols)
  const { metrics } = useModelMetrics()
  const { updatePrices } = useAlerts()

  const mockKPIs = {
    pnl: { value: 12.4, change: 2.1 },
    hitRate: { value: metrics?.accuracy ? metrics.accuracy * 100 : 73.2, change: 1.8 },
    maxDrawdown: { value: -8.3, change: 0.5 },
    sharpe: { value: metrics?.sharpe || 1.84, change: 0.12 },
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (signals && Object.keys(signals).length > 0) {
      const priceUpdates: Record<string, number> = {}
      Object.entries(signals).forEach(([symbol, signal]) => {
        if (signal?.currentPrice) {
          priceUpdates[symbol] = signal.currentPrice
        }
      })
      updatePrices(priceUpdates)
    }
  }, [signals, updatePrices])

  if (isLoading || predictionsLoading) {
    return (
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 28 }}>
        <div className="min-h-screen bg-bg">
          <AppHeader />
          <div className="container py-8">
            <div className="grid gap-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse border-border">
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-12"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 28 }}>
      <div className="min-h-screen bg-bg">
        <AppHeader />

        <div className="py-6 space-y-6">
          <div className="container">
            {/* KPI Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4 max-w-7xl mx-auto"
            >
              {[
                {
                  title: "P&L",
                  value: `${mockKPIs.pnl.value > 0 ? "+" : ""}${mockKPIs.pnl.value}%`,
                  change: mockKPIs.pnl.change,
                  icon: DollarSign,
                  color: mockKPIs.pnl.value > 0 ? "text-positive" : "text-negative",
                },
                {
                  title: "Hit Rate",
                  value: `${mockKPIs.hitRate.value}%`,
                  change: mockKPIs.hitRate.change,
                  icon: Target,
                  color: "text-ink",
                },
                {
                  title: "Max Drawdown",
                  value: `${mockKPIs.maxDrawdown.value}%`,
                  change: mockKPIs.maxDrawdown.change,
                  icon: TrendingDown,
                  color: "text-negative",
                },
                {
                  title: "Sharpe Ratio",
                  value: mockKPIs.sharpe.value.toString(),
                  change: mockKPIs.sharpe.change,
                  icon: Activity,
                  color: "text-ink",
                },
              ].map((kpi, index) => (
                <motion.div
                  key={kpi.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.06,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                  className="motion-stagger"
                >
                  <Card className="hover:bg-surface/80 transition-colors border-border kpi-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-ink-muted">{kpi.title}</CardTitle>
                      <kpi.icon className="h-4 w-4 text-ink-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className={`kpi-numeral font-mono font-semibold ${kpi.color}`}>{kpi.value}</div>
                      <div className="flex items-center text-xs text-ink-muted">
                        {kpi.change > 0 ? (
                          <TrendingUp className="mr-1 h-3 w-3 text-positive" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3 text-negative" />
                        )}
                        {Math.abs(kpi.change)}% from last period
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop Bento Grid Layout */}
          <div className="container">
            <div className="max-w-7xl mx-auto">
              <div className="hidden lg:block space-y-6">
                {/* Main 3-column layout */}
                <div className="grid grid-cols-12 gap-4 h-[500px]">
                  {/* Left Column - Watchlist and Prophet stacked */}
                  <div className="col-span-3 flex flex-col gap-4 h-full">
                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.16 }}
                      className="flex-1"
                    >
                      <Watchlist selectedSymbol={selectedSymbol} onSymbolSelect={setSelectedSymbol} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-1"
                    >
                      <ProphetForecastPanel symbol={selectedSymbol} />
                    </motion.div>
                  </div>

                  {/* Center Column - Main Chart */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.24 }}
                    className="col-span-6 h-full"
                  >
                    <Card className="h-full border-border">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-ink font-mono">{selectedSymbol}</CardTitle>
                            <CardDescription className="text-ink-muted">Real-time price action</CardDescription>
                          </div>
                          <Badge variant="secondary" className="bg-muted text-ink-muted">
                            <Activity className="mr-1 h-3 w-3" />
                            Live
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="h-[calc(100%-80px)] p-4">
                        <CandlestickChart symbol={selectedSymbol} />
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Right Column - Mini-Aladin and Price Alerts stacked */}
                  <div className="col-span-3 flex flex-col gap-4 h-full">
                    <motion.div
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.28 }}
                      className="flex-1"
                    >
                      <MiniAladinPanel signal={signals[selectedSymbol]} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.32 }}
                      className="flex-1"
                    >
                      <PriceAlertsPanel
                        symbol={selectedSymbol}
                        currentPrice={signals[selectedSymbol]?.currentPrice || 0}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet Layout */}
              <div className="lg:hidden space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.24 }}
                  className="h-[300px] xs:h-[400px] md:h-[500px]"
                >
                  <Card className="h-full border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-ink font-mono text-sm xs:text-base">{selectedSymbol}</CardTitle>
                          <CardDescription className="text-ink-muted text-xs xs:text-sm">
                            Real-time price action
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-muted text-ink-muted text-xs">
                          <Activity className="mr-1 h-3 w-3" />
                          Live
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-60px)] p-2 xs:p-4">
                      <CandlestickChart symbol={selectedSymbol} />
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="grid gap-4 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16 }}
                  >
                    <Watchlist selectedSymbol={selectedSymbol} onSymbolSelect={setSelectedSymbol} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.28 }}
                  >
                    <MiniAladinPanel signal={signals[selectedSymbol]} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ProphetForecastPanel symbol={selectedSymbol} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 }}
                  >
                    <PriceAlertsPanel
                      symbol={selectedSymbol}
                      currentPrice={signals[selectedSymbol]?.currentPrice || 0}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  )
}
