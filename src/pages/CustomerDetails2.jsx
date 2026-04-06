import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserById } from '../features/users/usersSlice';
import { selectPropertiesByUserId } from '../features/products/productsSlice';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import {
    Building2, MapPin, Eye,
    ArrowLeft, Mail, Activity,
    User, Download, Star,
    Shield, Clock, TrendingUp,
    Ban, Phone, Home, CreditCard, AlertCircle,
    Globe, Calendar, ChevronRight
} from 'lucide-react';

const typeColors = {
    villas: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    home: 'bg-blue-100 text-blue-700 border-blue-200',
    plots: 'bg-amber-100 text-amber-700 border-amber-200',
    flats: 'bg-violet-100 text-violet-700 border-violet-200',
    commercial: 'bg-rose-100 text-rose-700 border-rose-200',
    'independent house': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Appartments: 'bg-sky-100 text-sky-700 border-sky-200',
    Lands: 'bg-orange-100 text-orange-700 border-orange-200',
    other: 'bg-slate-100 text-slate-600 border-slate-200',
};

const roleConfig = {
    Agent: { bg: 'bg-blue-600', light: 'bg-blue-50 text-blue-700 border-blue-200', color: 'text-blue-600' },
    Seller: { bg: 'bg-emerald-600', light: 'bg-emerald-50 text-emerald-700 border-emerald-200', color: 'text-emerald-600' },
    Buyer: { bg: 'bg-violet-600', light: 'bg-violet-50 text-violet-700 border-violet-200', color: 'text-violet-600' },
};

export default function CustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const userInformation = useSelector((state) => selectUserById(state, id));
    const propertyInformation = useSelector((state) => selectPropertiesByUserId(state, id)) || [];

    const role = userInformation?.role || 'Buyer';
    const cfg = roleConfig[role] || roleConfig.Buyer;

    if (!userInformation) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-100 mt-10 shadow-card">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <User size={32} className="text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">User not found</h2>
                <p className="text-slate-400 text-sm mt-2 max-w-xs text-center leading-relaxed font-medium">This record might have been moved or permanently deleted from the database.</p>
                <button
                    onClick={() => navigate('/customers')}
                    className="mt-10 flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    <ArrowLeft size={16} /> Return to Directory
                </button>
            </div>
        );
    }

    const stats = [
        { label: 'Total Listings', value: propertyInformation.length, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Profile Rating', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Active Reports', value: userInformation?.reports?.length || 0, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
        { label: 'Member Since', value: userInformation?.joined ? userInformation.joined.split('-')[0] : '2024', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-32">

            {/* ── BREADCRUMBS & ACTIONS ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <button onClick={() => navigate('/customers')} className="hover:text-primary transition-colors">Directory</button>
                        <ChevronRight size={10} />
                        <span className="text-slate-300">Customers</span>
                        <ChevronRight size={10} />
                        <span className="text-primary">{userInformation.name}</span>
                    </nav>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        {userInformation.name}
                        <Badge variant={userInformation.status === 'Active' ? 'green' : 'slate'} className="ml-2 py-1 px-3 text-[10px] tracking-widest">{userInformation.status}</Badge>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={14} /> Export
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all shadow-sm">
                        <Ban size={14} /> Suspend Account
                    </button>
                </div>
            </div>

            {/* ── METRICS BAR ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center justify-between group">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center border border-white/50 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                            <s.icon size={20} className={s.color} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* ── LEFT SIDEBAR (IDENTITY) ── */}
                <div className="lg:col-span-4 space-y-8 sticky top-24">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-8 ring-slate-50 shadow-premium">
                                    <Avatar initials={userInformation.avatar} size="xl" className="w-full h-full border-none" />
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl ${userInformation.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'} border-4 border-white flex items-center justify-center shadow-lg animate-pulse`}>
                                    <Activity size={14} className="text-white" />
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-slate-900">{userInformation.name}</h2>
                            <p className={`text-xs font-black uppercase tracking-widest mt-1 ${cfg.color}`}>{role} ACCOUNT</p>
                            <p className="text-slate-400 text-sm font-medium mt-4 max-w-[200px] leading-relaxed">
                                Managed user profile since January 2024 with full operational permissions.
                            </p>

                            <div className="w-full h-px bg-slate-50 my-8" />

                            <div className="w-full space-y-6">
                                {[
                                    { label: 'Email Address', value: userInformation.email, icon: Mail },
                                    { label: 'Phone Number', value: userInformation.phone, icon: Phone },
                                    { label: 'Base Location', value: userInformation.address?.city || 'Not set', icon: MapPin },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 text-left group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                            <item.icon size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                                            <p className="text-sm font-bold text-slate-700 break-all">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Registry Badge */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="relative space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                <Shield size={20} className="text-primary" />
                            </div>
                            <h4 className="text-lg font-black tracking-tight leading-tight">Verification<br />Registry Active</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">Identity and address verification were successfully audited on Oct 2024.</p>
                        </div>
                    </div>
                </div>

                {/* ── MAIN CONTENT (SHEETS) ── */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Portfolio Sheet */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                                    <Home size={18} className="text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Property Portfolio</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Marketplace Listings</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-black bg-slate-900 text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-slate-200">
                                {propertyInformation.length} Units
                            </span>
                        </div>

                        {propertyInformation.length === 0 ? (
                            <div className="p-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100">
                                    <Building2 size={32} className="text-slate-200" />
                                </div>
                                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No mapping data available</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {propertyInformation.map((prop) => (
                                    <div key={prop.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-md border-4 border-white group-hover:rotate-2 transition-transform">
                                                <img
                                                    src={prop.coverPhoto || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=150&auto=format&fit=crop`}
                                                    className="w-full h-full object-cover"
                                                    alt={prop.title}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-base font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{prop.title}</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={12} className="text-slate-400" />
                                                        <span className="text-xs font-bold text-slate-400">{prop.city}</span>
                                                    </div>
                                                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                    <Badge variant={prop.propertyType === 'Villas' ? 'green' : 'slate'} className="scale-90 origin-left py-0.5 px-3 uppercase text-[9px] tracking-widest">
                                                        {prop.propertyType}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-lg font-black text-slate-900 tracking-tighter">{prop.price}</p>
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Market Value</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/property/${prop.id}`)}
                                                className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary/30 hover:shadow-xl transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Financial Sheet */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/20">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                <CreditCard size={18} className="text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Financial Ledger</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Recent Transaction History</p>
                            </div>
                        </div>
                        <div className="p-8">
                            {(userInformation.transactions || []).length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center">
                                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">ledger is currently empty</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(userInformation.transactions || []).map((txn, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50/30 rounded-[2rem] border border-slate-100 hover:border-primary/20 hover:bg-white transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-50 shadow-sm group-hover:rotate-6 transition-transform">
                                                    <TrendingUp size={18} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-800 leading-none mb-2">{txn.type}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={12} className="text-slate-300" />
                                                        <span className="text-xs font-bold text-slate-400">{txn.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-900 tracking-tighter">{txn.amount}</p>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${txn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    {txn.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
