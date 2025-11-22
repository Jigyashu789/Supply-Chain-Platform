from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class InventoryItem(BaseModel):
    id: str
    name: str
    current_stock: int
    lead_time_days: int
    daily_demand_mean: float
    daily_demand_std: float
    holding_cost: float
    stockout_cost: float

class InventoryOptimizationRequest(BaseModel):
    items: List[InventoryItem]
    service_level_target: float = 0.95

class InventoryRecommendation(BaseModel):
    item_id: str
    item_name: str
    reorder_point: int
    order_quantity: int
    safety_stock: int
    estimated_cost: float
    status: str = "pending"  # pending, approved, rejected

class Location(BaseModel):
    id: str
    lat: float
    lng: float
    demand: int = 0

class Vehicle(BaseModel):
    id: str
    capacity: int
    start_location_id: str

class RouteOptimizationRequest(BaseModel):
    depot: Location
    customers: List[Location]
    vehicles: List[Vehicle]

class RouteStop(BaseModel):
    location_id: str
    arrival_time: Optional[str] = None
    load_after: int

class VehicleRoute(BaseModel):
    vehicle_id: str
    stops: List[RouteStop]
    total_distance: float
    total_load: int

class RouteOptimizationResponse(BaseModel):
    routes: List[VehicleRoute]
    total_fleet_distance: float
    unassigned_jobs: int
