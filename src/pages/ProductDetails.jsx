import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectPropertyById, updatePropertyStatus } from '../features/products/productsSlice';
import { Building2, ArrowLeft, Clock, Shield, ChevronDown, Star, ThumbsUp, MessageSquare, Filter, SortAsc, LayoutGrid } from 'lucide-react';
import { reviewsData } from '../data/mockData';

import Modal from '../components/ui/Modal';
import PropertyForm from '../components/ui/PropertyForm';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const product = useSelector((state) => selectPropertyById(state, id));
    const [statusToUpdate, setStatusToUpdate] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [reason, setReason] = useState('');

    // Filter reviews for this property
    const reviews = useMemo(() => {
        return reviewsData.filter(r => r.propertyId === Number(id));
    }, [id]);

    const stats = useMemo(() => {
        if (!reviews.length) return { avg: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
        const total = reviews.length;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach(r => distribution[5 - r.rating]++);
        return {
            avg: (sum / total).toFixed(1),
            total,
            distribution: distribution.map(count => Math.round((count / total) * 100))
        };
    }, [reviews]);

    const handleStatusChange = (newStatus) => {
        if (newStatus === 'verified' || newStatus === 'rejected') {
            setStatusToUpdate(newStatus);
            setIsConfirmModalOpen(true);
        } else {
            dispatch(updatePropertyStatus({ id: product.id, status: newStatus }));
        }
    };

    const confirmStatusUpdate = () => {
        dispatch(updatePropertyStatus({ id: product.id, status: statusToUpdate }));
        setIsConfirmModalOpen(false);
        setStatusToUpdate(null);
    };

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border mt-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Building2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Property not found</h2>
                <p className="text-slate-500 mt-1">This listing might have been removed or doesn't exist.</p>
                <button
                    onClick={() => navigate('/properties')}
                    className="mt-6 px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                    <ArrowLeft size={14} className="inline mr-2" /> Back to Listings
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Breadcrumb */}
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
                            <span className="hover:text-primary transition-colors cursor-pointer">Admin</span>
                            <span className="text-slate-200">/</span>
                            <span className="hover:text-primary transition-colors cursor-pointer">Listings</span>
                            <span className="text-slate-200">/</span>
                            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">#PRP-{product.id}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{product.title}</h2>
                    </div>
                </div>
                {/* <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={product.status?.toLowerCase() || 'draft'}
                            onChange={(e) => handleStatusChange(e.target.value.toLowerCase())}
                            className={`appearance-none pr-10 pl-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border cursor-pointer outline-none transition-all shadow-sm ${product.status?.toLowerCase() === 'new' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                product.status?.toLowerCase() === 'processing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    product.status?.toLowerCase() === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                        product.status?.toLowerCase() === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                        >
                            <option value="new">New</option>
                            <option value="processing">Processing</option>
                            <option value="draft">Draft</option>
                            <option value="rejected">Rejected</option>
                            <option value="verified">Verified</option>
                        </select>
                        <ChevronDown size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${product.status?.toLowerCase() === 'new' ? 'text-blue-400' :
                            product.status?.toLowerCase() === 'processing' ? 'text-amber-400' :
                                product.status?.toLowerCase() === 'rejected' ? 'text-rose-400' :
                                    product.status?.toLowerCase() === 'verified' ? 'text-emerald-500' :
                                        'text-slate-400'
                            }`} />
                    </div>
                </div> */}
            </div>

            {/* Main Content Area */}
            <div className="animate-in fade-in duration-500 space-y-8">
                <PropertyForm initialData={product} />

                {/* Reviews Section */}
                {/* <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                                    <MessageSquare size={12} />
                                    <span>User Feedback</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Property Reviews & Ratings</h3>
                                <p className="text-slate-500 text-sm mt-1">Showing verified user experiences for this property.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                                    <Filter size={14} /> Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
                                    <SortAsc size={14} /> Relevancy
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      
                            <div className="lg:col-span-4 space-y-8">
                                <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                        <Star size={80} fill="currentColor" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-end gap-3 mb-2">
                                            <span className="text-5xl font-black">{stats.avg}</span>
                                            <span className="text-slate-400 font-bold mb-1.5 text-xl">/ 5.0</span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    size={18}
                                                    className={s <= Math.round(stats.avg) ? 'text-amber-400 fill-amber-400' : 'text-slate-700 fill-slate-700'}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Based on {stats.total} total reviews</p>
                                    </div>
                                </div>

                                <div className="space-y-4 px-2">
                                    {[5, 4, 3, 2, 1].map((rating, idx) => (
                                        <div key={rating} className="flex items-center gap-4 group cursor-default">
                                            <div className="flex items-center gap-1.5 min-w-[32px]">
                                                <span className="text-xs font-black text-slate-700">{rating}</span>
                                                <Star size={10} className="text-amber-400 fill-amber-400" />
                                            </div>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${stats.distribution[idx]}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 min-w-[32px] text-right group-hover:text-slate-900 transition-colors">
                                                {stats.distribution[idx]}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

            
                            <div className="lg:col-span-8 space-y-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar initials={review.avatar} size="lg" className="ring-4 ring-white shadow-sm" />
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{review.user}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    size={10}
                                                                    className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">• {review.date}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="sky">Verified Buyer</Badge>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed pl-1">
                                            "{review.comment}"
                                        </p>
                                        <div className="mt-5 pt-5 border-t border-slate-100/50 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-primary transition-colors transition-transform active:scale-90">
                                                    <ThumbsUp size={12} /> Helpful
                                                </button>
                                                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors transition-transform active:scale-90">
                                                    Report
                                                </button>
                                            </div>
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                                        <div className={`w-full h-full bg-slate-${200 + i * 100}`}></div>
                                                    </div>
                                                ))}
                                                <div className="text-[8px] font-black text-slate-400 flex items-center ml-3">+4 found this helpful</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirm Status Update"
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Are you sure you want to update the status of this property to <span className={`font-black uppercase tracking-widest ${statusToUpdate === 'verified' ? 'text-emerald-600' : 'text-rose-600'}`}> {statusToUpdate}</span>?
                        </p>
                    </div>
                    {statusToUpdate === 'rejected' && (
                        <textarea
                            placeholder="Reason for status update"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-300 placeholder:text-slate-300"
                        />
                    )}
                    <div className="flex items-center gap-3 justify-end">
                        <button
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmStatusUpdate}
                            className={`px-6 py-2.5 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 ${statusToUpdate === 'verified' ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600' : 'bg-rose-500 shadow-rose-500/20 hover:bg-rose-600'}`}
                        >
                            {statusToUpdate === 'verified' ? 'Confirm Update' : 'Reject Property'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
