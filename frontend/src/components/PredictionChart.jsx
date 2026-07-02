import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './PredictionChart.css';

const PredictionChart = ({ rawData }) => {
  // Format the raw backend arrays into an array of objects for Recharts
  const chartData = useMemo(() => {
    if (!rawData || !rawData.dates || !rawData.actual_prices || !rawData.predicted_prices) {
      return [];
    }

    return rawData.dates.map((date, index) => ({
      date: date,
      actual: rawData.actual_prices[index],
      predicted: rawData.predicted_prices[index]
    }));
  }, [rawData]);

  if (chartData.length === 0) {
    return (
      <div className="no-data-container">
        <p>No prediction data available.</p>
      </div>
    );
  }

  return (
    <div className="prediction-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            minTickGap={30}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '5px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line 
            type="monotone" 
            dataKey="actual" 
            name="Actual Price"
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            name="Predicted Price"
            stroke="#ef4444" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 8 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
