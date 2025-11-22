import React, { useState, useEffect } from 'react';
import ExceptionInbox from '../components/ExceptionInbox';
import MarineSupplyMap from '../components/MarineSupplyMap'; // Reusing map for network view

const ControlTower = () => {
    const [exceptions, setExceptions] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        // Mock data fetch
        setExceptions([
            {
                id: 'ex-1',
                type: 'delay',
                severity: 'high',
                status: 'open',
                title: 'Shipment #SH-1234 Delayed',
                description: 'Vessel delayed at Port of Singapore due to congestion.',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                assignedTo: 'Global Logistics Co',
                comments: [
                    { id: 'c-1', author: 'System', text: 'Automated alert triggered by AIS data.', timestamp: new Date(Date.now() - 86400000).toISOString() }
                ]
            },
            {
                id: 'ex-2',
                type: 'quality',
                severity: 'medium',
                status: 'resolved',
                title: 'Quality Check Failed - Batch #B-99',
                description: 'Temperature excursion detected during transit.',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                assignedTo: 'Raw Materials Inc',
                comments: []
            }
        ]);
    }, []);

    const handleAddComment = (id, text) => {
        const updated = exceptions.map(ex => {
            if (ex.id === id) {
                return {
                    ...ex,
                    comments: [...ex.comments, {
                        id: Date.now(),
                        text,
                        author: 'Me',
                        timestamp: new Date().toISOString()
                    }]
                };
            }
            return ex;
        });
        setExceptions(updated);
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl flex justify-between items-end">
                <div>
                    <h1 className="mb-sm">🗼 Collaborative Control Tower</h1>
                    <p className="text-secondary">End-to-end visibility and exception management across the network</p>
                </div>
                <div className="flex gap-md">
                    <button
                        className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Network View
                    </button>
                    <button
                        className={`btn ${activeTab === 'exceptions' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setActiveTab('exceptions')}
                    >
                        Exceptions ({exceptions.filter(e => e.status === 'open').length})
                    </button>
                </div>
            </div>

            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 gap-lg">
                    {/* KPI Summary */}
                    <div className="grid grid-cols-4 gap-lg">
                        <div className="kpi-card">
                            <div className="kpi-header"><span className="kpi-title">Connected Partners</span></div>
                            <div className="kpi-value">12</div>
                        </div>
                        <div className="kpi-card warning">
                            <div className="kpi-header"><span className="kpi-title">Active Exceptions</span></div>
                            <div className="kpi-value">{exceptions.filter(e => e.status === 'open').length}</div>
                        </div>
                        <div className="kpi-card success">
                            <div className="kpi-header"><span className="kpi-title">On-Time Performance</span></div>
                            <div className="kpi-value">94.2%</div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-header"><span className="kpi-title">Data Sharing</span></div>
                            <div className="kpi-value">Live</div>
                        </div>
                    </div>

                    {/* Map View */}
                    <div className="card p-0 overflow-hidden h-[500px]">
                        <MarineSupplyMap />
                    </div>
                </div>
            )}

            {activeTab === 'exceptions' && (
                <ExceptionInbox exceptions={exceptions} onAddComment={handleAddComment} />
            )}
        </div>
    );
};

export default ControlTower;
