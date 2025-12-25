
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { User, LeaveRequest, LeaveStatus, Role } from '../types';
import { 
  Clock, CheckCircle2, XCircle, AlertCircle, 
  Users, Zap, TrendingUp, Calendar, 
  ArrowUpRight, Heart, Briefcase, Award,
  Activity
} from 'lucide-react';

interface DashboardProps {
  user: User;
  requests: LeaveRequest[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, requests }) => {
  const totalTaken = user.balances.reduce((acc, b) => acc + b.used, 0);
  const totalLimit = user.balances.reduce((acc, b) => acc + b.total, 0);
  
  const chartData = [
    { name: 'Used', value: totalTaken },
    { name: 'Free', value: totalLimit - totalTaken }
  ];
  
  const COLORS = ['#6366f1', '#e2e8f0'];

  const renderEmployeeHome = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Stats Card */}
      <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-50/50 flex flex-col items-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-50 rounded-full blur-2xl opacity-60" />
        
        <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest self-start z-10 mb-4 px-2">Available Balance</h2>
        
        <div className="w-full h-56 relative z-10 flex items-center justify-center">
          <div className="absolute w-[200px] h-[200px] rounded-full border-[16px] border-slate-100" />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={95}
                paddingAngle={0}
                dataKey="value"
                startAngle={225}
                endAngle={-45}
                cornerRadius={40}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl font-black text-slate-900 leading-none tracking-tighter">
              {totalLimit - totalTaken}
            </span>
            <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mt-2">Days Left</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full mt-2">
          {user.balances.slice(0, 4).map((balance, i) => (
            <div key={balance.type} className={`p-5 rounded-[32px] border transition-all hover:scale-[1.02] cursor-default ${i % 2 === 0 ? 'bg-indigo-50/30 border-indigo-100/50' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{balance.type}</span>
                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-indigo-500' : 'bg-slate-300'}`} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">{balance.used}</span>
                <span className="text-xs text-slate-400 font-bold">/ {balance.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-end mb-5 px-2">
          <div>
            <h3 className="text-xl font-black text-slate-900">Applications</h3>
            <p className="text-xs text-slate-400 font-medium">Track your recent requests</p>
          </div>
          <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl text-[11px] font-extrabold uppercase tracking-wider">History</button>
        </div>
        
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[32px] border-2 border-dashed border-slate-100">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Calendar size={32} />
              </div>
              <p className="text-slate-400 text-sm font-bold">No data found</p>
            </div>
          ) : (
            requests.slice(0, 3).map((req) => (
              <div key={req.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 flex items-center justify-between group transition-all hover:shadow-md">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-colors ${
                    req.status === LeaveStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' :
                    req.status === LeaveStatus.REJECTED ? 'bg-rose-50 text-rose-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {req.status === LeaveStatus.APPROVED ? <CheckCircle2 size={24} /> : 
                     req.status === LeaveStatus.REJECTED ? <XCircle size={24} /> : 
                     <Clock size={24} />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{req.type} Leave</h4>
                    <p className="text-xs text-slate-400 font-bold tracking-tight">{new Date(req.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-2xl ${
                    req.status === LeaveStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                    req.status === LeaveStatus.REJECTED ? 'bg-rose-100 text-rose-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{req.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderManagerHome = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Manager Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-8 shadow-2xl shadow-indigo-200 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full -ml-16 -mb-16 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-indigo-100 text-[11px] font-extrabold uppercase tracking-widest mb-1">Team Overview</p>
              <h2 className="text-2xl font-black">Performance Hub</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[32px] border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-indigo-200" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-100">Team Force</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black">24</p>
                <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-0.5"><ArrowUpRight size={10} /> 5%</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[32px] border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={16} className="text-rose-200" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-100">Active Leave</span>
              </div>
              <p className="text-3xl font-black">03</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.03] active:scale-95 cursor-pointer">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mb-4 shadow-inner shadow-amber-100">
            <Zap size={28} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-slate-800">New Requests</span>
          <span className="bg-amber-100 text-amber-700 text-[9px] font-black uppercase px-2 py-1 rounded-lg mt-2 tracking-wider">04 Pending</span>
        </div>
        <div className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.03] active:scale-95 cursor-pointer">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mb-4 shadow-inner shadow-blue-100">
            <Briefcase size={28} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-black text-slate-800">Team Calendar</span>
          <span className="bg-blue-100 text-blue-700 text-[9px] font-black uppercase px-2 py-1 rounded-lg mt-2 tracking-wider">View All</span>
        </div>
      </div>

      {/* Upcoming Spotlight */}
      <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12" />
        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
          <Award size={20} className="text-indigo-500" /> 
          Upcoming Absence
        </h3>
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-sm transition-transform group-hover:scale-110">
                  {i === 1 ? 'JS' : 'RK'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{i === 1 ? 'John Smith' : 'Rahul Kumar'}</p>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Casual • Oct {10+i}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl">3 Days</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHRHome = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HR Analytics Card */}
      <div className="bg-white p-8 rounded-[44px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Organization Pulse</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Leave Utilization Index</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Zap size={24} />
          </div>
        </div>
        
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Mon', val: 40 }, { name: 'Tue', val: 70 }, 
              { name: 'Wed', val: 55 }, { name: 'Thu', val: 85 }, 
              { name: 'Fri', val: 65 }
            ]}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="val" fill="url(#colorBar)" radius={[10, 10, 10, 10]} barSize={24} />
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-indigo-600 p-6 rounded-[36px] shadow-xl shadow-indigo-100 text-white relative overflow-hidden group transition-all hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8" />
          <Activity size={24} className="mb-4 opacity-50" />
          <p className="text-3xl font-black">94.2%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Compliance Rate</p>
        </div>
        <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:scale-[1.02]">
          <Calendar size={24} className="mb-4 text-purple-500" />
          <div>
            <p className="text-3xl font-black text-slate-800">12</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Policies</p>
          </div>
        </div>
      </div>

      {/* Critical Board */}
      <div className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm">
        <h3 className="font-black text-slate-900 mb-6 px-1">Critical Board</h3>
        <div className="space-y-4">
          <div className="bg-rose-50/50 p-5 rounded-[28px] border border-rose-100/50 flex items-start gap-4">
            <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-rose-900 uppercase tracking-wider">Quota Breach</p>
              <p className="text-[11px] text-rose-600/80 font-semibold mt-1 leading-relaxed">3 accounts in IT dept. have exceeded annual sick leave limits.</p>
            </div>
          </div>
          <div className="bg-indigo-50/50 p-5 rounded-[28px] border border-indigo-100/50 flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-indigo-900 uppercase tracking-wider">Policy Sync</p>
              <p className="text-[11px] text-indigo-600/80 font-semibold mt-1 leading-relaxed">Bereavement policy v2.1 updated across all regions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 pb-32">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none">Hi,</h1>
          <p className="text-xl font-bold gradient-text mt-1">{user.name.split(' ')[0]}</p>
        </div>
        <div className="relative">
          <div className="w-14 h-14 rounded-[22px] bg-gradient-to-tr from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center">
            <span className="font-black text-indigo-600 tracking-tighter text-lg">{user.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 border-4 border-slate-50 rounded-full" />
        </div>
      </div>

      {user.role === Role.EMPLOYEE && renderEmployeeHome()}
      {user.role === Role.MANAGER && renderManagerHome()}
      {user.role === Role.HR && renderHRHome()}
    </div>
  );
};

export default Dashboard;
