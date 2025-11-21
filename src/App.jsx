import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import Login from './pages/Login';
import InventoryDashboard from './pages/InventoryDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import DemandForecast from './pages/DemandForecast';
import SupplierDashboard from './pages/SupplierDashboard';
import VisibilityDashboard from './pages/VisibilityDashboard';
import RiskManagement from './pages/RiskManagement';

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications } = useData();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Login />;
  }

  const navItems = [
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/logistics', label: 'Logistics', icon: '🚛' },
    { path: '/forecast', label: 'Demand Forecast', icon: '📈' },
    { path: '/suppliers', label: 'Suppliers', icon: '🏭' },
    { path: '/visibility', label: 'Visibility', icon: '👁️' },
    { path: '/risks', label: 'Risk Management', icon: '⚠️' },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="p-lg mb-lg">
          <h2 className="flex items-center gap-sm text-primary mb-0">
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>SCM Pro</span>
          </h2>
          <p className="text-tertiary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            AI-Powered Supply Chain
          </p>
        </div>

        <nav>
          <ul className="nav-menu">
            {navItems.map(item => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-lg mt-xl" style={{ position: 'absolute', bottom: '1rem', width: '100%' }}>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div className="flex items-center gap-md mb-sm">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-semibold text-primary truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-tertiary" style={{ fontSize: '0.75rem' }}>
                  {user?.role || 'Manager'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-outline btn-sm w-full"
              style={{ marginTop: '0.5rem' }}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/logistics" element={<LogisticsDashboard />} />
          <Route path="/forecast" element={<DemandForecast />} />
          <Route path="/suppliers" element={<SupplierDashboard />} />
          <Route path="/visibility" element={<VisibilityDashboard />} />
          <Route path="/risks" element={<RiskManagement />} />
        </Routes>
      </main>

      {/* Notification Badge */}
      {notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: 'var(--gradient-secondary)',
          color: 'white',
          borderRadius: '999px',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          zIndex: 1000,
        }}>
          🔔 {notifications.length} new updates
        </div>
      )}
    </div>
  );
}

export default App;
