
import React, { useState } from 'react';
import { Role, User, LeaveType } from '../types';
import { Shield, Lock, Calendar, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mockUsers: User[] = [
    {
      id: 'EMP001',
      employeeCode: 'EMP101',
      dob: '1990-01-01',
      name: 'Mahak Panjwani',
      email: 'mahak@company.com',
      role: Role.EMPLOYEE,
      balances: [
        { type: LeaveType.CASUAL, total: 12, used: 2 },
        { type: LeaveType.SICK, total: 10, used: 1 },
        { type: LeaveType.EARNED, total: 20, used: 5 },
        { type: LeaveType.SPECIAL, total: 5, used: 0 },
        { type: LeaveType.EMERGENCY, total: 3, used: 0 }
      ]
    },
    {
      id: 'MGR001',
      employeeCode: 'MGR201',
      dob: '1985-05-15',
      name: 'Yashika Sharma',
      email: 'yashika@company.com',
      role: Role.MANAGER,
      balances: [
        { type: LeaveType.CASUAL, total: 12, used: 1 },
        { type: LeaveType.SICK, total: 10, used: 0 },
        { type: LeaveType.EARNED, total: 20, used: 2 },
        { type: LeaveType.SPECIAL, total: 5, used: 0 },
        { type: LeaveType.EMERGENCY, total: 3, used: 0 }
      ]
    },
    {
      id: 'HR001',
      employeeCode: 'HR301',
      dob: '1988-10-20',
      name: 'Admin User',
      email: 'hr@company.com',
      role: Role.HR,
      balances: [
        { type: LeaveType.CASUAL, total: 12, used: 0 },
        { type: LeaveType.SICK, total: 10, used: 0 },
        { type: LeaveType.EARNED, total: 20, used: 0 },
        { type: LeaveType.SPECIAL, total: 5, used: 0 },
        { type: LeaveType.EMERGENCY, total: 3, used: 0 }
      ]
    }
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const foundUser = mockUsers.find(
        (u) => u.employeeCode.toUpperCase() === employeeCode.toUpperCase() && u.dob === dob
      );

      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('Verification failed. Check your credentials.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="h-screen relative overflow-hidden flex flex-col items-center justify-center p-8 max-w-md mx-auto bg-slate-50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[100px] opacity-20 floating" />
      <div className="absolute bottom-[-5%] left-[-20%] w-[250px] h-[250px] bg-purple-500 rounded-full blur-[80px] opacity-20 floating" style={{ animationDelay: '2s' }} />

      <div className="w-full z-10 space-y-10">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[28px] shadow-2xl shadow-indigo-200 flex items-center justify-center mx-auto transform -rotate-6 transition-transform hover:rotate-0 duration-500">
              <Shield className="text-white" size={36} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 p-1.5 rounded-full border-4 border-slate-50 floating">
              <Sparkles size={12} className="text-amber-900" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="text-slate-500 font-medium mt-1">Sign in to your workplace portal</p>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm flex items-center gap-3 border border-rose-100 animate-bounce">
              <AlertCircle size={18} />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-2">Employee Identity</label>
            <div className="relative group">
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="Code (e.g. EMP101)"
                className="w-full glass bg-white border-slate-200 rounded-3xl py-5 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold placeholder:text-slate-400 placeholder:font-normal"
              />
              <div className="absolute right-4 inset-y-0 flex items-center text-slate-300">
                <Lock size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest px-2">Date of Birth</label>
            <div className="relative group">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full glass bg-white border-slate-200 rounded-3xl py-5 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-semibold"
              />
              <div className="absolute right-4 inset-y-0 flex items-center text-slate-300">
                <Calendar size={18} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-[28px] font-bold shadow-xl shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Portal</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="pt-10 flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Developed by Skyway Techno Solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
