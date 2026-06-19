import React, { useState, useEffect } from 'react';
import { MapPin, Package, ArrowLeft, Layers, AlertTriangle, Search } from 'lucide-react';
import './WarehouseUnitsPage.css';

const UnitStockView = ({ unit, onBack }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/units/${unit.unitId}/products`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error fetching unit stock", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [unit.unitId]);

  return (
    <div className="warehouse-units-page">
      <div className="stock-view-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={18} /> Back to Units
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 m-0 flex items-center gap-2">
            <Layers className="text-blue-500" />
            {unit.name}
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-md ml-2 border border-slate-200">
              #{unit.unitId}
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
            <MapPin size={14} /> {unit.region} - {unit.address}
          </p>
        </div>
      </div>

      <div className="stock-container">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading stock data...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU / ID</th>
                  <th>Current Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.productId}>
                    <td className="font-medium text-slate-700">{p.name}</td>
                    <td className="text-slate-500 font-mono text-xs">{p.productId}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${p.quantity < 15 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.quantity} Units
                        {p.quantity < 15 && <AlertTriangle size={12} />}
                      </span>
                    </td>
                    <td className="text-slate-600">₹{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Package size={48} />
            </div>
            <h3>No Stock Available</h3>
            <p>This unit currently has no inventory assigned to it.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WarehouseUnitsPage = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/units`);
        const data = await res.json();
        if (data.success) {
          setUnits(data.units);
        }
      } catch (err) {
        console.error("Error fetching units", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const regions = ['All', ...new Set(units.map(u => u.region || 'Unknown').filter(Boolean))];
  
  const filteredUnits = selectedRegion === 'All' 
    ? units 
    : units.filter(u => (u.region || 'Unknown') === selectedRegion);

  if (selectedUnit) {
    return <UnitStockView unit={selectedUnit} onBack={() => setSelectedUnit(null)} />;
  }

  return (
    <div className="warehouse-units-page">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 m-0">Regional Units</h1>
        <p className="text-slate-500 mt-1">View all connected units across regions and inspect their local stock.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-500">
          Loading units...
        </div>
      ) : (
        <>
          {units.length > 0 && (
            <div className="region-selector">
              <div className="region-tabs">
                {regions.map(region => (
                  <button
                    key={region}
                    className={`region-tab ${selectedRegion === region ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredUnits.length > 0 ? (
            <div className="units-grid">
              {filteredUnits.map(unit => (
                <div key={unit.unitId} className="unit-card">
                  <div className="unit-card-header">
                    <div className="unit-icon-wrapper">
                      <Layers size={24} />
                    </div>
                    <span className={`unit-status ${unit.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                      {unit.status || 'Active'}
                    </span>
                  </div>
                  
                  <div className="unit-info">
                    <h3>{unit.name}</h3>
                    <p className="mb-1"><MapPin size={14} /> {unit.region || 'No Region'}</p>
                    <p className="text-xs">{unit.address || 'No address provided'}</p>
                  </div>
                  
                  <div className="unit-actions">
                    <button 
                      className="view-stock-btn"
                      onClick={() => setSelectedUnit(unit)}
                    >
                      <Package size={16} /> View Unit Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search size={48} />
              </div>
              <h3>No Units Found</h3>
              <p>There are currently no units available in this region.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WarehouseUnitsPage;
