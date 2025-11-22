import React, { useState, useEffect } from 'react';

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock fetch
        setTimeout(() => {
            setPartners([
                { id: 'p-1', name: 'Global Logistics Co', type: 'logistics', status: 'active', connectedSince: '2023-01-15' },
                { id: 'p-2', name: 'Raw Materials Inc', type: 'supplier', status: 'active', connectedSince: '2023-03-10' }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const handleInvite = (e) => {
        e.preventDefault();
        alert("Invitation sent! (Mock)");
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-xl flex justify-between items-end">
                <div>
                    <h1 className="mb-sm">🤝 Partner Network</h1>
                    <p className="text-secondary">Manage connections with suppliers, logistics providers, and customers</p>
                </div>
                <button className="btn btn-primary" onClick={() => document.getElementById('invite-modal').showModal()}>
                    + Invite Partner
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {partners.map(partner => (
                    <div key={partner.id} className="card hover:border-primary transition-colors cursor-pointer">
                        <div className="card-header">
                            <h3 className="card-title">{partner.name}</h3>
                            <span className="badge badge-success">{partner.status}</span>
                        </div>
                        <div className="card-body">
                            <div className="flex items-center gap-sm mb-md">
                                <span className="text-2xl">
                                    {partner.type === 'logistics' ? '🚛' : partner.type === 'supplier' ? '🏭' : '🏢'}
                                </span>
                                <span className="text-secondary capitalize">{partner.type}</span>
                            </div>
                            <div className="text-sm text-tertiary">
                                Connected since: {new Date(partner.connectedSince).toLocaleDateString()}
                            </div>
                            <div className="mt-lg flex gap-sm">
                                <button className="btn btn-sm btn-outline flex-1">View Profile</button>
                                <button className="btn btn-sm btn-outline flex-1">Message</button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <div
                    className="card border-dashed border-2 border-border flex flex-col items-center justify-center p-xl cursor-pointer hover:border-primary hover:bg-bg-tertiary transition-all"
                    onClick={() => document.getElementById('invite-modal').showModal()}
                >
                    <div className="text-4xl mb-sm text-tertiary">+</div>
                    <div className="font-semibold text-secondary">Connect New Partner</div>
                </div>
            </div>

            {/* Invite Modal (Native Dialog) */}
            <dialog id="invite-modal" className="glass-card p-xl rounded-xl backdrop:bg-black/50">
                <h3 className="text-xl font-bold mb-md">Invite Partner</h3>
                <form onSubmit={handleInvite} method="dialog">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" placeholder="partner@company.com" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Role</label>
                        <select className="form-select">
                            <option value="supplier">Supplier</option>
                            <option value="logistics">Logistics Provider</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-sm mt-lg">
                        <button type="button" className="btn btn-outline" onClick={() => document.getElementById('invite-modal').close()}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Send Invitation</button>
                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default Partners;
