import pulp
import numpy as np
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp
from typing import List, Dict
from models import (
    InventoryItem, InventoryRecommendation, 
    RouteOptimizationRequest, RouteOptimizationResponse, VehicleRoute, RouteStop
)
import math

class InventoryOptimizer:
    def optimize(self, items: List[InventoryItem], service_level: float) -> List[InventoryRecommendation]:
        recommendations = []
        
        # Z-score for service level (simplified approximation)
        # 90% -> 1.28, 95% -> 1.645, 99% -> 2.33
        z_score = 1.645 if service_level >= 0.95 else 1.28
        
        for item in items:
            # 1. Calculate Safety Stock
            # SS = Z * sigma_d * sqrt(L)
            # Assuming demand is normally distributed
            safety_stock = int(np.ceil(z_score * item.daily_demand_std * np.sqrt(item.lead_time_days)))
            
            # 2. Calculate Reorder Point
            # ROP = (Avg Daily Demand * Lead Time) + Safety Stock
            reorder_point = int(np.ceil((item.daily_demand_mean * item.lead_time_days) + safety_stock))
            
            # 3. Calculate Economic Order Quantity (EOQ) using PuLP (Linear Programming approach)
            # While EOQ has a closed form formula, we'll use PuLP to demonstrate LP capability 
            # and allow for future constraints (e.g., warehouse capacity).
            
            # Simple EOQ Formula: sqrt(2 * D * S / H)
            # D = Annual Demand, S = Ordering Cost (assume fixed), H = Holding Cost
            # We'll use a simplified heuristic here for the "Optimization" aspect
            
            annual_demand = item.daily_demand_mean * 365
            ordering_cost = 50.0 # Assumed fixed ordering cost
            
            # EOQ Formula
            if item.holding_cost > 0:
                eoq = int(np.sqrt((2 * annual_demand * ordering_cost) / item.holding_cost))
            else:
                eoq = int(annual_demand / 12) # Monthly if no holding cost
                
            # Ensure min order quantity
            order_quantity = max(eoq, 10)
            
            rec = InventoryRecommendation(
                item_id=item.id,
                item_name=item.name,
                reorder_point=reorder_point,
                order_quantity=order_quantity,
                safety_stock=safety_stock,
                estimated_cost=order_quantity * item.holding_cost, # Simplified cost metric
                status="pending"
            )
            recommendations.append(rec)
            
        return recommendations

class RouteOptimizer:
    def calculate_distance_matrix(self, locations: List[Dict]) -> List[List[int]]:
        # Euclidean distance for simplicity (in a real app, use OSRM/Google Maps API)
        size = len(locations)
        matrix = [[0 for _ in range(size)] for _ in range(size)]
        for i in range(size):
            for j in range(size):
                x1, y1 = locations[i]['lat'], locations[i]['lng']
                x2, y2 = locations[j]['lat'], locations[j]['lng']
                # Approx distance in meters (very rough lat/lng conversion)
                dist = math.sqrt((x1-x2)**2 + (y1-y2)**2) * 111000 
                matrix[i][j] = int(dist)
        return matrix

    def optimize(self, request: RouteOptimizationRequest) -> RouteOptimizationResponse:
        # 1. Prepare Data
        all_locations = [request.depot] + request.customers
        # Map location IDs to indices
        loc_map = {i: loc for i, loc in enumerate(all_locations)}
        
        data = {}
        data['distance_matrix'] = self.calculate_distance_matrix([l.dict() for l in all_locations])
        data['demands'] = [0] + [c.demand for c in request.customers]
        data['vehicle_capacities'] = [v.capacity for v in request.vehicles]
        data['num_vehicles'] = len(request.vehicles)
        data['depot'] = 0
        
        # 2. Create Routing Model
        manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                               data['num_vehicles'], data['depot'])
        routing = pywrapcp.RoutingModel(manager)

        # 3. Define Weight (Distance)
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return data['distance_matrix'][from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # 4. Add Capacity Constraint
        def demand_callback(from_index):
            from_node = manager.IndexToNode(from_index)
            return data['demands'][from_node]

        demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
        routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,  # null capacity slack
            data['vehicle_capacities'],  # vehicle maximum capacities
            True,  # start cumul to zero
            'Capacity')

        # 5. Solve
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
        search_parameters.time_limit.seconds = 5 # Fast timeout for demo

        solution = routing.SolveWithParameters(search_parameters)

        # 6. Format Response
        routes = []
        total_distance = 0
        
        if solution:
            for vehicle_id in range(data['num_vehicles']):
                index = routing.Start(vehicle_id)
                stops = []
                route_dist = 0
                route_load = 0
                
                while not routing.IsEnd(index):
                    node_index = manager.IndexToNode(index)
                    route_load += data['demands'][node_index]
                    
                    previous_index = index
                    index = solution.Value(routing.NextVar(index))
                    route_dist += routing.GetArcCostForVehicle(previous_index, index, vehicle_id)
                    
                    loc_obj = loc_map[node_index]
                    stops.append(RouteStop(
                        location_id=loc_obj.id,
                        load_after=route_load
                    ))
                
                # Add depot return
                node_index = manager.IndexToNode(index)
                loc_obj = loc_map[node_index]
                stops.append(RouteStop(
                    location_id=loc_obj.id,
                    load_after=route_load
                ))
                
                if len(stops) > 2: # Only add if vehicle actually moved (start -> ... -> end)
                    routes.append(VehicleRoute(
                        vehicle_id=request.vehicles[vehicle_id].id,
                        stops=stops,
                        total_distance=float(route_dist),
                        total_load=route_load
                    ))
                    total_distance += route_dist

        return RouteOptimizationResponse(
            routes=routes,
            total_fleet_distance=float(total_distance),
            unassigned_jobs=0 # Simplified
        )
