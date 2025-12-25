
import React, { useState } from 'react';
import { LeaveBalance, LeaveRequest, LeaveType } from '../types';
import { Settings, FileText, Download, Filter, Plus, Edit2, Trash2, PieChart as PieIcon } from 'lucide-react';

interface AdminPortalProps {
  policies: LeaveBalance[];
  requests: LeaveRequest[];
}

const AdminPortal: React.FC<AdminPortalProps> = ({ policies, requests }) => {
  const [activeView, setActiveView] = useState<'policies' | 'reports'>('policies');

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white p-1 rounded-2xl border border-gray-200 flex shadow-sm">
        <button
          onClick={() => setActiveView('policies')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeView === 'policies' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          Leave Policies
        </button>
        <button
          onClick={() => setActiveView('reports')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeView === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          Reports
        </button>
      </div>

      {activeView === 'policies' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Leave Types</h3>
            <button className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {policies.map((policy) => (
              <div key={policy.type} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{policy.type} Leave</h4>
                  <p className="text-xs text-gray-500">Max Limit: {policy.total} Days</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <h4 className="text-xs font-bold text-blue-700 uppercase mb-2">Global Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs text-gray-700">
                <span>Enable Carry-forward</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
              </label>
              <label className="flex items-center justify-between text-xs text-gray-700">
                <span>Auto-approve Sick Leave</span>
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Leave Usage Report</h3>
            <div className="flex gap-2">
              <button className="bg-white border border-gray-200 p-2 rounded-lg text-gray-600">
                <Filter size={16} />
              </button>
              <button className="bg-white border border-gray-200 p-2 rounded-lg text-gray-600">
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{req.employeeName}</td>
                    <td className="px-4 py-3 text-gray-600">{req.type}</td>
                    <td className="px-4 py-3 text-gray-800 font-bold">{req.duration}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        req.status === 'Approved' ? 'text-green-600 bg-green-50' : 
                        req.status === 'Rejected' ? 'text-red-600 bg-red-50' : 'text-orange-600 bg-orange-50'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <PieIcon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Absence This Month</p>
              <p className="text-xl font-bold text-gray-800">42 Days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
