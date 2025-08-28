// Mock data for the Mini-Aladin prediction model

export type AladinSignal = {
  symbol: string
  probUp5d: number
  regime: "bull" | "bear" | "sideways"
  confidence: number
  drivers: string[]
  updatedAt: string
}

export const watchlist = ["SBIN.NS", "RELIANCE.NS", "HDFCBANK.NS", "INFY.NS", "TCS.NS"]

export const signals: Record<string, AladinSignal> = {
  "SBIN.NS": {
    probUp5d: 0.71,
    regime: "bull",
    confidence: 0.85,
    drivers: ["Momentum strong", "Positive earnings drift", "Macro tailwind index"],
    symbol: "SBIN.NS",
    updatedAt: "2025-08-27T09:30:00Z",
  },
  "RELIANCE.NS": {
    probUp5d: 0.54,
    regime: "sideways",
    confidence: 0.62,
    drivers: ["Range-bound volatility", "Neutral sentiment"],
    symbol: "RELIANCE.NS",
    updatedAt: "2025-08-27T09:30:00Z",
  },
  "HDFCBANK.NS": {
    probUp5d: 0.68,
    regime: "bull",
    confidence: 0.78,
    drivers: ["Strong fundamentals", "Sector rotation positive", "Technical breakout"],
    symbol: "HDFCBANK.NS",
    updatedAt: "2025-08-27T09:30:00Z",
  },
  "INFY.NS": {
    probUp5d: 0.45,
    regime: "bear",
    confidence: 0.72,
    drivers: ["Earnings headwinds", "Dollar strength negative", "Sector underperformance"],
    symbol: "INFY.NS",
    updatedAt: "2025-08-27T09:30:00Z",
  },
  "TCS.NS": {
    probUp5d: 0.58,
    regime: "sideways",
    confidence: 0.65,
    drivers: ["Mixed earnings signals", "Consolidation pattern", "Awaiting catalyst"],
    symbol: "TCS.NS",
    updatedAt: "2025-08-27T09:30:00Z",
  },
}

export function generateCandles(n = 240) {
  let p = 100
  const out: any[] = []
  for (let i = 0; i < n; i++) {
    const o = p
    const c = (p += (Math.random() - 0.5) * 2)
    const h = Math.max(o, c) + Math.random() * 1.2
    const l = Math.min(o, c) - Math.random() * 1.2
    out.push({
      time: i,
      open: o,
      high: h,
      low: l,
      close: c,
    })
  }
  return out
}
