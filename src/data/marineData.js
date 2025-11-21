// Marine Shipping Data
// Major ports with coordinates and detailed information
export const marinePorts = [
    {
        id: 'singapore',
        name: 'Port of Singapore',
        country: 'Singapore',
        coordinates: [1.2644, 103.8222],
        status: 'operational',
        congestion: 'low',
        vessels: 42,
        capacity: '37.2M TEU/year',
        type: 'Container Hub',
    },
    {
        id: 'shanghai',
        name: 'Port of Shanghai',
        country: 'China',
        coordinates: [31.2304, 121.4737],
        status: 'operational',
        congestion: 'medium',
        vessels: 58,
        capacity: '47.3M TEU/year',
        type: 'Container Hub',
    },
    {
        id: 'rotterdam',
        name: 'Port of Rotterdam',
        country: 'Netherlands',
        coordinates: [51.9244, 4.4777],
        status: 'operational',
        congestion: 'low',
        vessels: 35,
        capacity: '15.3M TEU/year',
        type: 'Gateway Hub',
    },
    {
        id: 'losangeles',
        name: 'Port of Los Angeles',
        country: 'USA',
        coordinates: [33.7361, -118.2639],
        status: 'congested',
        congestion: 'high',
        vessels: 28,
        capacity: '10.7M TEU/year',
        type: 'Container Terminal',
    },
    {
        id: 'dubai',
        name: 'Port of Jebel Ali',
        country: 'UAE',
        coordinates: [24.9857, 55.0272],
        status: 'operational',
        congestion: 'low',
        vessels: 31,
        capacity: '19.3M TEU/year',
        type: 'Transshipment Hub',
    },
    {
        id: 'hongkong',
        name: 'Port of Hong Kong',
        country: 'Hong Kong',
        coordinates: [22.2793, 114.1628],
        status: 'operational',
        congestion: 'medium',
        vessels: 39,
        capacity: '18.4M TEU/year',
        type: 'Transshipment Hub',
    },
    {
        id: 'busan',
        name: 'Port of Busan',
        country: 'South Korea',
        coordinates: [35.1028, 129.0403],
        status: 'operational',
        congestion: 'low',
        vessels: 26,
        capacity: '22.4M TEU/year',
        type: 'Container Hub',
    },
    {
        id: 'suez',
        name: 'Port Said (Suez Canal)',
        country: 'Egypt',
        coordinates: [31.2653, 32.3019],
        status: 'operational',
        congestion: 'medium',
        vessels: 22,
        capacity: '6.3M TEU/year',
        type: 'Canal Transit',
    },
];

// Major shipping routes with waypoints
export const shippingRoutes = [
    {
        id: 'asia-europe',
        name: 'Asia-Europe Route',
        type: 'container',
        color: '#3b82f6',
        waypoints: [
            [31.2304, 121.4737], // Shanghai
            [22.2793, 114.1628], // Hong Kong
            [1.2644, 103.8222],  // Singapore
            [24.9857, 55.0272],  // Dubai
            [31.2653, 32.3019],  // Suez
            [51.9244, 4.4777],   // Rotterdam
        ],
        distance: '11,500 nautical miles',
        duration: '32 days',
        traffic: 'high',
    },
    {
        id: 'transpacific',
        name: 'Transpacific Route',
        type: 'container',
        color: '#10b981',
        waypoints: [
            [31.2304, 121.4737],  // Shanghai
            [35.1028, 129.0403],  // Busan
            [35.4437, 139.638],   // Tokyo (waypoint)
            [33.7361, -118.2639], // Los Angeles
        ],
        distance: '5,500 nautical miles',
        duration: '14 days',
        traffic: 'very high',
    },
    {
        id: 'asia-middle-east',
        name: 'Asia-Middle East Route',
        type: 'bulk',
        color: '#f59e0b',
        waypoints: [
            [1.2644, 103.8222],  // Singapore
            [13.0827, 80.2707],  // Chennai (waypoint)
            [24.9857, 55.0272],  // Dubai
        ],
        distance: '3,200 nautical miles',
        duration: '9 days',
        traffic: 'medium',
    },
];

