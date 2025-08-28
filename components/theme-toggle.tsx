"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    console.log("[v0] ThemeToggle mounted, theme:", theme, "resolvedTheme:", resolvedTheme)
  }, [theme, resolvedTheme])

  const handleThemeToggle = () => {
    console.log("[v0] Theme toggle CLICKED! Current theme:", theme, "resolvedTheme:", resolvedTheme)
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    console.log("[v0] Switching to theme:", newTheme)
    setTheme(newTheme)

    setTimeout(() => {
      console.log("[v0] Theme after change attempt:", theme, "resolvedTheme:", resolvedTheme)
    }, 100)
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 hover:bg-muted transition-colors relative z-50"
      onClick={(e) => {
        console.log("[v0] Button click event triggered!")
        e.preventDefault()
        e.stopPropagation()
        handleThemeToggle()
      }}
      onMouseDown={() => console.log("[v0] Button mouse down")}
      onMouseUp={() => console.log("[v0] Button mouse up")}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
