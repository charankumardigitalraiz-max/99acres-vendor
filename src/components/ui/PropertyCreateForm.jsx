import React, { useState, useRef } from 'react';
import {
    User, Building, MapPin, IndianRupee, Image as ImageIcon,
    ShieldCheck, Check, Layout, Calendar, Play, Plus, UploadCloud, Trash2, Smartphone, CheckCircle, ArrowRight, Lock,
    FileText, Briefcase, Phone, Mail, Award, Info, FileStack, Camera, Video, ChevronLeft
} from 'lucide-react';
import Modal from './Modal';
import {
    BAR_COUNCILS,
    APPROVAL_AUTHORITIES,
    PROJECT_TYPES,
    PROPERTY_TYPES,
    PROPERTY_STATUSES,
    STAMP_DUTY_OPTIONS,
    GST_OPTIONS,
    AGENT_FEE_OPTIONS,
    FACING_OPTIONS,
    LAND_AREA_UNITS,
    COMMERCIAL_TYPES,
    AMENITIES
} from '../../constants/formOptions';

export default function PropertyCreateForm({ initialData, onCancel, onSubmit }) {
    const [openStep, setOpenStep] = useState(1);
    const [formData, setFormData] = useState(initialData || {
        // Step 1: Professional Profile
        personalDetails: {
            companyName: '',
            contactPersonName: { firstName: '', lastName: '' },
            contactNumber: '',
            email: '',
            gstNumber: '',
            address: '',
            idCard: null
        },
        legalAdvisor: {
            firstName: '',
            lastName: '',
            rollNumber: '',
            contactNumber: '',
            memberOf: BAR_COUNCILS[0]
        },
        salesDept: { firstName: '', lastName: '', phoneNumber: '', email: '' },
        loanDept: { firstName: '', lastName: '', phoneNumber: '', email: '' },
        previousProjects: [], // Array of { name, location, type }
        aboutCompany: '',

        // Step 2: Project & Property Info
        postingAs: 'Owner',
        propertyType: PROPERTY_TYPES[0],
        projectName: '',
        projectApprovedBy: APPROVAL_AUTHORITIES[0],

        // Step 3: Technical Specs & Permits
        approvalLetters: [],
        layoutPermissionNumber: '',
        buildingPermissionNumber: '',
        hmdaApprovalNumber: '',
        reraCertificate: null,
        reraExpiry: '',

        // Specialized Specs (Conditionally used based on propertyType)
        numberOfFloors: '',
        vastuCompliant: 'Yes',
        facing: FACING_OPTIONS[0],

        // For Multi-unit & Standalone
        flatSizes: {
            '1 BHK': '',
            '2 BHK': '',
            '2.5 BHK': '',
            '3 BHK': '',
            '3.5 BHK': '',
            '4 BHK': '',
            '5 BHK': ''
        },

        // For Standalone/Villas
        plotArea: '',
        plotAreaUnit: 'Sq. Yards',
        builtUpArea: '',

        // For Lands/Plots
        totalArea: '',
        totalAreaUnit: LAND_AREA_UNITS[0],
        dimensions: { length: '', width: '' },
        boundaryWall: 'No',
        roadWidth: '',

        // For Commercial
        commercialType: COMMERCIAL_TYPES[0],
        washrooms: 'Shared',

        // Step 4: Financials & Media
        propertyStatus: PROPERTY_STATUSES[0],
        priceDetails: {
            totalPrice: '',
            pricePerSft: '',
            pricePerAcre: '',
            pricePerSqYard: ''
        },
        stampDuty: STAMP_DUTY_OPTIONS[0],
        gstStatus: GST_OPTIONS[0],
        agentFee: AGENT_FEE_OPTIONS[0],
        amenities: [],
        media: {
            poster: null,
            photos: [],
            video: null,
            videoConsent: false
        }
    });

    const [lightboxMedia, setLightboxMedia] = useState(null);
    const [isStep1Completed, setIsStep1Completed] = useState(false);
    const [isStep2Completed, setIsStep2Completed] = useState(false);
    const [isStep3Completed, setIsStep3Completed] = useState(false);
    const isResidential = ['Apartment', 'Builder floor Apartments', 'Penthouse', 'Studio Flat'].includes(formData.propertyType);
    const isStandalone = ['Residential House / Individual House', 'Villa Project', 'Farm House'].includes(formData.propertyType);
    const isLand = ['Residential Plot', 'Agriculture Land', 'Land for Development'].includes(formData.propertyType);
    const isCommercial = formData.propertyType === 'Commercial Space';

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: { ...prev[category], [field]: value }
        }));
    };

    const handleDeepNestedChange = (category, subCategory, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [subCategory]: { ...prev[category][subCategory], [field]: value }
            }
        }));
    };

    const handleFileChange = (e, field, category, isArray = false) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // In a real app, you'd upload these to a server. For now, we'll use local URLs.
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

    // File Input Refs
    const idCardRef = useRef(null);
    const approvalLettersRef = useRef(null);
    const reraCertRef = useRef(null);
    const posterRef = useRef(null);
    const photosRef = useRef(null);
    const videoRef = useRef(null);

    const steps = [
        { id: 1, title: 'Professional Profile', icon: <User size={16} /> },
        { id: 2, title: 'Project & Property', icon: <Building size={16} /> },
        { id: 3, title: 'Specs & Permits', icon: <FileText size={16} /> },
        { id: 4, title: 'Financials & Media', icon: <IndianRupee size={16} /> }
    ];

    return (
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
            {/* Premium Horizontal Stepper */}
            <div className="flex items-center justify-between px-6 py-6 bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide relative">
                {steps.map((step, index) => {
                    const isLocked = step.id === 1 ? false :
                        step.id === 2 ? !isStep1Completed :
                            step.id === 3 ? !isStep2Completed :
                                step.id === 4 ? !isStep3Completed : false;

                    return (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => {
                                    if (!isLocked) {
                                        setOpenStep(step.id);
                                    }
                                }}
                                disabled={isLocked}
                                className={`flex items-center gap-3 relative z-10 transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} ${openStep === step.id ? 'text-primary scale-105' : 'text-slate-600 hover:text-slate-600 hover:scale-105'}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 border 
                                    ${isLocked ? 'bg-slate-100 text-slate-300 border-slate-200' :
                                        openStep === step.id ? 'bg-primary text-white border-primary shadow-primary/30' :
                                            'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'}`}>
                                    {isLocked ? <Lock size={16} /> : step.icon}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${openStep === step.id ? 'text-primary/70' : 'text-slate-600'}`}>Step {step.id}</p>
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
                {/* STEP 1: PROFESSIONAL PROFILE */}
                {openStep === 1 && (
                    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Personal Details */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <User className="text-primary" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Personal Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Company Name</p>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.companyName}
                                        onChange={(e) => handleNestedChange('personalDetails', 'companyName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Enter company name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">First Name</p>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.contactPersonName.firstName}
                                        onChange={(e) => handleDeepNestedChange('personalDetails', 'contactPersonName', 'firstName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Last Name</p>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.contactPersonName.lastName}
                                        onChange={(e) => handleDeepNestedChange('personalDetails', 'contactPersonName', 'lastName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Last Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Contact Number</p>
                                    <input
                                        type="tel"
                                        value={formData.personalDetails.contactNumber}
                                        onChange={(e) => handleNestedChange('personalDetails', 'contactNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">E-mail</p>
                                    <input
                                        type="email"
                                        value={formData.personalDetails.email}
                                        onChange={(e) => handleNestedChange('personalDetails', 'email', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">GST Number</p>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.gstNumber}
                                        onChange={(e) => handleNestedChange('personalDetails', 'gstNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="GST Registration No."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Address</p>
                                    <textarea
                                        value={formData.personalDetails.address}
                                        onChange={(e) => handleNestedChange('personalDetails', 'address', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all h-20 resize-none"
                                        placeholder="Full business address"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload ID Card</p>
                                    <div
                                        onClick={() => idCardRef.current?.click()}
                                        className="h-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-primary/50 transition-all overflow-hidden relative"
                                    >
                                        <input type="file" ref={idCardRef} className="hidden" onChange={(e) => handleFileChange(e, 'idCard', 'personalDetails')} />
                                        {formData.personalDetails.idCard ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                                <Check size={14} className="mr-1" /> ID Uploaded
                                            </div>
                                        ) : (
                                            <>
                                                <Camera size={18} className="text-slate-300 mb-1" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Legal Advisor */}
                        <section className="pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Award className="text-primary" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Legal Advisor</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">First Name</p>
                                    <input
                                        type="text"
                                        value={formData.legalAdvisor.firstName}
                                        onChange={(e) => handleNestedChange('legalAdvisor', 'firstName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Legal Advisor's First Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Last Name</p>
                                    <input
                                        type="text"
                                        value={formData.legalAdvisor.lastName}
                                        onChange={(e) => handleNestedChange('legalAdvisor', 'lastName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Legal Advisor's Last Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Roll Number</p>
                                    <input
                                        type="text"
                                        value={formData.legalAdvisor.rollNumber}
                                        onChange={(e) => handleNestedChange('legalAdvisor', 'rollNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Bar Roll Number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Contact Number</p>
                                    <input
                                        type="tel"
                                        value={formData.legalAdvisor.contactNumber}
                                        onChange={(e) => handleNestedChange('legalAdvisor', 'contactNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Legal Advisor's Phone"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Member of (Bar Council)</p>
                                    <select
                                        value={formData.legalAdvisor.memberOf}
                                        onChange={(e) => handleNestedChange('legalAdvisor', 'memberOf', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    >
                                        {BAR_COUNCILS.map(council => (
                                            <option key={council} value={council}>{council}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Departments */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 pt-10 border-t border-slate-100">
                            {/* Sales Dept */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Briefcase className="text-blue-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Sales Department</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">First Name</p>
                                        <input type="text" value={formData.salesDept.firstName} onChange={(e) => handleNestedChange('salesDept', 'firstName', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="First Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Last Name</p>
                                        <input type="text" value={formData.salesDept.lastName} onChange={(e) => handleNestedChange('salesDept', 'lastName', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Last Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Phone</p>
                                        <input type="tel" value={formData.salesDept.phoneNumber} onChange={(e) => handleNestedChange('salesDept', 'phoneNumber', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Phone" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Email</p>
                                        <input type="email" value={formData.salesDept.email} onChange={(e) => handleNestedChange('salesDept', 'email', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Email" />
                                    </div>
                                </div>
                            </section>

                            {/* Loan Dept */}
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <IndianRupee className="text-emerald-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Loan Department</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">First Name</p>
                                        <input type="text" value={formData.loanDept.firstName} onChange={(e) => handleNestedChange('loanDept', 'firstName', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="First Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Last Name</p>
                                        <input type="text" value={formData.loanDept.lastName} onChange={(e) => handleNestedChange('loanDept', 'lastName', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Last Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Phone</p>
                                        <input type="tel" value={formData.loanDept.phoneNumber} onChange={(e) => handleNestedChange('loanDept', 'phoneNumber', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Phone" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Email</p>
                                        <input type="email" value={formData.loanDept.email} onChange={(e) => handleNestedChange('loanDept', 'email', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Email" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Previous Projects */}
                        <section className="pt-10 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <FileStack className="text-orange-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Previous Projects Completed</h3>
                                </div>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, previousProjects: [...prev.previousProjects, { name: '', location: '', type: PROJECT_TYPES[0] }] }))}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                                >
                                    <Plus size={14} /> Add Project
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.previousProjects.map((project, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 relative group">
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Project Name</p>
                                            <input type="text" value={project.name} onChange={(e) => {
                                                const newProjects = [...formData.previousProjects];
                                                newProjects[index].name = e.target.value;
                                                handleChange('previousProjects', newProjects);
                                            }} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Location (City, State)</p>
                                            <input type="text" value={project.location} onChange={(e) => {
                                                const newProjects = [...formData.previousProjects];
                                                newProjects[index].location = e.target.value;
                                                handleChange('previousProjects', newProjects);
                                            }} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Type of Project</p>
                                            <select value={project.type} onChange={(e) => {
                                                const newProjects = [...formData.previousProjects];
                                                newProjects[index].type = e.target.value;
                                                handleChange('previousProjects', newProjects);
                                            }} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none">
                                                {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-end pb-1">
                                            <button
                                                onClick={() => {
                                                    const newProjects = formData.previousProjects.filter((_, i) => i !== index);
                                                    handleChange('previousProjects', newProjects);
                                                }}
                                                className="w-full py-2 bg-rose-50 text-rose-500 rounded-lg border border-rose-100 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Trash2 size={12} className="inline mr-1" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {formData.previousProjects.length === 0 && (
                                    <div className="py-10 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-600">
                                        <Info size={24} className="mb-2 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No previous projects added</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* About Company */}
                        <section className="pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Info className="text-primary" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">About Company</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Short Writeup (Min 1000 words space provided)</p>
                                <textarea
                                    value={formData.aboutCompany}
                                    onChange={(e) => handleChange('aboutCompany', e.target.value)}
                                    className="w-full px-6 py-5 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-[2.5rem] text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all h-60 resize-none leading-relaxed"
                                    placeholder="Enter details about your company, achievements, and vision..."
                                />
                                <div className="flex justify-end">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                        {formData.aboutCompany.split(/\s+/).filter(Boolean).length} / 1000 words recommended
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Footer Navigation */}
                        <div className="flex items-center justify-end pt-10 border-t border-slate-100">
                            <button
                                onClick={() => {
                                    setIsStep1Completed(true);
                                    setOpenStep(2);
                                }}
                                className="px-5 py-3 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3"
                            >
                                Continue to Project Details <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: PROJECT & PROPERTY INFO */}
                {openStep === 2 && (
                    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Building className="text-primary" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Property Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Posting Property as</p>
                                    <div className="flex gap-2">
                                        {['Owner', 'Builder', 'Agent'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => handleChange('postingAs', option)}
                                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${formData.postingAs === option ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-2 border-slate-200 text-slate-800 hover:border-slate-300'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Property Type</p>
                                    <select
                                        value={formData.propertyType}
                                        onChange={(e) => handleChange('propertyType', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    >
                                        {PROPERTY_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Name of the Project / Society</p>
                                    <input
                                        type="text"
                                        value={formData.projectName}
                                        onChange={(e) => handleChange('projectName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Enter project/society name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Project Approved by</p>
                                    <select
                                        value={formData.projectApprovedBy}
                                        onChange={(e) => handleChange('projectApprovedBy', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    >
                                        {APPROVAL_AUTHORITIES.map(auth => (
                                            <option key={auth} value={auth}>{auth}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Footer Navigation */}
                        <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                            <button
                                onClick={() => setOpenStep(1)}
                                className="px-5 py-3 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft size={14} /> Previous Step
                            </button>
                            <button
                                onClick={() => {
                                    setIsStep2Completed(true);
                                    setOpenStep(3);
                                }}
                                className="px-5 py-3 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3"
                            >
                                Continue to Specs & Permits <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: TECHNICAL SPECS & PERMITS */}
                {openStep === 3 && (
                    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Permissions & Numbers */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <FileText className="text-primary" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Permissions & Approval Numbers</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Layout Permission No.</p>
                                    <input
                                        type="text"
                                        value={formData.layoutPermissionNumber}
                                        onChange={(e) => handleChange('layoutPermissionNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="No."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Building Permission No.</p>
                                    <input
                                        type="text"
                                        value={formData.buildingPermissionNumber}
                                        onChange={(e) => handleChange('buildingPermissionNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="No."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">HMDA Approval Number</p>
                                    <input
                                        type="text"
                                        value={formData.hmdaApprovalNumber}
                                        onChange={(e) => handleChange('hmdaApprovalNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="No."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Approval Letters</p>
                                    <div
                                        onClick={() => approvalLettersRef.current?.click()}
                                        className="h-11 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-white hover:border-primary/50 transition-all relative overflow-hidden"
                                    >
                                        <input type="file" ref={approvalLettersRef} className="hidden" multiple onChange={(e) => handleFileChange(e, 'approvalLetters', null, true)} />
                                        {formData.approvalLetters.length > 0 ? (
                                            <span className="text-[10px] font-bold text-emerald-600">{formData.approvalLetters.length} Files Added</span>
                                        ) : (
                                            <UploadCloud size={16} className="text-slate-300" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* RERA Section */}
                        <section className="pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <ShieldCheck className="text-emerald-500" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">RERA Certification</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload RERA Certificate</p>
                                    <div
                                        onClick={() => reraCertRef.current?.click()}
                                        className="h-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-primary/50 transition-all overflow-hidden relative"
                                    >
                                        <input type="file" ref={reraCertRef} className="hidden" onChange={(e) => handleFileChange(e, 'reraCertificate')} />
                                        {formData.reraCertificate ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest text-center px-4">
                                                <CheckCircle size={14} className="mr-1" /> Certificate Attached
                                            </div>
                                        ) : (
                                            <>
                                                <UploadCloud size={20} className="text-slate-300 mb-1" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">RERA Expiry Date</p>
                                    <input
                                        type="date"
                                        value={formData.reraExpiry}
                                        onChange={(e) => handleChange('reraExpiry', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Category Helpers */}

                        {/* SECTION: RESIDENTIAL (MULTI-UNIT) & STANDALONE */}
                        {(isResidential || isStandalone) && (
                            <section className="pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <Layout className="text-blue-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                                        {isStandalone ? 'Villa / House Specifications' : 'Building Specifications'}
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        {isStandalone && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Total Plot Area</p>
                                                    <div className="flex">
                                                        <input type="text" value={formData.plotArea} onChange={(e) => handleChange('plotArea', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-l-xl text-xs font-bold outline-none" placeholder="Area" />
                                                        <select value={formData.plotAreaUnit} onChange={(e) => handleChange('plotAreaUnit', e.target.value)} className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl px-2 text-[10px] font-bold outline-none">
                                                            <option value="Sq. Yards">Sq.Yd</option>
                                                            <option value="Sft">Sft</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Built-up Area (Sft)</p>
                                                    <input type="text" value={formData.builtUpArea} onChange={(e) => handleChange('builtUpArea', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Sft" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Number of Floors</p>
                                                <input type="number" value={formData.numberOfFloors} onChange={(e) => handleChange('numberOfFloors', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Total Floors" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Facing</p>
                                                <select value={formData.facing} onChange={(e) => handleChange('facing', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                                    {FACING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Vastu Compliant</p>
                                            <div className="flex gap-2">
                                                {['Yes', 'No'].map(option => (
                                                    <button key={option} onClick={() => handleChange('vastuCompliant', option)} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${formData.vastuCompliant === option ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-2 border-slate-200 text-slate-800 hover:border-slate-300'}`}>
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Config & Sizes (Total Sft)</p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            {Object.keys(formData.flatSizes).map(bhk => (
                                                <div key={bhk} className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-500 min-w-[50px]">{bhk}</span>
                                                    <input type="text" value={formData.flatSizes[bhk]} onChange={(e) => handleNestedChange('flatSizes', bhk, e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none" placeholder="Sft" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* SECTION: LAND / PLOTS */}
                        {isLand && (
                            <section className="pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPin className="text-emerald-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Land Specifications</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Total Area</p>
                                        <div className="flex">
                                            <input type="text" value={formData.totalArea} onChange={(e) => handleChange('totalArea', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-l-xl text-xs font-bold outline-none" placeholder="Value" />
                                            <select value={formData.totalAreaUnit} onChange={(e) => handleChange('totalAreaUnit', e.target.value)} className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl px-2 text-[10px] font-bold outline-none">
                                                {LAND_AREA_UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Facing</p>
                                        <select value={formData.facing} onChange={(e) => handleChange('facing', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                            {FACING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Road Width (ft)</p>
                                        <input type="text" value={formData.roadWidth} onChange={(e) => handleChange('roadWidth', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="e.g. 40 ft" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Dimensions (L x W)</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input type="text" value={formData.dimensions.length} onChange={(e) => handleNestedChange('dimensions', 'length', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Length" />
                                            <input type="text" value={formData.dimensions.width} onChange={(e) => handleNestedChange('dimensions', 'width', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Width" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Boundary Wall</p>
                                        <div className="flex gap-2">
                                            {['Yes', 'No'].map(option => (
                                                <button key={option} onClick={() => handleChange('boundaryWall', option)} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${formData.boundaryWall === option ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-2 border-slate-200 text-slate-800 hover:border-slate-300'}`}>
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* SECTION: COMMERCIAL */}
                        {isCommercial && (
                            <section className="pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-2 mb-6">
                                    <Building className="text-blue-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Commercial Specifications</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Floor Number</p>
                                        <input type="text" value={formData.numberOfFloors} onChange={(e) => handleChange('numberOfFloors', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Floor No." />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Commercial Type</p>
                                        <select value={formData.commercialType} onChange={(e) => handleChange('commercialType', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                            {COMMERCIAL_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Washrooms</p>
                                        <select value={formData.washrooms} onChange={(e) => handleChange('washrooms', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                            <option value="Private">Private</option>
                                            <option value="Shared">Shared</option>
                                            <option value="None">None</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Total Area (Sft)</p>
                                        <input type="text" value={formData.builtUpArea} onChange={(e) => handleChange('builtUpArea', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Sft" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Facing</p>
                                        <select value={formData.facing} onChange={(e) => handleChange('facing', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                            {FACING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>
                        )}


                        {/* Footer Navigation */}
                        <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                            <button
                                onClick={() => setOpenStep(2)}
                                className="px-5 py-3 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft size={14} /> Previous Step
                            </button>
                            <button
                                onClick={() => {
                                    setIsStep3Completed(true);
                                    setOpenStep(4);
                                }}
                                className="px-5 py-3 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3"
                            >
                                Continue to Financials & Media <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: FINANCIALS & MEDIA */}
                {openStep === 4 && (
                    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Status & Pricing */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <IndianRupee className="text-primary" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Status & Pricing</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Property Status</p>
                                    <select
                                        value={formData.propertyStatus}
                                        onChange={(e) => handleChange('propertyStatus', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    >
                                        {PROPERTY_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Total Price</p>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px]">₹</span>
                                        <input
                                            type="text"
                                            value={formData.priceDetails.totalPrice}
                                            onChange={(e) => handleNestedChange('priceDetails', 'totalPrice', e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Total Price"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 md:col-span-2 lg:col-span-1">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Price/Sft</p>
                                        <input type="text" value={formData.priceDetails.pricePerSft} onChange={(e) => handleNestedChange('priceDetails', 'pricePerSft', e.target.value)} className="w-full px-3 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="₹" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Price/Acre</p>
                                        <input type="text" value={formData.priceDetails.pricePerAcre} onChange={(e) => handleNestedChange('priceDetails', 'pricePerAcre', e.target.value)} className="w-full px-3 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="₹" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Price/SqYd</p>
                                        <input type="text" value={formData.priceDetails.pricePerSqYard} onChange={(e) => handleNestedChange('priceDetails', 'pricePerSqYard', e.target.value)} className="w-full px-3 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="₹" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Stamp Duty & Registration Charge</p>
                                    <select value={formData.stampDuty} onChange={(e) => handleChange('stampDuty', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                        {STAMP_DUTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">GST Status</p>
                                    <select value={formData.gstStatus} onChange={(e) => handleChange('gstStatus', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                        {GST_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className={`space-y-2 ${formData.postingAs === 'Agent' ? '' : 'hidden'}`} >
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Agent Fee</p>
                                    <select value={formData.agentFee} onChange={(e) => handleChange('agentFee', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none">
                                        {AGENT_FEE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Amenities Section */}
                        {(isResidential || isStandalone) && (
                            <section className="pt-10 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-6">
                                    <Award className="text-emerald-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Amenities</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {AMENITIES.map(amenity => {
                                        const isSelected = formData.amenities?.includes(amenity);
                                        return (
                                            <button
                                                key={amenity}
                                                onClick={() => {
                                                    const current = formData.amenities || [];
                                                    handleChange('amenities', isSelected ? current.filter(a => a !== amenity) : [...current, amenity]);
                                                }}
                                                className={`px-4 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold border transition-all active:scale-95 ${isSelected ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                {amenity}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Media Section */}
                        <section className="pt-10 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <ImageIcon className="text-blue-500" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Media Assets</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Poster & Photos */}
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Main Poster Photo</p>
                                        <div
                                            onClick={() => posterRef.current?.click()}
                                            className="h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative group"
                                        >
                                            <input type="file" ref={posterRef} className="hidden" onChange={(e) => handleFileChange(e, 'poster', 'media')} />
                                            {formData.media.poster ? (
                                                <img src={formData.media.poster} className="w-full h-full object-cover" alt="Poster" />
                                            ) : (
                                                <>
                                                    <Camera size={24} className="text-slate-300 mb-2" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload Poster</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Property Gallery (5-6 Photos)</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {formData.media.photos.map((img, i) => (
                                                <div key={i} className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative group">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleChange('media', { ...formData.media, photos: formData.media.photos.filter((_, idx) => idx !== i) }); }}
                                                        className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Plus size={12} className="rotate-45" />
                                                    </button>
                                                </div>
                                            ))}
                                            <div
                                                onClick={() => photosRef.current?.click()}
                                                className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-300 hover:text-primary transition-all"
                                            >
                                                <input type="file" ref={photosRef} className="hidden" multiple onChange={(e) => handleFileChange(e, 'photos', 'media', true)} />
                                                <Plus size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Video & Consent */}
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Product Video (Max 20MB)</p>
                                        <div
                                            onClick={() => videoRef.current?.click()}
                                            className="h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-all overflow-hidden relative group"
                                        >
                                            <input type="file" ref={videoRef} className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video', 'media')} />
                                            {formData.media.video ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                                                    <Play size={32} />
                                                    <span className="text-[10px] font-black uppercase mt-2">Video Attached</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Video size={24} className="text-slate-300 mb-2" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload Video</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => handleNestedChange('media', 'videoConsent', !formData.media.videoConsent)}
                                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-4 cursor-pointer hover:bg-white transition-all"
                                    >
                                        <div className={`mt-1 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-all ${formData.media.videoConsent ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}>
                                            {formData.media.videoConsent && <Check size={12} className="text-white" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-700 leading-relaxed">
                                                I give consent and permission to upload this video in our YouTube Channel and all other Social Media platforms at no cost nor the benefit from Social Media platforms.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FINAL STEP: Summary & Submission */}
                        <div className="pt-10 border-t border-slate-100">
                            <div className="p-6 rounded-[2rem] bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                        <CheckCircle className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-widest">Ready to List</h4>
                                        <p className="text-[10px] text-slate-400 font-bold">Please review all information before final listing.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => setOpenStep(3)}
                                        className="flex-1 md:flex-none px-8 py-4 border bg-red-800 border-slate-800 text-white hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => onSubmit(formData)}
                                        className="flex-1 md:flex-none px-5 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95"
                                    >
                                        Verify & List Property
                                    </button>
                                </div>
                            </div>
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
