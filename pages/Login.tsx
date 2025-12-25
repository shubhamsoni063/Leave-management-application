
import React, { useState, useEffect } from 'react';
import { Role, User, LeaveType } from '../types';
import { 
  Shield, AlertCircle, ArrowRight, Copy, Check, 
  HelpCircle, ChevronRight, Share2, Smartphone,
  ExternalLink, Laptop, Info, Monitor
} from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [employeeCode, setEmployeeCode] = useState('EMP101');
  const [dob, setDob] = useState('1990-01-01');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const [view, setView] = useState<'sync' | 'login'>('sync');

  useEffect(() => {
    // FOOLPROOF URL SANITIZATION
    let raw = window.location.href.split('?')[0].split('#')[0];
    
    // 1. Remove common malformations like "googhttps" or "googindex.html"
    // This regex looks for the protocol string being appended to the end of the domain
    let clean = raw.replace(/(https?|index\.html|\/)+$/, '');
    
    // 2. Ensure it starts with https
    if (!clean.startsWith('http')) {
      clean = 'https://' + clean;
    }

    setAppUrl(clean);
    
    // Auto-detect if we are already "inside" the app (e.g. mobile or direct)
    // to skip the sync screen if preferred
    if (window.innerWidth < 768) {
      setView('login');
    }
  }, []);

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
        setError('Verification failed. Invalid code or DOB.');
        setLoading(false);
      }
    }, 800);
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // QR Code URL - strictly encoded with the clean URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl)}`;

  if (view === 'sync') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="w-full max-w-sm space-y-8 z-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-200 flex items-center justify-center mx-auto transform -rotate-6">
              <Smartphone className="text-white" size={36} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Mobile Sync</h1>
            <p className="text-slate-500 text-sm font-medium px-4">
              Scan the QR code to open the LeaveMaster Pro Android application on your phone.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-200 border border-white flex flex-col items-center gap-6">
            <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
              <img src={qrUrl} alt="Scan me" className="w-44 h-44" />
            </div>

            <div className="w-full space-y-3">
              <button 
                onClick={copyUrlToClipboard}
                className="w-full py-4 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-[11px] uppercase tracking-widest border border-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Link Copied' : 'Copy Clean Link'}
              </button>
              
              <button 
                onClick={() => setView('login')}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Monitor size={16} /> Use on Desktop
              </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100">
            <div className="flex gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-black text-amber-900 uppercase">DNS Fix</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  If you see <b>"googhttps"</b> error on your phone: Tapping the address bar and deleting the word <b>"https"</b> from the end of the address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-6 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
      
      <div className="w-full z-10 space-y-10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Sign In</h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Skyway Techno Solutions</p>
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-white">
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[11px] font-bold flex items-center gap-3 border border-rose-100">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Employee ID</label>
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="EMP101"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Enter Dashboard</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        <button 
          onClick={() => setView('sync')}
          className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors py-4 text-[10px] font-black uppercase tracking-widest"
        >
          <Smartphone size={14} /> Switch to Mobile Sync
        </button>

        <p className="text-center text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] pt-10">LeaveMaster v1.0</p>
      </div>
    </div>
  );
};

export default Login;
