import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In production, this would fetch real metrics from your model
    // const response = await fetch('http://localhost:8000/metrics')
    // const metrics = await response.json()

    // Mock metrics for now
    const metrics = {
      accuracy: 0.732,
      precision: 0.685,
      recall: 0.741,
      sharpe: 1.84,
      total_predictions: 15420,
      last_updated: new Date().toISOString(),
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching model metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
