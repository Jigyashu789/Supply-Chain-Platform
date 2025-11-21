import { useState } from 'react';
import { useData } from '../contexts/DataContext';

function InventoryDashboard() {
    const { inventory, getInventoryStatus, getReorderSuggestions, getDemandForecast } = useData();
    const [selectedSKU, setSelectedSKU] = useState(null);

    const reorderSuggestions = getReorderSuggestions();

    const totalValue = inventory.reduce((sum, item) => sum + item.currentStock, 0);
    const criticalItems = inventory.filter(item => getInventoryStatus(item) === 'critical').length;
    const overstockItems = inventory.filter(item => getInventoryStatus(item) === 'overstock').length;
    const optimalStock = inventory.filter(item => getInventoryStatus(item) === 'optimal').length;

    const getStatusBadge = (item) => {
        const status = getInventoryStatus(item);
        const badges = {
            'critical': 'badge-danger',
            'warning': 'badge-warning',
            'optimal': 'badge-success',
            'overstock': 'badge-info',
        };
        const labels = {
            'critical': 'Critical',
            'warning': 'Low Stock',
            'optimal': 'Optimal',
            'overstock': 'Overstock',
        };
        return <span className={`badge ${badges[status]}`}>{labels[status]}</span>;
    };

    const getStockPercentage = (item) => {
        return Math.min(100, (item.currentStock / item.optimalStock) * 100);
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl">
                <h1 className="mb-sm">📦 Inventory Management</h1>
                <p className="text-secondary">Real-time stock levels with AI-driven predictive analytics</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-lg mb-xl">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Total Items</span>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                    </div>
                    <div className="kpi-value">{totalValue.toLocaleString()}</div>
                    <div className="kpi-change positive">
                        <span>↑ 12%</span>
                        <span className="text-tertiary" style={{ fontWeight: 'normal' }}>vs last month</span>
                    </div>
                </div>

                <div className="kpi-card success">
                    <div className="kpi-header">
                        <span className="kpi-title">Optimal Stock</span>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                    </div>
                    <div className="kpi-value">{optimalStock}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                        {((optimalStock / inventory.length) * 100).toFixed(0)}% of inventory
                    </div>
                </div>

                <div className="kpi-card warning">
                    <div className="kpi-header">
                        <span className="kpi-title">Critical Items</span>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    </div>
                    <div className="kpi-value">{criticalItems}</div>
                    <div className="kpi-change negative">
                        <span>Needs immediate action</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Turnover Rate</span>
                        <span style={{ fontSize: '1.5rem' }}>🔄</span>
                    </div>
                    <div className="kpi-value">4.2x</div>
                    <div className="kpi-change positive">
                        <span>↑ 8%</span>
                        <span className="text-tertiary" style={{ fontWeight: 'normal' }}>vs last quarter</span>
                    </div>
                </div>
            </div>

            {/* Reorder Alerts */}
            {reorderSuggestions.length > 0 && (
                <div className="alert alert-warning mb-xl">
                    <div>
                        <strong>🔔 {reorderSuggestions.length} Items Need Reordering</strong>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                            AI recommends immediate action for critical stock levels
                        </p>
                    </div>
                    <button className="btn btn-sm btn-primary">
                        Create Purchase Orders
                    </button>
                </div>
            )}

            {/* Inventory Table */}
            <div className="card mb-xl">
                <div className="card-header">
                    <h3 className="card-title">Current Inventory Levels</h3>
                    <div className="flex gap-sm">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search items..."
                            style={{ width: '200px' }}
                        />
                        <button className="btn btn-outline btn-sm">Filter</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Stock Level</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <code style={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                color: 'var(--color-primary)',
                                            }}>
                                                {item.id}
                                            </code>
                                        </td>
                                        <td className="font-semibold">{item.name}</td>
                                        <td className="text-secondary">{item.category}</td>
                                        <td>
                                            <span className="font-semibold">{item.currentStock}</span>
                                            <span className="text-tertiary"> / {item.optimalStock}</span>
                                        </td>
                                        <td>
                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                background: 'var(--color-bg-tertiary)',
                                                borderRadius: '999px',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    width: `${getStockPercentage(item)}%`,
                                                    height: '100%',
                                                    background: getInventoryStatus(item) === 'critical' ? 'var(--color-danger)' :
                                                        getInventoryStatus(item) === 'warning' ? 'var(--color-warning)' :
                                                            getInventoryStatus(item) === 'overstock' ? 'var(--color-info)' :
                                                                'var(--color-success)',
                                                    transition: 'width 0.3s ease',
                                                }} />
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(item)}</td>
                                        <td className="text-secondary">{item.location}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => setSelectedSKU(item.id)}
                                            >
                                                View Forecast
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* AI Demand Forecast Modal */}
            {selectedSKU && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '2rem',
                    }}
                    onClick={() => setSelectedSKU(null)}
                >
                    <div
                        className="glass-card animate-fade-in"
                        style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-lg">
                            <div>
                                <h3 className="mb-sm">AI Demand Forecast - {selectedSKU}</h3>
                                <p className="text-secondary mb-0">30-day predictive analytics with confidence intervals</p>
                            </div>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setSelectedSKU(null)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="alert alert-info mb-lg">
                            <div>
                                <strong>🤖 AI Prediction Insight</strong>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                    Based on historical trends, seasonality patterns, and market data, we predict a 15% increase in demand over the next 30 days. Recommended action: Increase stock by 25 units within 7 days.
                                </p>
                            </div>
                        </div>

                        <div style={{
                            padding: '2rem',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center',
                        }}>
                            <p className="text-secondary">📊 Demand forecast visualization would appear here</p>
                            <p className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                                Interactive chart showing historical data (blue) and AI predictions (green) with confidence bands
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-md mt-lg">
                            <div className="card">
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Expected Demand (30d)</div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>450 units</div>
                            </div>
                            <div className="card">
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Confidence Level</div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-success)' }}>87%</div>
                            </div>
                            <div className="card">
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Recommended Buffer</div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-warning)' }}>20%</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InventoryDashboard;
