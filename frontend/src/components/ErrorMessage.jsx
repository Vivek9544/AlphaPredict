import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>Analysis Failed</h3>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
