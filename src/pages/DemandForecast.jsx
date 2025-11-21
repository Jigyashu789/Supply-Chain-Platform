import { useState } from 'react';
import { useData } from '../contexts/DataContext';

function DemandForecast() {
    const { inventory, getDemandForecast } = useData();
    const [selectedSKU, setSelectedSKU] = useState(inventory[0]?.id);
    const [scenario, setScenario] = useState('normal');

    const forecastData = selectedSKU ? getDemandForecast(selectedSKU) : null;
    const selectedItem = inventory.find(item => item.id === selectedSKU);

    const scenarioImpacts = {
        'normal': { label: 'Normal Conditions', multiplier: 1.0, color: 'var(--color-primary)' },
        'spike': { label: 'Demand Spike (+40%)', multiplier: 1.4, color: 'var(--color-danger)' },
        'delay': { label: 'Supplier Delay (2 weeks)', multiplier: 0.8, color: 'var(--color-warning)' },
        'seasonal': { label: 'Seasonal Increase (+25%)', multiplier: 1.25, color: 'var(--color-success)' },
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl">
                <h1 className="mb-sm">📈 Demand Forecasting & Planning</h1>
                <p className="text-secondary">AI-powered predictive analytics with scenario planning</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-lg mb-xl">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Forecast Accuracy</span>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span>
                    </div>
                    <div className="kpi-value">87%</div>
                    <div className="kpi-change positive">
                        <span>↑ 3%</span>
                        <span className="text-tertiary" style={{ fontWeight: 'normal' }}>vs last month</span>
                    </div>
                </div>

                <div className="kpi-card success">
                    <div className="kpi-header">
                        <span className="kpi-title">Predicted Growth</span>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                    </div>
                    <div className="kpi-value">+18%</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Next 30 days</div>
                </div>

                <div className="kpi-card warning">
                    <div className="kpi-header">
                        <span className="kpi-title">Stockout Risk</span>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    </div>
                    <div className="kpi-value">Medium</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>3 items at risk</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">ML Confidence</span>
                        <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    </div>
                    <div className="kpi-value">92%</div>
                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>High accuracy</div>
                </div>
            </div>

            {/* Forecasting Interface */}
            <div className="grid grid-cols-3 gap-lg mb-xl">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Select Product</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">Product SKU</label>
                            <select
                                className="form-select"
                                value={selectedSKU}
                                onChange={(e) => setSelectedSKU(e.target.value)}
                            >
                                {inventory.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.id} - {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedItem && (
                            <div className="mt-lg">
                                <div className="mb-md">
                                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Current Stock</div>
                                    <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                                        {selectedItem.currentStock} units
                                    </div>
                                </div>
                                <div className="mb-md">
                                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Average Daily Demand</div>
                                    <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-success)' }}>
                                        {selectedItem.demand} units/day
                                    </div>
                                </div>
                                <div>
                                    <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Lead Time</div>
                                    <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-warning)' }}>
                                        {selectedItem.leadTime} days
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3 className="card-title">What-If Scenario Analysis</h3>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label className="form-label">Scenario Type</label>
                            <select
                                className="form-select"
                                value={scenario}
                                onChange={(e) => setScenario(e.target.value)}
                            >
                                {Object.entries(scenarioImpacts).map(([key, value]) => (
                                    <option key={key} value={key}>{value.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="alert alert-info mt-md">
                            <div>
                                <strong>📊 Scenario Impact</strong>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                                    Under the "<strong>{scenarioImpacts[scenario].label}</strong>" scenario,
                                    expected demand will be <strong>{(scenarioImpacts[scenario].multiplier * 100).toFixed(0)}%</strong> of baseline predictions.
                                    {scenario === 'spike' && ' Immediate procurement recommended.'}
                                    {scenario === 'delay' && ' Consider alternate suppliers now.'}
                                    {scenario === 'seasonal' && ' Adjust procurement schedule accordingly.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-md mt-lg">
                            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Baseline Forecast (30d)</div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                                    450 units
                                </div>
                            </div>
                            <div className="card" style={{ background: `${scenarioImpacts[scenario].color}15` }}>
                                <div className="text-tertiary" style={{ fontSize: '0.875rem' }}>Scenario Forecast (30d)</div>
                                <div className="font-bold" style={{ fontSize: '1.5rem', color: scenarioImpacts[scenario].color }}>
                                    {Math.round(450 * scenarioImpacts[scenario].multiplier)} units
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forecast Chart */}
            <div className="card mb-xl">
                <div className="card-header">
                    <h3 className="card-title">30-Day Demand Forecast</h3>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: 'var(--color-info)' }}></div>
                            <span>Historical Data</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: 'var(--color-success)' }}></div>
                            <span>AI Forecast</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: 'rgba(16, 185, 129, 0.2)' }}></div>
                            <span>Confidence Band (±10%)</span>
                        </div>
                    </div>
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
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(99, 102, 241, 0.05) 40px, rgba(99, 102, 241, 0.05) 41px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(99, 102, 241, 0.05) 60px, rgba(99, 102, 241, 0.05) 61px)',
                        }} />
                        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
                            <p className="text-secondary mb-md">📈 Interactive Time Series Chart</p>
                            <p className="text-tertiary" style={{ fontSize: '0.875rem', maxWidth: '400px' }}>
                                In production: D3.js or Chart.js visualization showing historical sales (past 30 days), AI-predicted demand (next 30 days), seasonality trends, and confidence intervals
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-2 gap-lg">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">🤖 AI Insights & Recommendations</h3>
                    </div>
                    <div className="card-body">
                        <div className="mb-md">
                            <div className="flex items-start gap-md mb-md">
                                <span style={{ fontSize: '1.5rem' }}>📊</span>
                                <div>
                                    <div className="font-semibold mb-sm">Trend Analysis</div>
                                    <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
                                        Demand shows a consistent upward trend (+2.5%/week) over the past 3 months. Seasonality factor indicates a 15% increase expected in Q4.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-md mb-md">
                                <span style={{ fontSize: '1.5rem' }}>⚡</span>
                                <div>
                                    <div className="font-semibold mb-sm">Procurement Recommendation</div>
                                    <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
                                        Place order for 120 units within 5 days to maintain optimal stock levels. Current lead time: {selectedItem?.leadTime} days.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-md">
                                <span style={{ fontSize: '1.5rem' }}>🎯</span>
                                <div>
                                    <div className="font-semibold mb-sm">Accuracy Metric</div>
                                    <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
                                        Model accuracy for this SKU: 89%. Based on 90 days of historical data with external market factors integrated.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">External Factors</h3>
                    </div>
                    <div className="card-body">
                        <div className="mb-md">
                            <div className="flex items-center justify-between mb-sm">
                                <span className="text-secondary">Market Trends</span>
                                <span className="badge badge-success">Positive</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: '75%',
                                    height: '100%',
                                    background: 'var(--gradient-success)',
                                }} />
                            </div>
                        </div>

                        <div className="mb-md">
                            <div className="flex items-center justify-between mb-sm">
                                <span className="text-secondary">Seasonality Impact</span>
                                <span className="badge badge-warning">Moderate</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: '60%',
                                    height: '100%',
                                    background: 'var(--gradient-warning)',
                                }} />
                            </div>
                        </div>

                        <div className="mb-md">
                            <div className="flex items-center justify-between mb-sm">
                                <span className="text-secondary">Economic Indicators</span>
                                <span className="badge badge-primary">Stable</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '8px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    width: '50%',
                                    height: '100%',
                                    background: 'var(--gradient-primary)',
                                }} />
                            </div>
                        </div>

                        <div className="alert alert-info" style={{ marginTop: '1rem', marginBottom: 0 }}>
                            <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                Model considers 12+ external factors including market conditions, competitor activity, and macroeconomic trends.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DemandForecast;
