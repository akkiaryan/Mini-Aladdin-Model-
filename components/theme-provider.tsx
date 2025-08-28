"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    console.log("[v0] ThemeProvider initialized with props:", props)
  }, []) // Fixed lint error by using an empty dependency array

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
