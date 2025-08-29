# Mini Aladin — Finance Quant Options  
**Technical Report v1.0 — August 29, 2025**

> A compact, research-grade quant pipeline inspired by institutional risk, research, and portfolio construction workflows (e.g., platforms like BlackRock’s Aladdin), adapted for retail-friendly, explainable decision support.

---

## Why This Project Matters

Most YouTube tutorials on “quant trading” stop at simple moving averages, candlestick charts, or a single ML model. They rarely cover how signals connect to **risk models** or **portfolio construction**, which is exactly what makes real institutional systems like BlackRock’s Aladdin powerful.  

**Mini Aladin is different.** It isn’t just a one-off predictor — it is a **coherent pipeline** that ties together:  
- **Integrated data ingestion** (prices, macro signals, news sentiment)  
- **Multiple modeling engines** (XGBoost, ARIMA, Prophet, LSTM)  
- **Risk modeling** (covariance shrinkage)  
- **Portfolio optimization** (Markowitz mean–variance)  
- **Explainable outputs** (BUY/WATCH/AVOID tags, feature importances, backtested equity curves)  

This makes Mini Aladin a **scaled-down but true reflection** of the “research spine” of BlackRock’s Aladdin.

---

## Mini Aladin vs. BlackRock’s Aladdin

| **Aspect** | **BlackRock Aladdin** | **Mini Aladin (this project)** |
|------------|-----------------------|--------------------------------|
| **Scale** | Enterprise platform managing **$20+ trillion AUM** | Research prototype for a curated stock universe (e.g., NIFTY 50) |
| **Data ingestion** | Global feeds: equities, bonds, derivatives, private equity, ESG, climate data | Yahoo Finance (prices), FRED/RBI (macro), DistilBERT (news sentiment) |
| **Risk analytics** | Factor models, Monte Carlo simulations, stress/scenario tests | Covariance shrinkage, historical backtests |
| **Modeling** | Proprietary factor models, scenario engines, climate sims, ML | XGBoost classifier (core), ARIMA/Prophet, LSTM |
| **Portfolio construction** | Advanced optimizers with custom constraints, regulatory compliance | Markowitz mean–variance optimization with caps and cash buffer |
| **Execution & compliance** | Integrated trading, compliance, accounting, reporting | Signal CSVs, portfolio weights, equity curve plots |
| **Infrastructure** | Enterprise cloud + Aladdin Data Cloud (Snowflake) | Python notebooks, open-source libs (scikit-learn, xgboost, Prophet, etc.) |
| **Governance** | Regulatory oversight, validation teams, institutional compliance | Transparent, educational, reproducible with saved artifacts |
| **Purpose** | Global asset managers, pension funds, sovereign wealth funds | Students, researchers, hobbyists learning quant finance |

### In short:
- **Aladdin = industrial engine**: full-stack risk, trading, compliance, and reporting at global scale.  
- **Mini Aladin = research lab**: open, transparent system that shows how the same math (returns, volatility, covariance, optimization) actually works in practice.  

---

## Use Cases

- **Students & learners:** Explore how institutional quant platforms actually work in simplified form.  
- **Researchers:** Extend with new factors, NLP embeddings, or alternative risk models.  
- **Hackathons/projects:** Demonstrate end-to-end quant pipelines, not just toy predictors.  
- **Personal experimentation:** Learn risk-aware portfolio construction beyond simple charting strategies.  

---

## 1. Executive Summary
**Goal.** Build a mini-Aladdin-style decision engine that fuses market prices, macro indicators, and news sentiment to produce:  
- Per-name 5-day directional probabilities and discrete signals (**BUY/WATCH/AVOID**)  
- A daily portfolio plan via mean–variance optimization with risk controls  

**Core stack.** Feature engineering → XGBoost classifier for 5-day direction → auxiliary ARIMA/Prophet/LSTM → covariance shrinkage risk model → Markowitz optimizer → backtesting + reporting.  

---

## 2. Objectives & Scope
1. Generate actionable **5-day horizon research signals**.  
2. Construct a **robust daily portfolio plan** with risk-adjusted weights.  
3. Ensure **explainability** via feature importances and simple math.  
4. Maintain **reproducibility** with saved models, fixed seeds, and ordered splits.  

---

## 3. System Architecture
**Phase 1 — Dataset Build:** Collect stock prices (Yahoo), macro indicators (FRED), and news sentiment (DistilBERT).  
**Phase 2 — Model Training:** Train XGBoost binary classifier on 80/20 time split.  
**Phase 3 — Backtesting:** Rebalance every $H$ days, compute equity curve & Sharpe.  
**Phase 4 — Risk Modeling:** 60-day covariance matrix with shrinkage.  
**Phase 5 — Forecasting Utilities:** ARIMA, Prophet, LSTM for scenario analysis.  
**Phase 6 — Reporting:** Signals CSV, portfolio plans, annotated plots.  
**Phase 7 — Ops Hygiene:** Versioned outputs, artifacts, API validation.  

