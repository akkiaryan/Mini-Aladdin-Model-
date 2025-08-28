interface NewsArticle {
  title: string
  snippet: string
  link: string
  source: string
  date: string
  thumbnail?: string
}

interface SerpApiResponse {
  news_results?: Array<{
    title: string
    snippet: string
    link: string
    source: string
    date: string
    thumbnail?: string
  }>
}

class NewsService {
  private apiKey = "a50e40e200b40fbe0365238db6e0a64f5eb77ff219cb47d801138dbc2022ce71"
  private baseUrl = "https://serpapi.com/search"

  private isMarketOpen(): boolean {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 6 = Saturday
    const hour = now.getHours()
    const minute = now.getMinutes()
    const currentTime = hour * 60 + minute

    // Market closed on weekends
    if (day === 0 || day === 6) return false

    // Market hours: 9:15 AM to 3:30 PM IST (Indian market)
    const marketOpen = 9 * 60 + 15 // 9:15 AM
    const marketClose = 15 * 60 + 30 // 3:30 PM

    return currentTime >= marketOpen && currentTime <= marketClose
  }

  async fetchFinancialNews(query = "Indian stock market news"): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        tbm: "nws", // News search
        api_key: this.apiKey,
        num: "10",
        hl: "en",
        gl: "in", // India
        tbs: "qdr:d", // Last 24 hours
      })

      const response = await fetch(`${this.baseUrl}?${params}`)

      if (!response.ok) {
        throw new Error(`SerpAPI error: ${response.status}`)
      }

      const data: SerpApiResponse = await response.json()

      return (data.news_results || []).map((article) => ({
        title: article.title,
        snippet: article.snippet,
        link: article.link,
        source: article.source,
        date: article.date,
        thumbnail: article.thumbnail,
      }))
    } catch (error) {
      console.error("Error fetching news:", error)
      return []
    }
  }

  async getMarketNews(): Promise<NewsArticle[]> {
    const queries = ["NSE BSE Indian stock market today", "Sensex Nifty market news", "Indian equity market analysis"]

    try {
      const newsPromises = queries.map((query) => this.fetchFinancialNews(query))
      const newsArrays = await Promise.all(newsPromises)

      // Combine and deduplicate news
      const allNews = newsArrays.flat()
      const uniqueNews = allNews.filter(
        (article, index, self) => index === self.findIndex((a) => a.title === article.title),
      )

      return uniqueNews.slice(0, 15) // Return top 15 articles
    } catch (error) {
      console.error("Error getting market news:", error)
      return []
    }
  }

  getMarketStatus(): { isOpen: boolean; nextOpen?: string; message: string } {
    const isOpen = this.isMarketOpen()
    const now = new Date()

    if (isOpen) {
      return {
        isOpen: true,
        message: "Market is currently open",
      }
    }

    // Calculate next market open
    const nextOpen = new Date(now)
    const day = now.getDay()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const currentTime = hour * 60 + minute

    if (day === 0) {
      // Sunday
      nextOpen.setDate(now.getDate() + 1) // Monday
    } else if (day === 6) {
      // Saturday
      nextOpen.setDate(now.getDate() + 2) // Monday
    } else if (currentTime >= 15 * 60 + 30) {
      // After market close
      nextOpen.setDate(now.getDate() + 1) // Next day
    }

    nextOpen.setHours(9, 15, 0, 0) // 9:15 AM

    return {
      isOpen: false,
      nextOpen: nextOpen.toISOString(),
      message: day === 0 || day === 6 ? "Market closed - Weekend" : "Market closed",
    }
  }
}

export const newsService = new NewsService()
export type { NewsArticle }
