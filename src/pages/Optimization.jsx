import React, { useState } from 'react';
import RecommendationCard from '../components/RecommendationCard';

const Optimization = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const [recommendations, setRecommendations] = useState([
        // Mock data for initial render (since backend might not be running yet)
        {
            item_id: 'SKU-001',
            item_name: 'Wireless Earbuds',
            reorder_point: 150,
            order_quantity: 500,
            safety_stock: 50,
            estimated_cost: 12500,
            status: 'pending'
        },
        {
            item_id: 'SKU-002',
            item_name: 'Smart Watch Series 5',
            reorder_point: 45,
            order_quantity: 200,
            safety_stock: 15,
            estimated_cost: 45000,
            status: 'pending'
        },
        {
            item_id: 'SKU-003',
            item_name: 'Laptop Stand',
            reorder_point: 80,
            order_quantity: 300,
            safety_stock: 25,
            estimated_cost: 6000,
            status: 'approved'
        }
    ]);

    const handleApprove = (rec) => {
        const updated = recommendations.map(r =>
            r.item_id === rec.item_id ? { ...r, status: 'approved' } : r
        );
        setRecommendations(updated);
        // In real app, call API to save decision
    };

    const handleReject = (rec) => {
        const updated = recommendations.map(r =>
            r.item_id === rec.item_id ? { ...r, status: 'rejected' } : r
        );
        setRecommendations(updated);
    };

    const runOptimization = async () => {
        // Mock loading state
        const newRec = {
            item_id: `SKU-00${recommendations.length + 1}`,
            item_name: 'Gaming Keyboard',
            reorder_point: 120,
            order_quantity: 400,
            safety_stock: 40,
            estimated_cost: 18000,
            status: 'pending'
        };
        setTimeout(() => {
            setRecommendations([newRec, ...recommendations]);
        }, 1000);
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl flex justify-between items-end">
                <div>
                    <h1 className="mb-sm">🚀 Prescriptive Optimization</h1>
                    <p className="text-secondary">AI-driven recommendations for inventory and logistics</p>
                </div>
                <div className="flex gap-md">
                    <button
                        className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Inventory
                    </button>
                    <button
                        className={`btn ${activeTab === 'routing' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('routing')}
                    >
                        Routing
                    </button>
                </div>
            </div>

            {activeTab === 'inventory' && (
                <div>
                    <div className="flex justify-between items-center mb-lg">
                        <h3 className="text-xl font-semibold">Inventory Recommendations</h3>
                        <button className="btn btn-sm btn-secondary" onClick={runOptimization}>
                            ⚡ Run Optimizer
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                        {recommendations.map((rec, index) => (
                            <RecommendationCard
                                key={index}
                                recommendation={rec}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'routing' && (
                <div className="card">
                    <div className="card-body text-center p-xl">
                        <div className="text-4xl mb-md">🚚</div>
                        <h3>Route Optimization</h3>
                        <p className="text-secondary">
                            Vehicle Routing Problem (VRP) solver integration coming soon.
                        </p>
                        <button className="btn btn-primary mt-md" disabled>
                            Configure Fleet
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Optimization;
