
import React, { useState } from 'react';
import { Calendar, Sparkles, Loader2, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { User, LeaveType, LeaveRequest } from '../types';
import { GoogleGenAI } from '@google/genai';

interface ApplyLeaveProps {
  user: User;
  onSubmit: (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => void;
}

const ApplyLeave: React.FC<ApplyLeaveProps> = ({ user, onSubmit }) => {
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.CASUAL);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const calculateDuration = () => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fromDate || !toDate || !reason) {
      setError('Please fill in all required fields');
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      setError('Invalid date range selected');
      return;
    }

    const balance = user.balances.find(b => b.type === leaveType);
    
    if (balance && (balance.total - balance.used) < duration) {
      setError(`Insufficient ${leaveType} balance. You have ${balance.total - balance.used} days left.`);
      return;
    }

    onSubmit({
      employeeId: user.id,
      employeeName: user.name,
      type: leaveType,
      fromDate,
      toDate,
      reason,
      duration
    });
  };

  const generateAIReason = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short, professional, and convincing reason for a ${leaveType} leave application. 
                  Maximum 12 words. Direct answer only.`,
      });
      if (response.text) {
        setReason(response.text.trim());
      }
    } catch (err) {
      setError('AI assistant unavailable. Please type manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
      <div className="bg-white rounded-[44px] p-8 shadow-2xl shadow-indigo-100/50 border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 mb-8 px-1">New Application</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-5 rounded-[28px] text-xs font-bold flex items-start gap-3 border border-rose-100 animate-shake">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-2">Leave Category</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(LeaveType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLeaveType(type)}
                  className={`py-4 px-4 rounded-[22px] text-xs font-bold transition-all border ${
                    leaveType === type 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-[1.03] z-10' 
                      : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-2">From</label>
              <div className="relative group">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[22px] py-4 px-5 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-2">To</label>
              <div className="relative group">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[22px] py-4 px-5 text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Reason / Notes</label>
              <button 
                type="button"
                onClick={generateAIReason}
                disabled={isGenerating}
                className="text-[10px] flex items-center gap-1.5 text-indigo-600 font-black uppercase tracking-wider hover:text-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-amber-500" />}
                Smart Fill
              </button>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly explain the purpose..."
              className="w-full bg-slate-50 border border-slate-100 rounded-[28px] p-5 text-xs font-semibold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none min-h-[120px] resize-none placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-[28px] font-black shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Submit Request</span>
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
