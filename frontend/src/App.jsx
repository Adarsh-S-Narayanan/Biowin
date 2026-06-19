import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Warehouse, Truck, ArrowLeft, LogIn, ShoppingBag, History, PlusCircle, Package, Trash2, Coins, TrendingUp, Layers, LogOut, Search, Edit2, CheckCircle, XCircle, RotateCcw, Briefcase, Globe, MapPin } from 'lucide-react';
import DashboardLayout from './components/DashboardLayout';
import AdminPageContent from './pages/AdminPage';
import AdminUnitsPageContent from './pages/AdminUnitsPage';
import AdminWarehousesPageContent from './pages/AdminWarehousesPage';
import AdminConvoysPageContent from './pages/AdminConvoysPage';
import ConvoyDashboardPage from './pages/ConvoyDashboardPage';
import WayanadMountainBg from './components/WayanadMountainBg';
import WarehouseUnitsPageContent from './pages/WarehouseUnitsPage';

// --- Auth Context Mock ---
// Since we are focusing on Admin and bypassing standard Firebase email auth
// we will manage a simple auth state in the App root.
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    // Check local storage on initial load
    const authStatus = sessionStorage.getItem('biowin_auth');
    const role = sessionStorage.getItem('biowin_role');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = async (expectedRole, username, password) => {
    if (expectedRole === 'admin') {
      const creds = {
        admin: { user: 'Admin123', pass: 'Abcd@123' },
      };
      
      const c = creds[expectedRole];
      if (c && c.user === username && c.pass === password) {
        setIsAuthenticated(true);
        setUserRole(expectedRole);
        sessionStorage.setItem('biowin_auth', 'true');
        sessionStorage.setItem('biowin_role', expectedRole);
        return expectedRole;
      }
      return null;
    }
    
    // For warehouse and convoy, call backend
    if (expectedRole === 'warehouse' || expectedRole === 'convoy') {
      try {
        const endpoint = expectedRole === 'warehouse' ? '/api/auth/warehouse-login' : '/api/auth/convoy-login';
        const bodyIdField = expectedRole === 'warehouse' ? 'warehouseId' : 'convoyId';
        
        const res = await fetch(`${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [bodyIdField]: username, password })
        });
        
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          setUserRole(expectedRole);
          sessionStorage.setItem('biowin_auth', 'true');
          sessionStorage.setItem('biowin_role', expectedRole);
          if (expectedRole === 'warehouse') {
            sessionStorage.setItem('biowin_warehouse_data', JSON.stringify(data.warehouse));
          } else if (expectedRole === 'convoy') {
            sessionStorage.setItem('biowin_convoy_data', JSON.stringify(data.convoy));
          }
          return expectedRole;
        }
      } catch (err) {
        console.error("Login error:", err);
      }
    }
    return null;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    sessionStorage.removeItem('biowin_auth');
    sessionStorage.removeItem('biowin_role');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const successRole = await login(role, username, password);
    if (successRole) {
      navigate(`/${successRole}`); // Redirect to role page
    } else {
      setError(`Invalid ID or password for ${role} access`);
    }
  };

  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'System';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafc 60%, #eff6ff 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>
      <WayanadMountainBg />
      <style>{`
        @keyframes loginBlobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
        @keyframes loginCardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-input-premium:focus {
          border-color: #2ecc71 !important;
          box-shadow: 0 0 0 4px rgba(46,204,113,0.18) !important;
          outline: none !important;
        }
        .login-btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(46,204,113,0.45);
        }
        .login-btn-premium:active {
          transform: scale(0.98);
        }
      `}</style>

      <div style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        padding: '2.75rem 2.5rem',
        textAlign: 'center',
        animation: 'loginCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo area */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '80px', height: '80px',
            background: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 24px rgba(46,204,113,0.35)',
          }}>
            <ShieldCheck size={38} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f2417', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            {displayRole} Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>Please enter your credentials to continue</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', color: '#b91c1c', padding: '0.75rem 1rem',
            borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.875rem',
            fontWeight: 600, border: '1px solid #fecaca',
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem', letterSpacing: '0.01em' }}>
              {role === 'admin' ? 'Username' : `${displayRole} ID`}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'admin' ? 'e.g. Admin123' : 'e.g. 123'}
              required
              className="login-input-premium"
              style={{
                padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0',
                borderRadius: '12px', fontSize: '1rem', outline: 'none',
                transition: 'all 0.2s ease', background: '#f8fafc', color: '#0f172a',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem', letterSpacing: '0.01em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="login-input-premium"
              style={{
                padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0',
                borderRadius: '12px', fontSize: '1rem', outline: 'none',
                transition: 'all 0.2s ease', background: '#f8fafc', color: '#0f172a',
              }}
            />
          </div>
          <button
            type="submit"
            className="login-btn-premium"
            style={{
              background: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)',
              color: '#ffffff', border: 'none', borderRadius: '12px',
              padding: '1rem', fontSize: '1rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              cursor: 'pointer', marginTop: '0.5rem',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 15px rgba(46,204,113,0.3)',
            }}
          >
            <LogIn size={18} /> Sign In
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#64748b', fontSize: '0.875rem', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#2ecc71'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>

        <div style={{
          marginTop: '1.5rem', fontSize: '0.7rem', color: '#94a3b8',
          fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Biowin Agro Research • Secure Portal
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

const dashCardAccents = [
  { gradient: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)', glow: 'rgba(46,204,113,0.35)', border: 'rgba(46,204,113,0.25)' },
  { gradient: 'linear-gradient(135deg, #0f4c75 0%, #1b94e0 100%)', glow: 'rgba(27,148,224,0.35)', border: 'rgba(27,148,224,0.25)' },
  { gradient: 'linear-gradient(135deg, #5b21b6 0%, #a78bfa 100%)', glow: 'rgba(167,139,250,0.35)', border: 'rgba(167,139,250,0.25)' },
  { gradient: 'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)', glow: 'rgba(251,146,60,0.35)', border: 'rgba(251,146,60,0.25)' },
];

const DashboardCard = ({ icon: Icon, title, subtitle, linkTo, footerText, accentIdx = 0 }) => {
  const accent = dashCardAccents[accentIdx] || dashCardAccents[0];
  const [hovered, setHovered] = React.useState(false);
  return (
    <Link
      to={linkTo}
      style={{
        background: hovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        boxShadow: hovered ? `0 20px 50px ${accent.glow}` : '0 10px 30px rgba(45,90,39,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        border: `1px solid ${hovered ? 'rgba(46,204,113,0.4)' : 'rgba(255, 255, 255, 0.6)'}`,
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Subtle top gradient bar */}
      <div style={{ height: '4px', background: accent.gradient, opacity: hovered ? 1 : 0.8 }} />
      <div style={{ padding: '2.25rem 1.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: accent.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: hovered ? `0 8px 24px ${accent.glow}` : `0 4px 12px ${accent.glow}`,
          transition: 'box-shadow 0.3s ease',
        }}>
          <Icon size={32} color="#ffffff" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a4d3a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>{title}</h2>
        <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>{subtitle}</p>
      </div>
      <div style={{
        background: hovered ? accent.gradient : 'rgba(255, 255, 255, 0.5)',
        padding: '0.875rem',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.8125rem',
        letterSpacing: '0.04em',
        color: hovered ? '#ffffff' : '#3B6D11',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
      }}>
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
    { title: 'Admin', subtitle: 'System Administration', icon: ShieldCheck, linkTo: '/admin', footerText: 'Management Access', accentIdx: 0 },
    { title: 'Unit', subtitle: 'Operational Units', icon: Stethoscope, linkTo: '/unit', footerText: 'View Units', accentIdx: 1 },
    { title: 'Warehouse', subtitle: 'Inventory & Storage', icon: Warehouse, linkTo: '/warehouse', footerText: 'Manage Stock', accentIdx: 2 },
    { title: 'Convoy', subtitle: 'Transportation & Logistics', icon: Truck, linkTo: '/convoy', footerText: 'Track Fleet', accentIdx: 3 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafc 60%, #eff6ff 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    }}>
      <WayanadMountainBg />
      {/* Decorative background circles */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,204,113,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ marginBottom: '3.5rem', textAlign: 'center', position: 'relative' }}>
          {/* Brand pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)',
            borderRadius: '999px', padding: '0.35rem 1rem',
            marginBottom: '1.25rem', fontSize: '0.8125rem', fontWeight: 700,
            color: '#1a4d3a', letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }} />
            Biowin Agro Research
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="SIGWE Logo" 
              style={{ 
                height: '80px', 
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
              }} 
            />
          </div>
          <p style={{ color: '#64748b', fontSize: '1.125rem', margin: 0 }}>Select your portal to continue</p>
          {isAuthenticated && (
            <button onClick={logout} style={{
              position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
              background: '#ef4444', color: '#fff', border: 'none',
              padding: '0.5rem 1.25rem', borderRadius: '10px', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.875rem',
            }}>Logout</button>
          )}
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.75rem',
        }}>
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              subtitle={card.subtitle}
              icon={card.icon}
              linkTo={card.linkTo}
              footerText={card.footerText}
              accentIdx={card.accentIdx}
            />
          ))}
        </div>

        {/* Brand watermark footer */}
        <div style={{ marginTop: '4rem', textAlign: 'center', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Biowin Agro Research • Operations Management Platform
        </div>
      </div>
    </div>
  );
};

const PageTemplate = ({ title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm m-8">
    <h1 className="text-3xl font-bold text-spice-dark mb-4">{title}</h1>
    <p className="text-slate-700">{description}</p>
  </div>
);

const AdminPage = ({ logout }) => {
  const navItems = [
    { label: 'Admin Center', icon: ShieldCheck, path: '/admin' },
    { label: 'Units', icon: Layers, path: '/admin/units' },
    { label: 'Warehouses', icon: Warehouse, path: '/admin/warehouses' },
    { label: 'Convoys', icon: Truck, path: '/admin/convoys' }
  ];
  return (
    <DashboardLayout navItems={navItems} logout={logout}>
      <AdminPageContent />
    </DashboardLayout>
  );
};

const AdminUnits = ({ logout }) => {
  const navItems = [
    { label: 'Admin Center', icon: ShieldCheck, path: '/admin' },
    { label: 'Units', icon: Layers, path: '/admin/units' },
    { label: 'Warehouses', icon: Warehouse, path: '/admin/warehouses' },
    { label: 'Convoys', icon: Truck, path: '/admin/convoys' }
  ];
  return (
    <DashboardLayout navItems={navItems} logout={logout}>
      <AdminUnitsPageContent />
    </DashboardLayout>
  );
};

const AdminWarehouses = ({ logout }) => {
  const navItems = [
    { label: 'Admin Center', icon: ShieldCheck, path: '/admin' },
    { label: 'Units', icon: Layers, path: '/admin/units' },
    { label: 'Warehouses', icon: Warehouse, path: '/admin/warehouses' },
    { label: 'Convoys', icon: Truck, path: '/admin/convoys' }
  ];
  return (
    <DashboardLayout navItems={navItems} logout={logout}>
      <AdminWarehousesPageContent />
    </DashboardLayout>
  );
};

const AdminConvoys = ({ logout }) => {
  const navItems = [
    { label: 'Admin Center', icon: ShieldCheck, path: '/admin' },
    { label: 'Units', icon: Layers, path: '/admin/units' },
    { label: 'Warehouses', icon: Warehouse, path: '/admin/warehouses' },
    { label: 'Convoys', icon: Truck, path: '/admin/convoys' }
  ];
  return (
    <DashboardLayout navItems={navItems} logout={logout}>
      <AdminConvoysPageContent />
    </DashboardLayout>
  );
};

const UnitPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unitIdInput, setUnitIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [unitData, setUnitData] = useState(null);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState('stock'); // 'stock', 'billing', 'history', 'deliveries'
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [viewBillData, setViewBillData] = useState(null); // bill object | null
  
  // Stock Form state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProductsForRequest, setSelectedProductsForRequest] = useState({});
  const [stockMessage, setStockMessage] = useState({ type: '', text: '' });
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [globalProducts, setGlobalProducts] = useState([]);
  const [globalProductSearchQuery, setGlobalProductSearchQuery] = useState('');
  const [editingStockProduct, setEditingStockProduct] = useState(null);
  const [editingStockPrice, setEditingStockPrice] = useState("");
  const [unitRequests, setUnitRequests] = useState([]);

  // Billing Form / Cart state
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [billQty, setBillQty] = useState('');
  const [billingMessage, setBillingMessage] = useState({ type: '', text: '' });
  const [billingSearchQuery, setBillingSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // 'Cash', 'UPI', or 'Online'
  const [isOnlineCodeModalOpen, setIsOnlineCodeModalOpen] = useState(false);
  const [onlineCode, setOnlineCode] = useState('');
  const [onlineOrderToFulfill, setOnlineOrderToFulfill] = useState(null);
  
  // Returns Form state
  const [returns, setReturns] = useState([]);
  const [returnProductId, setReturnProductId] = useState('');
  const [returnQty, setReturnQty] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnMessage, setReturnMessage] = useState({ type: '', text: '' });
  
  // Online Orders state
  const [onlineOrderTab, setOnlineOrderTab] = useState('new'); // 'new' or 'history'
  const [onlineOrders, setOnlineOrders] = useState([]);
  
  // Load session
  useEffect(() => {
    const isUnitAuth = sessionStorage.getItem('biowin_unit_auth') === 'true';
    const storedUnit = sessionStorage.getItem('biowin_unit_data');
    if (isUnitAuth && storedUnit) {
      try {
        const data = JSON.parse(storedUnit);
        setUnitData(data);
        setIsLoggedIn(true);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch products and sales when logged in
  useEffect(() => {
    if (isLoggedIn && unitData) {
      fetchProducts();
      fetchSales();
      fetchLatestMetadata();
      fetchGlobalProducts();
      fetchDeliveries();
      fetchReturns();
      fetchUnitRequests();
      fetchOnlineOrders();
    }
  }, [isLoggedIn, unitData?.unitId]);

  const fetchOnlineOrders = async () => {
    if (!unitData) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/reservations`);
      const data = await res.json();
      if (data.success) {
        setOnlineOrders(data.reservations || []);
      }
    } catch (err) {
      console.error("Error fetching online orders:", err);
    }
  };

  const handleCancelOnlineOrder = async (orderId) => {
    if (!unitData) return;
    if (!window.confirm(`Are you sure you want to cancel order #${orderId} and return items to stock?`)) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/reservations/${orderId}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setBillingMessage({ type: 'success', text: 'Order cancelled and stock returned.' });
        fetchOnlineOrders();
        fetchProducts(); // Refresh stock
      } else {
        setBillingMessage({ type: 'error', text: data.message || 'Failed to cancel order.' });
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setBillingMessage({ type: 'error', text: 'Server error while cancelling order.' });
    }
  };

  const fetchUnitRequests = async () => {
    if (!unitData) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/requests`);
      const data = await res.json();
      if (data.success) {
        setUnitRequests(data.requests);
      }
    } catch (err) {
      console.error("Error fetching unit requests:", err);
    }
  };

  const fetchGlobalProducts = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/warehouses/products');
      const data = await res.json();
      if (data.success) {
        setGlobalProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching global products:", err);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/deliveries`);
      const data = await res.json();
      if (data.success) {
        setDeliveries(data.bills);
      }
    } catch (err) {
      console.error("Error fetching deliveries:", err);
    }
  };

  const fetchReturns = async () => {
    if (!unitData) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/returns`);
      const data = await res.json();
      if (data.success) {
        setReturns(data.returns);
      }
    } catch (err) {
      console.error("Error fetching returns:", err);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setReturnMessage({ type: '', text: '' });
    if (!returnProductId || !returnQty || Number(returnQty) <= 0) {
      setReturnMessage({ type: 'error', text: 'Please select a product and enter a valid quantity' });
      return;
    }
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: returnProductId, quantity: Number(returnQty), reason: returnReason })
      });
      const data = await res.json();
      if (data.success) {
        setReturnMessage({ type: 'success', text: data.message });
        setReturnProductId('');
        setReturnQty('');
        setReturnReason('');
        fetchProducts();
        fetchReturns();
      } else {
        setReturnMessage({ type: 'error', text: data.message || 'Failed to process return' });
      }
    } catch (err) {
      setReturnMessage({ type: 'error', text: 'Server error' });
    }
  };

  const fetchLatestMetadata = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/units');
      const data = await res.json();
      if (data.success) {
        const currentUnit = data.units.find(u => u.unitId === unitData.unitId);
        if (currentUnit) {
          setUnitData(currentUnit);
          sessionStorage.setItem('biowin_unit_data', JSON.stringify(currentUnit));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    if (!unitData) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchSales = async () => {
    if (!unitData) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/sales`);
      const data = await res.json();
      if (data.success) {
        setSales(data.sales);
      }
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/auth/unit-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId: unitIdInput, password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('biowin_unit_auth', 'true');
        sessionStorage.setItem('biowin_unit_data', JSON.stringify(data.unit));
        setUnitData(data.unit);
        setIsLoggedIn(true);
        setUnitIdInput('');
        setPasswordInput('');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Failed to connect to server');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('biowin_unit_auth');
    sessionStorage.removeItem('biowin_unit_data');
    setUnitData(null);
    setIsLoggedIn(false);
  };

  const handleRequestStock = async (e) => {
    e.preventDefault();
    setStockMessage({ type: '', text: '' });
    
    const selectedProductIds = Object.keys(selectedProductsForRequest);
    if (selectedProductIds.length === 0) {
      setStockMessage({ type: 'error', text: 'Please select at least one product' });
      return;
    }

    const requestsToMake = selectedProductIds.map(productId => {
      const quantity = Number(selectedProductsForRequest[productId]);
      if (!quantity || quantity <= 0) return null;
      return { productId, quantity };
    }).filter(Boolean);

    if (requestsToMake.length === 0) {
      setStockMessage({ type: 'error', text: 'Please enter a valid quantity for selected products' });
      return;
    }

    try {
      const promises = requestsToMake.map(reqData => 
        fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqData)
        }).then(r => r.json())
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        setStockMessage({ type: 'success', text: "All stock requests submitted successfully" });
        setSelectedProductsForRequest({});
        setGlobalProductSearchQuery('');
        setIsRequestModalOpen(false);
        fetchUnitRequests();
      } else {
        setStockMessage({ type: 'error', text: 'Some or all requests failed to submit' });
      }
    } catch (err) {
      setStockMessage({ type: 'error', text: 'Server error' });
    }
  };

  const handleUpdatePrice = async (productId) => {
    if (!editingStockPrice || isNaN(Number(editingStockPrice))) {
      alert("Please enter a valid price");
      return;
    }
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(editingStockPrice) })
      });
      const data = await res.json();
      if (data.success) {
        setEditingStockProduct(null);
        setEditingStockPrice("");
        fetchProducts();
      } else {
        alert(data.message || "Failed to update price");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleDeleteStockProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product from stock?")) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const quickAddToCart = (product) => {
    setBillingMessage({ type: '', text: '' });
    if (product.quantity <= 0) {
      setBillingMessage({ type: 'error', text: 'Out of stock' });
      return;
    }

    const existingCartItem = cart.find(item => item.productName === product.name);
    if (existingCartItem) {
      const newQty = existingCartItem.quantity + 1;
      if (product.quantity < newQty) {
        setBillingMessage({ type: 'error', text: `Cannot add more. Stock limit reached.` });
        return;
      }
      setCart(cart.map(item => item.productName === product.name ? { ...item, quantity: newQty } : item));
    } else {
      setCart([...cart, { productName: product.name, quantity: 1, price: product.price }]);
    }
  };

  const updateCartQty = (index, delta) => {
    const item = cart[index];
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    const product = products.find(p => p.name === item.productName);
    if (product && product.quantity < newQty) {
      setBillingMessage({ type: 'error', text: `Cannot add more. Stock limit reached.` });
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = newQty;
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    setBillingMessage({ type: '', text: '' });
    if (cart.length === 0) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart, 
          paymentMethod,
          isOnline: !!onlineOrderToFulfill,
          onlineOrderId: onlineOrderToFulfill
        })
      });
      const data = await res.json();
      if (data.success) {
        setBillingMessage({ type: 'success', text: 'Billing completed successfully!' });
        setCart([]);
        setPaymentMethod('Cash');
        setOnlineOrderToFulfill(null);
        fetchProducts();
        fetchSales();
        fetchLatestMetadata();
      } else {
        setBillingMessage({ type: 'error', text: data.message || 'Failed to process sale' });
      }
    } catch (err) {
      setBillingMessage({ type: 'error', text: 'Server error during checkout' });
    }
  };

  const downloadSalesHistory = () => {
    if (sales.length === 0) return;
    const headers = ["Receipt ID", "Date & Time", "Item Name", "Quantity", "Price (INR)", "Payment Method", "Total Revenue (INR)"];
    const rows = [];
    sales.forEach(sale => {
      sale.items.forEach(item => {
        rows.push([
          sale.receiptId || 'N/A',
          new Date(sale.timestamp).toLocaleString(),
          item.productName,
          item.quantity,
          Number(item.price).toFixed(2),
          sale.paymentMethod || 'Cash',
          Number(sale.totalAmount).toFixed(2)
        ]);
      });
    });
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sales_history_${unitData?.unitId || 'unit'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0f2417 0%, #1a4d3a 40%, #2ecc71 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      }}>
        {/* Animated glow blobs */}
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,204,113,0.25) 0%, transparent 70%)',
          top: '-100px', right: '-100px',
          animation: 'loginBlobFloat 8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,77,58,0.4) 0%, transparent 70%)',
          bottom: '-80px', left: '-60px',
          animation: 'loginBlobFloat 11s ease-in-out infinite reverse',
          pointerEvents: 'none',
        }} />
        <style>{`
          @keyframes loginBlobFloat {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(20px, -30px) scale(1.05); }
            66% { transform: translate(-15px, 15px) scale(0.95); }
          }
          @keyframes unitCardIn {
            from { opacity: 0; transform: translateY(30px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .unit-login-input:focus {
            border-color: #2ecc71 !important;
            box-shadow: 0 0 0 4px rgba(46,204,113,0.18) !important;
            outline: none !important;
          }
          .unit-login-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(46,204,113,0.45) !important;
          }
          .unit-login-btn:active { transform: scale(0.98); }
        `}</style>

        <div style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          borderRadius: '24px',
          width: '100%', maxWidth: '440px',
          padding: '2.75rem 2.5rem',
          textAlign: 'center',
          animation: 'unitCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
          position: 'relative', zIndex: 1,
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '80px', height: '80px',
              background: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 24px rgba(46,204,113,0.35)',
            }}>
              <Stethoscope size={38} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f2417', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
              Unit Manager Login
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>Access unit stock, billing &amp; sales history</p>
          </div>

          {loginError && (
            <div style={{
              background: '#fef2f2', color: '#b91c1c', padding: '0.75rem 1rem',
              borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.875rem',
              fontWeight: 600, border: '1px solid #fecaca',
            }}>{loginError}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>Unit ID</label>
              <input
                type="text"
                value={unitIdInput}
                onChange={(e) => setUnitIdInput(e.target.value)}
                placeholder="e.g. 1042"
                required
                className="unit-login-input"
                style={{
                  padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0',
                  borderRadius: '12px', fontSize: '1rem', outline: 'none',
                  transition: 'all 0.2s ease', background: '#f8fafc', color: '#0f172a',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="unit-login-input"
                style={{
                  padding: '0.875rem 1rem', border: '1.5px solid #e2e8f0',
                  borderRadius: '12px', fontSize: '1rem', outline: 'none',
                  transition: 'all 0.2s ease', background: '#f8fafc', color: '#0f172a',
                }}
              />
            </div>
            <button
              type="submit"
              className="unit-login-btn"
              style={{
                background: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)',
                color: '#ffffff', border: 'none', borderRadius: '12px',
                padding: '1rem', fontSize: '1rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: 'pointer', marginTop: '0.5rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 15px rgba(46,204,113,0.3)',
              }}
            >
              <LogIn size={18} /> Sign In
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              color: '#64748b', fontSize: '0.875rem', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#2ecc71'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>

          <div style={{
            marginTop: '1.5rem', fontSize: '0.7rem', color: '#94a3b8',
            fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Biowin Agro Research • Secure Portal
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col py-6 px-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-spice-dark text-white w-10 h-10 rounded-lg flex items-center justify-center">
            <Stethoscope size={24} />
          </div>
          <div className="flex flex-col text-left">
            <h2 className="text-[1.1rem] font-bold text-slate-800 m-0 leading-tight">{unitData?.name}</h2>
            <p className="text-xs text-slate-500 m-0">Unit Manager (#{unitData?.unitId})</p>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
              <select
                value={unitData?.status || 'Active'}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitData.unitId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: newStatus })
                    });
                    const data = await res.json();
                    if (data.success) {
                      const updatedUnit = { ...unitData, status: newStatus };
                      setUnitData(updatedUnit);
                      sessionStorage.setItem('biowin_unit_data', JSON.stringify(updatedUnit));
                    }
                  } catch (err) {
                    console.error("Error updating unit status:", err);
                  }
                }}
                className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 outline-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow">
          {[
            { tab: 'stock', Icon: Package, label: 'Stock in Hand' },
            { tab: 'billing', Icon: ShoppingBag, label: 'Billing (POS)' },
            { tab: 'online_orders', Icon: Globe, label: 'Online Orders' },
            { tab: 'history', Icon: History, label: 'Sales History' },
            { tab: 'deliveries', Icon: Truck, label: 'Deliveries & Bills' },
            { tab: 'returns', Icon: RotateCcw, label: 'Returns' },
          ].map(({ tab, Icon: NavIcon, label }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: '10px',
                  fontWeight: 600, fontSize: '0.9375rem',
                  transition: 'all 0.2s ease', cursor: 'pointer', width: '100%',
                  textAlign: 'left', border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(46,204,113,0.12) 0%, rgba(46,204,113,0.04) 100%)' : 'transparent',
                  color: isActive ? '#1a4d3a' : '#475569',
                  borderLeft: isActive ? '3px solid #2ecc71' : '3px solid transparent',
                  paddingLeft: isActive ? 'calc(1rem - 0px)' : '1rem',
                  transform: isActive ? 'none' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateX(2px)'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; } }}
              >
                <NavIcon size={20} style={{ color: isActive ? '#2ecc71' : '#94a3b8', flexShrink: 0 }} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2 pt-6 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-semibold text-[0.95rem] transition-all hover:bg-red-100 cursor-pointer w-full text-left border-0"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow p-8 lg:p-10 overflow-y-auto">
        <style>{`
          @keyframes fadeInUpStat {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Revenue Card */}
          <div style={{
            background: '#fff', padding: '1.5rem', borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(46,204,113,0.08)', border: '1px solid rgba(46,204,113,0.1)',
            display: 'flex', alignItems: 'center', gap: '1rem',
            animation: 'fadeInUpStat 0.5s ease both',
          }}>
            <div style={{
              padding: '1rem', borderRadius: '14px',
              background: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)',
              boxShadow: '0 4px 14px rgba(46,204,113,0.35)', flexShrink: 0,
              color: '#fff',
            }}>
              <Coins size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Revenue</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
                ₹{(unitData?.revenue || 0).toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          {/* Total Sales Card */}
          <div style={{
            background: '#fff', padding: '1.5rem', borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.1)',
            display: 'flex', alignItems: 'center', gap: '1rem',
            animation: 'fadeInUpStat 0.5s 0.1s ease both',
          }}>
            <div style={{
              padding: '1rem', borderRadius: '14px',
              background: 'linear-gradient(135deg, #0f4c75 0%, #38bdf8 100%)',
              boxShadow: '0 4px 14px rgba(56,189,248,0.35)', flexShrink: 0,
              color: '#fff',
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Total Sales Count</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
                {unitData?.totalSales || 0}
              </h3>
            </div>
          </div>

          {/* Unique Products Card */}
          <div style={{
            background: '#fff', padding: '1.5rem', borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.1)',
            display: 'flex', alignItems: 'center', gap: '1rem',
            animation: 'fadeInUpStat 0.5s 0.2s ease both',
          }}>
            <div style={{
              padding: '1rem', borderRadius: '14px',
              background: 'linear-gradient(135deg, #5b21b6 0%, #a78bfa 100%)',
              boxShadow: '0 4px 14px rgba(167,139,250,0.35)', flexShrink: 0,
              color: '#fff',
            }}>
              <Package size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Unique Products</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>
                {products.length}
              </h3>
            </div>
          </div>
        </div>

        {activeTab === 'stock' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-8">
              {/* Requests Section */}
              {unitRequests.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mt-0 mb-4">Stock Requests</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          <th className="py-2 px-4">Request ID</th>
                          <th className="py-2 px-4">Product Name</th>
                          <th className="py-2 px-4">Quantity</th>
                          <th className="py-2 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unitRequests.map(req => (
                          <tr key={req.requestId} className="border-b border-slate-50 text-slate-600">
                            <td className="py-2.5 px-4 font-mono text-xs text-slate-400">{req.requestId}</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-700">{req.productName}</td>
                            <td className="py-2.5 px-4">{req.quantity}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                req.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                req.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {req.status === 'Dispatched' ? 'Incoming' : req.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 mt-0 mb-0">Stock in Hand</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search stock..."
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-spice-dark focus:ring-1 focus:ring-spice-dark"
                    />
                  </div>
                  <button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex items-center gap-2 bg-spice-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-spice-darker transition-colors cursor-pointer border-0"
                  >
                    <PlusCircle size={16} /> Request Stock
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10 shadow-sm">
                    <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Qty in Hand</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.name.toLowerCase().includes(stockSearchQuery.toLowerCase()) || (p.productId && p.productId.toLowerCase().includes(stockSearchQuery.toLowerCase()))).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">No products found.</td>
                      </tr>
                    ) : products.filter(p => p.name.toLowerCase().includes(stockSearchQuery.toLowerCase()) || (p.productId && p.productId.toLowerCase().includes(stockSearchQuery.toLowerCase()))).map((prod) => (
                      <tr key={prod._id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-400">{prod.productId || 'N/A'}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">{prod.name}</td>
                        <td className="py-3.5 px-4">
                          {editingStockProduct === prod.productId ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editingStockPrice}
                              onChange={(e) => setEditingStockPrice(e.target.value)}
                              className="w-20 px-2 py-1 border border-slate-200 rounded text-sm focus:border-spice-dark focus:ring-1 focus:ring-spice-dark outline-none"
                            />
                          ) : (
                            `₹${Number(prod.price).toFixed(2)}`
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">{prod.quantity}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            prod.quantity > 10 ? 'bg-green-100 text-green-800' : prod.quantity > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {prod.quantity > 10 ? 'In Stock' : prod.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {editingStockProduct === prod.productId ? (
                              <>
                                <button
                                  onClick={() => handleUpdatePrice(prod.productId)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 cursor-pointer border-0"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingStockProduct(null);
                                    setEditingStockPrice("");
                                  }}
                                  className="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300 cursor-pointer border-0"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingStockProduct(prod.productId);
                                    setEditingStockPrice(prod.price);
                                  }}
                                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors border-0 cursor-pointer"
                                  title="Edit Price"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteStockProduct(prod.productId)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors border-0 cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        )}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Products Grid (Left Side - POS Style) */}
            <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)]">
              <div className="p-6 pb-4 border-b border-slate-100 shrink-0">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800 m-0">Point of Sale</h3>
                  <div className="relative w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={billingSearchQuery}
                      onChange={(e) => setBillingSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-spice-dark focus:ring-1 focus:ring-spice-dark"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-5 overflow-y-auto flex-grow custom-scrollbar">
                {billingMessage.text && (
                  <div className={`p-4 rounded-lg mb-6 text-sm font-semibold border ${
                    billingMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {billingMessage.text}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.filter(p => p.name.toLowerCase().includes(billingSearchQuery.toLowerCase()) || (p.productId && p.productId.toLowerCase().includes(billingSearchQuery.toLowerCase()))).map(p => {
                  const outOfStock = p.quantity <= 0;
                  return (
                    <button 
                      key={p._id}
                      onClick={() => !outOfStock && quickAddToCart(p)}
                      disabled={outOfStock}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col items-stretch gap-0 whitespace-normal ${
                        outOfStock 
                          ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' 
                          : 'border-slate-100 bg-white hover:border-spice-dark hover:shadow-md cursor-pointer active:scale-95'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs font-bold text-slate-400">Stock: {p.quantity}</div>
                        <div className="text-[10px] font-mono text-slate-300">#{p.productId || 'N/A'}</div>
                      </div>
                      <div className="font-bold text-slate-800 text-[1.05rem] leading-tight mb-2 h-10 overflow-hidden">{p.name}</div>
                      <div className="font-bold text-spice-dark text-lg">₹{Number(p.price).toFixed(2)}</div>
                    </button>
                  )
                })}
                {products.filter(p => p.name.toLowerCase().includes(billingSearchQuery.toLowerCase()) || (p.productId && p.productId.toLowerCase().includes(billingSearchQuery.toLowerCase()))).length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 font-medium">No products found.</div>
                )}
              </div>
              </div>
            </div>

            {/* Receipt / Cart (Right Side) */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] sticky top-6">
              <div className="p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <h3 className="text-lg font-bold text-slate-800 m-0 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-spice-dark" />
                  Current Order
                </h3>
              </div>
              
              <div className="flex-grow overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 opacity-60">
                    <ShoppingBag size={48} />
                    <p className="font-medium">Cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex-grow pr-4">
                          <div className="font-bold text-slate-800 mb-1 leading-tight">{item.productName}</div>
                          <div className="text-sm font-semibold text-spice-dark">₹{Number(item.price).toFixed(2)}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</div>
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            <button onClick={() => updateCartQty(idx, -1)} className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer border-0">
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-slate-700 text-sm">{item.quantity}</span>
                            <button onClick={() => updateCartQty(idx, 1)} className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer border-0">
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Footer */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-500 font-bold">Subtotal</span>
                  <span className="text-lg font-bold text-slate-800">
                    ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-bold">Tax</span>
                  <span className="text-lg font-bold text-slate-800">₹0.00</span>
                </div>
                <div className="flex flex-col gap-2 mb-4 pt-4 border-t border-slate-200">
                  <span className="text-slate-500 font-bold text-sm text-left">Payment Method</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash')}
                      style={{
                        flex: 1, padding: '0.625rem 0.75rem',
                        borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem',
                        border: paymentMethod === 'Cash' ? '2px solid #2ecc71' : '1.5px solid #e2e8f0',
                        background: paymentMethod === 'Cash' ? 'linear-gradient(135deg, rgba(46,204,113,0.1) 0%, rgba(26,77,58,0.08) 100%)' : '#fff',
                        color: paymentMethod === 'Cash' ? '#1a4d3a' : '#64748b',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: paymentMethod === 'Cash' ? '0 2px 8px rgba(46,204,113,0.2)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '1rem' }}>₹</span> Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      style={{
                        flex: 1, padding: '0.625rem 0.75rem',
                        borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem',
                        border: paymentMethod === 'UPI' ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
                        background: paymentMethod === 'UPI' ? 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(79,70,229,0.08) 100%)' : '#fff',
                        color: paymentMethod === 'UPI' ? '#4338ca' : '#64748b',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: paymentMethod === 'UPI' ? '0 2px 8px rgba(99,102,241,0.2)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>UPI</span> Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOnlineCodeModalOpen(true)}
                      style={{
                        flex: 1, padding: '0.625rem 0.75rem',
                        borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem',
                        border: paymentMethod === 'Online' ? '2px solid #f59e0b' : '1.5px solid #e2e8f0',
                        background: paymentMethod === 'Online' ? 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.08) 100%)' : '#fff',
                        color: paymentMethod === 'Online' ? '#b45309' : '#64748b',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: paymentMethod === 'Online' ? '0 2px 8px rgba(245,158,11,0.2)' : 'none',
                      }}
                    >
                      <Globe size={14} /> Online
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-200">
                  <span className="text-slate-800 font-black text-xl">Total</span>
                  <span className="text-3xl font-black text-spice-dark">
                    ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                
                <style>{`
                  @keyframes payBtnPulse {
                    0%, 100% { box-shadow: 0 4px 20px rgba(46,204,113,0.4); }
                    50% { box-shadow: 0 4px 35px rgba(46,204,113,0.65); }
                  }
                  .pay-now-btn:hover { transform: translateY(-2px); }
                  .pay-now-btn:active { transform: scale(0.98); }
                `}</style>
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className={cart.length > 0 ? 'pay-now-btn' : ''}
                  style={{
                    width: '100%', padding: '1.1rem',
                    borderRadius: '14px', fontWeight: 900, fontSize: '1.1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    border: 'none', cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
                    background: cart.length > 0 ? 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)' : '#e2e8f0',
                    color: cart.length > 0 ? '#ffffff' : '#94a3b8',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    animation: cart.length > 0 ? 'payBtnPulse 2.5s ease-in-out infinite' : 'none',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>₹</span> PAY NOW
                </button>
              </div>
            </div>

            {/* Online Payment Code Modal */}
            {isOnlineCodeModalOpen && (
              <div
                style={{
                  position: 'fixed', inset: 0,
                  background: 'rgba(15,23,42,0.65)',
                  backdropFilter: 'blur(6px)',
                  zIndex: 60,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '1.5rem',
                }}
              >
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" style={{ animation: 'fadeInUp 0.3s ease-out both' }}>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 text-center m-0">Enter 5-Digit Code</h3>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="e.g. 12345"
                    value={onlineCode}
                    onChange={(e) => setOnlineCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-2xl tracking-widest font-mono p-3 border-2 border-slate-200 rounded-xl mb-6 focus:border-amber-500 focus:outline-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsOnlineCodeModalOpen(false);
                        setOnlineCode('');
                        if (paymentMethod === 'Online') setPaymentMethod('Cash'); // Reset if canceled
                      }}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors border-0 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (onlineCode.length === 5) {
                          const matchedOrder = onlineOrders.find(o => o.orderId === onlineCode && o.status === 'Pending');
                          if (matchedOrder) {
                            const newCart = matchedOrder.products?.map(p => ({
                              productName: p.productName || p.name,
                              quantity: p.quantity,
                              price: p.price
                            })) || [];
                            setCart(newCart);
                            setOnlineOrderToFulfill(matchedOrder.orderId);
                            setPaymentMethod('Online');
                            setIsOnlineCodeModalOpen(false);
                            setBillingMessage({ type: 'success', text: `Loaded online order #${matchedOrder.orderId}` });
                          } else {
                            alert('Order not found or already processed.');
                          }
                        } else {
                          alert('Please enter a valid 5-digit code.');
                        }
                      }}
                      className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors border-0 cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'online_orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800 m-0 text-left">Online Orders</h3>
            </div>
            
            {/* Toggle for New Orders vs Order History */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4">
              <button
                onClick={() => setOnlineOrderTab('new')}
                className={`px-4 py-2 font-semibold rounded-lg transition-all border-0 cursor-pointer ${onlineOrderTab === 'new' ? 'bg-spice-dark text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                New Orders
              </button>
              <button
                onClick={() => setOnlineOrderTab('history')}
                className={`px-4 py-2 font-semibold rounded-lg transition-all border-0 cursor-pointer ${onlineOrderTab === 'history' ? 'bg-spice-dark text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Order History
              </button>
            </div>

            {onlineOrderTab === 'new' ? (
              onlineOrders.filter(o => o.status === 'Pending').length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-100">
                  <Globe size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="m-0 text-lg">No new online orders at the moment.</p>
                  <p className="text-sm mt-2">New orders will appear here automatically.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {onlineOrders.filter(o => o.status === 'Pending').map((order) => (
                    <div key={order._id || order.orderId} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-slate-800 m-0">Order #{order.orderId}</p>
                          <p className="text-sm text-slate-500 m-0">
                            Customer: {order.customerName || 'N/A'} {order.customerEmail ? `(${order.customerEmail})` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-spice-dark m-0">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                          <p className="text-xs text-slate-400 m-0">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Items</p>
                        <ul className="m-0 pl-0 list-none space-y-1">
                          {order.products?.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm text-slate-700 font-medium">
                              <span>{item.quantity}x {item.productName || item.name}</span>
                              <span className="font-mono">₹{Number(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => handleCancelOnlineOrder(order.orderId)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors cursor-pointer"
                        >
                          Return to Stock (After 1 week)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              onlineOrders.filter(o => o.status !== 'Pending').length === 0 ? (
                <div className="text-center py-10 text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-100">
                  <History size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="m-0 text-lg">No online order history available.</p>
                  <p className="text-sm mt-2">Past orders will be listed here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {onlineOrders.filter(o => o.status !== 'Pending').map((order) => (
                    <div key={order._id || order.orderId} className="bg-slate-50 border border-slate-100 rounded-xl p-4 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800 m-0">Order #{order.orderId}</p>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 uppercase">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 m-0 mt-1">
                            Customer: {order.customerName || 'N/A'} {order.customerEmail ? `(${order.customerEmail})` : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-700 m-0">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                          <p className="text-xs text-slate-400 m-0">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="border-t border-slate-200 pt-3">
                        <ul className="m-0 pl-0 list-none space-y-1">
                          {order.products?.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm text-slate-500">
                              <span>{item.quantity}x {item.productName || item.name}</span>
                              <span className="font-mono">₹{Number(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800 m-0 text-left">Sales History</h3>
              {sales.length > 0 && (
                <button
                  onClick={downloadSalesHistory}
                  className="bg-spice-dark hover:bg-spice-darker text-white text-sm font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border-0 active:scale-95"
                >
                  Download CSV
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Receipt ID</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">No sales history found.</td>
                    </tr>
                  ) : sales.map((sale) => (
                    sale.items.map((item, idx) => (
                      <tr key={`${sale._id}-${idx}`} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors text-left">
                        {idx === 0 ? (
                          <>
                            <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-400" rowSpan={sale.items.length}>
                              {sale.receiptId || 'N/A'}
                            </td>
                            <td className="py-3.5 px-4 text-sm font-semibold text-slate-500" rowSpan={sale.items.length}>
                              {new Date(sale.timestamp).toLocaleString()}
                            </td>
                          </>
                        ) : null}
                        <td className="py-3.5 px-4 text-slate-800 font-semibold">
                          {item.productName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono">
                          ₹{Number(item.price).toFixed(2)}
                        </td>
                        {idx === 0 ? (
                          <>
                            <td className="py-3.5 px-4 text-sm font-semibold" rowSpan={sale.items.length}>
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                                  sale.paymentMethod === 'UPI' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {sale.paymentMethod || 'Cash'}
                                </span>
                                {sale.isOnline && (
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase border border-emerald-200">
                                    Online Order
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-slate-800 font-mono" rowSpan={sale.items.length}>
                              ₹{Number(sale.totalAmount).toFixed(2)}
                            </td>
                          </>
                        ) : null}
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6" style={{ animation: 'fadeInUp 0.4s ease-out both' }}>
            <h3 className="text-lg font-semibold text-slate-800 mb-6 text-left">Incoming Deliveries &amp; Bills</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="py-4 px-5 font-semibold">Job ID</th>
                    <th className="py-4 px-5 font-semibold">Delivered Date</th>
                    <th className="py-4 px-5 font-semibold">Total Amount</th>
                    <th className="py-4 px-5 font-semibold">Convoy Status</th>
                    <th className="py-4 px-5 font-semibold">Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.length === 0 ? (
                    <tr><td colSpan="5" className="py-10 text-center text-slate-500">No deliveries found.</td></tr>
                  ) : deliveries.map(bill => (
                    <tr key={bill._id} className="border-b border-slate-100 transition-colors" style={{ transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'hsl(145,63%,98%)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td className="py-4 px-5 font-semibold text-slate-800">#{bill.jobId}</td>
                      <td className="py-4 px-5 text-slate-600">{bill.deliveredAt ? new Date(bill.deliveredAt).toLocaleString() : '—'}</td>
                      <td className="py-4 px-5 font-bold text-emerald-600" style={{ fontVariantNumeric: 'tabular-nums' }}>₹{Number(bill.totalAmount).toFixed(2)}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          bill.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {bill.status || 'Delivered'}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <button
                          onClick={() => setViewBillData(bill)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            background: '#f8fafc', color: '#475569',
                            border: '1.5px solid #e2e8f0', padding: '0.35rem 0.85rem',
                            borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'hsl(213,92%,96%)'; e.currentTarget.style.borderColor = 'hsl(213,92%,70%)'; e.currentTarget.style.color = 'hsl(213,92%,38%)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          View Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Unit Bill Modal */}
            {viewBillData && (
              <div
                style={{
                  position: 'fixed', inset: 0,
                  background: 'rgba(15,23,42,0.65)',
                  backdropFilter: 'blur(6px)',
                  zIndex: 50,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '1.5rem',
                  animation: 'fadeIn 0.2s ease-out both',
                }}
                onClick={() => setViewBillData(null)}
              >
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    maxWidth: '560px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)',
                    color: '#fff', position: 'relative',
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.75)' }}>
                      Biowin Agro Research
                    </span>
                    <h2 style={{
                      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                      fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0,
                    }}>Delivery Bill</h2>
                    <button
                      onClick={() => setViewBillData(null)}
                      style={{
                        background: 'rgba(255,255,255,0.15)', border: 'none',
                        borderRadius: '8px', padding: '0.4rem', cursor: 'pointer',
                        color: '#fff', display: 'flex', alignItems: 'center', zIndex: 1,
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                    {/* Meta */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', border: '1px solid #f1f5f9' }}>
                      {[
                        ['Job ID', `#${viewBillData.jobId}`],
                        ['Convoy ID', viewBillData.convoyId || '—'],
                        ['Unit Name', viewBillData.unitName || unitData?.name || '—'],
                        ['Delivered Date', viewBillData.deliveredAt ? new Date(viewBillData.deliveredAt).toLocaleString() : '—'],
                        ['Payment Status', null],
                      ].map(([label, value], i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none', fontSize: '0.9rem' }}>
                          <span style={{ color: '#64748b', fontWeight: 500, fontSize: '0.84rem' }}>{label}</span>
                          {label === 'Payment Status' ? (
                            viewBillData.paymentCompleted
                              ? <span className="biowin-badge-paid">Paid</span>
                              : <span className="biowin-badge-pending">Pending</span>
                          ) : (
                            <span style={{ fontWeight: 700, color: '#1e293b' }}>{value}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Items table */}
                    {viewBillData.items && viewBillData.items.length > 0 && (
                      <div style={{ marginBottom: '1.25rem', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                              {['Product', 'Qty', 'Unit Price', 'Subtotal'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {viewBillData.items.map((it, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.65rem 0.75rem', color: '#334155' }}>{it.name || it.productName}</td>
                                <td style={{ padding: '0.65rem 0.75rem', color: '#334155' }}>{it.quantity}</td>
                                <td style={{ padding: '0.65rem 0.75rem', color: '#334155' }}>₹{Number(it.price).toFixed(2)}</td>
                                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#16a34a' }}>₹{(it.quantity * it.price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Grand total */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: 'linear-gradient(135deg, hsl(145,63%,94%), hsl(145,63%,90%))',
                      border: '1.5px solid hsl(145,63%,80%)',
                      borderRadius: '12px', padding: '0.875rem 1.25rem',
                    }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'hsl(145,63%,25%)' }}>Grand Total</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'hsl(145,63%,25%)', letterSpacing: '-0.02em' }}>
                        ₹{Number(viewBillData.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="biowin-btn-secondary" onClick={() => setViewBillData(null)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{ animation: 'fadeInUp 0.4s ease-out both' }}>
            {/* Returns History (Left Side) */}
            <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)]">
              <div className="p-6 pb-4 border-b border-slate-100 shrink-0">
                <h3 className="text-xl font-bold text-slate-800 m-0 text-left">Returns History</h3>
              </div>
              
              <div className="p-6 pt-0 overflow-y-auto flex-grow custom-scrollbar">
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                        <th className="py-4 px-5 font-semibold">Date</th>
                        <th className="py-4 px-5 font-semibold">Product</th>
                        <th className="py-4 px-5 font-semibold">Quantity</th>
                        <th className="py-4 px-5 font-semibold">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returns.length === 0 ? (
                        <tr><td colSpan="4" className="py-10 text-center text-slate-500">No returns found.</td></tr>
                      ) : returns.map((ret, idx) => (
                        <tr key={idx} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                          <td className="py-4 px-5 text-slate-600 text-sm">{new Date(ret.timestamp).toLocaleString()}</td>
                          <td className="py-4 px-5 font-semibold text-slate-800">{ret.productName}</td>
                          <td className="py-4 px-5 text-slate-600 font-bold">{ret.quantity}</td>
                          <td className="py-4 px-5 text-slate-600 text-sm">{ret.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Log Return (Right Side) */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] sticky top-6">
              <div className="p-5 border-b border-slate-100 bg-slate-50 rounded-t-xl text-left">
                <h3 className="text-lg font-bold text-slate-800 m-0 flex items-center gap-2">
                  <RotateCcw size={20} className="text-spice-dark" />
                  Log Return
                </h3>
              </div>
              
              <div className="flex-grow overflow-y-auto p-5 text-left">
                <p className="text-xs text-slate-400 mb-6">Select a product to return to the warehouse or write off.</p>
                {returnMessage.text && (
                  <div className={`p-4 rounded-lg mb-6 text-sm font-semibold border ${
                    returnMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {returnMessage.text}
                  </div>
                )}
                
                <form onSubmit={handleReturnSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Product</label>
                    <select
                      value={returnProductId}
                      onChange={(e) => setReturnProductId(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-spice-dark focus:ring-2 focus:ring-spice-dark/20 bg-white transition-all shadow-sm"
                    >
                      <option value="">-- Select Product --</option>
                      {products.map(p => (
                        <option key={p.productId} value={p.productId}>
                          {p.name} (Stock: {p.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Quantity to Return</label>
                    <input
                      type="number"
                      min="1"
                      value={returnQty}
                      onChange={(e) => setReturnQty(e.target.value)}
                      placeholder="Enter quantity"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-spice-dark focus:ring-2 focus:ring-spice-dark/20 transition-all shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Reason</label>
                    <input
                      type="text"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      placeholder="e.g. Expired, Damaged, Surplus"
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-spice-dark focus:ring-2 focus:ring-spice-dark/20 transition-all shadow-sm"
                    />
                  </div>

                  <div className="mt-4">
                    <button 
                      type="submit" 
                      style={{
                        background: 'linear-gradient(135deg, #1a4d3a 0%, #2ecc71 100%)',
                        boxShadow: '0 4px 15px rgba(46,204,113,0.3)'
                      }}
                      className="w-full py-3.5 text-white font-black rounded-xl hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center gap-2 text-[1.05rem] tracking-wide"
                    >
                      <RotateCcw size={18} /> SUBMIT RETURN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Request Stock Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 m-0">
                <PlusCircle size={24} className="text-spice-dark" />
                Request Stock
              </h2>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors border-0 cursor-pointer bg-transparent"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-4 relative">
              <p className="text-sm text-slate-500 m-0">
                Select multiple products and set quantities to request stock from the global warehouse.
              </p>
              
              {stockMessage.text && (
                <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                  stockMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {stockMessage.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  {stockMessage.text}
                </div>
              )}
              
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search global catalog..."
                  value={globalProductSearchQuery}
                  onChange={(e) => setGlobalProductSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-100 rounded-xl text-sm outline-none focus:border-spice-dark focus:ring-4 focus:ring-spice-dark/10 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>
              
              <div className="border-2 border-slate-100 rounded-xl overflow-hidden flex flex-col bg-slate-50">
                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 p-2 flex flex-col gap-2">
                  {globalProducts.filter(p => p.isAvailable !== false && (p.name.toLowerCase().includes(globalProductSearchQuery.toLowerCase()) || (p.productId && p.productId.toLowerCase().includes(globalProductSearchQuery.toLowerCase())))).length === 0 ? (
                    <div className="p-8 text-center text-slate-400 font-medium flex flex-col items-center gap-2">
                      <Package size={32} className="opacity-20" />
                      No products found matching your search.
                    </div>
                  ) : globalProducts.filter(p => p.isAvailable !== false && (p.name.toLowerCase().includes(globalProductSearchQuery.toLowerCase()) || (p.productId && p.productId.toLowerCase().includes(globalProductSearchQuery.toLowerCase())))).map(p => {
                    const quantity = selectedProductsForRequest[p.productId] || '';
                    const isSelected = selectedProductsForRequest[p.productId] !== undefined;
                    return (
                      <div
                        key={p.productId}
                        className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between gap-4 ${
                          isSelected 
                            ? 'bg-orange-50/50 border-amber-500 shadow-sm' 
                            : 'bg-white border-transparent hover:border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-grow">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => {
                              const newSelections = { ...selectedProductsForRequest };
                              if (e.target.checked) {
                                newSelections[p.productId] = '1';
                              } else {
                                delete newSelections[p.productId];
                              }
                              setSelectedProductsForRequest(newSelections);
                            }}
                            className="w-5 h-5 rounded border-slate-300 text-spice-dark focus:ring-spice-dark cursor-pointer accent-spice-dark shrink-0"
                          />
                          <div className="flex flex-col flex-grow cursor-pointer" onClick={() => {
                            const newSelections = { ...selectedProductsForRequest };
                            if (!isSelected) {
                              newSelections[p.productId] = '1';
                            } else {
                              delete newSelections[p.productId];
                            }
                            setSelectedProductsForRequest(newSelections);
                          }}>
                            <span className="font-bold text-slate-800">{p.name}</span>
                            <div className="flex gap-2 items-center flex-wrap">
                              <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">ID: {p.productId}</span>
                              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">₹{Number(p.price).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm shrink-0">
                            <label className="text-xs font-bold text-slate-500">QTY</label>
                            <input 
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                setSelectedProductsForRequest({
                                  ...selectedProductsForRequest,
                                  [p.productId]: e.target.value
                                });
                              }}
                              className="w-16 text-center font-bold text-slate-800 outline-none"
                              placeholder="1"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              <div className="text-sm font-bold text-slate-500">
                {Object.keys(selectedProductsForRequest).length} product(s) selected
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setIsRequestModalOpen(false);
                    setSelectedProductsForRequest({});
                    setStockMessage({ type: '', text: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer border-0 bg-transparent"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRequestStock}
                  disabled={Object.keys(selectedProductsForRequest).length === 0}
                  className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-sm border-0 flex items-center gap-2 ${
                    Object.keys(selectedProductsForRequest).length > 0 
                      ? 'bg-spice-dark hover:bg-spice-darker hover:shadow cursor-pointer active:scale-95' 
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <PlusCircle size={18} />
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WarehouseDashboardContent = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // New state variables for grouped view
  const [expandedUnitId, setExpandedUnitId] = useState(null);
  const [unitStocks, setUnitStocks] = useState({});
  const [isFetchingStock, setIsFetchingStock] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/warehouses/requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpandUnit = async (unitId) => {
    if (expandedUnitId === unitId) {
      setExpandedUnitId(null);
      return;
    }
    setExpandedUnitId(unitId);

    if (!unitStocks[unitId]) {
      setIsFetchingStock(true);
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitId}/products`);
        const data = await res.json();
        if (data.success) {
          setUnitStocks(prev => ({ ...prev, [unitId]: data.products }));
        }
      } catch (err) {
        console.error("Error fetching unit stock:", err);
      } finally {
        setIsFetchingStock(false);
      }
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this pending request?")) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/requests/${requestId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
      }
    } catch (err) {
      console.error("Error deleting request:", err);
    }
  };

  // Group requests by unit
  const groupedRequests = requests.reduce((acc, req) => {
    if (!acc[req.unitId]) {
      acc[req.unitId] = { unitName: req.unitName, requests: [] };
    }
    acc[req.unitId].requests.push(req);
    return acc;
  }, {});

  // Apply search filtering on the grouped data
  const filteredUnits = Object.entries(groupedRequests).filter(([unitId, data]) => {
    return data.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           data.requests.some(r => r.productName.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 m-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 m-0">Unit Requests</h3>
          <p className="text-sm text-slate-500 mt-1">Monitor stock requests grouped by unit.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search units or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-spice-dark focus:ring-1 focus:ring-spice-dark w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">Loading requests...</div>
      ) : filteredUnits.length === 0 ? (
        <div className="text-center py-10 text-slate-400">No requests found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredUnits.map(([unitId, data]) => {
            const isExpanded = expandedUnitId === unitId;
            const stockData = unitStocks[unitId];

            return (
              <div key={unitId} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <button 
                  onClick={() => handleExpandUnit(unitId)}
                  className="w-full bg-slate-50 hover:bg-slate-100 transition-colors p-5 flex justify-between items-center cursor-pointer border-0 text-left border-b border-transparent"
                  style={{ borderBottomColor: isExpanded ? '#e2e8f0' : 'transparent' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm border border-slate-200 text-spice-dark">
                      <Warehouse size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 m-0">{data.unitName}</h4>
                      <p className="text-xs text-slate-500 font-medium m-0 mt-0.5">Unit ID: {unitId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pending Requests</span>
                      <span className="text-lg font-black text-slate-800">{data.requests.length} Items</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Left side: Requests Table */}
                      <div className="flex flex-col">
                        <h5 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                          <PlusCircle size={16} className="text-amber-500" /> 
                          Requested Products
                        </h5>
                        <div className="border border-slate-100 rounded-lg overflow-hidden">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                              <tr>
                                <th className="px-4 py-2 font-semibold">Product</th>
                                <th className="px-4 py-2 font-semibold text-center">Qty</th>
                                <th className="px-4 py-2 font-semibold">Status</th>
                                <th className="px-4 py-2 text-right font-semibold">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {data.requests.map(req => (
                                <tr key={req.requestId} className="hover:bg-slate-50">
                                  <td className="px-4 py-2.5 font-medium text-slate-800">{req.productName}</td>
                                  <td className="px-4 py-2.5 font-bold text-slate-800 text-center">{req.quantity}</td>
                                  <td className="px-4 py-2.5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                      req.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                                      req.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {req.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-right">
                                    {req.status === 'Pending' && (
                                      <button 
                                        onClick={() => handleDeleteRequest(req.requestId)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer border-0 bg-transparent"
                                        title="Delete Request"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Right side: Unit Stock Table */}
                      <div className="flex flex-col">
                        <h5 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                          <Package size={16} className="text-emerald-500" />
                          Current Unit Stock
                        </h5>
                        
                        {isFetchingStock ? (
                          <div className="p-8 text-center text-slate-400 text-sm font-medium">Fetching unit inventory...</div>
                        ) : !stockData ? (
                          <div className="p-8 text-center text-slate-400 text-sm font-medium">No stock data available.</div>
                        ) : stockData.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-sm font-medium border border-slate-100 rounded-lg">Unit has no stock.</div>
                        ) : (
                          <div className="border border-slate-100 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0 shadow-sm z-10">
                                <tr>
                                  <th className="px-4 py-2 font-semibold">Product</th>
                                  <th className="px-4 py-2 font-semibold text-center">In Hand</th>
                                  <th className="px-4 py-2 font-semibold text-right">Price</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {stockData.map(prod => (
                                  <tr key={prod.productId} className="hover:bg-slate-50">
                                    <td className="px-4 py-2.5 font-medium text-slate-800">{prod.name}</td>
                                    <td className="px-4 py-2.5 text-center">
                                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                                        prod.quantity > 10 ? 'bg-emerald-100 text-emerald-800' : prod.quantity > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                      }`}>
                                        {prod.quantity}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-slate-500">
                                      ₹{Number(prod.price).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const WarehousePage = ({ logout }) => {
  const navItems = [
    { label: 'Warehouse', icon: Warehouse, path: '/warehouse' },
    { label: 'Products', icon: Package, path: '/warehouse/products' },
    { label: 'Units', icon: MapPin, path: '/warehouse/units' }
  ];
  return (
    <DashboardLayout navItems={navItems} logout={logout} title="Warehouse" subtitle="Inventory Management">
      <div className="mb-6 px-8 pt-8">
        <h1 className="text-3xl font-bold text-slate-800 m-0">Warehouse Management</h1>
        <p className="text-slate-500 mt-1">Inventory and unit stock controls.</p>
      </div>
      <WarehouseDashboardContent />
    </DashboardLayout>
  );
};

const WarehouseProductsPageContent = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/warehouses/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleAddOrEditProduct = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!productName.trim()) {
      setMessage({ type: 'error', text: 'Product name is required' });
      return;
    }

    try {
      const url = editProductId 
        ? `/api/warehouses/products/${editProductId}`
        : '/api/warehouses/products';
      const method = editProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: productName, price: productPrice })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setProductName('');
        setProductPrice('');
        setEditProductId(null);
        fetchProducts();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to save product' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error' });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/warehouses/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setMessage({ type: 'success', text: 'Product deleted successfully' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Server error' });
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/warehouses/products/${product.productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !product.isAvailable })
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (product) => {
    setEditProductId(product.productId);
    setProductName(product.name);
    setProductPrice(product.price);
    setMessage({ type: '', text: '' });
  };

  const cancelEdit = () => {
    setEditProductId(null);
    setProductName('');
    setProductPrice('');
    setMessage({ type: '', text: '' });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.productId && p.productId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mt-0 mb-0">Global Products List</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Hex ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">No products found.</td>
                </tr>
              ) : filteredProducts.map((prod) => (
                <tr key={prod._id} className="border-b border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-400">{prod.productId || 'N/A'}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{prod.name}</td>
                  <td className="py-3.5 px-4">₹{Number(prod.price).toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      prod.isAvailable !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {prod.isAvailable !== false ? 'Available' : 'Not Available'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleAvailability(prod)}
                        title="Toggle Availability"
                        className={`p-1.5 rounded-md transition-colors border-0 cursor-pointer ${
                          prod.isAvailable !== false ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'
                        }`}
                      >
                        {prod.isAvailable !== false ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button 
                        onClick={() => handleEditClick(prod)}
                        title="Edit"
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors border-0 cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(prod.productId)}
                        title="Delete"
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors border-0 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-fit">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 mt-0">
          {editProductId ? 'Edit Product' : 'Add New Product'}
        </h3>
        {message.text && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleAddOrEditProduct} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-semibold text-slate-600">Product Name</label>
            <input 
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Organic Wheat Seeds"
              className="px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-sm font-semibold text-slate-600">Price (₹)</label>
            <input 
              type="number"
              step="0.01"
              required
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="e.g. 12.50"
              className="px-3.5 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border-0">
              {editProductId ? <><Edit2 size={18} /> Update</> : <><PlusCircle size={18} /> Add Product</>}
            </button>
            {editProductId && (
              <button type="button" onClick={cancelEdit} className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-4 py-2.5 font-semibold transition-all cursor-pointer border-0">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const WarehouseProductsPage = ({ logout }) => {
  const navItems = [
    { label: 'Warehouse', icon: Warehouse, path: '/warehouse' },
    { label: 'Products', icon: Package, path: '/warehouse/products' },
    { label: 'Units', icon: MapPin, path: '/warehouse/units' }
  ];
  return (
    <DashboardLayout navItems={navItems} logout={logout} title="Warehouse" subtitle="Inventory Management">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 m-0">Products</h1>
        <p className="text-slate-500 mt-1">Manage global product catalog</p>
      </div>
      <WarehouseProductsPageContent />
    </DashboardLayout>
  );
};

const WarehouseUnitsPage = ({ logout }) => {
  const navItems = [
    { label: 'Warehouse', icon: Warehouse, path: '/warehouse' },
    { label: 'Products', icon: Package, path: '/warehouse/products' },
    { label: 'Units', icon: MapPin, path: '/warehouse/units' }
  ];
  return (
    <DashboardLayout navItems={navItems} logout={logout} title="Warehouse" subtitle="Units">
      <div className="px-8 pt-8 h-full overflow-y-auto">
        <WarehouseUnitsPageContent />
      </div>
    </DashboardLayout>
  );
};

import ConvoyJobsPage from './pages/ConvoyJobsPage';

const ConvoyPage = ({ logout, children }) => {
  const navItems = [
    { label: 'Orders', icon: Truck, path: '/convoy' },
    { label: 'Jobs', icon: Briefcase, path: '/convoy/jobs' }
  ];
  
  const convoyDataString = sessionStorage.getItem('biowin_convoy_data');
  const convoyData = convoyDataString ? JSON.parse(convoyDataString) : null;
  const convoyId = convoyData ? convoyData.convoyId : null;

  return (
    <DashboardLayout navItems={navItems} logout={logout}>
      {children ? children : <ConvoyDashboardPage convoyId={convoyId} />}
    </DashboardLayout>
  );
};

function App() {
  const { isAuthenticated, userRole, login, logout } = useAuth();

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Dashboard logout={logout} isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/login/:role" element={<Login login={login} isAuthenticated={isAuthenticated} userRole={userRole} />} />
        
        {/* Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin">
            <AdminPage logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/admin/units" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin">
            <AdminUnits logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/admin/warehouses" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin">
            <AdminWarehouses logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/admin/convoys" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="admin">
            <AdminConvoys logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/unit" element={<UnitPage logout={logout} />} />
        <Route path="/warehouse" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="warehouse">
            <WarehousePage logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/warehouse/products" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="warehouse">
            <WarehouseProductsPage logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/warehouse/units" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="warehouse">
            <WarehouseUnitsPage logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/convoy" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="convoy">
            <ConvoyPage logout={logout} />
          </ProtectedRoute>
        } />
        <Route path="/convoy/jobs" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} userRole={userRole} requiredRole="convoy">
            <ConvoyPage logout={logout}>
              <ConvoyJobsPage convoyId={JSON.parse(sessionStorage.getItem('biowin_convoy_data') || '{}').convoyId} />
            </ConvoyPage>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
