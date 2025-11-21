import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { format } from 'date-fns';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import VesselTracker from './VesselTracker';
import {
    marinePorts,
    shippingRoutes,
    activeVessels,
    marineRisks,
    getPortStatusColor,
    getCongestionColor,
} from '../data/marineData';

// Fix default icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom port icon
const createPortIcon = (status) => {
    const color = status === 'congested' ? '#f59e0b' :
        status === 'delayed' ? '#ef4444' :
            '#10b981';

    return L.divIcon({
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        className: 'custom-port-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
};

// Custom vessel icon
const createVesselIcon = () => {
    return L.divIcon({
        html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #3b82f6;"></div>`,
        className: 'custom-vessel-marker',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};

function MarineMap() {
    const [showRoutes, setShowRoutes] = useState(true);
    const [showVessels, setShowVessels] = useState(true);
    const [showRisks, setShowRisks] = useState(true);

    return (
        <div style={{ position: 'relative', width: '100%', height: '600px' }}>
            {/* Map Controls */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
            }}>
                <div className="flex flex-col gap-sm">
                    <label className="flex items-center gap-sm" style={{ fontSize: '0.875rem', color: 'white', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showRoutes}
                            onChange={(e) => setShowRoutes(e.target.checked)}
                        />
                        <span>Shipping Routes</span>
                    </label>
                    <label className="flex items-center gap-sm" style={{ fontSize: '0.875rem', color: 'white', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showVessels}
                            onChange={(e) => setShowVessels(e.target.checked)}
                        />
                        <span>Active Vessels</span>
                    </label>
                    <label className="flex items-center gap-sm" style={{ fontSize: '0.875rem', color: 'white', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showRisks}
                            onChange={(e) => setShowRisks(e.target.checked)}
                        />
                        <span>Risk Zones</span>
                    </label>
                </div>
            </div>

            {/* Leaflet Map */}
            <MapContainer
                center={[20, 60]}
                zoom={3}
                style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Shipping Routes */}
                {showRoutes && shippingRoutes.map(route => (
                    <Polyline
                        key={route.id}
                        positions={route.waypoints}
                        pathOptions={{
                            color: route.color,
                            weight: 3,
                            opacity: 0.7,
                            dashArray: route.type === 'bulk' ? '10, 10' : null,
                        }}
                    >
                        <Popup>
                            <div style={{ minWidth: '200px' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>{route.name}</h4>
                                <div style={{ fontSize: '0.875rem' }}>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Type:</strong> {route.type}</p>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Distance:</strong> {route.distance}</p>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Duration:</strong> {route.duration}</p>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Traffic:</strong> {route.traffic}</p>
                                </div>
                            </div>
                        </Popup>
                    </Polyline>
                ))}

                {/* Ports */}
                {marinePorts.map(port => (
                    <Marker
                        key={port.id}
                        position={port.coordinates}
                        icon={createPortIcon(port.status)}
                    >
                        <Popup>
                            <div style={{ minWidth: '220px' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>{port.name}</h4>
                                <div style={{ fontSize: '0.875rem' }}>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Country:</strong> {port.country}</p>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Type:</strong> {port.type}</p>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Capacity:</strong> {port.capacity}</p>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Status:</strong>
                                        <span style={{
                                            color: getPortStatusColor(port.status),
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                        }}>
                                            {port.status.toUpperCase()}
                                        </span>
                                    </p>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Congestion:</strong>
                                        <span style={{
                                            color: getCongestionColor(port.congestion),
                                            marginLeft: '0.5rem',
                                            fontWeight: 'bold',
                                        }}>
                                            {port.congestion.toUpperCase()}
                                        </span>
                                    </p>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Active Vessels:</strong> {port.vessels}</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Active Vessels */}
                {showVessels && activeVessels.map(vessel => (
                    <Marker
                        key={vessel.id}
                        position={vessel.currentPosition}
                        icon={createVesselIcon()}
                    >
                        <VesselTracker vessel={vessel} />
                    </Marker>
                ))}

                {/* Marine Risks */}
                {showRisks && marineRisks.map(risk => (
                    <Circle
                        key={risk.id}
                        center={risk.location}
                        radius={risk.radius * 1000}
                        pathOptions={{
                            color: risk.severity === 'critical' ? '#ef4444' :
                                risk.severity === 'high' ? '#f59e0b' :
                                    '#3b82f6',
                            fillColor: risk.severity === 'critical' ? '#ef4444' :
                                risk.severity === 'high' ? '#f59e0b' :
                                    '#3b82f6',
                            fillOpacity: 0.2,
                            weight: 2,
                        }}
                    >
                        <Popup>
                            <div style={{ minWidth: '220px' }}>
                                <h4 style={{ marginBottom: '0.5rem', color: '#ef4444' }}>⚠️ {risk.title}</h4>
                                <div style={{ fontSize: '0.875rem' }}>
                                    <p style={{ margin: '0.25rem 0' }}><strong>Severity:</strong> {risk.severity.toUpperCase()}</p>
                                    <p style={{ margin: '0.5rem 0' }}>{risk.description}</p>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Affected Routes:</strong> {risk.affectedRoutes.length}
                                    </p>
                                    <p style={{ margin: '0.25rem 0' }}>
                                        <strong>Affected Vessels:</strong> {risk.affectedVessels.length}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Circle>
                ))}
            </MapContainer>

            {/* Map Legend */}
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
            }}>
                <div className="text-primary font-semibold mb-sm" style={{ fontSize: '0.75rem', color: 'white' }}>
                    Legend
                </div>
                <div className="flex flex-col gap-xs">
                    <div className="flex items-center gap-sm">
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#10b981',
                        }} />
                        <span style={{ fontSize: '0.7rem', color: 'white' }}>Operational Port</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#f59e0b',
                        }} />
                        <span style={{ fontSize: '0.7rem', color: 'white' }}>Congested Port</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#3b82f6',
                        }} />
                        <span style={{ fontSize: '0.7rem', color: 'white' }}>Active Vessel</span>
                    </div>
                    <div className="flex items-center gap-sm">
                        <div style={{
                            width: '20px',
                            height: '3px',
                            background: '#3b82f6',
                        }} />
                        <span style={{ fontSize: '0.7rem', color: 'white' }}>Shipping Route</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MarineMap;
