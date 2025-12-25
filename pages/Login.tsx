
import React, { useState, useEffect } from 'react';
import { Role, User, LeaveType } from '../types';
import { 
  Shield, Lock, Calendar, AlertCircle, ArrowRight, 
  Sparkles, Copy, Check, QrCode, Info, ExternalLink,
  HelpCircle, ChevronRight, Share2, Globe, Laptop, Smartphone
} from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
    // HEAVILY SANITIZED URL DETECTION
    // This prevents the "googhttps" DNS error by ensuring a clean protocol and hostname
    let cleanUrl = window.location.href;
    
    // 1. Remove query params and hashes
    cleanUrl = cleanUrl.split('?')[0].split('#')[0];
    
    // 2. Remove common file suffixes that cause 404s in cloud previews
    if (cleanUrl.endsWith('index.html')) {
      cleanUrl = cleanUrl.replace('index.html', '');
    }
    
    // 3. Ensure no trailing slashes for cleaner QR/Sharing
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }

    setAppUrl(cleanUrl);
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

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(appUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LeaveMaster Pro',
          text: 'Open the Leave Management app on your mobile:',
          url: appUrl,
        });
      } catch (err) {
        copyUrlToClipboard();
      }
    } else {
      copyUrlToClipboard();
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`;

  return (
    <div className="min-h-screen relative overflow-y-auto flex flex-col items-center py-10 px-6 max-w-md mx-auto bg-slate-50">
      {/* Visual background */}
      <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[100px] opacity-10 floating" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[250px] h-[250px] bg-purple-500 rounded-full blur-[80px] opacity-10 floating" style={{ animationDelay: '2s' }} />

      <div className="w-full z-10 space-y-8">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[28px] shadow-2xl shadow-indigo-200 flex items-center justify-center mx-auto transform -rotate-6 transition-transform hover:rotate-0 duration-500">
              <Shield className="text-white" size={36} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">LeaveMaster Pro</h1>
        </div>

        {/* Diagnostic Link Check (Desktop Only) */}
        <div className="bg-indigo-900 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-100 flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Smartphone size={20} className="text-indigo-200" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
              <h3 className="text-sm font-bold">Mobile Sync Ready</h3>
            </div>
          </div>
          <a 
            href={appUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-indigo-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            Test Link <ExternalLink size={10} />
          </a>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-white space-y-6">
          <form onSubmit={handleSignIn} className="space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[11px] font-bold flex items-center gap-3 border border-rose-100 animate-bounce">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Identity Code</label>
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                placeholder="EMP101"
                className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-4 rounded-[22px] font-black shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        {/* Mobile Setup */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col items-center gap-6">
            <div className="p-3 bg-white rounded-3xl border-2 border-slate-50 shadow-inner">
              <img src={qrUrl} alt="QR Code" className="w-36 h-36 opacity-100" />
            </div>

            <div className="w-full space-y-3">
              <button 
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-4 rounded-[22px] border border-indigo-100 hover:bg-indigo-100 transition-all font-black text-[11px] uppercase tracking-widest"
              >
                <Share2 size={16} /> Share Link to Phone
              </button>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Verify URL Logic:</p>
                <code className="text-[9px] block break-all text-indigo-500 font-mono font-bold">
                  {appUrl}
                </code>
              </div>
            </div>

            {/* Troubleshooting */}
            <button 
              onClick={() => setShowTroubleshoot(!showTroubleshoot)}
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              <HelpCircle size={14} /> Fix DNS/404 Errors <ChevronRight size={14} className={showTroubleshoot ? 'rotate-90' : ''} />
            </button>

            {showTroubleshoot && (
              <div className="bg-amber-50 rounded-[28px] p-6 border border-amber-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-amber-900 mb-1">Fixing "Site Can't Be Reached"</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      If your phone says `NXDOMAIN` or `googhttps`, your browser is adding "https" to the domain name by mistake.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2 border-t border-amber-200">
                  <p className="text-[10px] font-black text-amber-900 uppercase tracking-wider">Solution:</p>
                  <ol className="text-[11px] text-amber-800 space-y-2 list-decimal list-inside font-semibold">
                    <li>Copy the link above using the Share button.</li>
                    <li>Open <b>Google Chrome</b> on Android.</li>
                    <li>Paste the link into the address bar.</li>
                    <li><b>Crucial:</b> If Chrome asks "Did you mean...", click the correct link without "https" at the end.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">Skyway Techno Solutions</p>
      </div>
    </div>
  );
};

export default Login;
