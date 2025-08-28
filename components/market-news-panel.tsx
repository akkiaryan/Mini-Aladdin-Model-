"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Newspaper, ExternalLink, Clock } from "lucide-react"
import { useNews } from "@/hooks/use-news"

export function NewsDropdown() {
  const { newsData, loading, error } = useNews()

  const isMarketOpen = () => {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 6 = Saturday
    const hour = now.getHours()
    const minutes = now.getMinutes()
    const currentTime = hour * 60 + minutes

    // Market closed on weekends
    if (day === 0 || day === 6) return false

    // Market hours: 9:30 AM to 4:00 PM (570 minutes to 960 minutes)
    return currentTime >= 570 && currentTime <= 960
  }

  const marketOpen = isMarketOpen()

  console.log("[v0] NewsDropdown rendering, marketOpen:", marketOpen)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Newspaper className="h-[1.2rem] w-[1.2rem]" />
          <div
            className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
              marketOpen ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="sr-only">Market News</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="h-4 w-4" />
            <span className="font-medium">Market News</span>
            <Badge
              variant={marketOpen ? "default" : "secondary"}
              className={marketOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"}
            >
              <Clock className="h-3 w-3 mr-1" />
              {marketOpen ? "Market Open" : "Market Closed"}
            </Badge>
          </div>

          {loading && (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">Unable to load news</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          )}

          {newsData && newsData.news && (
            <div className="space-y-3">
              {newsData.news.slice(0, 5).map((article, index) => (
                <div key={index} className="border-b border-border pb-3 last:border-b-0">
                  <h4 className="text-sm font-medium leading-tight mb-1">{article.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{article.snippet}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => window.open(article.link, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {newsData.news.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent news available</p>
              )}
            </div>
          )}

          {!loading && !error && !newsData && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">News will appear here</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MarketNewsPanel() {
  return null
}
