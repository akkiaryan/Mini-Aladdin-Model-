import pandas as pd
import numpy as np
from prophet import Prophet
from datetime import datetime, timedelta
import yfinance as yf
import warnings
warnings.filterwarnings('ignore')

class ProphetForecaster:
    def __init__(self):
        self.model = None
        
    def prepare_data(self, symbol, period="1y"):
        """Fetch and prepare data for Prophet model"""
        try:
            # Fetch historical data
            ticker = yf.Ticker(symbol)
            data = ticker.history(period=period)
            
            if data.empty:
                return None
                
            # Prepare data for Prophet (needs 'ds' and 'y' columns)
            df = pd.DataFrame({
                'ds': data.index,
                'y': data['Close']
            })
            
            return df
        except Exception as e:
            print(f"Error preparing data for {symbol}: {e}")
            return None
    
    def train_and_forecast(self, symbol, forecast_days=5):
        """Train Prophet model and generate forecast"""
        try:
            # Prepare training data
            df = self.prepare_data(symbol)
            if df is None:
                return None
            
            # Initialize and train Prophet model
            model = Prophet(
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=True,
                changepoint_prior_scale=0.05,
                seasonality_prior_scale=10.0,
                holidays_prior_scale=10.0,
                seasonality_mode='multiplicative'
            )
            
            model.fit(df)
            
            # Create future dataframe
            future = model.make_future_dataframe(periods=forecast_days)
            
            # Generate forecast
            forecast = model.predict(future)
            
            # Extract forecast data
            forecast_data = forecast.tail(forecast_days)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict('records')
            
            # Calculate trend and confidence
            current_price = df['y'].iloc[-1]
            forecast_price = forecast_data[-1]['yhat']
            trend = "BULLISH" if forecast_price > current_price else "BEARISH"
            confidence = min(95, max(60, abs((forecast_price - current_price) / current_price) * 100 + 70))
            
            return {
                'symbol': symbol,
                'current_price': float(current_price),
                'forecast_data': forecast_data,
                'trend': trend,
                'confidence': float(confidence),
                'price_change_pct': float((forecast_price - current_price) / current_price * 100),
                'generated_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error forecasting for {symbol}: {e}")
            return None

# Example usage
if __name__ == "__main__":
    forecaster = ProphetForecaster()
    
    # Test with a few symbols
    symbols = ["SBIN.NS", "RELIANCE.NS", "HDFCBANK.NS"]
    
    for symbol in symbols:
        print(f"\nForecasting for {symbol}...")
        result = forecaster.train_and_forecast(symbol)
        if result:
            print(f"Current Price: ₹{result['current_price']:.2f}")
            print(f"5-day Trend: {result['trend']}")
            print(f"Confidence: {result['confidence']:.1f}%")
            print(f"Expected Change: {result['price_change_pct']:.2f}%")
