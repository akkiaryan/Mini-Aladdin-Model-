"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const watchlistData = [
  { symbol: "SBIN.NS", name: "State Bank of India", price: 542.3, change: 2.4, volume: "12.5M" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries", price: 2456.75, change: -0.8, volume: "8.2M" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", price: 1678.9, change: 1.2, volume: "15.3M" },
  { symbol: "INFY.NS", name: "Infosys", price: 1834.5, change: 0.5, volume: "6.8M" },
  { symbol: "TCS.NS", name: "Tata Consultancy", price: 3987.25, change: -1.1, volume: "4.2M" },
]

interface WatchlistProps {
  selectedSymbol: string
  onSymbolSelect: (symbol: string) => void
}

export function Watchlist({ selectedSymbol, onSymbolSelect }: WatchlistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair">Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {watchlistData.map((stock) => (
          <Button
            key={stock.symbol}
            variant={selectedSymbol === stock.symbol ? "secondary" : "ghost"}
            className="w-full justify-start p-3 h-auto"
            onClick={() => onSymbolSelect(stock.symbol)}
          >
            <div className="flex flex-col items-start w-full space-y-1">
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">{stock.symbol}</span>
                <div className="flex items-center space-x-1">
                  {stock.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : stock.change < 0 ? (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  ) : (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={`text-xs font-mono ${
                      stock.change > 0 ? "text-green-600" : stock.change < 0 ? "text-red-600" : "text-muted-foreground"
                    }`}
                  >
                    {stock.change > 0 ? "+" : ""}
                    {stock.change}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                <span className="truncate">{stock.name}</span>
                <span className="font-mono">₹{stock.price}</span>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
