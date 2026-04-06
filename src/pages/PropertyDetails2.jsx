
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectPropertyById, updatePropertyStatus } from '../features/products/productsSlice';
import { selectReviewsByPropertyId } from '../features/reviews/reviewSlice';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import {
    Building2, MapPin, CheckCircle, XCircle,
    Shield, Edit3, Info, Maximize2, Play, Users,
    Layout, Waves, Wind, Trash2, Check, Clock,
    Smartphone, Sofa, Tv, Utensils,
    Bike, Trees, Eye, ArrowLeft, Calendar, Activity,
    Image as ImageIcon, ChevronDown, RotateCcw, MoreHorizontal, AlertOctagon, MessageSquare
} from 'lucide-react';

import PropertyForm from '../components/ui/PropertyForm';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const product = useSelector((state) => selectPropertyById(state, id));
    const [activeTab, setActiveTab] = useState('Basic Info');
    const [selectedAlbum, setSelectedAlbum] = useState('Livving Room');
    const [lightboxMedia, setLightboxMedia] = useState(null); // { type: 'image' | 'video', url: string }
    const [isEditing, setIsEditing] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [statusConfirm, setStatusConfirm] = useState(null); // { type, reason }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-border mt-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Building2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Property not found</h2>
                <p className="text-slate-500 mt-1">This listing might have been removed or doesn't exist.</p>
                <button onClick={() => navigate('/properties')} className="mt-6 btn-secondary">
                    <ArrowLeft size={14} /> Back to Listings
                </button>
            </div>
        );
    }

    const albumCategories = product.smartAlbum ? Object.keys(product.smartAlbum) : [];

    return (
        <div className="space-y-6 pb-24">
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
                            <span className="hover:text-primary cursor-pointer">Admin</span>
                            <span className="text-slate-200">/</span>
                            <span className="hover:text-primary cursor-pointer">Listings</span>
                            <span className="text-slate-200">/</span>
                            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">#PRP-{product.id}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{product.title}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="flex items-center gap-1.5">
                        {product.status?.toLowerCase() === 'verified' && (
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-emerald-100 shadow-sm">
                                <CheckCircle size={14} className="text-emerald-500 fill-emerald-500/10" /> {product.status}
                            </div>

                        )}
                        {product.status?.toLowerCase() === 'rejected' && (
                            <div className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-rose-100 shadow-sm">
                                <XCircle size={14} className="text-rose-500 fill-rose-500/10" /> {product.status}
                            </div>
                        )}
                        {(product.status?.toLowerCase() === 'processing' || product.status?.toLowerCase() === 'pending') && (
                            <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-amber-100 shadow-sm">
                                <Clock size={14} className="text-amber-500" /> {product.status}
                            </div>
                        )}
                        {(product.status?.toLowerCase() === 'new' || product.status?.toLowerCase() === 'active') && product.status?.toLowerCase() !== 'verified' && (
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-2 rounded-xl flex items-center gap-2 border border-blue-100 shadow-sm">
                                <MoreHorizontal size={14} className="text-blue-500" /> {product.status}
                            </div>
                        )}
                    </div>

                    {product.status?.toLowerCase() === 'rejected' && product.rejectionReason && (
                        <div className="absolute top-full left-0 mt-3 flex items-start gap-2 bg-rose-50/50 backdrop-blur-sm border border-rose-100 p-2.5 rounded-xl min-w-[280px] shadow-lg shadow-rose-200/20 animate-in slide-in-from-top-1 duration-300">
                            <Info size={12} className="text-rose-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-rose-400 mb-0.5">Rejection Reason</p>
                                <p className="text-[10px] font-bold text-rose-700 leading-tight">{product.rejectionReason}</p>
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 transition-all shadow-lg hover:shadow-slate-200">
                            Update Status <ChevronDown size={14} className={`transition-transform duration-300 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showStatusDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)}></div>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-2 space-y-1">
                                        {[
                                            { label: 'Verified', val: 'Verified', color: 'text-emerald-600 hover:bg-emerald-50', icon: <CheckCircle size={14} /> },
                                            { label: 'Rejected', val: 'Rejected', color: 'text-rose-600 hover:bg-rose-50', icon: <XCircle size={14} /> },
                                            { label: 'Processing', val: 'Processing', color: 'text-amber-600 hover:bg-amber-50', icon: <Clock size={14} /> },
                                            { label: 'New', val: 'New', color: 'text-blue-600 hover:bg-blue-50', icon: <RotateCcw size={14} /> }
                                        ].map(opt => (
                                            <button
                                                key={opt.val}
                                                onClick={() => {
                                                    if (opt.val === 'Verified' || opt.val === 'Rejected') {
                                                        setStatusConfirm({ type: opt.val, reason: '' });
                                                    } else {
                                                        dispatch(updatePropertyStatus({ id: product.id, status: opt.val }));
                                                    }
                                                    setShowStatusDropdown(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${opt.color}`}>
                                                {opt.icon} {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PropertyForm initialData={null} onCancel={() => setIsEditing(false)} onSubmit={() => setIsEditing(false)} />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
                        {/* TOP ROW: Main Information + Financials */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                            {/* Cover Photo */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div className="relative rounded-[2rem] overflow-hidden h-full min-h-[200px] max-h-[280px] border border-slate-200 group cursor-pointer"
                                    onClick={() => setLightboxMedia({ type: 'image', url: product.coverPhoto || product.images?.[0] })}>
                                    <img src={product.coverPhoto || product.images?.[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>

                                    {/* Play Overlay if video exists */}
                                    {product.video && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                                            <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 flex items-center justify-center text-white shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                                <Play size={24} fill="white" className="ml-1" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white pointer-events-none">
                                        <div className="flex items-center gap-8">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Price</p>
                                                <p className="text-3xl font-black tracking-tight">{product.price}</p>
                                            </div>
                                            <div className="w-px h-10 bg-white/20"></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Built Area</p>
                                                <p className="text-xl font-bold">{product.propertyLength}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pointer-events-auto">
                                            {product.video && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setLightboxMedia({ type: 'video', url: product.video }); }}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all shadow-lg">
                                                    <Play size={14} fill="currentColor" /> Watch Video
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setLightboxMedia({ type: 'image', url: product.coverPhoto || product.images?.[0] }); }}
                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900/80 transition-all shadow-lg">
                                                <Maximize2 size={14} /> Full View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financials & Admin Actions */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <div className="bg-white rounded-[1.5rem] border border-primary/20 shadow-xl shadow-slate-200/30 bg-gradient-to-br from-white to-slate-50 p-4 h-full flex flex-col">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-3">Financial Structure</h3>
                                    <div className="space-y-2 flex-1 flex flex-col justify-center">
                                        <div className="bg-white p-3.5 rounded-[1.25rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[2.5rem] -mr-6 -mt-6 group-hover:scale-110 transition-transform duration-500"></div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Expected Pricing</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{product.price}</p>
                                            <div className="mt-2">
                                                {product.pricing.negotiable ? (
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border border-emerald-200 shadow-sm">
                                                        <Check size={10} /> Negotiable Listing
                                                    </div>
                                                ) : (
                                                    <div className="text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg inline-flex items-center gap-1 border border-rose-200 shadow-sm">
                                                        <XCircle size={10} /> Fixed Rate Model
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            <div className="bg-white px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Price / SqFt</p>
                                                    <p className="text-sm font-black text-slate-900">₹{product.pricing.pricePerSqft.toLocaleString()}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                                    <Maximize2 size={14} />
                                                </div>
                                            </div>
                                            <div className="bg-white px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                                                <div>
                                                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Monthly Maintenance</p>
                                                    <p className="text-sm font-black text-slate-900">
                                                        {product.pricing.maintenanceCharges > 0 ? `₹${product.pricing.maintenanceCharges.toLocaleString()}` : 'Included'}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                                    <Smartphone size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM ROW: Tabs & Details */}
                        <div className="w-full bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
                            {/* <div className="p-3 bg-slate-50 border-b border-slate-200">
                                <div className="flex bg-slate-100/80 p-1 rounded-2xl w-full overflow-x-auto scrollbar-hide gap-1">
                                    {['Basic Info', 'Location', 'Pricing & Specs', 'Media Assets', 'Verification'].map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${activeTab === tab ? 'bg-white shadow-lg text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}>
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div> */}
                            {/* <div className="p-6">

                 
                                {activeTab === 'Basic Info' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                                            {[
                                                { label: 'You Are', value: product.uploadertype, cap: true },
                                                { label: 'Property Title', value: product.title },
                                                { label: 'Kind of Property', value: product.propertyType, cap: true },
                                                { label: 'Property Length / Area', value: product.propertyLength },
                                                { label: 'Listed For', value: product.purpose, cap: true },
                                                { label: 'Listed Date', value: product.date },
                                            ].map(f => (
                                                <div key={f.label}>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{f.label}</p>
                                                    <p className={`text-sm font-bold text-slate-800 ${f.cap ? 'capitalize' : ''}`}>{f.value || 'Not Provided'}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">About this Property</p>
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                This stunning {product.propertyType} is listed for {product.purpose}. Located in the heart of {product.location?.city}, it offers a perfect blend of luxury and convenience. The property features modern architecture with {product.furnishingStatus?.toLowerCase()} interiors and high-end finishes throughout.
                                            </p>
                                        </div>
                                    </div>
                                )}

                   
                                {activeTab === 'Location' && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                <MapPin size={13} className="text-blue-500" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">Auto-detected location configuration is available for this property.</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                                            {[
                                                { label: 'City', value: product.location?.city, cap: true },
                                                { label: 'Locality, Area', value: product.location?.locality, cap: true },
                                                { label: 'Project / Building Name', value: product.location?.projectName },
                                                { label: 'Landmark', value: product.location?.landmark },
                                            ].map(f => (
                                                <div key={f.label}>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{f.label}</p>
                                                    <p className={`text-sm font-bold text-slate-800 ${f.cap ? 'capitalize' : ''}`}>{f.value || 'Not Provided'}</p>
                                                </div>
                                            ))}
                                            <div className="md:col-span-2 pt-3 border-t border-slate-100">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Address</p>
                                                <p className="text-sm font-bold text-slate-800 leading-relaxed">{product.location?.fullAddress || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Activity size={12} /> Location Advantages</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(product.locationAdvantages || []).map(adv => (
                                                    <span key={adv} className="px-3 py-1 rounded-md text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200">{adv}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

            
                                {activeTab === 'Pricing & Specs' && (
                                    <div className="space-y-5">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Check size={12} className="text-emerald-500" /> Financial Structure</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Expected Price</p>
                                                    <p className="text-base font-black text-slate-900 tracking-tight">{product.price || 'N/A'}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Price / SqFt</p>
                                                    <p className="text-base font-black text-emerald-600">₹{product.pricing?.pricePerSqft?.toLocaleString() || 'N/A'}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Maintenance</p>
                                                    <p className="text-sm font-bold text-slate-800">{product.pricing?.maintenanceCharges > 0 ? `₹${product.pricing.maintenanceCharges.toLocaleString()}` : 'Included'}</p>
                                                </div>
                                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Flexibility</p>
                                                    <p className={`text-sm font-black ${product.pricing?.negotiable ? 'text-primary' : 'text-slate-600'}`}>
                                                        {product.pricing?.negotiable ? 'Negotiable' : 'Fixed Price'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Layout size={12} className="text-blue-500" /> Specifications & Availability</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { label: 'Furnishing', value: product.furnishingStatus },
                                                    { label: 'Direction', value: product.direction },
                                                    { label: 'Availability', value: product.availabilityStatus },
                                                    { label: 'Available From', value: product.availableFrom },
                                                ].map(f => (
                                                    <div key={f.label}>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{f.label}</p>
                                                        <p className="text-sm font-bold text-slate-800 capitalize">{f.value || 'N/A'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><CheckCircle size={12} className="text-primary" /> Amenities</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(product.amenities || []).map(a => (
                                                    <span key={a} className="px-3 py-1 rounded-md text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 capitalize">{a}</span>
                                                ))}
                                                {!(product.amenities?.length > 0) && <span className="text-xs font-bold text-slate-400 italic">No amenities specified</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                  
                                {activeTab === 'Media Assets' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Cover Photo</p>
                                                {(product.coverPhoto || product.images?.[0]) ? (
                                                    <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group shadow-sm" onClick={() => setLightboxImage(product.coverPhoto || product.images[0])}>
                                                        <img src={product.coverPhoto || product.images[0]} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-40 rounded-2xl bg-slate-50 border border-slate-200 border-dashed flex items-center justify-center">
                                                        <p className="text-xs font-bold text-slate-400 italic">No cover photo</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Property Video</p>
                                                <div className={`w-full h-40 border border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 transition-all ${product.video ? 'cursor-pointer hover:border-primary/50 group' : ''}`}
                                                    onClick={() => product.video && setLightboxImage(product.video)}>
                                                    <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-3 transition-colors ${product.video ? 'bg-primary text-white group-hover:scale-110' : 'bg-white text-slate-300'}`}>
                                                        <Play size={20} />
                                                    </div>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${product.video ? 'text-primary' : 'text-slate-400'}`}>
                                                        {product.video ? 'Play Video' : 'No video uploaded'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><ImageIcon size={12} className="text-primary" /> Smart Album Assets</p>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {Object.keys(product.smartAlbum || {}).map(room => (
                                                    <div key={room}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{room}</p>
                                                            <span className="text-[9px] font-bold text-slate-400">({product.smartAlbum[room]?.length || 0})</span>
                                                        </div>
                                                        <div className="grid grid-cols-5 gap-1.5 py-1">
                                                            {product.smartAlbum[room]?.map((img, i) => (
                                                                <img key={i} src={img} onClick={() => setLightboxImage(img)}
                                                                    className="aspect-square w-full object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" alt="" />
                                                            ))}
                                                            {!(product.smartAlbum[room]?.length > 0) && (
                                                                <div className="col-span-5 py-2">
                                                                    <p className="text-[10px] text-slate-400 italic">No assets uploaded</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

           
                                {activeTab === 'Verification' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Identity Verification</p>
                                                {product.ownerVerification?.photo ? (
                                                    <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group relative shadow-sm" onClick={() => setLightboxImage(product.ownerVerification.photo)}>
                                                        <img src={product.ownerVerification.photo} alt="Verification" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-white text-[10px] font-bold px-3 py-1.5 bg-black/50 rounded-full flex items-center gap-2">
                                                                <ImageIcon size={12} /> View {product.ownerVerification?.type || 'Proof'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-32 rounded-xl bg-slate-50 border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
                                                        <XCircle size={20} className="mb-2 text-slate-300" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">No Proof Uploaded</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Owner Photograph</p>
                                                {product.uploader?.photo ? (
                                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 cursor-pointer hover:border-primary/50 transition-colors shadow-sm" onClick={() => setLightboxImage(product.uploader.photo)}>
                                                        <img src={product.uploader.photo} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Owner" />
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                                                        <Users size={32} className="text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                    <Shield size={12} className="text-blue-500" /> Legal / Lawyer Details
                                                </p>
                                                {product.lawyerDetails ? (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lawyer Name</p>
                                                            <p className="text-sm font-bold text-slate-800">{product.lawyerDetails.name || 'Not Provided'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mobile</p>
                                                            <p className="text-sm font-bold text-slate-800">{product.lawyerDetails.mobile || 'Not Provided'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                                            <p className="text-sm font-bold text-slate-800">{product.lawyerDetails.email || 'Not Provided'}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 border-dashed flex items-center justify-center">
                                                        <p className="text-xs font-bold text-slate-400 italic">No lawyer details provided</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                    <Info size={12} className="text-amber-500" /> Banker Details
                                                </p>
                                                {product.bankerDetails?.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {product.bankerDetails.map((banker, idx) => (
                                                            <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                                                                <p className="text-sm font-bold text-slate-800">{banker.name}</p>
                                                                <p className="text-xs font-bold tracking-widest uppercase text-slate-600 shrink-0 ml-2">{banker.number}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 border-dashed flex items-center justify-center">
                                                        <p className="text-xs font-bold text-slate-400 italic">No banker details provided</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                                <Shield size={12} className="text-slate-500" /> Property Ownership Proofs
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {[
                                                    { id: 'saleDeed', label: 'Sale Deed / Title Deed', req: true },
                                                    { id: 'encumbranceCert', label: 'Encumbrance Certificate', req: true },
                                                    { id: 'propertyTaxReceipt', label: 'Property Tax Receipt', req: true },
                                                    { id: 'legalOpinion', label: 'Legal Opinion Document', req: false },
                                                    { id: 'lawyerCert', label: 'Lawyer Certificate', req: false }
                                                ].map(doc => {
                                                    const proofImg = product.ownershipProofs?.[doc.id];
                                                    return (
                                                        <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all flex flex-col gap-2">
                                                            {proofImg ? (
                                                                <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group relative" onClick={() => setLightboxImage(proofImg)}>
                                                                    <img src={proofImg} alt={doc.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <span className="text-white text-[10px] font-bold px-3 py-1.5 bg-black/50 rounded-full flex items-center gap-1"><ImageIcon size={12} /> View</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="w-full h-24 rounded-lg bg-slate-50 border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
                                                                    <XCircle size={18} className="mb-1 text-slate-300" />
                                                                    <span className="text-[9px] font-black uppercase tracking-widest">Not Uploaded</span>
                                                                </div>
                                                            )}
                                                            <div className="px-1">
                                                                <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                                                                <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${doc.req ? 'text-rose-400' : 'text-slate-400'}`}>
                                                                    {doc.req ? 'Required Verification' : 'Optional Support'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div> */}



                            <PropertyForm initialData={product} />
                        </div>


                    </div>


                </>
            )
            }
            {/* Lightbox Modal */}
            {/* Lightbox Modal */}
            <Modal isOpen={!!lightboxMedia} onClose={() => setLightboxMedia(null)} title={lightboxMedia?.type === 'video' ? 'Property Video Tour' : 'Asset Inspection'} size="xl">
                <div className="relative group bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center min-h-[400px]">
                    {lightboxMedia?.type === 'video' ? (
                        <video
                            src={lightboxMedia.url}
                            controls
                            autoPlay
                            className="w-full h-auto max-h-[85vh] object-contain shadow-2xl mx-auto"
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            src={lightboxMedia?.url}
                            className="w-full h-auto max-h-[85vh] object-contain mx-auto transition-transform duration-700"
                            alt="Full Screen Preview"
                        />
                    )}
                    <div className="absolute top-6 right-6 bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest shadow-2xl opacity-0 group-hover:opacity-100 transition-all">
                        {lightboxMedia?.type === 'video' ? 'HDR Video Stream Analysis' : 'High-Resolution Asset Analysis'}
                    </div>
                </div>
            </Modal>

            {/* Status Update Confirmation Modal */}
            <Modal isOpen={!!statusConfirm} onClose={() => setStatusConfirm(null)}
                title={statusConfirm?.type === 'Verified' ? 'Confirm Verification' : 'Listings Rejection'} size="md">
                <div className="p-2">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${statusConfirm?.type === 'Verified' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                            {statusConfirm?.type === 'Verified' ? <CheckCircle size={32} /> : <AlertOctagon size={32} />}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                            {statusConfirm?.type === 'Verified' ? 'Verify Property Listing?' : 'Reason for Rejection'}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 max-w-[280px]">
                            {statusConfirm?.type === 'Verified' ?
                                'This listing will be marked as verified and published to all users. Are you sure you want to proceed?' :
                                'Please provide a clear reason to the uploader why this property listing is being rejected.'}
                        </p>
                    </div>

                    {statusConfirm?.type === 'Rejected' && (
                        <div className="space-y-4 mb-6">
                            <div className="relative">
                                <MessageSquare size={14} className="absolute left-4 top-4 text-slate-400" />
                                <textarea
                                    value={statusConfirm.reason}
                                    onChange={(e) => setStatusConfirm({ ...statusConfirm, reason: e.target.value })}
                                    placeholder="e.g. Incomplete documentation, low quality images..."
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all h-28 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setStatusConfirm(null)}
                            className="px-6 py-3.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                dispatch(updatePropertyStatus({
                                    id: product.id,
                                    status: statusConfirm.type,
                                    rejectionReason: statusConfirm.reason
                                }));
                                setStatusConfirm(null);
                            }}
                            disabled={statusConfirm?.type === 'Rejected' && !statusConfirm.reason?.trim()}
                            className={`px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${statusConfirm?.type === 'Verified' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}`}>
                            {statusConfirm?.type === 'Verified' ? 'Yes, Verify Listing' : 'Confirm Rejection'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div >



    );
}
