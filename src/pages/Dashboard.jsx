import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import {
  TrendingUp, Users, Building2, Star, Clock,
  ArrowUpRight, IndianRupee, MapPin,
  MessageCircle, UserCog, CreditCard, ChevronRight,
  MessageSquareText
} from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
export default function Dashboard() {
  const navigate = useNavigate();
  const { kpis, recentChats, recentTransactions } = useSelector(s => s.dashboard);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">
            <span>Vendor</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-primary/80">Command Center</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map(kpi => <StatCard key={kpi.id} {...kpi} />)}
      </div>

      {/* Bottom Row - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Chats */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <MessageSquareText size={16} className="text-primary" /> Recent Chats
            </h3>
            <button
              onClick={() => navigate('/chats')}
              className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-[450px]">
            {recentChats.map((chat, idx) => (
              <div key={idx} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-all group cursor-pointer">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    {chat.userAvatar}
                  </div>
                  {chat.unread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-slate-800 truncate">{chat.name}</p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest tabular-nums">{chat.time}</span>
                  </div>
                  <p className={`text-[11px] leading-tight truncate ${chat.unread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                    {chat.msg}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <button className="w-full flex items-center justify-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-primary transition-colors">
              Manage Conversions <ChevronRight size={12} />
            </button>
          </div> */}
        </div>

        {/* Subscription Transactions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <CreditCard size={16} className="text-primary" /> Subscription Transactions
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:shadow-md transition-all active:scale-95"
              onClick={() => navigate('/subscriptions#history')}>
              <ArrowUpRight size={12} className="text-primary" /> All Subscriptions
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Customer</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-left">Plan / Type</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{txn.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{txn.user}</span>
                        <span className="text-[9px] text-slate-400">{txn.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{txn.type}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900 tabular-nums">{txn.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-sm ${txn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        txn.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400 tabular-nums">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <button className="w-full flex items-center justify-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-primary transition-colors">
              View Subscription Ledger <ChevronRight size={12} />
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