// Active vessels with enhanced tracking data
export const activeVessels = [
    {
        id: 'vessel-001',
        name: 'MSC Gülsün',
        type: 'Container Ship',
        operator: 'MSC',
        capacity: '23,756 TEU',
        currentPosition: [8.5, 115.2],
        destination: 'Rotterdam',
        route: 'asia-europe',
        speed: '22 knots',
        eta: new Date(Date.now() + 86400000 * 18),
        status: 'in-transit',
        cargo: 'Electronics, Textiles',
        mmsi: '235095435',
        imo: 'IMO9794549',
        callSign: '3FLS8',
        heading: '285°',
        draft: '16.0m',
    },
    {
        id: 'vessel-002',
        name: 'Ever Given',
        type: 'Container Ship',
        operator: 'Evergreen',
        capacity: '20,124 TEU',
        currentPosition: [30.8, 32.5],
        destination: 'Rotterdam',
        route: 'asia-europe',
        speed: '18 knots',
        eta: new Date(Date.now() + 86400000 * 8),
        status: 'in-transit',
        cargo: 'Manufactured Goods',
        mmsi: '353136000',
        imo: 'IMO9811000',
        callSign: 'H3RC',
        heading: '310°',
        draft: '15.7m',
    },
    {
        id: 'vessel-003',
        name: 'OOCL Hong Kong',
        type: 'Container Ship',
        operator: 'OOCL',
        capacity: '21,413 TEU',
        currentPosition: [25.5, 155.8],
        destination: 'Los Angeles',
        route: 'transpacific',
        speed: '24 knots',
        eta: new Date(Date.now() + 86400000 * 7),
        status: 'in-transit',
        cargo: 'Consumer Electronics',
        mmsi: '477234500',
        imo: 'IMO9714335',
        callSign: 'VRPJ6',
        heading: '92°',
        draft: '16.0m',
    },
    {
        id: 'vessel-004',
        name: 'CMA CGM Antoine',
        type: 'Container Ship',
        operator: 'CMA CGM',
        capacity: '20,776 TEU',
        currentPosition: [1.5, 104.2],
        destination: 'Dubai',
        route: 'asia-middle-east',
        speed: '20 knots',
        eta: new Date(Date.now() + 86400000 * 5),
        status: 'in-transit',
        cargo: 'Industrial Equipment',
        mmsi: '228339600',
        imo: 'IMO9454436',
        callSign: 'FLSU',
        heading: '270°',
        draft: '15.5m',
    },
    {
        id: 'vessel-005',
        name: 'HMM Algeciras',
        type: 'Container Ship',
        operator: 'HMM',
        capacity: '23,964 TEU',
        currentPosition: [35.5, 140.2],
        destination: 'Los Angeles',
        route: 'transpacific',
        speed: '23 knots',
        eta: new Date(Date.now() + 86400000 * 9),
        status: 'in-transit',
        cargo: 'Automotive Parts',
        mmsi: '440817000',
        imo: 'IMO9863639',
        callSign: 'D5IF9',
        heading: '85°',
        draft: '16.5m',
    },
];

// Marine risks and incidents
export const marineRisks = [
    {
        id: 'risk-marine-001',
        type: 'weather',
        severity: 'high',
        location: [15.0, 65.0],
        title: 'Tropical Cyclone Warning',
        description: 'Category 2 cyclone approaching Arabian Sea shipping lanes',
        affectedRoutes: ['asia-middle-east'],
        affectedVessels: ['vessel-004'],
        radius: 500,
    },
    {
        id: 'risk-marine-002',
        type: 'congestion',
        severity: 'medium',
        location: [31.2653, 32.3019],
        title: 'Suez Canal Congestion',
        description: '14 vessels waiting for transit, 8-hour delay expected',
        affectedRoutes: ['asia-europe'],
        affectedVessels: ['vessel-001', 'vessel-002'],
        radius: 100,
    },
    {
        id: 'risk-marine-003',
        type: 'piracy',
        severity: 'critical',
        location: [12.0, 43.5],
        title: 'Piracy Alert',
        description: 'Increased piracy activity reported in Gulf of Aden region',
        affectedRoutes: ['asia-europe'],
        affectedVessels: [],
        radius: 300,
    },
];

// Helper function to get port status color
export const getPortStatusColor = (status) => {
    const colors = {
        operational: '#10b981',
        congested: '#f59e0b',
        delayed: '#ef4444',
        closed: '#6b7280',
    };
    return colors[status] || colors.operational;
};

// Helper function to get congestion level color
export const getCongestionColor = (level) => {
    const colors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
    };
    return colors[level] || colors.low;
};

// Helper function to get route traffic color
export const getTrafficColor = (traffic) => {
    const colors = {
        'very high': '#dc2626',
        'high': '#f59e0b',
        'medium': '#3b82f6',
        'low': '#10b981',
    };
    return colors[traffic] || colors.medium;
};
