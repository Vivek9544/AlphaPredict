import React, { useState } from 'react';
import './StockForm.css';

const StockForm = ({ onPredict, disabled }) => {
  const [ticker, setTicker] = useState('GOOG');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim()) {
      onPredict(ticker);
    }
  };

  return (
    <div className="stock-form-card">
      <form onSubmit={handleSubmit} className="stock-form">
        <div className="input-group">
          <label htmlFor="ticker">Stock Ticker Symbol</label>
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="e.g. AAPL, GOOG, TSLA"
            disabled={disabled}
            autoComplete="off"
          />
        </div>
        <button type="submit" className="predict-btn" disabled={disabled || !ticker.trim()}>
          {disabled ? 'Analyzing...' : 'Predict Now'}
        </button>
      </form>
    </div>
  );
};

export default StockForm;
