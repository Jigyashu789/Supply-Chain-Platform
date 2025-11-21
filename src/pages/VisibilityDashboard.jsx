import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

function VisibilityDashboard() {
    const { inventory, shipments, purchaseOrders, notifications } = useData();

    const totalInventory = inventory.reduce((sum, item) => sum + item.currentStock, 0);
    const activeShipments = shipments.filter(s => ['In Transit', 'Out for Delivery'].includes(s.status)).length;
    const pendingPOs = purchaseOrders.filter(po => po.status === 'pending').length;
    const recentNotifications = notifications.slice(0, 10);

    return (
        <div className="animate-fade-in">
            <div className="mb-xl">
                <h1 className="mb-sm">👁️ Real-Time Visibility Dashboard</h1>
                <p className="text-secondary">Unified view of inventory, shipments, and procurement with IoT data</p>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-4 gap-lg mb-xl">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Total Inventory</span>
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                    </div>
                    <div className="kpi-value">{totalInventory}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                        Across {inventory.length} SKUs
                    </div>
                </div>

                <div className="kpi-card success">
                    <div className="kpi-header">
                        <span className="kpi-title">Active Shipments</span>
                        <span style={{ fontSize: '1.5rem' }}>🚛</span>
                    </div>
                    <div className="kpi-value">{activeShipments}</div>
                    <div className="flex items-center gap-xs">
                        <span className="status-dot success"></span>
                        <span className="text-tertiary" style={{ fontSize: '0.875rem' }}>Live tracking</span>
                    </div>
                </div>

                <div className="kpi-card warning">
                    <div className="kpi-header">
                        <span className="kpi-title">Pending POs</span>
                        <span style={{ fontSize: '1.5rem' }}>📋</span>
                    </div>
                    <div className="kpi-value">{pendingPOs}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Awaiting confirmation</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Data Sync</span>
                        <span style={{ fontSize: '1.5rem' }}>☁️</span>
                    </div>
                    <div className="kpi-value">
                        <span className="flex items-center gap-xs">
                            <span className="status-dot success"></span>
                            <span style={{ fontSize: '1rem' }}>Live</span>
                        </span>
                    </div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                        Last update: {format(new Date(), 'h:mm a')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-lg">
                {/* IoT Sensor Data */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3 className="card-title">IoT Sensor Monitoring</h3>
                        <span className="badge badge-success">
                            <span className="status-dot success"></span>
                            All Systems Online
                        </span>
                    </div>
                    <div className="card-body">
                        <div className="grid grid-cols-2 gap-md mb-lg">
                            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                                <div className="flex items-center justify-between mb-md">
                                    <span className="text-secondary font-medium">GPS Trackers</span>
                                    <span style={{ fontSize: '1.5rem' }}>📍</span>
                                </div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                                    {shipments.length} Active
                                </div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    Real-time location tracking
                                </div>
                            </div>

                            <div className="card" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                                <div className="flex items-center justify-between mb-md">
                                    <span className="text-secondary font-medium">RFID Readers</span>
                                    <span style={{ fontSize: '1.5rem' }}>📡</span>
                                </div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-success)' }}>
                                    8 Locations
                                </div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    Inventory checkpoints
                                </div>
                            </div>

                            <div className="card" style={{ background: 'rgba(245, 158, 11, 0.05)' }}>
                                <div className="flex items-center justify-between mb-md">
                                    <span className="text-secondary font-medium">Temperature Sensors</span>
                                    <span style={{ fontSize: '1.5rem' }}>🌡️</span>
                                </div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-warning)' }}>
                                    22°C
                                </div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    Warehouse average
                                </div>
                            </div>

                            <div className="card" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                                <div className="flex items-center justify-between mb-md">
                                    <span className="text-secondary font-medium">Humidity Sensors</span>
                                    <span style={{ fontSize: '1.5rem' }}>💧</span>
                                </div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-info)' }}>
                                    45%
                                </div>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    Optimal range
                                </div>
                            </div>
                        </div>

                        <div className="alert alert-success" style={{ marginBottom: 0 }}>
                            <div>
                                <strong>✅ All Sensors Operational</strong>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                    All IoT devices are online and reporting normally. Last health check: {format(new Date(), 'h:mm a')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Center */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Notifications</h3>
                        <span className="badge badge-info">{notifications.length} new</span>
                    </div>
                    <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {recentNotifications.length === 0 ? (
                            <div className="text-center text-tertiary" style={{ padding: '2rem 0' }}>
                                <p>No recent notifications</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-sm">
                                {recentNotifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        className="card"
                                        style={{
                                            padding: '0.75rem',
                                            borderLeft: `3px solid ${notif.type === 'success' ? 'var(--color-success)' :
                                                    notif.type === 'warning' ? 'var(--color-warning)' :
                                                        notif.type === 'error' ? 'var(--color-danger)' :
                                                            'var(--color-info)'
                                                }`,
                                        }}
                                    >
                                        <div className="font-semibold" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                            {notif.title}
                                        </div>
                                        <p className="text-secondary" style={{ fontSize: '0.75rem', margin: '0 0 0.5rem 0' }}>
                                            {notif.message}
                                        </p>
                                        <div className="text-tertiary" style={{ fontSize: '0.7rem' }}>
                                            {format(notif.timestamp, 'MMM d, h:mm a')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Unified Status Table */}
            <div className="card mt-lg">
                <div className="card-header">
                    <h3 className="card-title">Unified Status Overview</h3>
                    <div className="flex gap-sm">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search across all modules..."
                            style={{ width: '250px' }}
                        />
                        <button className="btn btn-outline btn-sm">Export Report</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="mb-lg">
                        <h4 className="mb-md" style={{ fontSize: '1rem' }}>Critical Inventory Items</h4>
                        <div className="grid grid-cols-2 gap-md">
                            {inventory.filter(item => item.currentStock < item.reorderPoint).slice(0, 4).map(item => (
                                <div key={item.id} className="card" style={{ borderLeft: '3px solid var(--color-danger)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{item.name}</div>
                                            <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                                Stock: {item.currentStock} / {item.optimalStock} units
                                            </div>
                                        </div>
                                        <span className="badge badge-danger">Critical</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-lg">
                        <h4 className="mb-md" style={{ fontSize: '1rem' }}>Active Shipments</h4>
                        <div className="grid grid-cols-2 gap-md">
                            {shipments.filter(s => ['In Transit', 'Out for Delivery'].includes(s.status)).slice(0, 4).map(ship => (
                                <div key={ship.id} className="card" style={{ borderLeft: '3px solid var(--color-success)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{ship.customer}</div>
                                            <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                                {ship.destination} • ETA: {format(ship.eta, 'MMM d, h:mm a')}
                                            </div>
                                        </div>
                                        <span className={`badge ${ship.status === 'Out for Delivery' ? 'badge-primary' : 'badge-info'}`}>
                                            {ship.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-md" style={{ fontSize: '1rem' }}>Pending Purchase Orders</h4>
                        <div className="grid grid-cols-2 gap-md">
                            {purchaseOrders.filter(po => po.status === 'pending').map(po => (
                                <div key={po.id} className="card" style={{ borderLeft: '3px solid var(--color-warning)' }}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold">{po.supplier}</div>
                                            <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                                {po.items.length} items • ${po.total.toLocaleString()}
                                            </div>
                                        </div>
                                        <span className="badge badge-warning">Pending</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisibilityDashboard;
