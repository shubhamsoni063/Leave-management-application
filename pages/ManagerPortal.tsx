
import React, { useState } from 'react';
import { LeaveRequest, LeaveStatus } from '../types';
import { Calendar, User, Clock, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ManagerPortalProps {
  requests: LeaveRequest[];
  onUpdate: (id: string, status: LeaveStatus) => void;
}

const ManagerPortal: React.FC<ManagerPortalProps> = ({ requests, onUpdate }) => {
  const [filter, setFilter] = useState<LeaveStatus | 'ALL'>(LeaveStatus.PENDING);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRequests = requests.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['ALL', LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filter === s 
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {s === 'ALL' ? 'All Requests' : s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No requests found</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div 
              key={req.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {req.employeeName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">{req.employeeName}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{req.type} • {req.duration} Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    req.status === LeaveStatus.APPROVED ? 'bg-green-100 text-green-600' :
                    req.status === LeaveStatus.REJECTED ? 'bg-red-100 text-red-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {req.status}
                  </span>
                  {expandedId === req.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expandedId === req.id && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="pt-2 border-t border-gray-50 space-y-3">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar size={14} />
                        <span>{new Date(req.fromDate).toLocaleDateString()} - {new Date(req.toDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-700 italic border border-gray-100">
                      "{req.reason}"
                    </div>
                    
                    {req.status === LeaveStatus.PENDING && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => onUpdate(req.id, LeaveStatus.REJECTED)}
                          className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          <X size={14} /> Reject
                        </button>
                        <button
                          onClick={() => onUpdate(req.id, LeaveStatus.APPROVED)}
                          className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                        >
                          <Check size={14} /> Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerPortal;
