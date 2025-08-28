"use client"
import { motion, MotionConfig } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 28 }}>
      <div className="min-h-screen bg-bg">
        <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-bg">
                <Brain className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold text-ink">QuantDesk</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="default" size="sm">
                <Link href="/app">Open App</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="py-24 md:py-32">
          <div className="container hero-section">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-fit bg-muted text-ink-muted">
                    Mini-Aladin AI
                  </Badge>
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl text-balance text-ink">
                    Minimalist quant signals
                  </h1>
                  <p className="text-xl text-ink-muted text-pretty max-w-[600px]">
                    Clean, focused trading platform with advanced prediction models and real-time market analysis.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-lg px-8">
                    <Link href="/app">
                      Open App
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 }}
                className="relative"
              >
                <Card className="aspect-[4/3] border-border bg-surface p-8 flex items-center justify-center">
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-32 h-32 flex items-center justify-center">
                      <Image
                        src="/images/idea-in-air.png"
                        alt="Innovation and insights"
                        width={128}
                        height={128}
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-mono font-semibold text-positive">73.2%</div>
                      <div className="text-sm text-ink-muted">Prediction Accuracy</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-16 max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-semibold sm:text-4xl text-ink">Professional Tools</h2>
              <p className="text-xl text-ink-muted max-w-[800px] mx-auto text-balance">
                Everything you need for systematic trading
              </p>
            </motion.div>

            <div className="features-grid max-w-6xl mx-auto">
              {[
                {
                  image: "/images/analytics.png",
                  alt: "Advanced analytics",
                  title: "Advanced Charts",
                  description: "Real-time candlestick charts with technical indicators and custom overlays.",
                },
                {
                  image: "/images/reading-expert.png",
                  alt: "Research and expertise",
                  title: "Model Insights",
                  description: "Mini-Aladin prediction model with probability scores and regime detection.",
                },
                {
                  image: "/images/lending-hand.png",
                  alt: "Collaboration and support",
                  title: "Portfolio Analytics",
                  description: "Risk metrics, performance attribution, and optimization tools.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.995 }}
                >
                  <Card className="h-full hover:bg-surface/80 transition-colors border-border">
                    <CardHeader>
                      <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Image
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.alt}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <CardTitle className="text-ink text-center">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed text-ink-muted text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-muted/30">
          <div className="container py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-accent text-bg">
                  <Brain className="h-4 w-4" />
                </div>
                <span className="font-semibold text-ink">QuantDesk</span>
              </div>
              <p className="text-sm text-ink-muted">This demo uses local mock data. No APIs.</p>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}
