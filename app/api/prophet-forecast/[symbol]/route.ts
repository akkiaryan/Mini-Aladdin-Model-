import { type NextRequest, NextResponse } from "next/server"

// Mock Prophet forecast data - replace with actual Python service call
const generateMockForecast = (symbol: string) => {
  const basePrice = Math.random() * 1000 + 500
  const trend = Math.random() > 0.5 ? "BULLISH" : "BEARISH"
  const confidence = Math.random() * 35 + 60 // 60-95%

  const forecastData = Array.from({ length: 5 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)

    const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
    const trendMultiplier = trend === "BULLISH" ? 1 + i * 0.01 : 1 - i * 0.01
    const price = basePrice * trendMultiplier * (1 + variation)

    return {
      ds: date.toISOString(),
      yhat: price,
      yhat_lower: price * 0.95,
      yhat_upper: price * 1.05,
    }
  })

  return {
    symbol,
    current_price: basePrice,
    forecast_data: forecastData,
    trend,
    confidence,
    price_change_pct: trend === "BULLISH" ? Math.random() * 10 + 2 : -(Math.random() * 10 + 2),
    generated_at: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const symbol = params.symbol

    // In production, this would call your Python Prophet service
    // const response = await fetch(`http://localhost:8000/prophet-forecast/${symbol}`)
    // const forecast = await response.json()

    const forecast = generateMockForecast(symbol)

    return NextResponse.json(forecast)
  } catch (error) {
    console.error("Prophet forecast error:", error)
    return NextResponse.json({ error: "Failed to generate forecast" }, { status: 500 })
  }
}
