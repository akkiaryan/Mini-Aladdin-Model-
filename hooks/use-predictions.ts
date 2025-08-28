"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { predictionService, type PredictionSignal, type ModelMetrics } from "@/lib/prediction-service"

export function usePrediction(symbol: string) {
  const [signal, setSignal] = useState<PredictionSignal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPrediction = useCallback(async () => {
    if (!symbol) return

    setLoading(true)
    setError(null)

    try {
      const prediction = await predictionService.getPrediction(symbol)
      setSignal(prediction)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch prediction")
    } finally {
      setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    fetchPrediction()
  }, [fetchPrediction])

  return { signal, loading, error, refetch: fetchPrediction }
}

export function useBatchPredictions(symbols: string[]) {
  const [signals, setSignals] = useState<Record<string, PredictionSignal>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const memoizedSymbols = useMemo(() => symbols, [JSON.stringify(symbols)])

  const fetchPredictions = useCallback(async () => {
    if (memoizedSymbols.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const predictions = await predictionService.getBatchPredictions(memoizedSymbols)
      setSignals(predictions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch predictions")
    } finally {
      setLoading(false)
    }
  }, [memoizedSymbols])

  useEffect(() => {
    fetchPredictions()
  }, [fetchPredictions])

  return { signals, loading, error, refetch: fetchPredictions }
}

export function useModelMetrics() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const modelMetrics = await predictionService.getModelMetrics()
        setMetrics(modelMetrics)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return { metrics, loading, error }
}
