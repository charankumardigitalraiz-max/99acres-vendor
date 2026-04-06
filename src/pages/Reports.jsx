import { useSelector, useDispatch } from 'react-redux';
import { setDateRange, setActiveTab } from '../features/reports/reportsSlice';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { Download, FileText, TrendingUp, Users, Building2, CreditCard } from 'lucide-react';
import { propertyTypeData } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-card p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="flex items-center gap-1.5 mb-0.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-sm inline-block flex-shrink-0" style={{ background: p.color }} />
            {p.name}: <span className="font-medium text-slate-700">₹{(p.value / 1000).toFixed(0)}K</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const dateRanges = ['3months', '6months', '1year'];
const tabs = [
  { key: 'revenue', label: 'Revenue', icon: CreditCard },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'properties', label: 'Properties', icon: Building2 },
];

export default function Reports() {
  const dispatch = useDispatch();
  const { revenueReport, dateRange, activeTab } = useSelector(s => s.reports);
  const { userGrowthData } = useSelector(s => s.dashboard);

  const summaryCards = [
    { label: 'Total Revenue (6M)', value: '₹43.5L', change: '+18.2%', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'New Users (6M)', value: '6,342', change: '+22.1%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Properties Listed', value: '18,290', change: '+12.4%', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'New Subscriptions', value: '840', change: '+9.8%', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' },
  ]
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span className="text-primary/80">Analytical Intelligence</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Platform Performance Metric</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Analytics</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-50 p-1.5 rounded-xl gap-1 border border-slate-100">
            {dateRanges.map(r => (
              <button
                key={r}
                onClick={() => dispatch(setDateRange(r))}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${dateRange === r ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {{ '3months': '3M', '6months': '6M', '1year': '1Y' }[r]}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            <FileText size={14} className="text-primary" /> PDF Audit
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 xl:grid-cols-4 gap-6">
        {summaryCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm shadow-slate-200/40 group hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={16} />
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm">
                  {card.change}
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">{card.label}</p>
              <p className="text-xl font-bold text-slate-900 tabular-nums leading-none tracking-tight">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tab selector */}
      <div className="flex gap-1.5 p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-200/50">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => dispatch(setActiveTab(tab.key))}
              className={`flex items-center gap-2.5 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === tab.key
                ? 'bg-white shadow-xl shadow-slate-200/50 text-primary border border-slate-100'
                : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 min-[790px]:grid-cols-12 gap-8">
          <div className="min-[790px]:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                  <CreditCard size={16} className="text-primary" /> Revenue Trajectory
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                <TrendingUp size={12} /> +18% Momentum
              </div>
            </div>
            <div className="p-8 flex-1">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueReport || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}K`} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                  <Bar dataKey="basic" name="Basic" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="standard" name="Standard" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="premium" name="Premium" fill="#2E353A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="min-[790px]:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-110 pointer-events-none"></div>
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] mb-8">Split Distribution</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Basic', value: 620000, color: '#94A3B8' },
                      { name: 'Standard', value: 963000, color: '#F59E0B' },
                      { name: 'Premium', value: 1175000, color: '#2E353A' },
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={85}
                    paddingAngle={8} dataKey="value"
                  >
                    {[{ color: '#94A3B8' }, { color: '#F59E0B' }, { color: '#2E353A' }].map((e, i) => (
                      <Cell key={i} fill={e.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`₹${(v / 100000).toFixed(2)}L`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-8">
              {[{ name: 'Basic', color: '#94A3B8' }, { name: 'Standard', color: '#F59E0B' }, { name: 'Premium', color: '#2E353A' }].map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name} Identity</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[450px]">
          <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
              <Users size={16} className="text-blue-500" /> User Acquisition Trend
            </h3>
          </div>
          <div className="p-8 flex-1">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={userGrowthData || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E353A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2E353A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} dx={-10} />
                <Tooltip cursor={{ stroke: '#F1F5F9', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="users" name="Total Entities" stroke="#2E353A" strokeWidth={3} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="newUsers" name="New Registration" stroke="#F59E0B" strokeWidth={3} fill="url(#colorNew)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="grid grid-cols-1 min-[790px]:grid-cols-12 gap-8">
          <div className="min-[790px]:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-110 pointer-events-none"></div>
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] mb-8">Asset Class Allocation</h3>
            <div className="aspect-square w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={propertyTypeData || []} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                    {propertyTypeData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="min-[790px]:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] mb-8">Distribution Matrix</h3>
            <div className="space-y-6">
              {propertyTypeData.map(d => {
                const total = propertyTypeData.reduce((a, x) => a + x.value, 0);
                const pct = Math.round((d.value / total) * 100);
                return (
                  <div key={d.name} className="group">
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.name} Vector</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">{d.value.toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div className="h-full rounded-full transition-all duration-1000 group-hover:opacity-80 shadow-sm" style={{ width: `${pct}%`, background: d.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
