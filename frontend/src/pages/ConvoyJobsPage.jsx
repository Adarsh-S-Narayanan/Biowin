import React, { useState, useEffect } from 'react';
import { Briefcase, Navigation, FileText, CheckCircle, Package, History } from 'lucide-react';

const ConvoyJobsPage = ({ convoyId }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (convoyId) {
      fetchJobs();
    }
  }, [convoyId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/convoys/${convoyId}/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeliver = async (jobId, unitId) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/convoys/${convoyId}/jobs/${jobId}/deliveries/${unitId}/deliver`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        fetchJobs();
      } else {
        alert(data.message || "Failed to mark delivered");
      }
    } catch (err) {
      console.error("Error marking delivered:", err);
    }
  };

  const activeJobs = jobs.filter(j => j.status === 'Started');
  const pastJobs = jobs.filter(j => j.status === 'Completed');

  return (
    <div className="relative">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 m-0 flex items-center gap-3">
            <Briefcase className="text-spice-dark" size={32} />
            Convoy Jobs
          </h1>
          <p className="text-slate-500 mt-2">Manage multiple ongoing physical transport jobs and view history.</p>
        </div>

      </div>

      {isLoading ? (
        <div className="text-center py-10 text-slate-500">Loading jobs...</div>
      ) : (
        <div className="flex flex-col gap-10">
          {/* Active Jobs */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              Ongoing Jobs ({activeJobs.length})
            </h2>
            {activeJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                <p className="text-slate-500 m-0">No active jobs. Start one above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeJobs.map(job => (
                  <div key={job.jobId} className="bg-white rounded-xl shadow-sm border border-blue-100 flex flex-col overflow-hidden">
                    <div className="p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Active</span>
                          <h3 className="font-bold text-lg text-slate-800 mt-2 mb-0">Job #{job.jobId}</h3>
                        </div>
                        <Package className="text-slate-300" size={24} />
                      </div>
                      <p className="text-sm text-slate-500 m-0">Started: {new Date(job.createdAt).toLocaleString()}</p>
                    </div>
                    
                    {job.deliveries && job.deliveries.length > 0 && (
                      <div className="bg-slate-50 border-t border-slate-100 p-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delivery Route</h4>
                        <div className="divide-y divide-slate-200">
                          {job.deliveries.map((delivery, idx) => (
                            <div key={`${job.jobId}-${delivery.unitId}`} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-slate-400">{idx + 1}.</span>
                                  <span className="font-bold text-slate-800 text-sm">{delivery.unitName}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 mb-0 ml-5">{delivery.items.length} product(s) to drop off</p>
                              </div>
                              <div className="ml-5 sm:ml-0">
                                {delivery.status === 'Pending' ? (
                                  <button 
                                    onClick={() => handleDeliver(job.jobId, delivery.unitId)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold border-0 cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                                  >
                                    <CheckCircle size={14} /> Deliver
                                  </button>
                                ) : (
                                  <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                                    <CheckCircle size={14} /> Delivered
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(!job.deliveries || job.deliveries.length === 0) && (
                      <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                        <p className="text-xs text-slate-500 m-0 italic">No deliveries assigned to this job yet.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Past Jobs */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History size={20} className="text-slate-500" />
              Job History
            </h2>
            {pastJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
                <p className="text-slate-500 m-0">No completed jobs yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                      <th className="p-4 font-bold">Job ID</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Date Started</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pastJobs.map(job => (
                      <tr key={job.jobId} className="hover:bg-slate-50">
                        <td className="p-4 font-bold text-slate-800">#{job.jobId}</td>
                        <td className="p-4">
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-bold text-xs flex items-center gap-1 w-fit">
                            <CheckCircle size={12} /> {job.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">{new Date(job.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default ConvoyJobsPage;
