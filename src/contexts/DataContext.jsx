import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(null);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

// Mock data generators
const generateMockInventory = () => [
    { id: 'SKU001', name: 'Laptop Computers', category: 'Electronics', currentStock: 45, reorderPoint: 50, optimalStock: 120, unit: 'units', location: 'Warehouse A', demand: 15, leadTime: 7 },
    { id: 'SKU002', name: 'Wireless Mice', category: 'Accessories', currentStock: 250, reorderPoint: 100, optimalStock: 300, unit: 'units', location: 'Warehouse B', demand: 50, leadTime: 3 },
    { id: 'SKU003', name: 'Office Chairs', category: 'Furniture', currentStock: 30, reorderPoint: 40, optimalStock: 80, unit: 'units', location: 'Warehouse A', demand: 8, leadTime: 14 },
    { id: 'SKU004', name: 'USB Cables', category: 'Accessories', currentStock: 500, reorderPoint: 200, optimalStock: 600, unit: 'units', location: 'Warehouse C', demand: 80, leadTime: 2 },
    { id: 'SKU005', name: 'Monitor Stands', category: 'Accessories', currentStock: 75, reorderPoint: 60, optimalStock: 150, unit: 'units', location: 'Warehouse B', demand: 20, leadTime: 5 },
    { id: 'SKU006', name: 'Keyboards', category: 'Peripherals', currentStock: 180, reorderPoint: 100, optimalStock: 250, unit: 'units', location: 'Warehouse A', demand: 35, leadTime: 4 },
];

const generateMockShipments = () => [
    { id: 'SHP001', orderId: 'ORD-2024-001', customer: 'TechCorp Inc', destination: 'New York, NY', status: 'In Transit', eta: new Date(Date.now() + 3600000 * 5), currentLocation: { lat: 40.7128, lng: -74.0060 }, driver: 'John Smith', items: 15, priority: 'high' },
    { id: 'SHP002', orderId: 'ORD-2024-002', customer: 'Global Solutions LLC', destination: 'Los Angeles, CA', status: 'Out for Delivery', eta: new Date(Date.now() + 3600000 * 2), currentLocation: { lat: 34.0522, lng: -118.2437 }, driver: 'Maria Garcia', items: 8, priority: 'normal' },
    { id: 'SHP003', orderId: 'ORD-2024-003', customer: 'Innovate Systems', destination: 'Chicago, IL', status: 'Delayed', eta: new Date(Date.now() + 3600000 * 12), currentLocation: { lat: 41.8781, lng: -87.6298 }, driver: 'David Lee', items: 22, priority: 'urgent' },
    { id: 'SHP004', orderId: 'ORD-2024-004', customer: 'Future Tech', destination: 'Houston, TX', status: 'In Transit', eta: new Date(Date.now() + 3600000 * 8), currentLocation: { lat: 29.7604, lng: -95.3698 }, driver: 'Sarah Johnson', items: 12, priority: 'normal' },
    { id: 'SHP005', orderId: 'ORD-2024-005', customer: 'Enterprise Plus', destination: 'Phoenix, AZ', status: 'Pending Pickup', eta: new Date(Date.now() + 3600000 * 24), currentLocation: { lat: 33.4484, lng: -112.0740 }, driver: 'Michael Brown', items: 30, priority: 'low' },
];

const generateMockSuppliers = () => [
    { id: 'SUP001', name: 'TechParts International', rating: 4.8, leadTime: 7, reliability: 96, products: ['Electronics', 'Peripherals'], status: 'active', location: 'Shenzhen, China', contact: 'contact@techparts.com' },
    { id: 'SUP002', name: 'OfficeFurniture Pro', rating: 4.5, leadTime: 14, reliability: 92, products: ['Furniture'], status: 'active', location: 'Portland, OR', contact: 'sales@officefurniture.com' },
    { id: 'SUP003', name: 'AccessoriesWorld', rating: 4.2, leadTime: 5, reliability: 88, products: ['Accessories'], status: 'warning', location: 'Mumbai, India', contact: 'info@accessoriesworld.in' },
    { id: 'SUP004', name: 'GlobalComponents Ltd', rating: 4.9, leadTime: 4, reliability: 98, products: ['Electronics', 'Accessories'], status: 'active', location: 'Tokyo, Japan', contact: 'orders@globalcomponents.jp' },
];

const generateMockPurchaseOrders = () => [
    { id: 'PO001', supplier: 'TechParts International', items: [{ sku: 'SKU001', qty: 50 }], total: 45000, status: 'pending', orderDate: new Date(Date.now() - 86400000), expectedDelivery: new Date(Date.now() + 86400000 * 6) },
    { id: 'PO002', supplier: 'OfficeFurniture Pro', items: [{ sku: 'SKU003', qty: 30 }], total: 12000, status: 'confirmed', orderDate: new Date(Date.now() - 86400000 * 3), expectedDelivery: new Date(Date.now() + 86400000 * 10) },
    { id: 'PO003', supplier: 'GlobalComponents Ltd', items: [{ sku: 'SKU006', qty: 100 }], total: 8500, status: 'shipped', orderDate: new Date(Date.now() - 86400000 * 5), expectedDelivery: new Date(Date.now() + 86400000 * 2) },
];

