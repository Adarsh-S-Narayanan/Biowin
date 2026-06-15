import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Package, Send, CheckSquare, ChevronDown, ChevronUp, Plus, Edit2, AlertTriangle, X, Navigation } from 'lucide-react';
import './ConvoyDashboardPage.css';

const ConvoyDashboardPage = ({ convoyId }) => {
  const [requests, setRequests] = useState([]);
  const [globalProducts, setGlobalProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUnits, setExpandedUnits] = useState({});
  const [confirmDispatch, setConfirmDispatch] = useState(null); // unitName
  
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  // Local state for inline editing and adding
  const [editingRequest, setEditingRequest] = useState(null); // requestId
  const [editQuantity, setEditQuantity] = useState('');
  const [addingToUnit, setAddingToUnit] = useState(null); // unitName
  const [newProductSelected, setNewProductSelected] = useState('');
  const [newProductQty, setNewProductQty] = useState('');

  useEffect(() => {
    fetchUnits();
    fetchRequests();
    fetchGlobalProducts();
    if (convoyId) {
      fetchActiveJobs();
    }
  }, [convoyId]);

  const fetchUnits = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/units');
      const data = await res.json();
      if (data.success) {
        setUnits(data.units);
        const uniqueReg = [...new Set(data.units.map(u => u.region).filter(Boolean))];
        setRegions(uniqueReg);
      }
    } catch (err) {
      console.error("Error fetching units:", err);
    }
  };

  const fetchActiveJobs = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/convoys/${convoyId}/jobs`);
      const data = await res.json();
      if (data.success) {
        const startedJobs = data.jobs.filter(j => j.status === 'Started');
        setActiveJobs(startedJobs);
        if (startedJobs.length > 0) {
          setSelectedJobId(startedJobs[0].jobId);
        }
      }
    } catch (err) {
      console.error("Error fetching active jobs:", err);
    }
  };

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

  const handleStartJob = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/convoys/${convoyId}/jobs`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchActiveJobs();
      }
    } catch (err) {
      console.error("Error starting job:", err);
    }
  };

  const handleCancelJob = async () => {
    if (!selectedJobId) return;
    if (!window.confirm("Are you sure you want to end this job and revert any pending dispatches back to 'Pending'?")) return;
    
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/convoys/${convoyId}/jobs/${selectedJobId}/cancel`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setSelectedJobId('');
        fetchActiveJobs();
        fetchRequests();
      } else {
        alert(data.message || "Failed to cancel job");
      }
    } catch (err) {
      console.error("Error cancelling job:", err);
    }
  };

  const toggleExpand = (unitName) => {
    setExpandedUnits(prev => ({ ...prev, [unitName]: !prev[unitName] }));
  };

  const handleUpdateQuantity = async (requestId) => {
    if (!editQuantity || isNaN(editQuantity) || Number(editQuantity) < 0) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: Number(editQuantity) })
      });
      const data = await res.json();
      if (data.success) {
        setEditingRequest(null);
        fetchRequests();
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleAddProduct = async (unitId, unitName) => {
    if (!newProductSelected || !newProductQty || Number(newProductQty) <= 0) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/units/${unitId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: newProductSelected, quantity: Number(newProductQty) })
      });
      const data = await res.json();
      if (data.success) {
        setAddingToUnit(null);
        setNewProductSelected('');
        setNewProductQty('');
        fetchRequests();
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const executeDispatch = async (unitId) => {
    if (!selectedJobId) {
      alert("Please select an active job first. If you don't have one, start one.");
      return;
    }
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/convoys/units/${unitId}/dispatch`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ convoyId, jobId: selectedJobId })
      });
      const data = await res.json();
      if (data.success) {
        setConfirmDispatch(null);
        fetchRequests();
      } else {
        alert(data.message || "Failed to dispatch");
      }
    } catch (err) {
      console.error("Error dispatching:", err);
    }
  };

  const hasActiveJob = activeJobs.length > 0;

  // Map unitId -> region
  const unitRegionMap = {};
  units.forEach(u => {
    unitRegionMap[u.unitId] = u.region;
  });

  // Filter requests by selected region
  const filteredRequests = selectedRegion && hasActiveJob
    ? requests.filter(r => unitRegionMap[r.unitId] === selectedRegion)
    : [];

  // Group requests by Unit Name
  const groupedRequests = filteredRequests.reduce((acc, req) => {
    if (!acc[req.unitName]) {
      acc[req.unitName] = { unitId: req.unitId, items: [] };
    }
    acc[req.unitName].items.push(req);
    return acc;
  }, {});

  return (
    <div className="convoy-dashboard relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 m-0 flex items-center gap-3">
          <Truck className="text-spice-dark" size={32} />
          Orders
        </h1>
        <p className="text-slate-500 mt-2">Manage dispatch and delivery of unit stock requests in batches</p>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex-1 w-full max-w-md">
          <label className="block text-sm font-bold text-slate-600 mb-2">Requests in your region</label>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-spice-dark"
          >
            <option value="">Select a Region</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        
        <div>
          {!hasActiveJob ? (
            <button 
              onClick={handleStartJob}
              className="bg-spice-dark hover:bg-spice-darker text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer border-0"
            >
              <Navigation size={18} /> Start Job
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-blue-200">
                <CheckCircle size={18} /> Active Job #{selectedJobId} In Progress
              </div>
              <button 
                onClick={handleCancelJob}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer border border-red-200"
                title="End current job and revert pending dispatches"
              >
                End Job
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">Loading requests...</div>
      ) : (!hasActiveJob || !selectedRegion) ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Requests to Display</h3>
          <p className="text-slate-500 mt-2">
            {!hasActiveJob ? "Start a job to begin processing orders." : "Select a region to view its pending requests."}
          </p>
        </div>
      ) : Object.keys(groupedRequests).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No Pending Requests</h3>
          <p className="text-slate-500 mt-2">All unit requests in {selectedRegion} have been fulfilled.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 max-w-5xl">
          {Object.entries(groupedRequests).map(([unitName, unitGroup]) => {
            const { unitId, items } = unitGroup;
            const isExpanded = !!expandedUnits[unitName];
            
            const pendingItems = items.filter(r => r.status === 'Pending');
            const dispatchedItems = items.filter(r => r.status === 'Dispatched');
            const deliveredItems = items.filter(r => r.status === 'Delivered');
            
            const hasPending = pendingItems.length > 0;
            const hasDispatched = dispatchedItems.length > 0;
            const isFullyDelivered = items.every(r => r.status === 'Delivered');

            return (
              <div key={unitName} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header (Always Visible) */}
                <div 
                  className="bg-white hover:bg-slate-50 px-6 py-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  onClick={() => toggleExpand(unitName)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${isFullyDelivered ? 'bg-emerald-100 text-emerald-600' : hasDispatched ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                      {isFullyDelivered ? <CheckCircle size={24} /> : hasDispatched ? <Truck size={24} /> : <Package size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 m-0">{unitName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 font-medium">
                        <span>Total Items: {items.length}</span>
                        <span>•</span>
                        {hasPending && <span className="text-amber-600">{pendingItems.length} Pending</span>}
                        {hasDispatched && <span className="text-blue-600">{dispatchedItems.length} In Transit</span>}
                        {deliveredItems.length > 0 && <span className="text-emerald-600">{deliveredItems.length} Delivered</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Top Level Action Buttons */}
                    {hasPending && (
                       <button 
                         onClick={(e) => { e.stopPropagation(); setConfirmDispatch(unitName); }}
                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm cursor-pointer border-0"
                       >
                         <Send size={16} /> Dispatch Pending
                       </button>
                    )}
                    
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content: Checklist and Editing */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-100 p-6">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Request Checklist</h4>
                    
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-inner">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                            <th className="p-3 font-bold">Product</th>
                            <th className="p-3 font-bold text-right">Quantity</th>
                            <th className="p-3 font-bold text-center">Status</th>
                            <th className="p-3 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {items.map(req => {
                            const isPending = req.status === 'Pending';
                            const isEditing = editingRequest === req.requestId;
                            
                            return (
                              <tr key={req.requestId} className="hover:bg-slate-50/50">
                                <td className="p-3 font-semibold text-slate-800">
                                  {req.productName}
                                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">#{req.requestId}</div>
                                </td>
                                <td className="p-3 text-right">
                                  {isEditing ? (
                                    <input 
                                      type="number"
                                      min="0"
                                      className="w-20 px-2 py-1 border border-slate-300 rounded text-right focus:outline-none focus:border-spice-dark"
                                      value={editQuantity}
                                      onChange={(e) => setEditQuantity(e.target.value)}
                                      autoFocus
                                    />
                                  ) : (
                                    <span className="font-bold text-slate-700">{req.quantity}</span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                    isPending ? 'bg-amber-100 text-amber-800' : 
                                    req.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {req.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  {isPending && (
                                    isEditing ? (
                                      <div className="flex justify-end gap-2">
                                        <button onClick={() => handleUpdateQuantity(req.requestId)} className="text-xs bg-emerald-500 text-white px-2 py-1 rounded font-bold border-0 cursor-pointer hover:bg-emerald-600">Save</button>
                                        <button onClick={() => setEditingRequest(null)} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold border-0 cursor-pointer hover:bg-slate-300">Cancel</button>
                                      </div>
                                    ) : (
                                      <button 
                                        onClick={() => { setEditingRequest(req.requestId); setEditQuantity(req.quantity.toString()); }}
                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors border-0 cursor-pointer bg-transparent"
                                        title="Edit Quantity"
                                      >
                                        <Edit2 size={14} />
                                      </button>
                                    )
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          
                          {/* Add Product Row */}
                          {hasPending && (
                            <tr className="bg-orange-50/30">
                              <td colSpan="4" className="p-3">
                                {addingToUnit === unitName ? (
                                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-200 shadow-sm">
                                    <div className="flex-1">
                                      <select 
                                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-spice-dark"
                                        value={newProductSelected}
                                        onChange={(e) => setNewProductSelected(e.target.value)}
                                      >
                                        <option value="">-- Select Product --</option>
                                        {globalProducts.map(p => (
                                          <option key={p.productId} value={p.productId}>{p.name} (₹{p.price})</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="w-24">
                                      <input 
                                        type="number"
                                        placeholder="Qty"
                                        min="1"
                                        className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-spice-dark text-right"
                                        value={newProductQty}
                                        onChange={(e) => setNewProductQty(e.target.value)}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleAddProduct(unitId, unitName)}
                                        className="bg-spice-dark hover:bg-spice-darker text-white px-3 py-1.5 rounded text-sm font-bold border-0 cursor-pointer transition-colors"
                                      >
                                        Add
                                      </button>
                                      <button 
                                        onClick={() => setAddingToUnit(null)}
                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm font-bold border-0 cursor-pointer transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setAddingToUnit(unitName)}
                                    className="flex items-center gap-1.5 text-sm font-bold text-spice-dark hover:text-spice-darker bg-transparent border-0 cursor-pointer w-full text-left"
                                  >
                                    <Plus size={16} /> Add Product to Pending Dispatch
                                  </button>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                {/* Confirmation Popup for this unit */}
                {confirmDispatch === unitName && (
                  <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-10 p-4 rounded-xl">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 max-w-md w-full">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-100 p-3 rounded-full text-amber-600 flex-shrink-0">
                          <AlertTriangle size={24} />
                        </div>
                        <div className="w-full">
                          <h3 className="text-lg font-bold text-slate-800 m-0">Confirm Dispatch</h3>
                          <p className="text-slate-600 mt-2 mb-4 text-sm">
                            You are about to dispatch {pendingItems.length} pending items to <strong>{unitName}</strong>.
                          </p>
                          
                          <div className="mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Active Job</label>
                            {activeJobs.length === 0 ? (
                              <p className="text-red-500 text-sm font-medium m-0">No active jobs found. Please start a new job first.</p>
                            ) : (
                              <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-spice-dark"
                                value={selectedJobId}
                                onChange={(e) => setSelectedJobId(e.target.value)}
                              >
                                {activeJobs.map(job => (
                                  <option key={job.jobId} value={job.jobId}>Job #{job.jobId} (Started: {new Date(job.createdAt).toLocaleDateString()})</option>
                                ))}
                              </select>
                            )}
                          </div>

                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => setConfirmDispatch(null)}
                              className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border-0 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => executeDispatch(unitId)}
                              disabled={activeJobs.length === 0 || !selectedJobId}
                              className={`px-4 py-2 rounded-lg font-bold text-white transition-colors border-0 flex items-center gap-2 ${
                                activeJobs.length === 0 || !selectedJobId 
                                ? 'bg-slate-300 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-sm'
                              }`}
                            >
                              <Send size={16} /> Yes, Dispatch
                            </button>
                          </div>
                        </div>
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

export default ConvoyDashboardPage;
