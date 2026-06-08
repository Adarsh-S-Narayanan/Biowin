import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Warehouse, Truck, ArrowLeft, LogIn } from 'lucide-react';
import './App.css';

// --- Auth Context Mock ---
// Since we are focusing on Admin and bypassing standard Firebase email auth
// we will manage a simple auth state in the App root.
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    // Check local storage on initial load
    const authStatus = localStorage.getItem('biowin_auth');
    const role = localStorage.getItem('biowin_role');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = (expectedRole, username, password) => {
    const creds = {
      admin: { user: 'Admin123', pass: 'Abcd@123' },
      unit: { user: 'Unit123', pass: 'Unit@123' },
      warehouse: { user: 'Warehouse123', pass: 'Ware@123' },
      convoy: { user: 'Convoy123', pass: 'Convoy@123' }
    };
    
    const c = creds[expectedRole];
    if (c && c.user === username && c.pass === password) {
      setIsAuthenticated(true);
      setUserRole(expectedRole);
      localStorage.setItem('biowin_auth', 'true');
      localStorage.setItem('biowin_role', expectedRole);
      return expectedRole;
    }
    return null;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('biowin_auth');
    localStorage.removeItem('biowin_role');
  };

  return { isAuthenticated, userRole, login, logout };
};

// --- Components ---

const Login = ({ login, isAuthenticated, userRole }) => {
  const { role } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already authenticated and matches role, redirect to appropriate page
  if (isAuthenticated && userRole === role) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const successRole = login(role, username, password);
    if (successRole) {
      navigate(`/${successRole}`); // Redirect to role page
    } else {
      setError(`Invalid username or password for ${role} access`);
    }
  };

  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'System';

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-wrapper">
            <ShieldCheck size={40} className="text-green" />
          </div>
          <h2>{displayRole} Login</h2>
          <p>Please enter your credentials</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Admin123"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="login-button">
            <LogIn size={18} /> Sign In
          </button>
        </form>
        <div className="login-footer">
          <Link to="/" className="back-link-small">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ isAuthenticated, userRole, requiredRole, children }) => {
  if (!isAuthenticated || userRole !== requiredRole) {
    return <Navigate to={`/login/${requiredRole}`} replace />;
  }
  return children;
};

const DashboardCard = ({ icon: Icon, title, subtitle, linkTo, footerText }) => {
  return (
    <Link to={linkTo} className="dashboard-card">
      <div className="card-content">
        <div className="card-icon">
          <Icon size={32} />
        </div>
        <h2 className="card-title">{title}</h2>
        <p className="card-subtitle">{subtitle}</p>
      </div>
      <div className="card-footer">
        {footerText}
      </div>
    </Link>
  );
};

const Dashboard = ({ logout, isAuthenticated }) => {
  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  const cards = [
    { title: 'Admin', subtitle: 'System Administration', icon: ShieldCheck, linkTo: '/admin', footerText: 'Management Access' },
    { title: 'Unit', subtitle: 'Operational Units', icon: Stethoscope, linkTo: '/unit', footerText: 'View Units' },
    { title: 'Warehouse', subtitle: 'Inventory & Storage', icon: Warehouse, linkTo: '/warehouse', footerText: 'Manage Stock' },
    { title: 'Convoy', subtitle: 'Transportation & Logistics', icon: Truck, linkTo: '/convoy', footerText: 'Track Fleet' }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Biowin Dashboard</h1>
        <p>Select a module to manage your operations</p>
        {isAuthenticated && (
          <button onClick={logout} className="logout-button">Logout</button>
        )}
      </header>
      <div className="card-grid">
        {cards.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            subtitle={card.subtitle}
            icon={card.icon}
            linkTo={card.linkTo}
            footerText={card.footerText}
          />
        ))}
      </div>
    </div>
  );
};

const PageTemplate = ({ title, description }) => (
  <div className="page-container">
    <Link to="/" className="back-link">
      <ArrowLeft size={20} /> Back to Dashboard
    </Link>
    <div className="page-content-card">
      <h1 className="page-title text-green">{title}</h1>
      <p>{description}</p>
    </div>
  </div>
);

const AdminPage = () => <PageTemplate title="Admin Dashboard" description="This is the secure admin management area. Only accessible by authorized admins." />;
const UnitPage = () => <PageTemplate title="Unit Operations" description="Manage all operational units here." />;
const WarehousePage = () => <PageTemplate title="Warehouse Management" description="Inventory and stock controls." />;
const ConvoyPage = () => <PageTemplate title="Convoy Tracking" description="Fleet and logistics management." />;

function App() {
  const { isAuthenticated, userRole, login, logout } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard logout={logout} isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/login/:role" element={<Login login={login} isAuthenticated={isAuthenticated} userRole={userRole} />} />
        
        {/* Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/unit" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="unit">
            <UnitPage />
          </ProtectedRoute>
        } />
        <Route path="/warehouse" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="warehouse">
            <WarehousePage />
          </ProtectedRoute>
        } />
        <Route path="/convoy" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="convoy">
            <ConvoyPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
