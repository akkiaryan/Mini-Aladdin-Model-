import { NextResponse } from "next/server"
import { newsService } from "@/lib/news-service"

export async function GET() {
  try {
    const marketStatus = newsService.getMarketStatus()
    const news = await newsService.getMarketNews()

    return NextResponse.json({
      news,
      marketStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("News API error:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
