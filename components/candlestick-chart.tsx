"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CandlestickChartProps {
  symbol: string
}

// Mock candlestick data generator
function generateCandles(n = 240) {
  let p = 100
  const out: any[] = []
  for (let i = 0; i < n; i++) {
    const o = p
    const c = (p += (Math.random() - 0.5) * 2)
    const h = Math.max(o, c) + Math.random() * 1.2
    const l = Math.min(o, c) - Math.random() * 1.2
    out.push({
      time: Date.now() - (n - i) * 60000, // 1 minute intervals
      open: o,
      high: h,
      low: l,
      close: c,
    })
  }
  return out
}

export function CandlestickChart({ symbol }: CandlestickChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()

  const [zoomLevel, setZoomLevel] = useState(1)
  const [panOffset, setPanOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouseX, setLastMouseX] = useState(0)

  const data = useRef(generateCandles(100))

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev * 1.5, 10))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev / 1.5, 0.5))
  }, [])

  const resetZoom = useCallback(() => {
    setZoomLevel(1)
    setPanOffset(0)
  }, [])

  const renderChart = useCallback(() => {
    if (!chartRef.current) return

    const width = chartRef.current.clientWidth || 600
    const height = chartRef.current.clientHeight || 300
    const padding = { top: 20, right: 60, bottom: 40, left: 60 }

    const totalCandles = data.current.length
    const visibleCandles = Math.floor(totalCandles / zoomLevel)
    const startIndex = Math.max(
      0,
      Math.min(totalCandles - visibleCandles, Math.floor(panOffset + (totalCandles - visibleCandles) / 2)),
    )
    const endIndex = Math.min(totalCandles, startIndex + visibleCandles)
    const visibleData = data.current.slice(startIndex, endIndex)

    const prices = visibleData.flatMap((d) => [d.high, d.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice || 1

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", width.toString())
    svg.setAttribute("height", height.toString())
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    svg.style.background = "transparent"
    svg.style.cursor = isDragging ? "grabbing" : "grab"

    // Clear previous content
    chartRef.current.innerHTML = ""
    chartRef.current.appendChild(svg)
    svgRef.current = svg

    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const candleWidth = Math.max(2, (chartWidth / visibleData.length) * 0.8)

    const priceSteps = 6
    for (let i = 0; i <= priceSteps; i++) {
      const price = minPrice + (priceRange * i) / priceSteps
      const y = padding.top + chartHeight - (i * chartHeight) / priceSteps

      // Price line
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", padding.left.toString())
      line.setAttribute("y1", y.toString())
      line.setAttribute("x2", (padding.left + chartWidth).toString())
      line.setAttribute("y2", y.toString())
      line.setAttribute("stroke", "currentColor")
      line.setAttribute("stroke-width", "0.5")
      line.setAttribute("opacity", "0.2")
      svg.appendChild(line)

      // Price label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", (padding.left - 10).toString())
      text.setAttribute("y", (y + 4).toString())
      text.setAttribute("text-anchor", "end")
      text.setAttribute("font-size", "11")
      text.setAttribute("fill", "currentColor")
      text.setAttribute("opacity", "0.7")
      text.textContent = `₹${price.toFixed(2)}`
      svg.appendChild(text)
    }

    const timeSteps = Math.min(8, visibleData.length)
    for (let i = 0; i <= timeSteps; i++) {
      const dataIndex = Math.floor((i * (visibleData.length - 1)) / timeSteps)
      const candle = visibleData[dataIndex]
      if (!candle) continue

      const x = padding.left + (dataIndex * chartWidth) / visibleData.length

      // Time line
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", x.toString())
      line.setAttribute("y1", padding.top.toString())
      line.setAttribute("x2", x.toString())
      line.setAttribute("y2", (padding.top + chartHeight).toString())
      line.setAttribute("stroke", "currentColor")
      line.setAttribute("stroke-width", "0.5")
      line.setAttribute("opacity", "0.2")
      svg.appendChild(line)

      // Time label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", x.toString())
      text.setAttribute("y", (padding.top + chartHeight + 20).toString())
      text.setAttribute("text-anchor", "middle")
      text.setAttribute("font-size", "11")
      text.setAttribute("fill", "currentColor")
      text.setAttribute("opacity", "0.7")
      const time = new Date(candle.time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      text.textContent = time
      svg.appendChild(text)
    }

    visibleData.forEach((candle, i) => {
      const x = padding.left + (i * chartWidth) / visibleData.length
      const yHigh = padding.top + ((maxPrice - candle.high) / priceRange) * chartHeight
      const yLow = padding.top + ((maxPrice - candle.low) / priceRange) * chartHeight
      const yOpen = padding.top + ((maxPrice - candle.open) / priceRange) * chartHeight
      const yClose = padding.top + ((maxPrice - candle.close) / priceRange) * chartHeight

      const isGreen = candle.close > candle.open
      const color = isGreen ? "#22c55e" : "#ef4444"

      // Wick line
      const wick = document.createElementNS("http://www.w3.org/2000/svg", "line")
      wick.setAttribute("x1", (x + candleWidth / 2).toString())
      wick.setAttribute("y1", yHigh.toString())
      wick.setAttribute("x2", (x + candleWidth / 2).toString())
      wick.setAttribute("y2", yLow.toString())
      wick.setAttribute("stroke", color)
      wick.setAttribute("stroke-width", "1")
      svg.appendChild(wick)

      // Candle body
      const body = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      body.setAttribute("x", x.toString())
      body.setAttribute("y", Math.min(yOpen, yClose).toString())
      body.setAttribute("width", candleWidth.toString())
      body.setAttribute("height", Math.max(1, Math.abs(yClose - yOpen)).toString())
      body.setAttribute("fill", color)
      body.setAttribute("stroke", color)
      svg.appendChild(body)
    })
  }, [zoomLevel, panOffset, isDragging])

  useEffect(() => {
    if (!chartRef.current || !svgRef.current) return

    const svg = svgRef.current

    // Mouse wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setZoomLevel((prev) => Math.max(0.5, Math.min(10, prev * delta)))
    }

    // Mouse drag for panning
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      setLastMouseX(e.clientX)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - lastMouseX
      const sensitivity = 0.5
      setPanOffset((prev) => prev - (deltaX * sensitivity) / zoomLevel)
      setLastMouseX(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    // Add event listeners
    svg.addEventListener("wheel", handleWheel, { passive: false })
    svg.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      svg.removeEventListener("wheel", handleWheel)
      svg.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, lastMouseX, zoomLevel]) // Removed touch-related dependencies

  useEffect(() => {
    if (!chartRef.current) return

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(() => {
        renderChart()
      }, 100)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(chartRef.current)

    // Initial render
    renderChart()

    return () => {
      resizeObserver.disconnect()
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [symbol, renderChart])

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button variant="outline" size="sm" onClick={zoomIn} className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
          <ZoomIn className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut} className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
          <ZoomOut className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetZoom}
          className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      <div ref={chartRef} className="flex-1 w-full bg-muted/20 rounded-lg min-h-[200px] relative" />
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <div className="flex items-center gap-4">
          <span>Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
          <span>5-minute intervals</span>
        </div>
      </div>
    </div>
  )
}
