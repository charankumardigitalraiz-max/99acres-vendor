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
    Globe, Calendar
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
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 mt-10 shadow-card">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
                    <User size={32} className="text-slate-300" />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Customer not found</h2>
                <p className="text-slate-400 text-sm mt-2 max-w-xs text-center leading-relaxed">This record might have been moved or permanently deleted from the database.</p>
                <button onClick={() => navigate('/customers')} className="mt-8 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <ArrowLeft size={16} /> Return to Directory
                </button>
            </div>
        );
    }

    const stats = [
        { label: 'Listings', value: propertyInformation.length, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Rating', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'Reports', value: userInformation?.reports?.length || 0, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
        { label: 'Joined', value: userInformation?.joined ? userInformation.joined.split('-')[0] : '2024', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* ── HEADER SECTION ── */}
            <div className="card !p-0">
                <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-slate-50 shadow-premium">
                                <Avatar initials={userInformation.avatar} size="xl" className="w-full h-full object-cover border-none" />
                            </div>
                            <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl ${userInformation.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'} border-4 border-white flex items-center justify-center shadow-lg`}>
                                <Activity size={12} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{userInformation.name}</h1>
                                <Badge variant={userInformation.status === 'Active' ? 'green' : 'slate'}>{userInformation.status}</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
                                    <Mail size={14} /> {userInformation.email}
                                </p>
                                <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                                <p className="text-slate-400 text-sm font-medium flex items-center gap-1.5">
                                    <Shield size={14} className={cfg.color} /> {role} Account
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-all border border-slate-200">
                            <Download size={16} /> Export Data
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-100 transition-all border border-rose-100">
                            <Ban size={16} /> Suspend
                        </button>
                    </div>
                </div>

                {/* Secondary Header Stats */}
                <div className="border-t border-slate-50 bg-slate-50/30 px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shadow-sm`}>
                                <s.icon size={16} className={s.color} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                                <p className="text-base font-black text-slate-900 leading-none">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── LEFT COLUMN ── */}
                <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="card p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Phone size={14} className="text-indigo-500" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Contact Details</h3>
                        </div>
                        <div className="space-y-5">
                            {[
                                { label: 'Primary Email', value: userInformation.email, icon: Mail },
                                { label: 'Phone Number', value: userInformation.phone, icon: Phone },
                                // { label: 'Language', value: 'English, Hindi', icon: Globe },
                            ].map((item, idx) => (
                                <div key={idx} className="group cursor-default">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{item.label}</p>
                                    <div className="flex items-center gap-2">
                                        <item.icon size={14} className="text-slate-300" />
                                        <p className="text-sm font-bold text-slate-700">{item.value || 'Not provided'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="card p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <MapPin size={14} className="text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Registry Address</h3>
                        </div>
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800">
                                        {userInformation.address?.city || 'No City'}
                                    </p>
                                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                                        {userInformation.address?.location || 'Central Region'}
                                    </p>
                                    <p className="text-xs text-slate-500 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                                        {userInformation.address?.fullAddress || 'Full registry address not available in public profile.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Property Portfolio */}
                    <div className="card !p-0">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100">
                                    <Home size={14} className="text-amber-500" />
                                </div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Property Portfolio</h3>
                            </div>
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-widest">
                                {propertyInformation.length} Active Listings
                            </span>
                        </div>

                        {propertyInformation.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                    <Building2 size={24} className="text-slate-300" />
                                </div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No properties mapped</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {propertyInformation.map((prop) => (
                                    <div key={prop.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-white">
                                                <img
                                                    src={prop.coverPhoto || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=150&auto=format&fit=crop`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    alt={prop.title}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{prop.title}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} className="text-slate-400" />
                                                        <span className="text-xs font-bold text-slate-400">{prop.city}</span>
                                                    </div>
                                                    <Badge variant={prop.propertyType === 'Villas' ? 'green' : 'slate'} className="scale-75 origin-left">
                                                        {prop.propertyType}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{prop.price}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asking Price</p>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/property/${prop.id}`)}
                                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 hover:shadow-lg transition-all"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Financial Summary */}
                    <div className="card !p-0">
                        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <CreditCard size={14} className="text-emerald-500" />
                            </div>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Financial Transactions</h3>
                        </div>
                        <div className="p-6">
                            {(userInformation.transactions || []).length === 0 ? (
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center py-4">Financial record is empty</p>
                            ) : (
                                <div className="space-y-4">
                                    {(userInformation.transactions || []).map((txn, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                    <TrendingUp size={16} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 leading-none mb-1">{txn.type}</p>
                                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                        <Clock size={10} /> {txn.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{txn.amount}</p>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${txn.status === 'Completed' ? 'text-emerald-500' : 'text-slate-400'}`}>
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
