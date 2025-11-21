import { useState, useEffect } from 'react';
import { Popup } from 'react-leaflet';
import { format } from 'date-fns';

function VesselTracker({ vessel, onClose }) {
    const [livePosition, setLivePosition] = useState(vessel.currentPosition);
    const [routeHistory, setRouteHistory] = useState([vessel.currentPosition]);

    // Simulate real-time position updates
    useEffect(() => {
        const interval = setInterval(() => {
            setLivePosition(prev => {
                // Simulate small movements toward destination
                const newLat = prev[0] + (Math.random() - 0.5) * 0.1;
                const newLng = prev[1] + (Math.random() - 0.5) * 0.1;
                const newPos = [newLat, newLng];
                setRouteHistory(history => [...history.slice(-20), newPos]); // Keep last 20 positions
                return newPos;
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const containers = vessel.containers || [
        { id: 'MSCU1234567', type: '40ft HC', cargo: 'Electronics', weight: '24,000 kg', origin: 'Shanghai', destination: 'Rotterdam' },
        { id: 'MSCU2345678', type: '20ft', cargo: 'Textiles', weight: '18,500 kg', origin: 'Shanghai', destination: 'Hamburg' },
        { id: 'MSCU3456789', type: '40ft', cargo: 'Auto Parts', weight: '26,300 kg', origin: 'Hong Kong', destination: 'Rotterdam' },
        { id: 'MSCU4567890', type: '40ft HC', cargo: 'Consumer Goods', weight: '22,800 kg', origin: 'Singapore', destination: 'Antwerp' },
        { id: 'MSCU5678901', type: '20ft Reefer', cargo: 'Pharmaceuticals', weight: '15,200 kg', origin: 'Shanghai', destination: 'Rotterdam', temp: '2-8°C' },
    ];

    const aisData = {
        mmsi: vessel.mmsi || '123456789',
        imo: vessel.imo || 'IMO9876543',
        callSign: vessel.callSign || 'ABCD1',
        heading: vessel.heading || '285°',
        speed: vessel.speed || '22 knots',
        draft: vessel.draft || '15.5m',
        lastUpdate: new Date(),
    };

    return (
        <Popup maxWidth={450} minWidth={380}>
            <div style={{
                maxHeight: '600px',
                overflowY: 'auto',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '16px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                padding: '1.5rem',
            }}>
                {/* Vessel Header */}
                <div style={{
                    marginBottom: '1.25rem',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                    paddingBottom: '1rem',
                    background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginLeft: '-1.5rem',
                    marginRight: '-1.5rem',
                    marginTop: '-1.5rem',
                }}>
                    <div className="flex items-center justify-between mb-sm">
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '700',
                        }}>
                            {vessel.name}
                        </h3>
                        <span style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#fff',
                                animation: 'pulse 2s infinite',
                            }} />
                            LIVE
                        </span>
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: '#cbd5e1',
                        fontWeight: '500',
                    }}>
                        {vessel.type} • {vessel.operator}
                    </p>
                </div>

                {/* AIS Data */}
                <div style={{
                    marginBottom: '1.25rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '0.75rem',
                        color: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <span style={{ fontSize: '1.1rem' }}>🛰️</span>
                        AIS Data
                    </h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        fontSize: '0.85rem',
                    }}>
                        {[
                            { label: 'MMSI', value: aisData.mmsi },
                            { label: 'IMO', value: aisData.imo },
                            { label: 'Call Sign', value: aisData.callSign },
                            { label: 'Heading', value: aisData.heading },
                            { label: 'Speed', value: aisData.speed, highlight: true },
                            { label: 'Draft', value: aisData.draft },
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(15, 23, 42, 0.5)',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(148, 163, 184, 0.1)',
                            }}>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                    {item.label}
                                </div>
                                <div style={{
                                    fontWeight: '600',
                                    color: item.highlight ? '#10b981' : '#f1f5f9',
                                }}>
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p style={{
                        margin: '0.75rem 0 0 0',
                        fontSize: '0.7rem',
                        color: '#64748b',
                        fontStyle: 'italic',
                    }}>
                        Last update: {format(aisData.lastUpdate, 'h:mm:ss a')}
                    </p>
                </div>

                {/* Voyage Info */}
                <div style={{
                    marginBottom: '1.25rem',
                    background: 'rgba(139, 92, 246, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '0.75rem',
                        color: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <span style={{ fontSize: '1.1rem' }}>🗺️</span>
                        Voyage Information
                    </h4>
                    <div style={{ fontSize: '0.875rem' }}>
                        {[
                            { label: 'Destination', value: vessel.destination },
                            { label: 'ETA', value: format(vessel.eta, 'MMM d, h:mm a'), color: '#3b82f6' },
                            { label: 'Capacity', value: vessel.capacity },
                            { label: 'Current Load', value: `${containers.length} containers (${Math.round(containers.length / 20000 * 100)}%)` },
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                marginBottom: idx < 3 ? '0.75rem' : 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 0.75rem',
                                background: idx % 2 === 0 ? 'rgba(15, 23, 42, 0.3)' : 'transparent',
                                borderRadius: '6px',
                            }}>
                                <span style={{ color: '#94a3b8' }}>{item.label}:</span>
                                <span style={{
                                    fontWeight: '600',
                                    color: item.color || '#f1f5f9',
                                }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Container Manifest */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '0.75rem',
                        color: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <span style={{ fontSize: '1.1rem' }}>📦</span>
                        Container Manifest
                        <span style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                        }}>
                            {containers.length}
                        </span>
                    </h4>
                    <div style={{
                        maxHeight: '220px',
                        overflowY: 'auto',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.3)',
                    }}>
                        {containers.map((container, idx) => (
                            <div
                                key={container.id}
                                style={{
                                    padding: '0.9rem',
                                    borderBottom: idx < containers.length - 1 ? '1px solid rgba(148, 163, 184, 0.15)' : 'none',
                                    background: idx % 2 === 0 ? 'rgba(99, 102, 241, 0.03)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(99, 102, 241, 0.03)' : 'transparent';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div className="flex items-center justify-between mb-xs">
                                    <code style={{
                                        fontSize: '0.75rem',
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '6px',
                                        color: '#a5b4fc',
                                        fontWeight: '700',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                    }}>
                                        {container.id}
                                    </code>
                                    <span style={{
                                        background: 'rgba(59, 130, 246, 0.2)',
                                        color: '#93c5fd',
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                    }}>
                                        {container.type}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
                                    <div style={{ marginBottom: '0.35rem' }}>
                                        📌 {container.cargo} • <strong>{container.weight}</strong>
                                    </div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                                        {container.origin} → {container.destination}
                                        {container.temp && (
                                            <span style={{
                                                marginLeft: '0.5rem',
                                                color: '#60a5fa',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                            }}>
                                                🌡️ {container.temp}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Position History */}
                <div style={{
                    marginBottom: '1.25rem',
                    background: 'rgba(236, 72, 153, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}>
                        <span style={{ fontSize: '1.1rem' }}>📍</span>
                        Position History
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(15, 23, 42, 0.4)',
                            borderRadius: '6px',
                            marginBottom: '0.5rem',
                        }}>
                            <span style={{ color: '#94a3b8' }}>Current:</span>
                            <span style={{ fontWeight: '600', color: '#f1f5f9', fontFamily: 'monospace' }}>
                                {livePosition[0].toFixed(4)}°N, {livePosition[1].toFixed(4)}°E
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(15, 23, 42, 0.4)',
                            borderRadius: '6px',
                        }}>
                            <span style={{ color: '#94a3b8' }}>Tracking points:</span>
                            <span style={{ fontWeight: '600', color: '#10b981' }}>{routeHistory.length}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1.5rem',
                }}>
                    <button style={{
                        flex: 1,
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                        transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
                        }}
                    >
                        Track Vessel
                    </button>
                    <button style={{
                        flex: 1,
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(148, 163, 184, 0.1)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(148, 163, 184, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                        }}
                    >
                        View Route
                    </button>
                </div>
            </div>
        </Popup>
    );
}

export default VesselTracker;
