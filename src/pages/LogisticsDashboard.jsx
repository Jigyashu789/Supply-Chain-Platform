import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

function LogisticsDashboard() {
    const { shipments } = useData();
    const [selectedShipment, setSelectedShipment] = useState(null);

    const inTransit = shipments.filter(s => s.status === 'In Transit').length;
    const outForDelivery = shipments.filter(s => s.status === 'Out for Delivery').length;
    const delayed = shipments.filter(s => s.status === 'Delayed').length;
    const onTime = shipments.filter(s => s.status !== 'Delayed').length;

    const getStatusBadge = (status) => {
        const badges = {
            'In Transit': 'badge-info',
            'Out for Delivery': 'badge-primary',
            'Delayed': 'badge-danger',
            'Pending Pickup': 'badge-warning',
            'Delivered': 'badge-success',
        };
        return <span className={`badge ${badges[status] || 'badge-info'}`}>{status}</span>;
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            'urgent': 'badge-danger',
            'high': 'badge-warning',
            'normal': 'badge-info',
            'low': 'badge-success',
        };
        return <span className={`badge ${badges[priority]}`}>{priority.toUpperCase()}</span>;
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl">
                <h1 className="mb-sm">🚛 Logistics & Last-Mile Delivery</h1>
                <p className="text-secondary">Real-time shipment tracking with GPS monitoring and route optimization</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-lg mb-xl">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">In Transit</span>
                        <span style={{ fontSize: '1.5rem' }}>🚚</span>
                    </div>
                    <div className="kpi-value">{inTransit}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Active shipments</div>
                </div>

                <div className="kpi-card success">
                    <div className="kpi-header">
                        <span className="kpi-title">Out for Delivery</span>
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                    </div>
                    <div className="kpi-value">{outForDelivery}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Within 2 hours</div>
                </div>

                <div className="kpi-card warning">
                    <div className="kpi-header">
                        <span className="kpi-title">Delayed</span>
                        <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                    </div>
                    <div className="kpi-value">{delayed}</div>
                    <div className="kpi-change negative">
                        <span>Needs attention</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">On-Time Rate</span>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                    </div>
                    <div className="kpi-value">{((onTime / shipments.length) * 100).toFixed(0)}%</div>
                    <div className="kpi-change positive">
                        <span>↑ 5%</span>
                        <span className="text-tertiary" style={{ fontWeight: 'normal' }}>vs last week</span>
                    </div>
                </div>
            </div>

            {/* Live Tracking Map */}
            <div className="grid grid-cols-2 gap-lg mb-xl">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Live Vehicle Tracking</h3>
                        <span className="badge badge-success">
                            <span className="status-dot success"></span>
                            Live
                        </span>
                    </div>
                    <div className="card-body">
                        <div style={{
                            height: '400px',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1) 25%, transparent 25%, transparent 75%, rgba(99, 102, 241, 0.1) 75%), linear-gradient(45deg, rgba(99, 102, 241, 0.1) 25%, transparent 25%, transparent 75%, rgba(99, 102, 241, 0.1) 75%)',
                                backgroundSize: '60px 60px',
                                backgroundPosition: '0 0, 30px 30px',
                                opacity: 0.3,
                            }} />
                            <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                                <p className="text-secondary mb-md">🗺️ Interactive Map Placeholder</p>
                                <p className="text-tertiary" style={{ fontSize: '0.875rem', maxWidth: '300px' }}>
                                    In production: OpenStreetMap with Leaflet.js showing real-time GPS coordinates, optimized routes, and traffic overlay
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Route Optimization</h3>
                        <button className="btn btn-sm btn-primary">Recalculate Routes</button>
                    </div>
                    <div className="card-body">
                        <div className="mb-lg">
                            <div className="flex items-center justify-between mb-sm">
                                <span className="text-secondary font-medium">Average Delivery Time</span>
                                <span className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--color-success)' }}>
                                    2.4 hrs
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: '85%',
                                    height: '100%',
                                    background: 'var(--gradient-success)',
                                }} />
                            </div>
                            <div className="text-tertiary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                15% faster than standard routing
                            </div>
                        </div>

                        <div className="mb-lg">
                            <div className="flex items-center justify-between mb-sm">
                                <span className="text-secondary font-medium">Fuel Efficiency</span>
                                <span className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                                    12.5 mpg
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: '78%',
                                    height: '100%',
                                    background: 'var(--gradient-primary)',
                                }} />
                            </div>
                            <div className="text-tertiary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                AI-optimized routes save 22% fuel costs
                            </div>
                        </div>

                        <div className="alert alert-info" style={{ marginBottom: 0 }}>
                            <div>
                                <strong>🤖 AI Recommendation</strong>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                    Consolidate SHP001 and SHP002 to reduce delivery time by 30 minutes and save $45 in fuel costs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipments Table */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Active Shipments</h3>
                    <div className="flex gap-sm">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search shipments..."
                            style={{ width: '200px' }}
                        />
                        <select className="form-select" style={{ width: '150px' }}>
                            <option>All Status</option>
                            <option>In Transit</option>
                            <option>Delayed</option>
                            <option>Out for Delivery</option>
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Shipment ID</th>
                                    <th>Customer</th>
                                    <th>Destination</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>ETA</th>
                                    <th>Priority</th>
                                    <th>Items</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shipments.map(shipment => (
                                    <tr key={shipment.id}>
                                        <td>
                                            <code style={{
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                color: 'var(--color-info)',
                                            }}>
                                                {shipment.id}
                                            </code>
                                        </td>
                                        <td className="font-semibold">{shipment.customer}</td>
                                        <td className="text-secondary">{shipment.destination}</td>
                                        <td>{shipment.driver}</td>
                                        <td>{getStatusBadge(shipment.status)}</td>
                                        <td className="text-secondary">{format(shipment.eta, 'MMM d, h:mm a')}</td>
                                        <td>{getPriorityBadge(shipment.priority)}</td>
                                        <td className="text-center">{shipment.items}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => setSelectedShipment(shipment)}
                                            >
                                                Track
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Shipment Detail Modal */}
            {selectedShipment && (
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
                    onClick={() => setSelectedShipment(null)}
                >
                    <div
                        className="glass-card animate-fade-in"
                        style={{ maxWidth: '700px', width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-lg">
                            <div>
                                <h3 className="mb-sm">Shipment Details - {selectedShipment.id}</h3>
                                <p className="text-secondary mb-0">Real-time tracking and delivery information</p>
                            </div>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setSelectedShipment(null)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-md mb-lg">
                            <div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Customer</div>
                                <div className="font-semibold">{selectedShipment.customer}</div>
                            </div>
                            <div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Driver</div>
                                <div className="font-semibold">{selectedShipment.driver}</div>
                            </div>
                            <div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Destination</div>
                                <div className="font-semibold">{selectedShipment.destination}</div>
                            </div>
                            <div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>ETA</div>
                                <div className="font-semibold">{format(selectedShipment.eta, 'MMM d, h:mm a')}</div>
                            </div>
                        </div>

                        <div className="alert alert-success">
                            <div>
                                <strong>📍 Current Location</strong>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                    Lat: {selectedShipment.currentLocation.lat.toFixed(4)}, Lng: {selectedShipment.currentLocation.lng.toFixed(4)}
                                </p>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
                                    Last updated: {format(new Date(), 'h:mm:ss a')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-sm mt-lg">
                            <button className="btn btn-primary flex-1">Send Notification</button>
                            <button className="btn btn-outline flex-1">View Route</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LogisticsDashboard;
