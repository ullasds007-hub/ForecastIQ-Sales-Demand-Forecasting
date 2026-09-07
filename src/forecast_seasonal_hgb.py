from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pathlib import Path
import subprocess
import sys
import json
import pandas as pd


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

FORECAST_SCRIPT = (
    BASE_DIR
    / "src"
    / "forecast_seasonal_hgb.py"
)

FORECAST_JSON = (
    BASE_DIR
    / "outputs"
    / "forecasts"
    / "future_sales_forecast.json"
)

DAILY_SALES_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "daily_sales.csv"
)


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="ForecastIQ API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ForecastRequest(BaseModel):
    product: str = "All Products"
    year: str = "2026"


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "ForecastIQ Backend API is running"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "Seasonal HGB-C",
        "model_loaded": True,
        "forecast_script": FORECAST_SCRIPT.exists(),
        "sales_data": DAILY_SALES_PATH.exists(),
    }


# ============================================================
# REAL ML FORECAST
# ============================================================

@app.post("/forecast")
def forecast(data: ForecastRequest):

    if not FORECAST_SCRIPT.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Forecast script not found: {FORECAST_SCRIPT}"
        )

    if not DAILY_SALES_PATH.exists():
        raise HTTPException(
            status_code=500,
            detail=f"Sales data not found: {DAILY_SALES_PATH}"
        )

    try:
        # ----------------------------------------------------
        # RUN EXISTING REAL FORECASTING PIPELINE
        # ----------------------------------------------------

        result = subprocess.run(
            [
                sys.executable,
                str(FORECAST_SCRIPT)
            ],
            cwd=str(BASE_DIR),
            capture_output=True,
            text=True,
            timeout=180
        )

        if result.returncode != 0:
            print("FORECAST ERROR:")
            print(result.stderr)

            raise HTTPException(
                status_code=500,
                detail=result.stderr[-2000:]
            )

        # ----------------------------------------------------
        # READ GENERATED REAL FORECAST JSON
        # ----------------------------------------------------

        if not FORECAST_JSON.exists():
            raise HTTPException(
                status_code=500,
                detail="Forecast JSON was not generated."
            )

        with open(
            FORECAST_JSON,
            "r",
            encoding="utf-8"
        ) as file:
            forecast_data = json.load(file)

        model_info = forecast_data["model"]
        summary = forecast_data["forecast"]
        daily_forecast = forecast_data["daily_forecast"]

        # ----------------------------------------------------
        # CALCULATE REAL GROWTH
        # Compare forecast 30 days with previous 30 days
        # ----------------------------------------------------

        historical = pd.read_csv(
            DAILY_SALES_PATH
        )

        historical["sales"] = pd.to_numeric(
            historical["sales"],
            errors="coerce"
        ).fillna(0)

        previous_30_total = float(
            historical["sales"]
            .tail(30)
            .sum()
        )

        forecast_total = float(
            summary["total_predicted_sales"]
        )

        if previous_30_total > 0:
            growth_value = (
                (
                    forecast_total
                    - previous_30_total
                )
                / previous_30_total
            ) * 100
        else:
            growth_value = 0.0

        growth_text = (
            f"{growth_value:+.1f}%"
        )

        # ----------------------------------------------------
        # FORMAT FORECAST FOR REACT
        # ----------------------------------------------------

        frontend_forecast = [
            {
                "date": item["date"],
                "month": item["date"],
                "value": round(
                    float(item["predicted_sales"]),
                    2
                ),
            }
            for item in daily_forecast
        ]

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {
            "status": "success",

            # UI selection - currently informational
            "product": data.product,
            "year": data.year,

            # REAL ML RESULTS
            "projected_demand": round(
                forecast_total,
                2
            ),

            "average_daily_sales": round(
                float(summary["average_daily_sales"]),
                2
            ),

            "minimum_daily_sales": round(
                float(summary["minimum_daily_sales"]),
                2
            ),

            "maximum_daily_sales": round(
                float(summary["maximum_daily_sales"]),
                2
            ),

            "peak_date": summary["peak_date"],

            "growth": growth_text,

            "accuracy": (
                f"{float(model_info['r2_percent']):.2f}%"
            ),

            "r2": float(
                model_info["r2"]
            ),

            "mape": float(
                model_info["mape_percent"]
            ),

            "rmse": float(
                model_info["rmse"]
            ),

            "mae": float(
                model_info["mae"]
            ),

            "forecast_horizon": int(
                summary["horizon_days"]
            ),

            "forecast_start": (
                summary["start_date"]
            ),

            "forecast_end": (
                summary["end_date"]
            ),

            "forecast": frontend_forecast,

            "model": "Seasonal HGB-C",

            "message": (
                "Real Seasonal HGB-C forecast generated successfully."
            ),
        }

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail="Forecast generation timed out."
        )

    except HTTPException:
        raise

    except Exception as error:
        print("API ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )