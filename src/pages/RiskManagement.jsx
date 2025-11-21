import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import MarineMap from '../components/MarineSupplyMap';

function RiskManagement() {
    const { risks, shipments, inventory } = useData();
    const [selectedRisk, setSelectedRisk] = useState(null);

    const criticalRisks = risks.filter(r => r.severity === 'critical').length;
    const highRisks = risks.filter(r => r.severity === 'high').length;
    const mediumRisks = risks.filter(r => r.severity === 'medium').length;
    const lowRisks = risks.filter(r => r.severity === 'low').length;

    const getSeverityBadge = (severity) => {
        const badges = {
            'critical': 'badge-danger',
            'high': 'badge-warning',
            'medium': 'badge-info',
            'low': 'badge-success',
        };
        return <span className={`badge ${badges[severity]}`}>{severity.toUpperCase()}</span>;
    };

    const getRiskIcon = (type) => {
        const icons = {
            'shipping_delay': '🚢',
            'supplier': '🏭',
            'weather': '🌧️',
            'demand_spike': '📊',
            'geopolitical': '🌍',
        };
        return icons[type] || '⚠️';
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl">
                <h1 className="mb-sm">⚠️ Risk Management & Alerts</h1>
                <p className="text-secondary">Proactive risk detection and mitigation strategies</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-lg mb-xl">
                <div className="kpi-card danger">
                    <div className="kpi-header">
                        <span className="kpi-title">Critical Risks</span>
                        <span style={{ fontSize: '1.5rem' }}>🚨</span>
                    </div>
                    <div className="kpi-value">{criticalRisks}</div>
                    <div className="kpi-change negative">
                        <span>Immediate action required</span>
                    </div>
                </div>

                <div className="kpi-card warning">
                    <div className="kpi-header">
                        <span className="kpi-title">High Priority</span>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    </div>
                    <div className="kpi-value">{highRisks}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Needs attention</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Medium Priority</span>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                    </div>
                    <div className="kpi-value">{mediumRisks}</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Under monitoring</div>
                </div>

                <div className="kpi-card success">
                    <div className="kpi-header">
                        <span className="kpi-title">Risk Score</span>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                    </div>
                    <div className="kpi-value">72/100</div>
                    <div className="kpi-change positive">
                        <span>↑ 5 points</span>
                        <span className="text-tertiary" style={{ fontWeight: 'normal' }}>vs last week</span>
                    </div>
                </div>
            </div>

            {/* Active Risks */}
            <div className="card mb-xl">
                <div className="card-header">
                    <h3 className="card-title">Active Risk Alerts</h3>
                    <div className="flex gap-sm">
                        <select className="form-select" style={{ width: '150px' }}>
                            <option>All Severity</option>
                            <option>Critical</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <button className="btn btn-primary btn-sm">+ Add Manual Risk</button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="flex flex-col gap-lg">
                        {risks.map(risk => (
                            <div
                                key={risk.id}
                                className="card"
                                style={{
                                    borderLeft: `4px solid ${risk.severity === 'critical' ? 'var(--color-danger)' :
                                        risk.severity === 'high' ? 'var(--color-warning)' :
                                            risk.severity === 'medium' ? 'var(--color-info)' :
                                                'var(--color-success)'
                                        }`,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedRisk(risk)}
                            >
                                <div className="flex items-start justify-between mb-md">
                                    <div className="flex items-start gap-md flex-1">
                                        <span style={{ fontSize: '2rem' }}>{getRiskIcon(risk.type)}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-md mb-sm">
                                                <h4 className="mb-0">{risk.title}</h4>
                                                {getSeverityBadge(risk.severity)}
                                            </div>
                                            <p className="text-secondary mb-md" style={{ fontSize: '0.875rem' }}>
                                                {risk.description}
                                            </p>
                                            {risk.affectedShipments && (
                                                <div className="flex items-center gap-xs mb-sm">
                                                    <span className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                                                        Affected Shipments:
                                                    </span>
                                                    {risk.affectedShipments.map(id => (
                                                        <code key={id} style={{
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem',
                                                            color: 'var(--color-danger)',
                                                        }}>
                                                            {id}
                                                        </code>
                                                    ))}
                                                </div>
                                            )}
                                            {risk.affectedSKUs && (
                                                <div className="flex items-center gap-xs mb-sm">
                                                    <span className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                                                        Affected SKUs:
                                                    </span>
                                                    {risk.affectedSKUs.map(id => (
                                                        <code key={id} style={{
                                                            background: 'rgba(239, 68, 68, 0.1)',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem',
                                                            color: 'var(--color-danger)',
                                                        }}>
                                                            {id}
                                                        </code>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="alert alert-info" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                                                <div>
                                                    <strong>💡 Recommended Mitigation</strong>
                                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                                        {risk.mitigation}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-tertiary" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                                        {format(risk.timestamp, 'MMM d, h:mm a')}
                                    </div>
                                </div>
                                <div className="flex gap-sm mt-md">
                                    <button className="btn btn-sm btn-primary">Take Action</button>
                                    <button className="btn btn-sm btn-outline">View Details</button>
                                    <button className="btn btn-sm btn-outline">Mark Resolved</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Risk Analysis */}
            <div className="card mb-xl">
                <div className="card-header">
                    <h3 className="card-title">🌊 Global Maritime Supply Chain Network</h3>
                    <span className="badge badge-success">
                        <span className="status-dot success"></span>
                        Live Tracking
                    </span>
                </div>
                <div className="card-body">
                    <MarineMap />

                    <div className="grid grid-cols-3 gap-sm mt-lg">
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: 'var(--color-danger)',
                            }}></div>
                            <span className="text-tertiary" style={{ fontSize: '0.75rem' }}>High Risk Port</span>
                        </div>
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: 'var(--color-warning)',
                            }}></div>
                            <span className="text-tertiary" style={{ fontSize: '0.75rem' }}>Congested Port</span>
                        </div>
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: 'var(--color-success)',
                            }}></div>
                            <span className="text-tertiary" style={{ fontSize: '0.75rem' }}>Operational Port</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scenario Planning and Analysis Grid */}
            <div className="grid grid-cols-2 gap-lg mb-xl">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Scenario Planning</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">Select Disruption Scenario</label>
                            <select className="form-select">
                                <option>Port Strike (5 days)</option>
                                <option>Supplier Bankruptcy</option>
                                <option>Natural Disaster</option>
                                <option>Cyber Attack</option>
                                <option>Pandemic Lockdown</option>
                            </select>
                        </div>

                        <div className="alert alert-warning mb-lg">
                            <div>
                                <strong>📊 Impact Analysis: Port Strike (5 days)</strong>
                                <div style={{ marginTop: '0.75rem' }}>
                                    <div className="mb-sm">
                                        <div className="flex items-center justify-between mb-xs">
                                            <span style={{ fontSize: '0.875rem' }}>Affected Shipments</span>
                                            <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>8</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-xs">
                                            <span style={{ fontSize: '0.875rem' }}>Revenue at Risk</span>
                                            <span className="font-semibold" style={{ color: 'var(--color-danger)' }}>$142,000</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span style={{ fontSize: '0.875rem' }}>Time to Recover</span>
                                            <span className="font-semibold" style={{ color: 'var(--color-warning)' }}>12 days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', marginBottom: 0 }}>
                            <div className="font-semibold mb-sm" style={{ fontSize: '0.875rem' }}>
                                🛡️ Mitigation Strategy
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                                <li className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    Reroute shipments through Oakland Port
                                </li>
                                <li className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    Expedite 3 POs via air freight
                                </li>
                                <li className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                    Increase safety stock by 20%
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Trends */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Risk Trend Analysis (30 Days)</h3>
                </div>
                <div className="card-body">
                    <div style={{
                        height: '300px',
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
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(99, 102, 241, 0.05) 50px, rgba(99, 102, 241, 0.05) 51px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(99, 102, 241, 0.05) 60px, rgba(99, 102, 241, 0.05) 61px)',
                        }} />
                        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                            <p className="text-secondary mb-md">📈 Time Series Chart</p>
                            <p className="text-tertiary" style={{ fontSize: '0.875rem', maxWidth: '400px' }}>
                                Historical risk score over time, showing trend patterns, anomaly detection, and predictive forecasting
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-md mt-lg">
                        <div className="card">
                            <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Risks Detected</div>
                            <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-info)' }}>
                                24
                            </div>
                            <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>Last 30 days</div>
                        </div>
                        <div className="card">
                            <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Risks Resolved</div>
                            <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-success)' }}>
                                20
                            </div>
                            <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>83% resolution rate</div>
                        </div>
                        <div className="card">
                            <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Avg Response Time</div>
                            <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-warning)' }}>
                                4.2h
                            </div>
                            <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>15% improvement</div>
                        </div>
                        <div className="card">
                            <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Cost Avoided</div>
                            <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                                $86K
                            </div>
                            <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>Through mitigation</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Detail Modal */}
            {
                selectedRisk && (
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
                        onClick={() => setSelectedRisk(null)}
                    >
                        <div
                            className="glass-card animate-fade-in"
                            style={{ maxWidth: '800px', width: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-lg">
                                <div className="flex items-center gap-md">
                                    <span style={{ fontSize: '2.5rem' }}>{getRiskIcon(selectedRisk.type)}</span>
                                    <div>
                                        <h3 className="mb-sm">{selectedRisk.title}</h3>
                                        <div className="flex items-center gap-sm">
                                            {getSeverityBadge(selectedRisk.severity)}
                                            <span className="text-tertiary" style={{ fontSize: '0.875rem' }}>
                                                Detected: {format(selectedRisk.timestamp, 'MMM d, h:mm a')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setSelectedRisk(null)}
                                >
                                    Close
                                </button>
                            </div>

                            <div className="mb-lg">
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Description</h4>
                                <p className="text-secondary">{selectedRisk.description}</p>
                            </div>

                            <div className="mb-lg">
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Recommended Mitigation</h4>
                                <div className="alert alert-info" style={{ marginBottom: 0 }}>
                                    <p style={{ margin: 0 }}>{selectedRisk.mitigation}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-md mb-lg">
                                <div className="card">
                                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Impact Level</div>
                                    <div className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--color-danger)' }}>
                                        {selectedRisk.severity === 'critical' ? 'Critical' : selectedRisk.severity === 'high' ? 'High' : 'Medium'}
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Affected Items</div>
                                    <div className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--color-warning)' }}>
                                        {(selectedRisk.affectedShipments?.length || 0) + (selectedRisk.affectedSKUs?.length || 0)}
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Est. Recovery</div>
                                    <div className="font-bold" style={{ fontSize: '1.25rem', color: 'var(--color-info)' }}>
                                        {selectedRisk.severity === 'critical' ? '5-7 days' : selectedRisk.severity === 'high' ? '3-5 days' : '1-3 days'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-sm">
                                <button className="btn btn-primary flex-1">Implement Mitigation</button>
                                <button className="btn btn-outline flex-1">Escalate to Management</button>
                                <button className="btn btn-outline flex-1">Mark as Resolved</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default RiskManagement;
