import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [email, setEmail] = useState('manager@scm.com');
    const [password, setPassword] = useState('demo123!');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('Manager');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password, role);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-primary)',
            padding: '2rem',
        }}>
            <div className="glass-card animate-fade-in" style={{
                maxWidth: '450px',
                width: '100%',
            }}>
                <div className="text-center mb-xl">
                    <h1 className="flex items-center justify-center gap-md mb-md">
                        <span style={{ fontSize: '3rem' }}>⚡</span>
                        <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            SCM Pro
                        </span>
                    </h1>
                    <p className="text-secondary">AI-Powered Supply Chain Management</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.25rem',
                                    padding: '0.25rem',
                                    color: 'var(--color-text-tertiary)',
                                }}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="role">Role</label>
                        <select
                            id="role"
                            className="form-select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Manager">Manager</option>
                            <option value="Coordinator">Logistics Coordinator</option>
                            <option value="Warehouse Staff">Warehouse Staff</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mt-lg">
                        Sign In
                    </button>
                </form>

                <div className="mt-lg" style={{
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                }}>
                    <p className="text-tertiary" style={{ fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                        💡 <strong>Demo Mode:</strong> Use pre-filled credentials or enter any email/password
                    </p>
                    <p className="text-tertiary" style={{ fontSize: '0.75rem', margin: 0, fontFamily: 'monospace', color: 'var(--color-primary)' }}>
                        Email: manager@scm.com • Password: demo123!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
