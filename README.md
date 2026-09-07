# ForecastIQ - Sales Demand Forecasting Platform

ForecastIQ is an end-to-end sales demand forecasting platform built with React, FastAPI, and machine learning.

The system uses a trained Seasonal HGB-C forecasting model to generate a 30-day sales forecast and presents the results through a premium business intelligence dashboard.

## Features

- Real 30-day sales forecasting
- Seasonal HGB-C machine learning model
- FastAPI backend
- React + Vite frontend
- Interactive dashboard
- Forecast charts
- Analytics page
- Product intelligence
- Executive reports
- AI Intelligence decision-support interface
- Employee login interface
- Dark and light themes
- Search and alert system

## Machine Learning Model

Model used:

Seasonal HGB-C  
HistGradientBoostingRegressor

Model performance:

- R²: approximately 0.957
- Accuracy display: approximately 95.72%
- MAPE: approximately 3.02%
- RMSE: approximately 31,501
- MAE: approximately 25,762

The model generates a recursive 30-day sales forecast using historical sales and engineered time-series features.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Recharts
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- Pandas
- NumPy
- Joblib
- Scikit-learn

### Machine Learning
- HistGradientBoostingRegressor
- Time-series feature engineering
- Lag features
- Rolling statistics
- Seasonal features
- Cyclical date features

## Project Structure

```text
Sales-Demand-Forecasting/
│
├── backend/
│   ├── main.py
│   └── venv/
│
├── data/
│   └── processed/
│       └── daily_sales.csv
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── models/
│   └── sales_forecasting_seasonal_HGB_C_candidate.joblib
│
├── outputs/
│   └── forecasts/
│
├── src/
│   ├── clean_data.py
│   ├── train_model.py
│   └── forecast_seasonal_hgb.py
│
├── README.md
├── requirements.txt
└── .gitignore