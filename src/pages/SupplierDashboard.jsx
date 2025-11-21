import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

function SupplierDashboard() {
    const { suppliers, purchaseOrders, addPurchaseOrder } = useData();
    const [showPOForm, setShowPOForm] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
    const avgLeadTime = suppliers.reduce((sum, s) => sum + s.leadTime, 0) / suppliers.length;
    const avgReliability = suppliers.reduce((sum, s) => sum + s.reliability, 0) / suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;

    const getStatusBadge = (status) => {
        const badges = {
            'active': 'badge-success',
            'warning': 'badge-warning',
            'inactive': 'badge-danger',
        };
        return <span className={`badge ${badges[status]}`}>{status.toUpperCase()}</span>;
    };

    const getPOStatusBadge = (status) => {
        const badges = {
            'pending': 'badge-warning',
            'confirmed': 'badge-info',
            'shipped': 'badge-primary',
            'delivered': 'badge-success',
            'cancelled': 'badge-danger',
        };
        return <span className={`badge ${badges[status]}`}>{status.toUpperCase()}</span>;
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl">
                <h1 className="mb-sm">🏭 Supplier Coordination</h1>
                <p className="text-secondary">Manage suppliers, automate orders, and track procurement</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-lg mb-xl">
                <div className="kpi-card success">
                    <div className="kpi-header">
                        <span className="kpi-title">Active Suppliers</span>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                    </div>
                    <div className="kpi-value">{activeSuppliers}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                        {suppliers.length} total registered
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Avg Rating</span>
                        <span style={{ fontSize: '1.5rem' }}>⭐</span>
                    </div>
                    <div className="kpi-value">{avgRating.toFixed(1)}</div>
                    <div className="kpi-change positive">
                        <span>↑ 0.3</span>
                        <span className="text-tertiary" style={{ fontWeight: 'normal' }}>vs last quarter</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Avg Lead Time</span>
                        <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                    </div>
                    <div className="kpi-value">{avgLeadTime.toFixed(0)}d</div>
                    <div className="kpi-change positive">
                        <span>↓ 1 day</span>
                        <span className="text-tertiary" style={{ fontWeight: 'normal' }}>improved</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Reliability</span>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                    </div>
                    <div className="kpi-value">{avgReliability.toFixed(0)}%</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>On-time delivery</div>
                </div>
            </div>

            {/* Supplier List */}
            <div className="card mb-xl">
                <div className="card-header">
                    <h3 className="card-title">Supplier Directory</h3>
                    <div className="flex gap-sm">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search suppliers..."
                            style={{ width: '200px' }}
                        />
                        <button className="btn btn-primary btn-sm">+ Add Supplier</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-2 gap-lg">
                        {suppliers.map(supplier => (
                            <div
                                key={supplier.id}
                                className="card"
                                style={{
                                    borderLeft: `4px solid ${supplier.status === 'active' ? 'var(--color-success)' : supplier.status === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)'}`,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedSupplier(supplier)}
                            >
                                <div className="flex items-start justify-between mb-md">
                                    <div>
                                        <h4 className="mb-sm">{supplier.name}</h4>
                                        <p className="text-tertiary" style={{ fontSize: '0.875rem', margin: 0 }}>
                                            📍 {supplier.location}
                                        </p>
                                    </div>
                                    {getStatusBadge(supplier.status)}
                                </div>

                                <div className="grid grid-cols-3 gap-md mb-md">
                                    <div>
                                        <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>Rating</div>
                                        <div className="font-semibold" style={{ color: 'var(--color-success)' }}>
                                            ⭐ {supplier.rating}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>Lead Time</div>
                                        <div className="font-semibold">{supplier.leadTime} days</div>
                                    </div>
                                    <div>
                                        <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>Reliability</div>
                                        <div className="font-semibold">{supplier.reliability}%</div>
                                    </div>
                                </div>

                                <div className="mb-sm">
                                    <div className="text-tertiary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                        Products
                                    </div>
                                    <div className="flex flex-wrap gap-xs">
                                        {supplier.products.map(product => (
                                            <span key={product} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                                                {product}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-sm mt-md">
                                    <button className="btn btn-sm btn-outline flex-1">Message</button>
                                    <button
                                        className="btn btn-sm btn-primary flex-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPOForm(true);
                                            setSelectedSupplier(supplier);
                                        }}
                                    >
                                        Create PO
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Purchase Orders */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Purchase Orders</h3>
                    <button className="btn btn-sm btn-primary" onClick={() => setShowPOForm(true)}>
                        + New Purchase Order
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>PO Number</th>
                                    <th>Supplier</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Order Date</th>
                                    <th>Expected Delivery</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseOrders.map(po => (
                                    <tr key={po.id}>
                                        <td>
                                            <code style={{
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                color: 'var(--color-primary)',
                                            }}>
                                                {po.id}
                                            </code>
                                        </td>
                                        <td className="font-semibold">{po.supplier}</td>
                                        <td className="text-secondary">{po.items.length} items</td>
                                        <td className="font-semibold">${po.total.toLocaleString()}</td>
                                        <td className="text-secondary">{format(po.orderDate, 'MMM d, yyyy')}</td>
                                        <td className="text-secondary">{format(po.expectedDelivery, 'MMM d, yyyy')}</td>
                                        <td>{getPOStatusBadge(po.status)}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create PO Modal */}
            {showPOForm && (
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
                    onClick={() => setShowPOForm(false)}
                >
                    <div
                        className="glass-card animate-fade-in"
                        style={{ maxWidth: '600px', width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-lg">
                            <div>
                                <h3 className="mb-sm">Create Purchase Order</h3>
                                <p className="text-secondary mb-0">Generate automated PO with AI-recommended quantities</p>
                            </div>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setShowPOForm(false)}
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            addPurchaseOrder({
                                id: `PO00${purchaseOrders.length + 1}`,
                                supplier: selectedSupplier?.name || 'TechParts International',
                                items: [{ sku: 'SKU001', qty: 50 }],
                                total: 45000,
                                status: 'pending',
                                orderDate: new Date(),
                                expectedDelivery: new Date(Date.now() + 86400000 * 7),
                            });
                            setShowPOForm(false);
                        }}>
                            <div className="form-group">
                                <label className="form-label">Supplier</label>
                                <select className="form-select" required>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Product SKU</label>
                                <select className="form-select" required>
                                    <option value="SKU001">SKU001 - Laptop Computers</option>
                                    <option value="SKU002">SKU002 - Wireless Mice</option>
                                    <option value="SKU003">SKU003 - Office Chairs</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter quantity"
                                    defaultValue="50"
                                    required
                                />
                                <p className="text-tertiary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                    💡 AI recommends 50 units based on current stock and demand forecast
                                </p>
                            </div>

                            <div className="alert alert-success">
                                <div>
                                    <strong>🤖 Smart Procurement</strong>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                        This order will arrive in {selectedSupplier?.leadTime || 7} days, preventing stockout based on current consumption rate.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-sm mt-lg">
                                <button type="submit" className="btn btn-primary flex-1">
                                    Create Purchase Order
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline flex-1"
                                    onClick={() => setShowPOForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Supplier Detail Modal */}
            {selectedSupplier && !showPOForm && (
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
                    onClick={() => setSelectedSupplier(null)}
                >
                    <div
                        className="glass-card animate-fade-in"
                        style={{ maxWidth: '700px', width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-lg">
                            <div>
                                <h3 className="mb-sm">{selectedSupplier.name}</h3>
                                <p className="text-secondary mb-0">Supplier Performance Dashboard</p>
                            </div>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setSelectedSupplier(null)}
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-md mb-lg">
                            <div className="card">
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Overall Rating</div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-success)' }}>
                                    ⭐ {selectedSupplier.rating}/5.0
                                </div>
                            </div>
                            <div className="card">
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>On-Time Delivery</div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                                    {selectedSupplier.reliability}%
                                </div>
                            </div>
                        </div>

                        <div className="mb-lg">
                            <div className="text-tertiary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Contact Information
                            </div>
                            <p className="text-secondary mb-sm">📧 {selectedSupplier.contact}</p>
                            <p className="text-secondary mb-sm">📍 {selectedSupplier.location}</p>
                            <p className="text-secondary mb-0">⏱️ Average Lead Time: {selectedSupplier.leadTime} days</p>
                        </div>

                        <div className="flex gap-sm">
                            <button className="btn btn-primary flex-1">Send Message</button>
                            <button className="btn btn-outline flex-1">View Order History</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupplierDashboard;
