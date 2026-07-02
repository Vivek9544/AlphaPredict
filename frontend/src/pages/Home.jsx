import React, { useState } from 'react';
import axios from 'axios';
import StockForm from '../components/StockForm';
import PredictionResult from '../components/PredictionResult';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  const handlePredict = async (ticker) => {
    setLoading(true);
    setError(null);
    setPredictionData(null);

    try {
      // Make a real POST request to the Flask REST API
      const response = await axios.post('http://localhost:5000/api/predict', {
        ticker: ticker.trim().toUpperCase()
      });

      const { actual_prices, predicted_prices } = response.data;
      
      // Extract the most recent known actual price
      const currentPrice = actual_prices[actual_prices.length - 1];
      
      // Extract the very last predicted value
      const predictedPrice = predicted_prices[predicted_prices.length - 1];
      
      // Calculate basic trend
      const trend = predictedPrice > currentPrice ? 'up' : 'down';
      
      // Map API JSON response to our component state
      setPredictionData({
        companyName: `${ticker.toUpperCase()} Stock`,
        symbol: response.data.ticker,
        currentPrice: currentPrice,
        predictedPrice: predictedPrice,
        predictionDate: "Next Trading Day",
        trend: trend,
        raw_data: response.data // Stored for future graph implementation
      });
      
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        "Failed to connect to the prediction server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1 className="hero-title">Predict the Future of Markets</h1>
        <p className="hero-subtitle">
          Advanced Machine Learning models to forecast stock trends. 
          Enter a ticker below to get an AI-powered prediction.
        </p>
      </header>

      <section className="interaction-section">
        <StockForm onPredict={handlePredict} disabled={loading} />
      </section>

      <section className="results-section">
        {loading && <Loading message="Analyzing market data..." />}
        {error && <ErrorMessage message={error} />}
        {predictionData && <PredictionResult data={predictionData} />}
      </section>
    </div>
  );
};

export default Home;
