import React from 'react';

const RecommendationCard = ({ recommendation, onApprove, onReject }) => {
    const { item_name, reorder_point, order_quantity, safety_stock, estimated_cost, status } = recommendation;

    const isPending = status === 'pending';

    return (
        <div className={`card ${status === 'approved' ? 'border-success' : status === 'rejected' ? 'border-danger' : ''}`}>
            <div className="card-header">
                <h4 className="card-title flex items-center gap-sm">
                    <span>📦</span> {item_name}
                </h4>
                {status !== 'pending' && (
                    <span className={`badge ${status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                        {status.toUpperCase()}
                    </span>
                )}
            </div>
            <div className="card-body">
                <div className="grid grid-cols-2 gap-md mb-md">
                    <div>
                        <div className="text-secondary text-xs">Reorder Point</div>
                        <div className="font-bold text-lg">{reorder_point} units</div>
                    </div>
                    <div>
                        <div className="text-secondary text-xs">Order Quantity</div>
                        <div className="font-bold text-lg text-primary">{order_quantity} units</div>
                    </div>
                    <div>
                        <div className="text-secondary text-xs">Safety Stock</div>
                        <div className="font-bold">{safety_stock} units</div>
                    </div>
                    <div>
                        <div className="text-secondary text-xs">Est. Cost</div>
                        <div className="font-bold text-warning">${estimated_cost.toLocaleString()}</div>
                    </div>
                </div>

                {isPending && (
                    <div className="flex gap-sm mt-md">
                        <button
                            className="btn btn-sm btn-primary flex-1"
                            onClick={() => onApprove(recommendation)}
                        >
                            ✅ Approve
                        </button>
                        <button
                            className="btn btn-sm btn-outline flex-1"
                            onClick={() => onReject(recommendation)}
                        >
                            ❌ Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationCard;
