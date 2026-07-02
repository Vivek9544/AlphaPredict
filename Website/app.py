import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from keras.models import load_model
from keras.layers import LSTM
from flask import Flask, render_template, request, send_file, jsonify
from flask_cors import CORS
import datetime as dt
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, mean_absolute_percentage_error, r2_score
import os

plt.style.use("fivethirtyeight")

app = Flask(__name__)
# Enable CORS for the React app on port 5173
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Load the model with custom_objects to handle compatibility
custom_objects = {
    'LSTM': lambda **kwargs: LSTM(**{k: v for k, v in kwargs.items() if k != 'time_major'})
}
model = load_model('stock_model.keras', custom_objects=custom_objects)

def process_stock_prediction(stock):
    """
    Helper function to process the stock data and run the ML prediction pipeline.
    This avoids code duplication between the HTML and JSON routes.
    """
    # Define the start and end dates for stock data
    start = dt.datetime(2000, 1, 1)
    end = dt.datetime(2025, 1, 1)
    
    # Download stock data
    df = yf.download(stock, start=start, end=end)
    
    # Descriptive Data
    data_desc = df.describe()
    
    # Exponential Moving Averages
    ema20 = df.Close.ewm(span=20, adjust=False).mean()
    ema50 = df.Close.ewm(span=50, adjust=False).mean()
    ema100 = df.Close.ewm(span=100, adjust=False).mean()
    ema200 = df.Close.ewm(span=200, adjust=False).mean()
    
    # Data splitting
    data_training = pd.DataFrame(df['Close'][0:int(len(df)*0.70)])
    data_testing = pd.DataFrame(df['Close'][int(len(df)*0.70): int(len(df))])
    
    # Scaling data
    scaler = MinMaxScaler(feature_range=(0, 1))
    data_training_array = scaler.fit_transform(data_training)
    
    # Prepare data for prediction
    past_100_days = data_training.tail(100)
    final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
    input_data = scaler.fit_transform(final_df)
    
    x_test, y_test = [], []
    for i in range(100, input_data.shape[0]):
        x_test.append(input_data[i - 100:i])
        y_test.append(input_data[i, 0])
    x_test, y_test = np.array(x_test), np.array(y_test)

    # Make predictions
    y_predicted = model.predict(x_test)
    
    # Inverse scaling for predictions
    scaler = scaler.scale_
    scale_factor = 1 / scaler[0]
    y_predicted = y_predicted * scale_factor
    y_test = y_test * scale_factor
    
    # Compute ML evaluation metrics
    rmse = np.sqrt(mean_squared_error(y_test, y_predicted))
    mae = mean_absolute_error(y_test, y_predicted)
    mape = mean_absolute_percentage_error(y_test, y_predicted)
    r2 = r2_score(y_test, y_predicted)
    
    return {
        'df': df,
        'data_desc': data_desc,
        'ema20': ema20,
        'ema50': ema50,
        'ema100': ema100,
        'ema200': ema200,
        'y_test': y_test,
        'y_predicted': y_predicted,
        'metrics': {
            'rmse': float(rmse),
            'mae': float(mae),
            'mape': float(mape),
            'r2_score': float(r2)
        }
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        stock = request.form.get('stock')
        if not stock:
            stock = 'GOOG'  # Default stock if none is entered
        
        # Run prediction pipeline
        result = process_stock_prediction(stock)
        
        df = result['df']
        data_desc = result['data_desc']
        ema20 = result['ema20']
        ema50 = result['ema50']
        ema100 = result['ema100']
        ema200 = result['ema200']
        y_test = result['y_test']
        y_predicted = result['y_predicted']
        
        # Plot 1: Closing Price vs Time Chart with 20 & 50 Days EMA
        fig1, ax1 = plt.subplots(figsize=(12, 6))
        ax1.plot(df.Close, 'y', label='Closing Price')
        ax1.plot(ema20, 'g', label='EMA 20')
        ax1.plot(ema50, 'r', label='EMA 50')
        ax1.set_title("Closing Price vs Time (20 & 50 Days EMA)")
        ax1.set_xlabel("Time")
        ax1.set_ylabel("Price")
        ax1.legend()
        ema_chart_path = "static/ema_20_50.png"
        fig1.savefig(ema_chart_path)
        plt.close(fig1)
        
        # Plot 2: Closing Price vs Time Chart with 100 & 200 Days EMA
        fig2, ax2 = plt.subplots(figsize=(12, 6))
        ax2.plot(df.Close, 'y', label='Closing Price')
        ax2.plot(ema100, 'g', label='EMA 100')
        ax2.plot(ema200, 'r', label='EMA 200')
        ax2.set_title("Closing Price vs Time (100 & 200 Days EMA)")
        ax2.set_xlabel("Time")
        ax2.set_ylabel("Price")
        ax2.legend()
        ema_chart_path_100_200 = "static/ema_100_200.png"
        fig2.savefig(ema_chart_path_100_200)
        plt.close(fig2)
        
        # Plot 3: Prediction vs Original Trend
        fig3, ax3 = plt.subplots(figsize=(12, 6))
        ax3.plot(y_test, 'g', label="Original Price", linewidth = 1)
        ax3.plot(y_predicted, 'r', label="Predicted Price", linewidth = 1)
        ax3.set_title("Prediction vs Original Trend")
        ax3.set_xlabel("Time")
        ax3.set_ylabel("Price")
        ax3.legend()
        prediction_chart_path = "static/stock_prediction.png"
        fig3.savefig(prediction_chart_path)
        plt.close(fig3)
        
        # Save dataset as CSV
        csv_file_path = f"static/{stock}_dataset.csv"
        df.to_csv(csv_file_path)

        # Return the rendered template with charts and dataset
        return render_template('index.html', 
                               plot_path_ema_20_50=ema_chart_path, 
                               plot_path_ema_100_200=ema_chart_path_100_200, 
                               plot_path_prediction=prediction_chart_path, 
                               data_desc=data_desc.to_html(classes='table table-bordered'),
                               dataset_link=csv_file_path)

    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def api_predict():
    data = request.get_json()
    if not data or 'ticker' not in data:
        return jsonify({"error": "No ticker provided"}), 400
    
    ticker = data['ticker']
    if not ticker:
        ticker = 'GOOG'
        
    # Run prediction pipeline
    result = process_stock_prediction(ticker)
    
    df = result['df']
    data_desc = result['data_desc']
    ema20 = result['ema20']
    ema50 = result['ema50']
    ema100 = result['ema100']
    ema200 = result['ema200']
    y_predicted = result['y_predicted']
    
    # Calculate padding so that predicted_prices aligns with the correct dates
    # (Since y_predicted only exists for the test data, i.e., last 30%)
    total_dates = len(df)
    predicted_length = len(y_predicted.flatten())
    padding = [None] * (total_dates - predicted_length)
    aligned_predicted_prices = padding + y_predicted.flatten().tolist()
    
    # Package into JSON
    response_data = {
        "ticker": ticker,
        "dates": df.index.strftime('%Y-%m-%d').tolist(),
        "actual_prices": df.Close.tolist(),
        "predicted_prices": aligned_predicted_prices,
        "ema20": ema20.tolist(),
        "ema50": ema50.tolist(),
        "ema100": ema100.tolist(),
        "ema200": ema200.tolist(),
        "statistics": data_desc.to_dict(),
        "metrics": result['metrics']
    }
    
    return jsonify(response_data)

@app.route('/download/<filename>')
def download_file(filename):
    return send_file(f"static/{filename}", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
