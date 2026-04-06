import React, { useState, useRef } from 'react';
import {
    User, Building, MapPin, IndianRupee, Image as ImageIcon,
    ShieldCheck, Check, Layout, Calendar, Play, Plus, UploadCloud, Trash2, Smartphone, CheckCircle, ArrowRight, Lock
} from 'lucide-react';
import Modal from './Modal';

export default function PropertyCreateForm({ initialData, onCancel, onSubmit }) {
    const [openStep, setOpenStep] = useState(1);
    const [formData, setFormData] = useState(initialData || {
        title: '',
        propertyType: 'home',
        uploadertype: 'owner',
        propertyLength: '',
        location: { city: '', locality: '', projectName: '', landmark: '', fullAddress: '' },
        pricing: { expectedPrice: '', pricePerSqft: '', maintenanceCharges: 0, negotiable: true },
        amenities: [],
        locationAdvantages: [],
        furnishingStatus: 'unfurnished',
        direction: 'east',
        availabilityStatus: 'new',
        smartAlbum: { 'Living Room': [], 'Bedroom': [], 'Kitchen': [], 'Bath Room': [] },
        ownershipProofs: {}
    });
    const [lightboxMedia, setLightboxMedia] = useState(null);
    const [isBasicInfoCompleted, setIsBasicInfoCompleted] = useState(false);
    const [isLocationCompleted, setIsLocationCompleted] = useState(false);
    const [isPricingCompleted, setIsPricingCompleted] = useState(false);
    const [isMediaCompleted, setIsMediaCompleted] = useState(false);
    const [isVerificationCompleted, setIsVerificationCompleted] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    const toggleArrayItem = (field, item) => {
        setFormData(prev => {
            const current = prev[field] || [];
            const exists = current.includes(item);
            return {
                ...prev,
                [field]: exists ? current.filter(i => i !== item) : [...current, item]
            };
        });
    };



    // File Input Refs
    const coverInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const smartAlbumRef = useRef({});
    const idVerificationRef = useRef(null);
    const ownerPhotoRef = useRef(null);
    const ownershipProofRefs = useRef({});

    const handleFileChange = (e, field, category, isArray = false) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const urls = files.map(file => URL.createObjectURL(file));

        if (isArray) {
            setFormData(prev => {
                const currentArray = category ? (prev[category]?.[field] || []) : (prev[field] || []);
                const updatedArray = [...currentArray, ...urls];
                return category ? {
                    ...prev,
                    [category]: { ...prev[category], [field]: updatedArray }
                } : {
                    ...prev,
                    [field]: updatedArray
                };
            });
        } else {
            const url = urls[0];
            if (category) {
                handleNestedChange(category, field, url);
            } else {
                handleChange(field, url);
            }
        }
    };

    const steps = [
        { id: 1, title: 'Property Details', icon: <Building size={16} /> },
        { id: 2, title: 'Location', icon: <MapPin size={16} /> },
        { id: 3, title: 'Pricing & Specs', icon: <IndianRupee size={16} /> },
        { id: 4, title: 'Media Assets', icon: <ImageIcon size={16} /> },
        { id: 5, title: 'Verification', icon: <ShieldCheck size={16} /> }
    ];

    return (
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
            {/* Premium Horizontal Stepper */}
            <div className="flex items-center justify-between px-6 py-6 bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide relative">
                {steps.map((step, index) => {
                    const isLocked = step.id === 1 ? false :
                        step.id === 2 ? !isBasicInfoCompleted :
                            step.id === 3 ? !isLocationCompleted :
                                step.id === 4 ? !isPricingCompleted :
                                    step.id === 5 ? !isMediaCompleted : false;

                    return (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => {
                                    if (!isLocked) {
                                        setOpenStep(step.id);
                                    }
                                }}
                                disabled={isLocked}
                                className={`flex items-center gap-3 relative z-10 transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} ${openStep === step.id ? 'text-primary scale-105' : 'text-slate-400 hover:text-slate-600 hover:scale-105'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 border 
                                    ${isLocked ? 'bg-slate-100 text-slate-300 border-slate-200' :
                                        openStep === step.id ? 'bg-primary text-white border-primary shadow-primary/30' :
                                            'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white'}`}>
                                    {isLocked ? <Lock size={16} /> : step.icon}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${openStep === step.id ? 'text-primary/70' : 'text-slate-400'}`}>Step {step.id}</p>
                                    <p className={`text-xs font-black tracking-tight whitespace-nowrap ${openStep === step.id ? 'text-primary' : 'text-slate-600'}`}>
                                        {isLocked ? 'Locked' : step.title}
                                    </p>
                                </div>
                            </button>
                            {index < steps.length - 1 && (
                                <div className="flex-1 min-w-[2rem] mx-4 h-0.5 rounded-full bg-slate-100 relative">
                                    <div className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500 ${openStep > step.id ? 'bg-primary w-full' : 'w-0'}`}></div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="bg-white">
                {/* STEP 1: PROPERTY DETAILS */}
                {openStep === 1 && (
                    <div className="p-10 space-y-7 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6">
                                <User size={12} className="text-primary" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Basic Information</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">You Are</p>
                                    <select
                                        value={formData.uploadertype}
                                        onChange={(e) => handleChange('uploadertype', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="agent">Agent</option>
                                        <option value="builder">Builder</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Property Title</p>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="e.g. Luxury 3BHK Villa in Whitefield"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Kind of Property</p>
                                    <select
                                        value={formData.propertyType}
                                        onChange={(e) => handleChange('propertyType', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    >
                                        <option value="home">Home</option>
                                        <option value="villas">Villas</option>
                                        <option value="flats">Flats</option>
                                        <option value="plots">Plots</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Property Length / Area</p>
                                    <input
                                        type="text"
                                        value={formData.propertyLength}
                                        onChange={(e) => handleChange('propertyLength', e.target.value)}
                                        placeholder="e.g. 2400 Sq.Ft"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => {
                                    setIsBasicInfoCompleted(true);
                                    setOpenStep(2);
                                }}
                                className='bg-primary p-3 text-[15px] text-white rounded-xl text-right flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95'
                            >
                                Save and Next
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: LOCATION */}
                {openStep === 2 && (
                    <div className="p-10 space-y-7 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6">
                            <MapPin size={12} className="text-blue-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Location Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">City</p>
                                <select
                                    value={formData.location?.city}
                                    onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                >
                                    <option value="">Select City</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Delhi NCR">Delhi NCR</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Locality, Area</p>
                                <input
                                    type="text"
                                    value={formData.location?.locality}
                                    onChange={(e) => handleNestedChange('location', 'locality', e.target.value)}
                                    placeholder="e.g. Indiranagar, Sector 4"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Project / Building Name</p>
                                <input
                                    type="text"
                                    value={formData.location?.projectName}
                                    onChange={(e) => handleNestedChange('location', 'projectName', e.target.value)}
                                    placeholder="e.g. Prestige Heights"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Landmark</p>
                                <input
                                    type="text"
                                    value={formData.location?.landmark}
                                    onChange={(e) => handleNestedChange('location', 'landmark', e.target.value)}
                                    placeholder="e.g. Near HDFC Bank"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Address</p>
                                <textarea
                                    value={formData.location?.fullAddress}
                                    onChange={(e) => handleNestedChange('location', 'fullAddress', e.target.value)}
                                    placeholder="Enter complete postal address..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none transition-all"
                                />
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => {
                                    setIsLocationCompleted(true);
                                    setOpenStep(3);
                                }}
                                className='bg-primary p-3 text-[15px] text-white rounded-xl text-right flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95'
                            >
                                Save and Next
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: PRICING & SPECS */}
                {openStep === 3 && (
                    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6">
                                <IndianRupee size={12} className="text-emerald-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Financial Structure</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Expected Price</p>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">₹</span>
                                        <input
                                            type="text"
                                            value={formData.pricing?.expectedPrice}
                                            onChange={(e) => handleNestedChange('pricing', 'expectedPrice', e.target.value)}
                                            placeholder="e.g. 1.2 Cr"
                                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Price per SqFt</p>
                                    <input
                                        type="number"
                                        value={formData.pricing?.pricePerSqft}
                                        onChange={(e) => handleNestedChange('pricing', 'pricePerSqft', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Maintenance</p>
                                    <input
                                        type="number"
                                        value={formData.pricing?.maintenanceCharges}
                                        onChange={(e) => handleNestedChange('pricing', 'maintenanceCharges', parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div
                                    onClick={() => handleNestedChange('pricing', 'negotiable', !formData.pricing?.negotiable)}
                                    className={`h-11 px-4 mt-6 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${formData.pricing?.negotiable ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${formData.pricing?.negotiable ? 'border-primary bg-primary' : 'border-slate-300 bg-white'}`}>
                                        {formData.pricing?.negotiable && <Check size={10} className="text-white" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Negotiable</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 mb-6">
                                <Layout size={12} className="text-blue-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Specifications</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Furnishing</p>
                                    <select
                                        value={formData.furnishingStatus}
                                        onChange={(e) => handleChange('furnishingStatus', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    >
                                        <option value="unfurnished">Unfurnished</option>
                                        <option value="semi-furnished">Semi-Furnished</option>
                                        <option value="fully-furnished">Fully-Furnished</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Direction</p>
                                    <select
                                        value={formData.direction}
                                        onChange={(e) => handleChange('direction', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    >
                                        <option value="east">East</option>
                                        <option value="west">West</option>
                                        <option value="north">North</option>
                                        <option value="south">South</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Availability</p>
                                    <select
                                        value={formData.availabilityStatus}
                                        onChange={(e) => handleChange('availabilityStatus', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    >
                                        <option value="new">New / Ready</option>
                                        <option value="under construction">Under Construction</option>
                                        <option value="resale">Resale</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6 border-t border-slate-50">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Amenities</p>
                                <div className="flex flex-wrap gap-2">
                                    {['WiFi', 'Pool', 'Gym', 'Parking', 'Security', 'Power Backup'].map(amenity => (
                                        <button
                                            key={amenity}
                                            onClick={() => toggleArrayItem('amenities', amenity)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${formData.amenities?.includes(amenity) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                                        >
                                            {amenity}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Location Advantages</p>
                                <div className="flex flex-wrap gap-2">
                                    {['School', 'Hospital', 'Metro', 'Mall', 'Highway'].map(adv => (
                                        <button
                                            key={adv}
                                            onClick={() => toggleArrayItem('locationAdvantages', adv)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all ${formData.locationAdvantages?.includes(adv) ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                                        >
                                            {adv}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => {
                                    setIsPricingCompleted(true);
                                    setOpenStep(4);
                                }}
                                className='bg-primary p-3 text-[15px] text-white rounded-xl text-right flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95'
                            >
                                Save and Next
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: MEDIA ASSETS */}
                {openStep === 4 && (
                    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Cover Photo</p>
                                <div
                                    className="w-full h-[260px] rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center group hover:border-primary/50 hover:bg-white transition-all cursor-pointer overflow-hidden relative"
                                    onClick={() => coverInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={coverInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'coverPhoto')}
                                    />
                                    {formData.coverPhoto ? (
                                        <>
                                            <img src={formData.coverPhoto} className="w-full h-full object-cover" alt="Cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full">Change Photo</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <UploadCloud size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Cover Asset</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Property Video Tour</p>
                                <div
                                    onClick={() => videoInputRef.current?.click()}
                                    className="w-full h-[260px] border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-white hover:border-primary/50 transition-all flex flex-col items-center justify-center group cursor-pointer overflow-hidden relative"
                                >
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        className="hidden"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, 'video')}
                                    />
                                    {formData.video ? (
                                        <div className="relative w-full h-full">
                                            <video
                                                src={formData.video}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                onMouseOver={(e) => e.target.play()}
                                                onMouseOut={(e) => e.target.pause()}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Play size={24} className="text-white" fill="white" />
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full">Change Video</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4 group-hover:bg-primary/5 group-hover:border-primary transition-all">
                                                <Play size={20} className="text-slate-400 group-hover:text-primary translate-x-0.5" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Video Tour</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Smart Album Assets</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {Object.keys(formData.smartAlbum || {}).map(room => (
                                    <div key={room}>
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{room}</p>
                                            <button
                                                onClick={() => smartAlbumRef.current[room]?.click()}
                                                className="w-6 h-6 rounded-lg bg-primary/5 text-primary border border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                                            >
                                                <input
                                                    type="file"
                                                    ref={el => smartAlbumRef.current[room] = el}
                                                    className="hidden"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        const urls = files.map(file => URL.createObjectURL(file));
                                                        handleChange('smartAlbum', { ...formData.smartAlbum, [room]: [...(formData.smartAlbum[room] || []), ...urls] });
                                                    }}
                                                />
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2">
                                            {formData.smartAlbum[room]?.map((img, i) => (
                                                <div key={i} className="relative group">
                                                    <img src={img} className="aspect-square w-full object-cover rounded-lg border border-slate-200" alt="" />
                                                    <button
                                                        onClick={() => {
                                                            const filtered = formData.smartAlbum[room].filter((_, idx) => idx !== i);
                                                            handleChange('smartAlbum', { ...formData.smartAlbum, [room]: filtered });
                                                        }}
                                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Plus size={10} className="rotate-45" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                onClick={() => {
                                    setIsMediaCompleted(true);
                                    setOpenStep(5);
                                }}
                                className='bg-primary p-3 text-[15px] text-white rounded-xl text-right flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95'
                            >
                                Save and Next
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 5: VERIFICATION */}
                {openStep === 5 && (
                    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Identity Verification</p>
                                <div
                                    className="w-full h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:bg-white hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
                                    onClick={() => idVerificationRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={idVerificationRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'photo', 'ownerVerification')}
                                    />
                                    {formData.ownerVerification?.photo ? (
                                        <img src={formData.ownerVerification.photo} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <>
                                            <Smartphone size={18} className="text-slate-300 mb-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Adhaar/ID</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Owner Photograph</p>
                                <div
                                    className="w-24 h-24 rounded-full border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center hover:border-primary transition-all cursor-pointer overflow-hidden relative"
                                    onClick={() => ownerPhotoRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={ownerPhotoRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'photo', 'uploader')}
                                    />
                                    {formData.uploader?.photo ? (
                                        <img src={formData.uploader.photo} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <User size={32} className="text-slate-300" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Property Ownership Proofs</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'saleDeed', label: 'Sale Deed / Title Deed' },
                                    { id: 'encumbranceCert', label: 'Encumbrance Certificate' },
                                    { id: 'propertyTaxReceipt', label: 'Property Tax Receipt' }
                                ].map(doc => (
                                    <div
                                        key={doc.id}
                                        onClick={() => ownershipProofRefs.current[doc.id]?.click()}
                                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all cursor-pointer group"
                                    >
                                        <input
                                            type="file"
                                            ref={el => ownershipProofRefs.current[doc.id] = el}
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => handleFileChange(e, doc.id, 'ownershipProofs')}
                                        />
                                        <div className="w-full h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center mb-3 group-hover:bg-primary/5 transition-all">
                                            {formData.ownershipProofs?.[doc.id] ? (
                                                <img src={formData.ownershipProofs[doc.id]} className="w-full h-full object-cover rounded-lg" alt="" />
                                            ) : (
                                                <Plus size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-rose-400 mt-1">Required</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-10 border-t border-slate-100">
                            <button
                                onClick={onCancel}
                                className="px-8 py-4 rounded-[1.5rem] border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={() => onSubmit(formData)}
                                className="px-10 py-4 rounded-[1.5rem] bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-primary transition-all active:scale-95 flex items-center gap-2"
                            >
                                <CheckCircle size={14} /> Verify & List Property
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox for Preview */}
            <Modal
                isOpen={!!lightboxMedia}
                onClose={() => setLightboxMedia(null)}
                title="Asset Preview"
                size="xl"
            >
                <div className="p-4">
                    <img src={lightboxMedia?.url} className="w-full rounded-xl" alt="" />
                </div>
            </Modal>


        </div>
    );
}
