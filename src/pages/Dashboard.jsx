import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import {
  TrendingUp, Users, Building2, Star, Clock,
  ArrowUpRight, IndianRupee, MapPin,
  MessageCircle, UserCog, CreditCard, ChevronRight,
  MessageSquareText, Calendar, LayoutDashboard,
  Zap, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { kpis, recentTransactions, propertyAnalytics, revenueData } = useSelector(s => s.dashboard);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Upper Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-normal mb-2">
            <LayoutDashboard size={12} className="text-primary" />
            <span>Command Center</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1" />
            <span className="text-slate-400">Insights</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Vendor Dashboard
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-normal border border-emerald-100">Live</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <Calendar size={14} className="text-primary" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-normal tabular-nums">
              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-normal hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 active:scale-95"
            onClick={() => navigate("/create-property")}>
            <Zap size={14} /> Quick Post
          </button>
        </div>
      </div>

      {/* KPI Section with Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {kpis.map(kpi => (
            <div key={kpi.id} className="hover-lift">
              <StatCard {...kpi} />
            </div>
          ))}
        </div>

        {/* Compact Activity Overview */}
        {/* <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Activity Momentum
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mb-6">Visualizing platform engagement</p>
          </div>
          
          <div className="h-32 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData || []}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-normal">Trending high</span>
            <button className="text-[9px] font-bold text-primary uppercase tracking-normal flex items-center gap-1 hover:underline">
              Analyze <ArrowRight size={10} />
            </button>
          </div>
        </div> */}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Performance Analytics */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-normal flex items-center gap-3">
                <Building2 size={16} className="text-primary" /> Property Performance
              </h3>
              {/* <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-normal">Analytics per listing</p> */}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-wider border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Metrics
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-slate-50">
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Entity Details</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Geography</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {propertyAnalytics.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                          <img src={prop.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-slate-800 truncate group-hover:text-primary transition-colors">{prop.title}</span>
                          <span className="text-[10px] text-slate-400 font-semibold tracking-tighter uppercase">ID: PR-{prop.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors">
                          <MapPin size={10} className="text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{prop.city}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`badge ${prop.status === 'verified' ? 'badge-green' :
                          prop.status === 'processing' ? 'badge-amber' :
                            'badge-red'
                          }`}>
                          {prop.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-6">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-slate-900 tabular-nums">{prop.views.toLocaleString()}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-normal">Views</span>
                        </div>
                        <div className={`flex flex-col items-end min-w-[50px] ${prop.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          <div className="flex items-center gap-1 font-bold text-[11px] tabular-nums">
                            {prop.trend === 'up' ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                            {prop.growth}
                          </div>
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-normal leading-none">Trend</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100">
            <button className="w-full text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-primary transition-colors flex items-center justify-center gap-2">
              View All Inventory Metrics <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Subscription History Ledger */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-[12px] font-bold text-slate-900  tracking-normal flex items-center gap-3">
                <CreditCard size={16} className="text-primary" /> Recent History
              </h3>
              {/* <p className="text-[9px] text-slate-400 font-medium mt-1 uppercase tracking-normal">Last 5 Transactions</p> */}
            </div>
            <button
              onClick={() => navigate('/subscriptions#history')}
              className="text-[9px] font-black text-primary uppercase tracking-normal hover:underline active:scale-95 transition-transform"
            >
              Full Ledger
            </button>
          </div>
          <div className="divide-y divide-slate-50 flex-1">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="px-8 py-5 hover:bg-slate-50/50 transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm border ${txn.status === 'Completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' :
                      txn.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-500' :
                        'bg-rose-50 border-rose-100 text-rose-500'
                      }`}>
                      <CreditCard size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">{txn.type}</span>
                      <span className="text-[9px] text-slate-400 font-black tracking-normal uppercase">{txn.date}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{txn.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-black uppercase tracking-normal px-1.5 py-0.5 rounded-md ${txn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                    txn.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                    {txn.status}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono tracking-tighter uppercase">{txn.id}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-slate-50/30">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-primary/20 text-primary">
                <Star size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-normal">Premium Vendor</p>
                <p className="text-[9px] text-slate-500 font-medium">Auto-renew active for May 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
