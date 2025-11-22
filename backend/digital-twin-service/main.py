from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import simpy
import random
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Digital Twin Service", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationConfig(BaseModel):
    scenario_type: str
    duration: int
    demand_mean: float = 10.0
    demand_std: float = 2.0
    initial_inventory: int = 100

class SimulationResult(BaseModel):
    service_level: float
    total_cost: float
    avg_lead_time: float
    inventory_history: List[int]
    stockouts: int

# --- Simulation Logic ---

class SupplyChainSimulation:
    def __init__(self, env, config: SimulationConfig):
        self.env = env
        self.config = config
        self.inventory = config.initial_inventory
        self.stockouts = 0
        self.total_orders = 0
        self.fulfilled_orders = 0
        self.inventory_history = []
        self.costs = 0.0
        
        # Parameters
        self.holding_cost_per_unit = 0.5
        self.stockout_cost_per_unit = 5.0
        self.reorder_point = 50
        self.reorder_qty = 100
        self.lead_time = 3  # days

    def run(self):
        self.env.process(self.demand_generator())
        self.env.process(self.inventory_monitor())
        self.env.process(self.replenishment_process())

    def demand_generator(self):
        """Generates daily demand based on scenario"""
        while True:
            yield self.env.timeout(1)  # One day passes
            
            # Calculate demand based on scenario
            if self.config.scenario_type == "Demand Spike (+20%)" and 10 <= self.env.now <= 20:
                daily_demand = max(0, int(np.random.normal(self.config.demand_mean * 1.2, self.config.demand_std)))
            else:
                daily_demand = max(0, int(np.random.normal(self.config.demand_mean, self.config.demand_std)))
            
            self.total_orders += daily_demand
            
            # Fulfill demand
            if self.inventory >= daily_demand:
                self.inventory -= daily_demand
                self.fulfilled_orders += daily_demand
            else:
                # Stockout
                shortage = daily_demand - self.inventory
                self.fulfilled_orders += self.inventory
                self.inventory = 0
                self.stockouts += shortage
                self.costs += shortage * self.stockout_cost_per_unit

    def inventory_monitor(self):
        """Tracks inventory levels and costs daily"""
        while True:
            self.inventory_history.append(self.inventory)
            self.costs += self.inventory * self.holding_cost_per_unit
            yield self.env.timeout(1)

    def replenishment_process(self):
        """Checks inventory and places orders"""
        while True:
            if self.inventory < self.reorder_point:
                # Place order
                yield self.env.timeout(self.lead_time)
                
                # Receive order (with potential disruption)
                if self.config.scenario_type == "Supplier Failure (Node n1)" and random.random() < 0.3:
                    # 30% chance of failure/delay in this scenario
                    yield self.env.timeout(2) # Extra delay
                
                self.inventory += self.reorder_qty
            else:
                yield self.env.timeout(1)

@app.post("/simulate", response_model=SimulationResult)
async def run_simulation(config: SimulationConfig):
    env = simpy.Environment()
    sim = SupplyChainSimulation(env, config)
    sim.run()
    env.run(until=config.duration)
    
    service_level = (sim.fulfilled_orders / sim.total_orders * 100) if sim.total_orders > 0 else 100
    
    return {
        "service_level": round(service_level, 2),
        "total_cost": round(sim.costs, 2),
        "avg_lead_time": sim.lead_time, # Simplified for now
        "inventory_history": sim.inventory_history,
        "stockouts": sim.stockouts
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002)
