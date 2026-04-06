import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPlanFilter, setStatusFilter, setSearch,
  selectFilteredSubscribers, setTypeFilter
} from '../features/subscriptions/subscriptionsSlice';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import SubscriptionPieChart from '../components/charts/SubscriptionPieChart';
import { Search, Download, RefreshCw, AlertCircle, Users, ShieldCheck, CheckCircle, Shield, ChevronDown } from 'lucide-react';
import Select from '../components/ui/Select';
import { subscriptionPieData } from '../data/mockData';

const plans = ['All', 'Basic', 'Standard', 'Premium'];
const types = ['All', 'Agent', 'Seller'];
const statuses = ['All', 'Active', 'Expired'];

export default function Subscribers() {
  const dispatch = useDispatch();
  const { planFilter, statusFilter, typeFilter, searchQuery } = useSelector(s => s.subscriptions);
  const filtered = useSelector(selectFilteredSubscribers);

  // Expiring soon (within 30 days simulation)
  const expiringSoon = filtered.filter(s => s.status === 'Active' && !s.autoRenew);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span className="text-primary/80">Administration</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <span>Customer Subscriptions</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Subscribers</h2>
        </div>
        <div className="flex items-center gap-3">
          {expiringSoon.length > 0 && (
            <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">{expiringSoon.length} Critical Renewals</span>
            </div>
          )}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            <Download size={14} className="text-primary" /> Export Data
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Agents', value: filtered.filter(s => s.type === 'agent').length, icon: Users, color: 'primary' },
          { label: 'Sellers', value: filtered.filter(s => s.type === 'seller').length, icon: ShieldCheck, color: 'blue' },
          { label: 'Active Plans', value: filtered.filter(s => s.status === 'Active').length, icon: CheckCircle, color: 'emerald' },
          { label: 'Auto Renewing', value: filtered.filter(s => s.autoRenew).length, icon: RefreshCw, color: 'violet' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm group hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-${s.color === 'primary' ? 'primary/5' : s.color + '-50'} flex items-center justify-center text-${s.color === 'primary' ? 'primary' : s.color + '-500'} group-hover:scale-110 transition-transform`}>
                {s.icon ? <s.icon size={16} /> : <Users size={16} />}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums leading-none tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 min-[790px]:grid-cols-12 gap-8">
        {/* LHS: Table Container */}
        <div className="min-[790px]:col-span-8 space-y-6">
          {/* Enhanced Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-[300px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5 block ml-1">Search Customers</label>
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Enter name or email..."
                  value={searchQuery}
                  onChange={e => dispatch(setSearch(e.target.value))}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-end">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5 block ml-1">Subscription Plan</label>
                <div className="flex bg-slate-50 p-1.5 rounded-lg gap-1 border border-slate-100">
                  {plans.map(p => (
                    <button
                      key={p}
                      onClick={() => dispatch(setPlanFilter(p))}
                      className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${planFilter === p ? 'bg-white shadow-md text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-32">
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={e => dispatch(setStatusFilter(e.target.value))}
                  options={statuses}
                  placeholder={null}
                />
              </div>
            </div>
          </div>

          {/* Data Ledger */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                <Shield size={16} className="text-primary" /> Subscription List
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Updates active</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Subscribed On</th>
                    <th>Plan Value</th>
                    <th>Auto Renew</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(sub => (
                    <tr key={sub.id} className="group hover:bg-slate-50 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar initials={sub.name.split(' ').map(n => n[0]).join('')} size="sm" className="ring-2 ring-slate-100" />
                          <div>
                            <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors leading-none">{sub.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{sub.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant={sub.plan === 'Premium' ? 'purple' : sub.plan === 'Standard' ? 'amber' : 'slate'} className="text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                          {sub.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-[10px] font-bold text-slate-700 tabular-nums">{sub.startDate}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exp: {sub.expiry}</p>
                      </td>
                      <td className="px-6 py-5 tabular-nums">
                        <div className="font-bold text-slate-900 text-sm">{sub.amount}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border shadow-sm ${sub.autoRenew ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                          {sub.autoRenew ? 'Active' : 'Manual'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary hover:border-primary/40 hover:shadow-md transition-all active:scale-95 group/btn">
                          <RefreshCw size={12} className="inline mr-1.5 group-hover/btn:rotate-180 transition-transform duration-500" /> Re-sync
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-20 text-slate-400">
                        <div className="flex flex-col items-center justify-center opacity-40">
                          <AlertCircle size={32} className="mb-4" />
                          <p className="text-xs font-bold uppercase tracking-widest">No Subscriber Records Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RHS: Intelligence Sidebar */}
        <div className="min-[790px]:col-span-4 space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-8 relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%] transition-transform duration-700 group-hover:scale-110 pointer-events-none"></div>
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3 mb-8">
              Tier Allocation
            </h3>
            <div className="aspect-square w-full">
              <SubscriptionPieChart data={subscriptionPieData} />
            </div>
          </div>

          {/* Priority Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                <AlertCircle size={16} className="text-amber-500" /> Expiring Soon
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[9px] font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20">{expiringSoon.length}</span>
            </div>
            <div className="divide-y divide-slate-50">
              {expiringSoon.length === 0 && (
                <p className="text-[10px] text-slate-400 p-8 font-bold text-center uppercase tracking-widest">Registry synchronized.</p>
              )}
              {expiringSoon.map(s => (
                <div key={s.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{s.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{s.plan} · Expires {s.expiry}</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95">Alert</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
