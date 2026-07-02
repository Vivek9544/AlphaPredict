import React from 'react';
import PredictionChart from './PredictionChart';
import './PredictionResult.css';

const PredictionResult = ({ data }) => {
  if (!data) return null;

  const isUp = data.trend === 'up';

  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <div>
          <h2>{data.companyName}</h2>
          <span className="ticker-badge">{data.symbol}</span>
        </div>
        <div className="date-badge">
          Target: {data.predictionDate}
        </div>
      </div>

      <div className="price-comparison">
        <div className="price-box">
          <span className="price-label">Current Price</span>
          <span className="price-value">${data.currentPrice.toFixed(2)}</span>
        </div>
        
        <div className="trend-indicator">
          <div className={`arrow ${isUp ? 'arrow-up' : 'arrow-down'}`}>
            {isUp ? '↗' : '↘'}
          </div>
        </div>

        <div className="price-box highlight">
          <span className="price-label">Predicted Price</span>
          <span className={`price-value ${isUp ? 'text-success' : 'text-danger'}`}>
            ${data.predictedPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <PredictionChart rawData={data.raw_data} />

      {/* Render Evaluation Metrics if provided by the backend */}
      {data.raw_data?.metrics && (
        <div className="metrics-section">
          <h3>Model Evaluation Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              {/* RMSE (Root Mean Squared Error): Measures the average magnitude of the prediction errors, giving higher weight to larger errors. Lower is better. */}
              <span className="metric-title">RMSE</span>
              <span className="metric-value">{data.raw_data.metrics.rmse.toFixed(2)} USD</span>
            </div>
            
            <div className="metric-card">
              {/* MAE (Mean Absolute Error): Measures the average absolute difference between predicted and actual values. Lower is better. */}
              <span className="metric-title">MAE</span>
              <span className="metric-value">{data.raw_data.metrics.mae.toFixed(2)} USD</span>
            </div>
            
            <div className="metric-card">
              {/* MAPE (Mean Absolute Percentage Error): Measures the prediction accuracy as a percentage. Lower is better. */}
              <span className="metric-title">MAPE</span>
              <span className="metric-value">{(data.raw_data.metrics.mape * 100).toFixed(2)} %</span>
            </div>

            <div className="metric-card">
              {/* R² Score: Represents the proportion of variance in the actual prices explained by the model. 1.0 is a perfect prediction. */}
              <span className="metric-title">R² Score</span>
              <span className="metric-value">{data.raw_data.metrics.r2_score.toFixed(4)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
