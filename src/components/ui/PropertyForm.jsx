import React, { useState, useRef } from 'react';
import {
    User, Building, MapPin, IndianRupee, Image as ImageIcon,
    ShieldCheck, Check, Layout, Calendar, Image, Play, XCircle, CheckCircle, Briefcase, Plus, UploadCloud, Trash2
} from 'lucide-react';
import Modal from './Modal';

export default function PropertyForm({ initialData }) {
    const [openStep, setOpenStep] = useState(1);
    const [formData, setFormData] = useState(initialData || {});
    const [lightboxMedia, setLightboxMedia] = useState(null); // { type: 'image' | 'video', url: string }
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [tempVideoLink, setTempVideoLink] = useState('');
    const handleVideoLinkChange = (e) => {
        setFormData({ ...formData, video: e.target.value });
    };

    const handleRemoveVideo = (e) => {
        if (e) e.stopPropagation();
        setFormData({ ...formData, video: '' });
    };

    const handleSaveVideoLink = () => {
        setFormData({ ...formData, video: tempVideoLink });
        setIsVideoModalOpen(false);
    };

    const openVideoModal = (e) => {
        if (e) e.stopPropagation();
        setTempVideoLink(formData.video || '');
        setIsVideoModalOpen(true);
    };

    const getYouTubeID = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYouTubeThumbnail = (url) => {
        const id = getYouTubeID(url);
        return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
    };

    const getEmbedUrl = (url) => {
        const id = getYouTubeID(url);
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
    };

    const steps = [
        { id: 1, title: 'Property Details', icon: <Building size={16} /> },
        { id: 2, title: 'Pricing & Specs', icon: <IndianRupee size={16} /> },
        { id: 3, title: 'Media Assets', icon: <ImageIcon size={16} /> },
        { id: 4, title: 'Verification', icon: <ShieldCheck size={16} /> }
    ];

    return (
        <div className="bg-white  border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
            {/* <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Building size={18} className="text-primary" />
                    Property Listing Details
                </h2>
                <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Read Only Form</span>
                </div>
            </div> */}

            {/* Premium Horizontal Stepper / Tabs */}
            <div className="flex items-center justify-between px-6 py-6 bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide relative">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <button
                            onClick={() => setOpenStep(step.id)}
                            className={`flex items-center gap-3 relative z-10 transition-all ${openStep === step.id ? 'text-primary scale-105' : 'text-slate-400 hover:text-slate-600 hover:scale-105'}`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 border ${openStep === step.id ? 'bg-primary text-white border-primary shadow-primary/30' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white'}`}>
                                {step.icon}
                            </div>
                            <div className="text-left hidden md:block">
                                <p className={`text-[9px] font-black uppercase tracking-widest ${openStep === step.id ? 'text-primary/70' : 'text-slate-400'}`}>Step {step.id}</p>
                                <p className={`text-xs font-black tracking-tight whitespace-nowrap ${openStep === step.id ? 'text-primary' : 'text-slate-600'}`}>{step.title}</p>
                            </div>
                        </button>
                        {index < steps.length - 1 && (
                            <div className="flex-1 min-w-[2rem] mx-4 h-0.5 rounded-full bg-slate-100 relative">
                                <div className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ${openStep > step.id ? 'bg-primary w-full' : 'w-0'}`}></div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="bg-white">
                {/* STEP 1: PROPERTY & LOCATION DETAILS */}
                {openStep === 1 && (
                    <div className="p-10 space-y-7 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Basic Section */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6 transition-all hover:bg-white hover:shadow-sm">
                                <User size={12} className="text-primary" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                    Basic Information
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">You Are</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{formData.uploadertype || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Property Title</p>
                                    <p className="text-sm font-bold text-slate-800">{formData.title || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kind of Property</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{formData.propertyType || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Property Length / Area</p>
                                    <p className="text-sm font-bold text-slate-800">{formData.propertyLength || 'Not Provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6 transition-all hover:bg-white hover:shadow-sm">
                                <MapPin size={12} className="text-blue-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                    Location Details
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">City</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{formData.location?.city || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Locality, Area</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{formData.location?.locality || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Project / Building Name</p>
                                    <p className="text-sm font-bold text-slate-800">{formData.location?.projectName || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Landmark</p>
                                    <p className="text-sm font-bold text-slate-800">{formData.location?.landmark || 'Not Provided'}</p>
                                </div>
                                <div className="md:col-span-2 pt-4 border-t border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Address</p>
                                    <p className="text-sm font-bold text-slate-800 leading-relaxed max-w-3xl">{formData.location?.fullAddress || 'Not Provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: PRICING & ADVANTAGES */}
                {openStep === 2 && (
                    <div className="p-10 space-y-7 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-3 transition-all hover:bg-white hover:shadow-sm">
                                <IndianRupee size={12} className="text-emerald-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                    Financial Structure
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Expected Price</p>
                                    <p className="text-xl font-black text-slate-800 tracking-tight">{formData.pricing?.expectedPrice || 'Not Provided'}</p>
                                </div>
                                <div className="md:border-l border-slate-100 md:pl-8">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Price per SqFt</p>
                                    <p className="text-base font-black text-emerald-600">{formData.pricing?.pricePerSqft || 'Not Provided'}</p>
                                </div>
                                <div className="md:border-l border-slate-100 md:pl-8">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Maintenance</p>
                                    <p className="text-sm font-bold text-slate-800">{formData.pricing?.maintenanceCharges || 'Included'}</p>
                                </div>
                                <div className="md:border-l border-slate-100 md:pl-8">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Flexibility</p>
                                    <p className={`text-sm font-black ${formData.pricing?.negotiable === 'true' || formData.pricing?.negotiable === true ? 'text-primary' : 'text-slate-600'}`}>
                                        {formData.pricing?.negotiable === 'true' || formData.pricing?.negotiable === true ? 'Negotiable' : 'Fixed Price'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Divider Line 1 */}
                        <div className="border-t border-slate-100 pt-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6 transition-all hover:bg-white hover:shadow-sm">
                                <Layout size={12} className="text-blue-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                    Specifications & Availability
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Furnishing</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{formData.furnishingStatus || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Direction</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{formData.direction || 'Not Provided'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Availability</p>
                                    <p className="text-sm font-bold text-slate-800 capitalize">{formData.availabilityStatus || 'Not Provided'}</p>
                                </div>
                                {formData.availabilityStatus === 'under construction' && (
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Available From</p>
                                        <p className="text-sm font-bold text-slate-800">{formData.availableFrom || 'Not Provided'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divider Line 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-5 border-t border-slate-100">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-4 transition-all hover:bg-white hover:shadow-sm">
                                    <CheckCircle size={12} className="text-primary" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                        Amenities
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(formData.amenities || []).map(amenity => (
                                        <span
                                            key={amenity}
                                            className="px-3 py-1 rounded-md text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                    {!(formData.amenities?.length > 0) && (
                                        <span className="text-xs font-bold text-slate-400 italic">No amenities specified</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-4 transition-all hover:bg-white hover:shadow-sm">
                                    <MapPin size={12} className="text-emerald-500" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                        Location Advantages
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(formData.locationAdvantages || []).map(adv => (
                                        <span
                                            key={adv}
                                            className="px-3 py-1 rounded-md text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200"
                                        >
                                            {adv}
                                        </span>
                                    ))}
                                    {!(formData.locationAdvantages?.length > 0) && (
                                        <span className="text-xs font-bold text-slate-400 italic">No advantages specified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: IMAGES AND VIDEOS */}
                {openStep === 3 && (
                    <div className="p-7 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Cover Photo</p>
                                {formData.coverPhoto || (formData.images && formData.images[0]) ? (
                                    <div
                                        className="w-full h-[260px] rounded-[2rem] overflow-hidden border border-slate-200 cursor-pointer group"
                                        onClick={() => setLightboxMedia({ type: 'image', url: formData.coverPhoto || formData.images[0] })}
                                    >
                                        <img src={formData.coverPhoto || formData.images[0]} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-slate-400 italic">No cover photo uploaded</p>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Property Video Tour</p>

                                {formData.video ? (
                                    <div className="space-y-4">
                                        <div
                                            className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group/preview cursor-pointer h-[260px]"
                                            onClick={() => setLightboxMedia({ type: 'video', url: formData.video })}
                                        >
                                            {getYouTubeThumbnail(formData.video) ? (
                                                <img
                                                    src={getYouTubeThumbnail(formData.video)}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover/preview:scale-105 duration-700 opacity-60"
                                                    alt="Video Thumbnail"
                                                    onError={(e) => {
                                                        e.target.src = `https://img.youtube.com/vi/${getYouTubeID(formData.video)}/0.jpg`;
                                                    }}
                                                />
                                            ) : null}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover/preview:bg-black/10 transition-all">
                                                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transform group-hover/preview:scale-110 transition-transform">
                                                    <Play size={24} fill="white" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white mt-4 shadow-sm opacity-80">Play Property Tour</p>
                                            </div>

                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity z-10">
                                                <button
                                                    onClick={openVideoModal}
                                                    className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                                                    title="Change Link"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveVideo(); }}
                                                    className="w-8 h-8 rounded-lg bg-rose-500/80 backdrop-blur-md border border-rose-400/20 text-white flex items-center justify-center hover:bg-rose-600 transition-all"
                                                    title="Remove Video"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 truncate px-2 italic">Source: {formData.video}</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={openVideoModal}
                                        className="w-full h-[260px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-white hover:border-primary/50 transition-all group flex flex-col items-center justify-center"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                            <Play size={20} className="text-slate-400 group-hover:text-primary transition-colors translate-x-0.5" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Add Video Tour Link</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1 opacity-60">YouTube, Vimeo, or Direct URL</p>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="pt-7 border-t border-slate-100">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6 transition-all hover:bg-white hover:shadow-sm">
                                <ImageIcon size={12} className="text-primary" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                    Smart Album Assets
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7">
                                {Object.keys(formData.smartAlbum || {}).map(room => (
                                    <div key={room}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{room}</p>
                                            <span className="text-[9px] font-bold text-slate-400">({formData.smartAlbum[room]?.length || 0})</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-1.5 py-1">
                                            {formData.smartAlbum[room]?.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    onClick={() => setLightboxMedia({ type: 'image', url: img })}
                                                    className="aspect-square w-full object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                                                    alt=""
                                                />
                                            ))}
                                            {!(formData.smartAlbum[room]?.length > 0) && (
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

                {/* STEP 4: VERIFICATION */}
                {openStep === 4 && (
                    <div className="p-7 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Identity Verification</p>
                                <div className="mt-3">
                                    {formData.ownerVerification?.photo ? (
                                        <div
                                            className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group relative"
                                            onClick={() => setLightboxMedia({ type: 'image', url: formData.ownerVerification.photo })}
                                        >
                                            <img src={formData.ownerVerification.photo} alt="Verification" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-[10px] font-bold px-3 py-1.5 bg-black/50 rounded-full flex items-center gap-2">
                                                    <ImageIcon size={12} /> View {formData.ownerVerification?.type || 'Proof'}
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
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Owner Photograph</p>
                                {formData.uploader?.photo ? (
                                    <div
                                        className="w-24 h-24 overflow-hidden border-2 border-slate-200 cursor-pointer hover:border-primary/50 transition-colors"
                                        onClick={() => setLightboxMedia({ type: 'image', url: formData.uploader.photo })}
                                    >
                                        <img src={formData.uploader.photo} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Owner" />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                                        <User size={32} className="text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {/* Legal Details */}
                            <div className="pt-4 border-t lg:border-t-0 lg:pt-0">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6 transition-all hover:bg-white hover:shadow-sm">
                                    <Briefcase size={12} className="text-blue-500" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                        Legal / Lawyer Details
                                    </h4>
                                </div>
                                {formData.lawyerDetails ? (
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lawyer Name</p>
                                            <p className="text-sm font-bold text-slate-800">{formData.lawyerDetails.name || 'Not Provided'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mobile</p>
                                                <p className="text-sm font-bold text-slate-800">{formData.lawyerDetails.mobile || 'Not Provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                                <p className="text-sm font-bold text-slate-800">{formData.lawyerDetails.email || 'Not Provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 border-dashed flex items-center justify-center">
                                        <p className="text-xs font-bold text-slate-400 italic">No lawyer details provided</p>
                                    </div>
                                )}
                            </div>

                            {/* Banker Details */}
                            <div className="pt-4 border-t lg:border-t-0 lg:pt-0">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6 transition-all hover:bg-white hover:shadow-sm">
                                    <Building size={12} className="text-amber-500" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                        Banker Details
                                    </h4>
                                </div>
                                {formData.bankerDetails?.length > 0 ? (
                                    <div className="space-y-4">
                                        {formData.bankerDetails.map((banker, idx) => (
                                            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{banker.name}</p>
                                                </div>
                                                <div className="text-right text-slate-600">
                                                    <p className="text-xs font-bold tracking-widest uppercase">{banker.number}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 border-dashed flex items-center justify-center">
                                        <p className="text-xs font-bold text-slate-400 italic">No banker details provided</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-7 border-t border-slate-100">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6 transition-all hover:bg-white hover:shadow-sm">
                                <ShieldCheck size={12} className="text-slate-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                                    Property Ownership Proofs
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {[
                                    { id: 'saleDeed', label: 'Sale Deed / Title Deed', req: true },
                                    { id: 'encumbranceCert', label: 'Encumbrance Certificate', req: true },
                                    { id: 'propertyTaxReceipt', label: 'Property Tax Receipt', req: true },
                                    { id: 'legalOpinion', label: 'Legal Opinion Document', req: false },
                                    { id: 'lawyerCert', label: 'Lawyer Certificate', req: false }
                                ].map(doc => {
                                    const proofImg = formData.ownershipProofs?.[doc.id];
                                    return (
                                        <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all flex flex-col gap-3">
                                            {proofImg ? (
                                                <div
                                                    className="w-full h-32 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group relative"
                                                    onClick={() => setLightboxMedia({ type: 'image', url: proofImg })}
                                                >
                                                    <img src={proofImg} alt={doc.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-[10px] font-bold px-3 py-1.5 bg-black/50 rounded-full flex items-center gap-2"><ImageIcon size={12} /> View Image</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-32 rounded-lg bg-slate-50 border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
                                                    <XCircle size={20} className="mb-2 text-slate-300" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Not Uploaded</span>
                                                </div>
                                            )}
                                            <div className="px-1">
                                                <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${doc.req ? 'text-rose-400' : 'text-slate-400'}`}>
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
            </div>

            {/* Media Lightbox */}
            <Modal
                isOpen={!!lightboxMedia}
                onClose={() => setLightboxMedia(null)}
                title={lightboxMedia?.type === 'video' ? 'Property Video Tour' : 'Asset Inspection'}
                size="xl"
            >
                {lightboxMedia && (
                    <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative w-full flex items-center justify-center min-h-[300px]">
                        {lightboxMedia.type === 'video' ? (
                            getYouTubeID(lightboxMedia.url) ? (
                                <iframe
                                    src={getEmbedUrl(lightboxMedia.url)}
                                    className="w-full aspect-video border-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Property Video Tour"
                                ></iframe>
                            ) : (
                                <video
                                    src={lightboxMedia.url}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[70vh] object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )
                        ) : (
                            <img
                                src={lightboxMedia.url}
                                alt="High Resolution Inspection"
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                        )}
                    </div>
                )}
            </Modal>

            {/* Video Link Entry Modal */}
            <Modal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                title="Property Video Tour"
                size="md"
            >
                <div className="p-2 space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <Play size={32} fill="currentColor" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Video Presentation</h3>
                        <p className="text-xs font-medium text-slate-500 max-w-[280px]">Paste a YouTube link or a direct video URL below to add a virtual tour to this property listing.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <Plus size={14} />
                            </div>
                            <input
                                type="text"
                                autoFocus
                                value={tempVideoLink}
                                onChange={(e) => setTempVideoLink(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        {tempVideoLink && getYouTubeThumbnail(tempVideoLink) && (
                            <div className="relative rounded-[2rem] overflow-hidden aspect-video border border-slate-200 bg-slate-100 animate-in fade-in zoom-in-95 duration-500">
                                <img
                                    src={getYouTubeThumbnail(tempVideoLink)}
                                    className="w-full h-full object-cover"
                                    alt="Manual Preview"
                                    onError={(e) => e.target.src = `https://img.youtube.com/vi/${getYouTubeID(tempVideoLink)}/0.jpg`}
                                />
                                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                        <Play size={16} fill="white" />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white mt-2 shadow-sm">Verified Preview</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={() => setIsVideoModalOpen(false)}
                            className="px-6 py-4 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all font-black"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSaveVideoLink}
                            disabled={!tempVideoLink.trim()}
                            className="px-6 py-4 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
