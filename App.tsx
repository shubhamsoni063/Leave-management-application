
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  PlusSquare, 
  CheckCircle, 
  Settings, 
  LogOut, 
  Menu,
  LayoutDashboard
} from 'lucide-react';
import { Role, LeaveStatus, LeaveType, User, LeaveRequest, LeaveBalance } from './types';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import ManagerPortal from './pages/ManagerPortal';
import AdminPortal from './pages/AdminPortal';
import Login from './pages/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leavePolicies, setLeavePolicies] = useState<LeaveBalance[]>([
    { type: LeaveType.CASUAL, total: 12, used: 2 },
    { type: LeaveType.SICK, total: 10, used: 1 },
    { type: LeaveType.EARNED, total: 20, used: 5 },
    { type: LeaveType.SPECIAL, total: 5, used: 0 },
    { type: LeaveType.EMERGENCY, total: 3, used: 0 }
  ]);

  useEffect(() => {
    const initialRequests: LeaveRequest[] = [
      {
        id: '1',
        employeeName: 'Mahak Panjwani',
        employeeId: 'EMP001',
        type: LeaveType.SICK,
        fromDate: '2025-09-29',
        toDate: '2025-09-29',
        reason: 'Severe migraine and high fever',
        status: LeaveStatus.PENDING,
        duration: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        employeeName: 'John Doe',
        employeeId: 'EMP002',
        type: LeaveType.CASUAL,
        fromDate: '2025-10-05',
        toDate: '2025-10-06',
        reason: 'Attending family wedding ceremony',
        status: LeaveStatus.APPROVED,
        duration: 2,
        createdAt: new Date().toISOString()
      }
    ];
    setRequests(initialRequests);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const addRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: Math.random().toString(36).substr(2, 9),
      status: LeaveStatus.PENDING,
      createdAt: new Date().toISOString(),
    };
    setRequests([newReq, ...requests]);
    setActiveTab('home');
  };

  const updateRequestStatus = (id: string, status: LeaveStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    
    if (status === LeaveStatus.APPROVED && currentUser) {
      const approvedReq = requests.find(r => r.id === id);
      if (approvedReq) {
        setCurrentUser(prev => {
          if (!prev) return null;
          const updatedBalances = prev.balances.map(b => 
            b.type === approvedReq.type ? { ...b, used: b.used + approvedReq.duration } : b
          );
          return { ...prev, balances: updatedBalances };
        });
      }
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-50 overflow-hidden shadow-2xl relative">
      {/* Catchy Header */}
      <header className="bg-white/80 backdrop-blur-md px-8 py-6 flex justify-between items-center shrink-0 z-40 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-[20px] shadow-lg shadow-indigo-100 transform rotate-6 scale-90">
            <LayoutDashboard size={18} strokeWidth={2.5} />
          </div>
          <span className="font-black text-slate-900 tracking-tighter text-2xl">LeaveMaster</span>
        </div>
        <button 
          onClick={handleLogout}
          className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 rounded-2xl border border-slate-100"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        {activeTab === 'home' && (
          <Dashboard 
            user={currentUser} 
            requests={requests.filter(r => r.employeeId === currentUser.id)} 
          />
        )}
        {activeTab === 'apply' && (
          <ApplyLeave 
            user={currentUser} 
            onSubmit={addRequest} 
          />
        )}
        {activeTab === 'manager' && (
          <ManagerPortal 
            requests={requests} 
            onUpdate={updateRequestStatus} 
          />
        )}
        {activeTab === 'admin' && (
          <AdminPortal 
            policies={leavePolicies} 
            requests={requests}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6 max-w-[calc(448px-3rem)] mx-auto z-50">
        <nav className="glass bg-white/90 rounded-[32px] p-2 flex justify-around items-center card-shadow border border-white/50">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')}
            icon={<Home size={22} />} 
            label="Home" 
          />
          <NavButton 
            active={activeTab === 'apply'} 
            onClick={() => setActiveTab('apply')}
            icon={<PlusSquare size={22} />} 
            label="Apply" 
          />
          {(currentUser.role === Role.MANAGER || currentUser.role === Role.HR) && (
            <NavButton 
              active={activeTab === 'manager'} 
              onClick={() => setActiveTab('manager')}
              icon={<CheckCircle size={22} />} 
              label="Review" 
            />
          )}
          {currentUser.role === Role.HR && (
            <NavButton 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')}
              icon={<Settings size={22} />} 
              label="Admin" 
            />
          )}
        </nav>
      </div>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center transition-all px-6 py-2 rounded-[24px] relative group overflow-hidden ${
      active ? 'text-white' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {active && (
      <div className="absolute inset-0 bg-indigo-600 rounded-[22px] animate-in zoom-in-75 duration-300 shadow-lg shadow-indigo-100" />
    )}
    <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110 translate-y-[-2px]' : 'scale-100'}`}>
      {icon}
    </div>
    <span className={`relative z-10 text-[9px] mt-1 font-black uppercase tracking-widest transition-all duration-300 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-75 h-0'}`}>
      {label}
    </span>
  </button>
);

export default App;
