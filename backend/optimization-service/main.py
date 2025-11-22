from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    InventoryOptimizationRequest, InventoryRecommendation,
    RouteOptimizationRequest, RouteOptimizationResponse
)
from solvers import InventoryOptimizer, RouteOptimizer
import uvicorn

app = FastAPI(title="Optimization Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

inventory_optimizer = InventoryOptimizer()
route_optimizer = RouteOptimizer()

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "optimization-service"}

@app.post("/optimize/inventory", response_model=list[InventoryRecommendation])
def optimize_inventory(request: InventoryOptimizationRequest):
    try:
        recommendations = inventory_optimizer.optimize(request.items, request.service_level_target)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize/routing", response_model=RouteOptimizationResponse)
def optimize_routing(request: RouteOptimizationRequest):
    try:
        result = route_optimizer.optimize(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3003)
