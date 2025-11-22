const { v4: uuidv4 } = require('uuid');

// In-memory mock database
const db = {
    organizations: [
        { id: 'org-1', name: 'My Company', type: 'manufacturer' },
        { id: 'org-2', name: 'Global Logistics Co', type: 'logistics' },
        { id: 'org-3', name: 'Raw Materials Inc', type: 'supplier' }
    ],
    partners: [
        { id: 'p-1', orgId: 'org-2', status: 'active', connectedSince: '2023-01-15' },
        { id: 'p-2', orgId: 'org-3', status: 'active', connectedSince: '2023-03-10' }
    ],
    exceptions: [
        {
            id: 'ex-1',
            type: 'delay',
            severity: 'high',
            status: 'open',
            title: 'Shipment #SH-1234 Delayed',
            description: 'Vessel delayed at Port of Singapore due to congestion.',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            assignedTo: 'org-2',
            comments: [
                { id: 'c-1', author: 'System', text: 'Automated alert triggered by AIS data.', timestamp: new Date(Date.now() - 86400000).toISOString() },
                { id: 'c-2', author: 'Logistics Mgr', text: 'Investigating alternative routes.', timestamp: new Date(Date.now() - 43200000).toISOString() }
            ]
        },
        {
            id: 'ex-2',
            type: 'quality',
            severity: 'medium',
            status: 'resolved',
            title: 'Quality Check Failed - Batch #B-99',
            description: 'Temperature excursion detected during transit.',
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            assignedTo: 'org-3',
            comments: []
        }
    ]
};

module.exports = {
    getPartners: () => {
        return db.partners.map(p => {
            const org = db.organizations.find(o => o.id === p.orgId);
            return { ...p, name: org.name, type: org.type };
        });
    },
    invitePartner: (email, role) => {
        // Mock invite logic
        return { success: true, message: `Invitation sent to ${email}` };
    },
    getExceptions: () => db.exceptions,
    createException: (data) => {
        const newException = {
            id: uuidv4(),
            ...data,
            status: 'open',
            createdAt: new Date().toISOString(),
            comments: []
        };
        db.exceptions.unshift(newException);
        return newException;
    },
    addComment: (exceptionId, text, author) => {
        const exception = db.exceptions.find(e => e.id === exceptionId);
        if (exception) {
            const comment = {
                id: uuidv4(),
                text,
                author,
                timestamp: new Date().toISOString()
            };
            exception.comments.push(comment);
            return comment;
        }
        return null;
    }
};
