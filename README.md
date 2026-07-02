# NexusStock: AI-Powered Market Forecasting

> An end-to-end machine learning platform that utilizes Deep Learning to predict future stock market trends based on historical financial data.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg?style=for-the-badge)

## 📌 Overview
**NexusStock** is a comprehensive web application designed to bridge the gap between complex financial machine learning models and everyday users. 
- **What the project does**: It fetches historical stock data, processes it through a trained Long Short-Term Memory (LSTM) neural network, and visualizes the actual versus predicted prices on an interactive dashboard.
- **Why it was built**: To provide a clean, visual, and highly accessible way for developers and financial enthusiasts to explore the capabilities of deep learning in time-series forecasting.
- **The problem it solves**: Financial modeling is often locked behind complex Python scripts or expensive proprietary software. NexusStock democratizes this by wrapping a robust TensorFlow model inside a beautiful, responsive React frontend.

---

## ✨ Features
- **React Frontend**: A modern, glassmorphism-styled user interface.
- **Flask REST API**: A lightweight, robust backend server serving ML predictions.
- **TensorFlow/Keras LSTM Model**: State-of-the-art deep learning model optimized for sequential time-series data.
- **Yahoo Finance Integration**: Live historical data pulling via `yfinance`.
- **Interactive Recharts Visualization**: Dynamic, responsive charting of market trends.
- **Real-time Stock Prediction**: On-the-fly data inference for any supported ticker.
- **Model Evaluation Metrics**: Real-world evaluation scoring (RMSE, MAE, MAPE, R² Score).
- **Responsive UI**: Flawless experience across desktop, tablet, and mobile devices.

---

## 💻 Tech Stack

### Frontend
- **React** (Vite)
- **Axios** (HTTP Client)
- **Recharts** (Interactive Charting)
- **CSS3** (Custom styling, CSS Variables, Flexbox/Grid)

### Backend
- **Flask** (Python Web Framework)
- **TensorFlow / Keras** (Deep Learning)
- **NumPy & Pandas** (Data Manipulation)
- **Scikit-learn** (Data Preprocessing & Evaluation)
- **yfinance** (Market Data Retrieval)

---

## 🏗️ Project Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Axios
 │
 ▼
Flask REST API
 │
 ▼
TensorFlow LSTM
 │
 ▼
Stock Prediction
 │
 ▼
JSON Response
 │
 ▼
React Dashboard
```

---

## 📁 Folder Structure

```text
Stock_Price_Prediction/
├── Models/
│   ├── Stock_Price_Prediction.ipynb   # Jupyter notebook for training
│   └── stock_model.keras              # Compiled TensorFlow model
├── Website/
│   ├── app.py                         # Flask REST API backend
│   └── requirements.txt               # Backend Python dependencies
├── frontend/
│   ├── src/                           # React source code
│   │   ├── components/                # Reusable UI components
│   │   ├── pages/                     # Main page layouts
│   │   ├── App.jsx                    # React entry point
│   │   └── main.jsx                   # Vite mounting script
│   └── package.json                   # Node dependencies
└── README.md                          # Project documentation
```

---

## 🚀 Installation

Follow these steps to run the project locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Stock_Price_Prediction.git
cd Stock_Price_Prediction
```

### 2. Backend Setup (Flask)
Create a virtual environment and install the required Python libraries.
```bash
cd Website
python -m venv venv

# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Frontend Setup (React)
Open a new terminal window and navigate to the frontend directory.
```bash
cd frontend
npm install
```

### 4. Run the Application
**Start the Flask Backend** (Terminal 1)
```bash
cd Website
python app.py
```
*The backend will run on `http://localhost:5000`*

**Start the React Frontend** (Terminal 2)
```bash
cd frontend
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🔌 API Documentation

### POST `/api/predict`
Predicts the future price of a given stock ticker using the LSTM model.

**Request**
```json
{
    "ticker": "AAPL"
}
```

**Response**
```json
{
    "ticker": "AAPL",
    "actual_prices": [145.2, 146.5, 147.1],
    "predicted_prices": [null, null, 148.0],
    "metrics": {
        "rmse": 3.45,
        "mae": 2.89,
        "mape": 0.015,
        "r2_score": 0.94
    }
}
```

---

## 🧠 Machine Learning Pipeline

```text
Yahoo Finance
      ↓
Preprocessing
      ↓
MinMaxScaler
      ↓
LSTM
      ↓
Prediction
      ↓
Evaluation
```

---

## 📊 Evaluation Metrics Explained

Understanding how well our model performs is critical. We use four main metrics:

- **RMSE (Root Mean Squared Error)**: Measures the average magnitude of the prediction errors. It gives higher weight to large errors, making it highly sensitive to outliers. Measured in USD. Lower is better.
- **MAE (Mean Absolute Error)**: Measures the average absolute difference between the predicted prices and actual prices. It treats all errors equally. Measured in USD. Lower is better.
- **MAPE (Mean Absolute Percentage Error)**: Represents the error as a percentage of the actual price. This makes it incredibly easy to understand (e.g., "The model is off by 2% on average"). Lower is better.
- **R² Score (Coefficient of Determination)**: Represents how much of the variance in the stock price is explained by our model. A score of `1.0` is a perfect prediction, while `0.0` is no better than guessing the average.

---

## 🔮 Future Improvements

We are always looking to improve NexusStock. Planned features include:
- Multi-stock comparison dashboards
- 7-day and 30-day multi-step forecasting
- Integration of advanced technical indicators (RSI, MACD)
- Sentiment analysis using live financial news APIs
- Transformer-based forecasting models (TimeGPT)
- Dockerized deployment for one-click setup
- User authentication and personalized watchlists
- Simulated portfolio tracking

---

## 📸 Screenshots

| Home Page | Prediction Dashboard |
|-----------|----------------------|
| *[Placeholder: screenshot_home.png]* | *[Placeholder: screenshot_dashboard.png]* |

| Interactive Chart | Evaluation Metrics |
|-------------------|--------------------|
| *[Placeholder: screenshot_chart.png]* | *[Placeholder: screenshot_metrics.png]* |

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