const generateMockRisks = () => [
    { id: 'RISK001', type: 'shipping_delay', severity: 'high', title: 'Port Congestion Alert', description: 'Los Angeles Port experiencing 3-day delays', affectedShipments: ['SHP003'], timestamp: new Date(Date.now() - 3600000), mitigation: 'Consider air freight alternatives or reroute through Oakland' },
    { id: 'RISK002', type: 'supplier', severity: 'medium', title: 'Supplier Lead Time Increase', description: 'AccessoriesWorld reporting 2-day additional lead time', affectedOrders: ['PO001'], timestamp: new Date(Date.now() - 7200000), mitigation: 'Place orders earlier or source from alternate supplier' },
    { id: 'RISK003', type: 'weather', severity: 'low', title: 'Weather Advisory', description: 'Heavy rain expected in Houston area', affectedShipments: ['SHP004'], timestamp: new Date(Date.now() - 1800000), mitigation: 'Monitor shipment progress, driver has been alerted' },
    { id: 'RISK004', type: 'demand_spike', severity: 'critical', title: 'Unexpected Demand Surge', description: 'Laptop demand increased by 40% this week', affectedSKUs: ['SKU001'], timestamp: new Date(Date.now() - 900000), mitigation: 'Expedite PO001 and consider emergency procurement' },
];

// AI-driven demand forecasting
const generateDemandForecast = (sku) => {
    const days = 30;
    const historical = [];
    const forecast = [];

    for (let i = days; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        const baseValue = Math.floor(Math.random() * 50) + 30;
        const seasonality = Math.sin((i / days) * Math.PI * 2) * 10;
        const value = Math.max(0, Math.floor(baseValue + seasonality));
        historical.push({ date, value, type: 'historical' });
    }

    for (let i = 1; i <= 30; i++) {
        const date = new Date(Date.now() + i * 86400000);
        const baseValue = Math.floor(Math.random() * 50) + 40;
        const trend = i * 0.5;
        const seasonality = Math.sin((i / 30) * Math.PI * 2) * 12;
        const value = Math.max(0, Math.floor(baseValue + trend + seasonality));
        const confidence = Math.max(60, 100 - i * 1.2);
        forecast.push({ date, value, confidence, type: 'forecast' });
    }

    return { historical, forecast };
};

export const DataProvider = ({ children }) => {
    const [inventory, setInventory] = useState(generateMockInventory());
    const [shipments, setShipments] = useState(generateMockShipments());
    const [suppliers, setSuppliers] = useState(generateMockSuppliers());
    const [purchaseOrders, setPurchaseOrders] = useState(generateMockPurchaseOrders());
    const [risks, setRisks] = useState(generateMockRisks());
    const [notifications, setNotifications] = useState([]);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate stock level changes
            setInventory(prev => prev.map(item => ({
                ...item,
                currentStock: Math.max(0, item.currentStock + Math.floor(Math.random() * 10) - 5)
            })));

            // Simulate shipment location updates
            setShipments(prev => prev.map(ship => {
                if (ship.status === 'In Transit' || ship.status === 'Out for Delivery') {
                    return {
                        ...ship,
                        currentLocation: {
                            lat: ship.currentLocation.lat + (Math.random() - 0.5) * 0.1,
                            lng: ship.currentLocation.lng + (Math.random() - 0.5) * 0.1,
                        }
                    };
                }
                return ship;
            }));

            // Generate random notifications
            if (Math.random() > 0.7) {
                addNotification({
                    id: `NOT${Date.now()}`,
                    type: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)],
                    title: 'System Update',
                    message: 'Real-time data synchronized',
                    timestamp: new Date(),
                });
            }
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev].slice(0, 50));
    };

    const addPurchaseOrder = (order) => {
        setPurchaseOrders(prev => [order, ...prev]);
        addNotification({
            id: `NOT${Date.now()}`,
            type: 'success',
            title: 'Purchase Order Created',
            message: `PO ${order.id} has been created for ${order.supplier}`,
            timestamp: new Date(),
        });
    };

    const getDemandForecast = (sku) => {
        return generateDemandForecast(sku);
    };

    const getInventoryStatus = (item) => {
        if (item.currentStock < item.reorderPoint) return 'critical';
        if (item.currentStock < item.optimalStock * 0.7) return 'warning';
        if (item.currentStock > item.optimalStock * 1.3) return 'overstock';
        return 'optimal';
    };

    const getReorderSuggestions = () => {
        return inventory
            .filter(item => item.currentStock < item.reorderPoint)
            .map(item => ({
                ...item,
                suggestedQuantity: item.optimalStock - item.currentStock,
                urgency: item.currentStock / item.reorderPoint,
            }))
            .sort((a, b) => a.urgency - b.urgency);
    };

    const value = {
        inventory,
        shipments,
        suppliers,
        purchaseOrders,
        risks,
        notifications,
        setInventory,
        setShipments,
        addPurchaseOrder,
        addNotification,
        getDemandForecast,
        getInventoryStatus,
        getReorderSuggestions,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
