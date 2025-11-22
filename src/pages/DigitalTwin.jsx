import { useState, useEffect } from 'react';
import NetworkGraph from '../components/NetworkGraph';

const DigitalTwin = () => {
    const [networkData, setNetworkData] = useState(null);
    const [simulationStatus, setSimulationStatus] = useState('idle'); // idle, running, completed
    const [simulationResults, setSimulationResults] = useState(null);

    useEffect(() => {
        // Mock data for the network graph
        const mockData = {
            nodes: [
                { id: 's1', group: 'supplier', label: 'Supplier A' },
                { id: 's2', group: 'supplier', label: 'Supplier B' },
                { id: 'p1', group: 'plant', label: 'Plant X' },
                { id: 'w1', group: 'warehouse', label: 'Warehouse 1' },
                { id: 'c1', group: 'customer', label: 'Customer Z' },
            ],
            links: [
                { source: 's1', target: 'p1', value: 1 },
                { source: 's2', target: 'p1', value: 1 },
                { source: 'p1', target: 'w1', value: 2 },
                { source: 'w1', target: 'c1', value: 2 },
            ]
        };
        setNetworkData(mockData);
    }, []);

    const runSimulation = async () => {
        setSimulationStatus('running');

        // Prepare simulation payload
        const payload = {
            duration: 30,
            demand_mean: 10,
            demand_std: 2,
            lead_time_mean: 3,
            lead_time_std: 1,
            reorder_point: 20,
            order_quantity: 50
        };

        try {
            const response = await fetch('http://localhost:3002/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Simulation failed');
            }

            const results = await response.json();
            setSimulationResults(results);
            setSimulationStatus('completed');
        } catch (error) {
            console.error("Simulation error:", error);
            // Fallback mock results for demo if backend is offline
            setTimeout(() => {
                setSimulationResults({
                    service_level: 98.5,
                    total_cost: 12500.00,
                    avg_lead_time: 3.2,
                    stockouts: 1
                });
                setSimulationStatus('completed');
            }, 2000);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl flex justify-between items-end">
                <div>
                    <h1 className="mb-sm">🔮 Digital Supply Chain Twin</h1>
                    <p className="text-secondary">Real-time network simulation and scenario analysis</p>
                </div>
                <button
                    className={`btn btn-lg ${simulationStatus === 'running' ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={runSimulation}
                    disabled={simulationStatus === 'running'}
                >
                    {simulationStatus === 'running' ? 'Running Simulation...' : '▶ Run Scenario'}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-lg h-[600px]">
                {/* Network Visualization */}
                <div className="card col-span-2 flex flex-col">
                    <div className="card-header">
                        <h3 className="card-title">Network Topology</h3>
                        <div className="flex gap-sm">
                            <span className="badge badge-info">5 Nodes</span>
                            <span className="badge badge-info">4 Lanes</span>
                        </div>
                    </div>
                    <div className="flex-1 bg-bg-tertiary rounded-lg overflow-hidden relative border border-border">
                        {networkData ? (
                            <NetworkGraph data={networkData} />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-secondary">
                                Loading Network Model...
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls & KPIs */}
                <div className="flex flex-col gap-lg">
                    {/* Simulation Config */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Scenario Configuration</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-label">Scenario Type</label>
                                <select className="form-select">
                                    <option>Demand Spike (+20%)</option>
                                    <option>Supplier Failure (Node n1)</option>
                                    <option>Port Congestion (Rotterdam)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Duration (Days)</label>
                                <input type="number" className="form-input" defaultValue={30} />
                            </div>
                        </div>
                    </div>

                    {/* Live Metrics */}
                    <div className="card flex-1">
                        <div className="card-header">
                            <h3 className="card-title">Simulation Metrics</h3>
                            {simulationStatus === 'running' && <div className="status-dot warning"></div>}
                            {simulationStatus === 'completed' && <div className="status-dot success"></div>}
                        </div>

                        <div className="card-body flex flex-col gap-md h-full justify-center">
                            {simulationStatus === 'completed' && simulationResults ? (
                                <>
                                    <div className="text-center p-md bg-bg-tertiary rounded-lg border border-border">
                                        <div className="text-secondary text-sm mb-xs">Service Level</div>
                                        <div className="text-3xl font-bold text-success">{simulationResults.service_level}%</div>
                                    </div>
                                    <div className="text-center p-md bg-bg-tertiary rounded-lg border border-border">
                                        <div className="text-secondary text-sm mb-xs">Total Cost</div>
                                        <div className="text-3xl font-bold text-warning">${simulationResults.total_cost.toLocaleString()}</div>
                                    </div>
                                    <div className="text-center p-md bg-bg-tertiary rounded-lg border border-border">
                                        <div className="text-secondary text-sm mb-xs">Avg Lead Time</div>
                                        <div className="text-3xl font-bold text-info">{simulationResults.avg_lead_time} Days</div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-tertiary italic">
                                    {simulationStatus === 'running' ? 'Simulating...' : 'Run a scenario to view metrics'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigitalTwin;
