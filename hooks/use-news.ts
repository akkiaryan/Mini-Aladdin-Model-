"use client"

import { useState, useEffect } from "react"
import type { NewsArticle } from "@/lib/news-service"

interface MarketStatus {
  isOpen: boolean
  nextOpen?: string
  message: string
}

interface NewsData {
  news: NewsArticle[]
  marketStatus: MarketStatus
  timestamp: string
}

export function useNews() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        if (!response.ok) throw new Error("Failed to fetch news")

        const data = await response.json()
        setNewsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Refresh news every 15 minutes during market hours
    const interval = setInterval(fetchNews, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { newsData, loading, error }
}