---

## 4. Data & Feature Engineering

**Price features:**
- Simple return: $r_t = \frac{P_t}{P_{t-1}} - 1$  
- 5-day return: $r^{(5)}_t = \frac{P_t}{P_{t-5}} - 1$  
- 10-day volatility: $\sigma^{(10)}_t = \text{stdev}(r_{t-9}, …, r_t)$  
- RSI(14): $\text{RSI}_{14} = 100 - \frac{100}{1 + RS}, \quad RS=\frac{\text{AvgGain}_{14}}{\text{AvgLoss}_{14}}$  

**Macro features:** % change in USDINR, NIFTY, WTI, 10y yields.  
**Sentiment:** Mean score $\bar{s} = \tfrac{1}{n}\sum s_i$, positive share, and article count.  
**Label rule:** $f_t = \frac{P_{t+5}}{P_t} - 1, \quad y_t = \mathbb{1}[f_t > 0.015]$  

---

## 5. Modeling

**XGBoost (primary):** logistic loss, outputs $p_{up,5d}$.  
Signal map:  
- BUY if $p \geq 0.65$  
- WATCH if $0.55 \leq p < 0.65$  
- AVOID otherwise  

**Prophet:**  
$$
y(t) = g(t) + s(t) + h(t) + \varepsilon_t
$$  

**ARIMA:**  
$$
\phi(B)(1-B)^d y_t = \theta(B)\varepsilon_t
$$  

**LSTM:** Sequence of daily returns → binary direction.  

---

## 6. Risk & Portfolio Optimization

**Covariance shrinkage:**  
$$
\Sigma = (1-\lambda)S + \lambda \,\text{diag}(S) + \gamma I
$$  

**Expected returns from probability:**  
$$
\mu_i = \text{scale}\cdot(2p_i - 1), \quad \text{scale}=0.10
$$  

**Mean–variance optimization:**  
$$
\min_{w} \; \tfrac{1}{2}\eta w^\top \Sigma w - \mu^\top w
$$  

Subject to:  
- $\sum w_i = 1-c$ (cash buffer)  
- $0 \leq w_i \leq w_{max}$  

---

## 7. Backtesting

- **Window:** last 20% of data.  
- **Rebalance:** every $H$ days, Top-K names by probability.  
- **Sharpe proxy:**  

$$
\text{Sharpe} = \frac{\bar{R}}{\sigma_R}\sqrt{\tfrac{252}{H}}
$$  

---

## 8. Evaluation Metrics
- Classifier ROC-AUC, accuracy, F1.  
- Signal precision@K.  
- Portfolio return, volatility, Sharpe, drawdown.  

---

## 9. Interpretability
- Feature importances from XGBoost.  
- Ablation studies (drop sentiment or macro).  
- Calibration curves.  
- Drift tests.  

---

## 10. Implementation Notes
Artifacts include:  
- `xgb_model.json` (trained model)  
- `signals_YYYYMMDD.csv` (probabilities + tags)  
- `portfolio_plan_YYYYMMDD.csv` (weights & risk stats)  

---

## 11. Limitations
- 1.5% threshold is heuristic.  
- Feature drift requires retraining.  
- News sparsity may weaken sentiment features.  
- Backtests exclude fees/slippage.  

---

## 12. Future Work
- Better probability calibration.  
- Advanced risk models (Ledoit–Wolf, GARCH).  
- Transaction cost modeling.  
- Richer NLP sentiment.  
- Model registry and governance.  

---

## 13. Key Equations Recap
1. Returns: $r_t = \frac{P_t}{P_{t-1}} - 1$  
2. Forward 5-day return: $f_t = \frac{P_{t+5}}{P_t} - 1$  
3. Label: $y_t = \mathbb{1}[f_t > 0.015]$  
4. RSI(14): $100 - \frac{100}{1+RS}$  
5. Shrinkage covariance: $\Sigma = (1-\lambda)S + \lambda \,\text{diag}(S)+\gamma I$  
6. Prob → Expected return: $\mu = \text{scale}(2p-1)$  
7. Portfolio objective: $\tfrac{1}{2}\eta w^\top \Sigma w - \mu^\top w$  
8. Sharpe proxy: $\frac{\bar{R}}{\sigma_R}\sqrt{\tfrac{252}{H}}$  

---

## 14. Attribution
Built with: **pandas, numpy, yfinance, fredapi, transformers, scikit-learn, xgboost, keras/tensorflow, Prophet, pmdarima, scipy**.  
This repository documents the implementation in `MINI_ALADIN.ipynb` / `mini_aladin.py`.  

---
