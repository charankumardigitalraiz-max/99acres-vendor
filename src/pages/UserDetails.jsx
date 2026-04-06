import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserById } from '../features/users/usersSlice';
import { selectPropertiesByUserId, selectWishlistedProperties } from '../features/products/productsSlice';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import {
    Building2, MapPin, Eye, CheckCircle, XCircle,
    ArrowLeft, Mail, Phone, Calendar, Activity,
    User, Download, ChevronRight, Star,
    Shield, Clock, TrendingUp, MessageSquare,
    Zap, Ban, Maximize2, Edit2, Heart
} from 'lucide-react';

const typeColors = {
    Villas: 'bg-emerald-50 text-emerald-600',
    home: 'bg-blue-50 text-blue-600',
    Plots: 'bg-amber-50 text-amber-600',
    Flats: 'bg-violet-50 text-violet-600',
    Commercial: 'bg-rose-50 text-rose-600',
    'Independent House': 'bg-indigo-50 text-indigo-600',
    Appartments: 'bg-sky-50 text-sky-600',
    Lands: 'bg-orange-50 text-orange-600',
    other: 'bg-slate-50 text-slate-600',
};

const statusColor = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    Suspended: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = useSelector((state) => selectUserById(state, id));
    const properties = useSelector((state) => selectPropertiesByUserId(state, id)) || [];
    const wishlistItems = useSelector((state) => selectWishlistedProperties(state, user?.wishlist));
    const isSeller = user?.role === 'Seller' || user?.role === 'Agent';
    const isBuyer = user?.role === 'Buyer';

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 mt-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <User size={32} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">User not found</h2>
                <p className="text-slate-500 mt-1 text-sm">The user you're looking for doesn't exist or has been removed.</p>
                <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-sm font-bold text-slate-600 flex items-center gap-2">
                    <ArrowLeft size={14} /> Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-primary/30 hover:bg-slate-50 text-slate-500 hover:text-primary transition-all shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                            <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/users')}>Users</span>
                            <span className="text-slate-200">/</span>
                            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">{user.name}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Details</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition shadow-sm">
                        <Download size={13} className="text-primary" /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-100 transition shadow-sm">
                        <Ban size={13} /> Suspend User
                    </button>
                </div>
            </div>

            {/* Profile Identity Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="flex flex-col md:flex-row items-start gap-8 p-8">
                    <div className="relative shrink-0 group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative p-1.5 bg-white rounded-full border border-slate-100 shadow-xl shadow-slate-200/50">
                            <Avatar initials={user.avatar} size="3xl" />
                        </div>
                        <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white text-white shadow-lg transition-transform duration-500 group-hover:scale-110 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            {user.status === 'Active' ? <CheckCircle size={16} fill="white" className="text-emerald-500" /> : <XCircle size={16} fill="white" className="text-rose-500" />}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusColor[user.status] || statusColor.Inactive}`}>
                                {user.status}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${user.role === 'Agent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                user.role === 'Seller' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    'bg-purple-50 text-purple-600 border-purple-100'
                                }`}>{user.role}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-8 mt-6">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                <p className="text-sm font-bold text-slate-800 break-all">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                                <p className="text-sm font-bold text-slate-800">{user.phone || '—'}</p>
                                {user.altPhone && <p className="text-xs font-bold text-slate-400 mt-0.5">{user.altPhone}</p>}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">City</p>
                                <p className="text-sm font-bold text-slate-800">{user.city || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Member Since</p>
                                <p className="text-sm font-bold text-slate-800">{user.joined || '—'}</p>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-4 pt-4 border-t border-slate-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Address</p>
                                <p className="text-sm font-bold text-slate-800 leading-relaxed">{user.address?.fullAddress || '—'}</p>
                            </div>
                        </div>
                    </div>
                    {isSeller && (
                        <div className="flex flex-col gap-3 shrink-0 md:items-end">
                            {[
                                { label: 'Subscription', value: user.subscription || 'Free', color: 'amber' },
                                { label: 'Properties', value: properties.length, color: 'blue' },
                            ].map(stat => (
                                <div key={stat.label} className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                                    <p className={`text-lg font-black tracking-tight ${stat.color === 'amber' ? 'text-amber-600' : 'text-blue-600'}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT: Properties + Transactions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Properties */}
                    {isSeller && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/5 to-white flex items-center justify-center border border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        <Building2 size={13} className="text-primary" />
                                    </div>
                                    Property Listings
                                </h3>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{properties.length} total</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="data-table">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60">
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {properties.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center text-xs font-bold text-slate-400 italic">No properties listed</td>
                                            </tr>
                                        ) : properties.map(prop => (
                                            <tr key={prop.id} className="hover:bg-slate-50 transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                                            <img src={prop.coverPhoto || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=150'} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors mb-0.5">{prop.title}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={8} />{prop.city}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${typeColors[prop.propertyType] || 'bg-slate-50 text-slate-500'}`}>{prop.propertyType}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-slate-900 tabular-nums">{prop.price}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => navigate(`/products/${prop.id}`)} className="p-2 rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-500 transition-all">
                                                        <Eye size={13} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Wishlist - Only for Buyers */}
                    {isBuyer && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]  flex items-center gap-2">
                                    <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-primary/5 to-white flex items-center justify-center border border-rose-200 shadow-sm transition-transform duration-300 group-hover:scale-110">'>
                                        <Heart size={13} className="text-rose-500 fill-rose-500" />
                                    </div>
                                    <span > My </span>
                                    <span> Wishlist</span>
                                </h3>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{wishlistItems.length} items</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60">
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {wishlistItems.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center text-xs font-bold text-slate-400 italic">Wishlist is empty</td>
                                            </tr>
                                        ) : wishlistItems.map(prop => (
                                            <tr key={prop.id} className="hover:bg-slate-50 transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                                                            <img src={prop.coverPhoto || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=150'} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors mb-0.5">{prop.title}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={8} />{prop.city}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${typeColors[prop.propertyType] || 'bg-slate-50 text-slate-500'}`}>{prop.propertyType}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-slate-900 tabular-nums">{prop.price}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => navigate(`/products/${prop.id}`)} className="p-2 rounded-lg bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-500 transition-all">
                                                        <Eye size={13} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Transactions */}
                    {user.transactions?.length > 0 && isSeller && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <TrendingUp size={13} className="text-emerald-500" /> Payment History
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {user.transactions.map((txn, i) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-all">
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 mb-0.5 capitalize">{txn.type}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <Clock size={8} /> {txn.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900 tabular-nums">{txn.amount}</p>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${txn.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{txn.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}

                </div>

                {/* RIGHT: Messages + Reports */}
                <div className="space-y-6">
                    {/* Messages */}
                    {user.chats?.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/5 to-white flex items-center justify-center border border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        <MessageSquare size={13} className="text-primary" />
                                    </div>
                                    Messages
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {user.chats.map((chat, i) => (
                                    <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div className="relative shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                                                {chat.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {chat.unread && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className="text-xs font-bold text-slate-800">{chat.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold shrink-0">{chat.time}</p>
                                            </div>
                                            <p className="text-[10px] text-slate-500 truncate">{chat.msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {user.activity?.length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-50 to-white flex items-center justify-center border border-blue-100 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        <Activity size={13} className="text-blue-500" />
                                    </div>
                                    Recent Activity
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {user.activity.map((act, i) => (
                                    <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-all">
                                        <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-700">{act.action}</p>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">{act.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reports/Flags */}
                    {user.reports?.length > 0 && isSeller && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-50 to-white flex items-center justify-center border border-rose-100 shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        <Shield size={13} className="text-rose-500" />
                                    </div>
                                    Security Reports
                                </h3>
                                <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[9px] font-bold border border-rose-100">{user.reports.length} flags</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {user.reports.map(report => (
                                    <div key={report.id} className="flex items-start justify-between px-5 py-4 hover:bg-rose-50/30 transition-all">
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 mb-0.5">{report.reason}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{report.date}</p>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border mt-0.5 ${report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
