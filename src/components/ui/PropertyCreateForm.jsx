import React, { useState, useRef, useEffect } from 'react';
import {
    User, Building, MapPin, IndianRupee, Image as ImageIcon,
    ShieldCheck, Check, Layout, Calendar, Play, Plus, UploadCloud, Trash2, Smartphone, CheckCircle, ArrowRight, Lock,
    FileText, Briefcase, Phone, Mail, Award, Info, FileStack, Camera, Video, ChevronLeft, ChevronDown,
    Waves, Dumbbell, Zap, Car, ArrowUpCircle, Users, Trees, Activity, Droplets, CloudRain
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
    const [isSalesExpanded, setIsSalesExpanded] = useState(false);
    const [isLoanExpanded, setIsLoanExpanded] = useState(false);
    const [isLegalExpanded, setIsLegalExpanded] = useState(false);
    const [isPropertyInfoExpanded, setIsPropertyInfoExpanded] = useState(true);
    const [isReraExpanded, setIsReraExpanded] = useState(false);
    const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
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
        layoutPermissionDoc: null,
        buildingPermissionNumber: '',
        buildingPermissionDoc: null,
        hmdaApprovalNumber: '',
        hmdaApprovalDoc: null,
        reraCertificate: null,
        reraNumber: '',
        reraExpiry: '',
        additionalApprovals: [], // Array of { title: '', number: '', doc: null }

        // Specialized Specs (Conditionally used based on propertyType)
        numberOfFloors: '',
        vastuCompliant: 'No',
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
            pricePerSqYard: '',
            priceUnit: 'Sft'
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

    const handleAddAdditionalApproval = () => {
        setFormData(prev => ({
            ...prev,
            additionalApprovals: [
                ...prev.additionalApprovals,
                { title: '', number: '', doc: null }
            ]
        }));
    };

    const handleUpdateAdditionalApproval = (index, field, value) => {
        setFormData(prev => {
            const updated = [...prev.additionalApprovals];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, additionalApprovals: updated };
        });
    };

    const handleDeleteAdditionalApproval = (index) => {
        setFormData(prev => ({
            ...prev,
            additionalApprovals: prev.additionalApprovals.filter((_, i) => i !== index)
        }));
    };

    const handleAdditionalApprovalFileChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        handleUpdateAdditionalApproval(index, 'doc', url);
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
    const layoutPermissionRef = useRef(null);
    const buildingPermissionRef = useRef(null);
    const hmdaApprovalRef = useRef(null);
    const approvalLettersRef = useRef(null);
    const reraCertRef = useRef(null);
    const posterRef = useRef(null);
    const photosRef = useRef(null);
    const videoRef = useRef(null);
    const additionalApprovalRef = useRef(null);
    const aboutCompanyRef = useRef(null);

    const handleSaveDraft = () => {
        onSubmit({ ...formData, status: 'draft' });
    };

    // Auto-resize textarea for About Company
    useEffect(() => {
        if (aboutCompanyRef.current) {
            aboutCompanyRef.current.style.height = 'auto';
            aboutCompanyRef.current.style.height = `${aboutCompanyRef.current.scrollHeight}px`;
        }
    }, [formData.aboutCompany]);

    // Amenities Icon Mapping
    const AMENITY_ICONS = {
        "Swimming Pool": <Waves size={16} />,
        "Gymnasium": <Dumbbell size={16} />,
        "Power Backup": <Zap size={16} />,
        "24/7 Security": <ShieldCheck size={16} />,
        "Car Parking": <Car size={16} />,
        "Elevator / Lift": <ArrowUpCircle size={16} />,
        "Club House": <Users size={16} />,
        "Park / Play Area": <Trees size={16} />,
        "Jogging Track": <Activity size={16} />,
        "Water Supply (24/7)": <Droplets size={16} />,
        "Rain Water Harvesting": <CloudRain size={16} />,
        "CCTV Surveillance": <Video size={16} />
    };

    const steps = [
        { id: 1, title: 'Professional Profile', icon: <User size={16} /> },
        { id: 2, title: 'Property Details', icon: <Building size={16} /> },
        { id: 3, title: 'Financials & Media', icon: <IndianRupee size={16} /> }
    ];

    // Previous Projects Modal State
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProjectIndex, setEditingProjectIndex] = useState(null);
    const [currentProject, setCurrentProject] = useState({
        name: '',
        location: '',
        type: PROJECT_TYPES[0],
        image: null
    });

    const handleOpenProjectModal = (index = null) => {
        if (index !== null) {
            setEditingProjectIndex(index);
            setCurrentProject({ ...formData.previousProjects[index] });
        } else {
            setEditingProjectIndex(null);
            setCurrentProject({
                name: '',
                location: '',
                type: PROJECT_TYPES[0],
                image: null
            });
        }
        setShowProjectModal(true);
    };

    const handleProjectImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCurrentProject(prev => ({ ...prev, image: url }));
        }
    };

    const handleSaveProject = () => {
        if (!currentProject.name || !currentProject.location) return;

        const updatedProjects = [...formData.previousProjects];
        if (editingProjectIndex !== null) {
            updatedProjects[editingProjectIndex] = currentProject;
        } else {
            updatedProjects.push(currentProject);
        }

        handleChange('previousProjects', updatedProjects);
        setShowProjectModal(false);
    };

    return (
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
            {/* Premium Horizontal Stepper */}
            <div className="flex items-center justify-between px-6 py-6 bg-white border-b border-slate-100 overflow-x-auto scrollbar-hide relative">
                {steps.map((step, index) => {
                    const isLocked = step.id === 1 ? false :
                        step.id === 2 ? !isStep1Completed :
                            step.id === 3 ? !isStep2Completed : false;

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
                                {/* <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">First Name</p>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.contactPersonName.firstName}
                                        onChange={(e) => handleDeepNestedChange('personalDetails', 'contactPersonName', 'firstName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="First Name"
                                    />
                                </div> */}
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Contact Person Full Name</p>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.contactPersonName.lastName}
                                        onChange={(e) => handleDeepNestedChange('personalDetails', 'contactPersonName', 'lastName', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Enter the Full name"
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
                                {/* <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">GST Number</p>
                                    <input
                                         type="text"
                                        value={formData.personalDetails.gstNumber}
                                        onChange={(e) => handleNestedChange('personalDetails', 'gstNumber', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="GST Registration No."
                                    />
                                </div> */}
                                <div className="md:col-span-2 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Address</p>
                                    <input
                                        type="text"
                                        value={formData.personalDetails.address}
                                        onChange={(e) => handleNestedChange('personalDetails', 'address', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Full business address"
                                    />
                                </div>

                            </div>
                        </section>

                        {/* Legal Advisor */}
                        <section className={`transition-all duration-300 border-2 border-slate-100 rounded-2xl p-4 ${isLegalExpanded ? 'bg-slate-50/50 border-primary/20 shadow-sm' : 'hover:border-slate-200'}`}>
                            <button
                                onClick={() => setIsLegalExpanded(!isLegalExpanded)}
                                className="flex items-center justify-between w-full group transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Award className="text-primary" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Legal Advisor</h3>
                                    {!isLegalExpanded && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2 bg-slate-100 px-2 py-0.5 rounded-full">Required</span>}
                                </div>
                                <div className={`p-1.5 rounded-lg border transition-all ${isLegalExpanded ? 'bg-primary text-white border-primary rotate-180' : 'bg-white border-slate-200 text-slate-400 group-hover:border-primary/30 group-hover:text-primary'}`}>
                                    <ChevronDown size={14} />
                                </div>
                            </button>

                            {isLegalExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 animate-in fade-in slide-in-from-top-3 duration-500">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Full Name</p>
                                        <input
                                            type="text"
                                            value={formData.legalAdvisor.lastName}
                                            onChange={(e) => handleNestedChange('legalAdvisor', 'lastName', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none transition-all"
                                            placeholder="Legal Advisor's Full Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Enroll Number</p>
                                        <input
                                            type="text"
                                            value={formData.legalAdvisor.rollNumber}
                                            onChange={(e) => handleNestedChange('legalAdvisor', 'rollNumber', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none transition-all"
                                            placeholder="Bar Roll Number"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Member of (Bar Council)</p>
                                        <select
                                            value={formData.legalAdvisor.memberOf}
                                            onChange={(e) => handleNestedChange('legalAdvisor', 'memberOf', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none transition-all"
                                        >
                                            {BAR_COUNCILS.map(council => (
                                                <option key={council} value={council}>{council}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Contact Number</p>
                                        <input
                                            type="tel"
                                            value={formData.legalAdvisor.contactNumber}
                                            onChange={(e) => handleNestedChange('legalAdvisor', 'contactNumber', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none transition-all"
                                            placeholder="Legal Advisor's Phone"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload ID Card</p>
                                        <div
                                            onClick={() => idCardRef.current?.click()}
                                            className="h-11 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-row items-center justify-center cursor-pointer hover:bg-white hover:border-primary/50 transition-all overflow-hidden relative"
                                        >
                                            <input type="file" ref={idCardRef} className="hidden" onChange={(e) => handleFileChange(e, 'idCard', 'personalDetails')} />
                                            {formData.personalDetails.idCard ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                                    <CheckCircle size={14} className="mr-1" /> ID Uploaded
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
                            )}
                        </section>

                        {/* Departments */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
                            {/* Sales Dept */}
                            <section className={`transition-all duration-300 border-2 border-slate-100 rounded-2xl p-4 ${isSalesExpanded ? 'bg-slate-50/50 border-primary/20 shadow-sm' : 'hover:border-slate-200'}`}>
                                <button
                                    onClick={() => setIsSalesExpanded(!isSalesExpanded)}
                                    className="flex items-center justify-between w-full group transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="text-blue-500" size={18} />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Sales Department</h3>
                                        {!isSalesExpanded && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>}
                                    </div>
                                    <div className={`p-1.5 rounded-lg border transition-all ${isSalesExpanded ? 'bg-primary text-white border-primary rotate-180' : 'bg-white border-slate-200 text-slate-400 group-hover:border-primary/30 group-hover:text-primary'}`}>
                                        <ChevronDown size={14} />
                                    </div>
                                </button>

                                {isSalesExpanded && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-in fade-in slide-in-from-top-3 duration-500">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Full Name</p>
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
                                )}
                            </section>

                            {/* Loan Dept */}
                            <section className={`transition-all duration-300 border-2 border-slate-100 rounded-2xl p-4 ${isLoanExpanded ? 'bg-slate-50/50 border-primary/20 shadow-sm' : 'hover:border-slate-200'}`}>
                                <button
                                    onClick={() => setIsLoanExpanded(!isLoanExpanded)}
                                    className="flex items-center justify-between w-full group transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="text-emerald-500" size={18} />
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Loan Department</h3>
                                        {!isLoanExpanded && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>}
                                    </div>
                                    <div className={`p-1.5 rounded-lg border transition-all ${isLoanExpanded ? 'bg-primary text-white border-primary rotate-180' : 'bg-white border-slate-200 text-slate-400 group-hover:border-primary/30 group-hover:text-primary'}`}>
                                        <ChevronDown size={14} />
                                    </div>
                                </button>

                                {isLoanExpanded && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-in fade-in slide-in-from-top-3 duration-500">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Full Name</p>
                                            <input type="text" value={formData.loanDept.lastName} onChange={(e) => handleNestedChange('loanDept', 'lastName', e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none" placeholder="Enter the Full name" />
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
                                )}
                            </section>
                        </div>

                        {/* Previous Projects */}
                        <section >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <FileStack className="text-orange-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Previous Projects Completed if Any</h3>
                                </div>
                                {/* <button
                                    onClick={() => handleOpenProjectModal()}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95"
                                >
                                    <Plus size={14} /> Add Project
                                </button> */}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {formData.previousProjects.map((project, index) => (
                                    <div key={index} className="group relative bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-4 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                            {project.image ? (
                                                <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-slate-200">
                                                    <ImageIcon size={20} strokeWidth={1.5} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[7px] font-black uppercase tracking-widest border border-slate-100">{project.type}</span>
                                            </div>
                                            <h4 className="text-[11px] font-black text-slate-800 truncate leading-tight">{project.name}</h4>
                                            <div className="flex items-center gap-1 mt-1 text-slate-400">
                                                <MapPin size={9} />
                                                <span className="text-[8px] font-bold truncate tracking-wider uppercase">{project.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button
                                                onClick={() => handleOpenProjectModal(index)}
                                                className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Camera size={12} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newProjects = formData.previousProjects.filter((_, i) => i !== index);
                                                    handleChange('previousProjects', newProjects);
                                                }}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Remove"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {formData.previousProjects.length === 0 && (
                                    <button
                                        onClick={() => handleOpenProjectModal()}
                                        className="col-span-full group border-2 border-dashed  rounded-2xl p-4 flex items-center justify-center gap-4 border-primary/30 hover:bg-slate-50/50 transition-all duration-500 cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:rotate-90 transition-all duration-500">
                                            <Plus size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-0.5">Add Your First Project</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">Click here to showcase your completions</p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* About Company */}
                        <section >
                            <div className="flex items-center gap-2 mb-6">
                                <Info className="text-primary" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">About Company</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Short Writeup (Min 1000 words space provided)</p>
                                <textarea
                                    ref={aboutCompanyRef}
                                    value={formData.aboutCompany}
                                    onChange={(e) => handleChange('aboutCompany', e.target.value)}
                                    rows={3}
                                    className="w-full px-6 py-5 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-[1.3rem] text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none leading-relaxed overflow-hidden"
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
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={handleSaveDraft}
                                className="px-5 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <FileText size={16} /> Save as Draft
                            </button>
                            <button
                                onClick={() => {
                                    setIsStep1Completed(true);
                                    setOpenStep(2);
                                }}
                                className="px-5 py-3 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3"
                            >
                                Continue to Property Details <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: PROJECT & PROPERTY INFO */}
                {openStep === 2 && (
                    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Property Information */}
                        <section className={`transition-all duration-300 border-2 border-slate-100 rounded-2xl p-4 ${isPropertyInfoExpanded ? 'bg-slate-50/50 border-primary/20 shadow-sm' : 'hover:border-slate-200'}`}>
                            <button
                                onClick={() => setIsPropertyInfoExpanded(!isPropertyInfoExpanded)}
                                className="flex items-center justify-between w-full group transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Building className="text-primary" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Property Information</h3>
                                    {!isPropertyInfoExpanded && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2 bg-slate-100 px-2 py-0.5 rounded-full">Required</span>}
                                </div>
                                <div className={`p-1.5 rounded-lg border transition-all ${isPropertyInfoExpanded ? 'bg-primary text-white border-primary rotate-180' : 'bg-white border-slate-200 text-slate-400 group-hover:border-primary/30 group-hover:text-primary'}`}>
                                    <ChevronDown size={14} />
                                </div>
                            </button>

                            {isPropertyInfoExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-in fade-in slide-in-from-top-3 duration-500">
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
                            )}
                        </section>

                        {/* Old Step 3 content merged into Step 2 */}

                        {/* RERA & Approvals Section */}
                        <section className={`transition-all duration-300 border-2 border-slate-100 rounded-2xl p-4 ${isReraExpanded ? 'bg-slate-50/50 border-primary/20 shadow-sm' : 'hover:border-slate-200'}`}>
                            <button
                                onClick={() => setIsReraExpanded(!isReraExpanded)}
                                className="flex items-center justify-between w-full group transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">RERA & Approvals</h3>
                                    {!isReraExpanded && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2 bg-slate-100 px-2 py-0.5 rounded-full">Required</span>}
                                </div>
                                <div className={`p-1.5 rounded-lg border transition-all ${isReraExpanded ? 'bg-primary text-white border-primary rotate-180' : 'bg-white border-slate-200 text-slate-400 group-hover:border-primary/30 group-hover:text-primary'}`}>
                                    <ChevronDown size={14} />
                                </div>
                            </button>

                            {isReraExpanded && (
                                <div className="space-y-8 mt-8 animate-in fade-in slide-in-from-top-3 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">RERA Number</p>
                                            <input
                                                type="text"
                                                value={formData.reraNumber}
                                                onChange={(e) => handleChange('reraNumber', e.target.value)}
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none transition-all"
                                                placeholder="e.g. P0220000..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload RERA Certificate</p>
                                            <div
                                                onClick={() => reraCertRef.current?.click()}
                                                className="py-2 flex flex-row items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50  cursor-pointer hover:bg-white hover:border-primary/50 transition-all overflow-hidden relative"
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

                                    <div className="pt-6 border-t border-slate-100">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
                                            <FileText className="text-primary" size={16} />
                                            Permissions & Approval Numbers
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Layout Permission No.</p>
                                                        <input
                                                            type="text"
                                                            value={formData.layoutPermissionNumber}
                                                            onChange={(e) => handleChange('layoutPermissionNumber', e.target.value)}
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold transition-all outline-none"
                                                            placeholder="No."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload Layout Document</p>
                                                        <div
                                                            onClick={() => layoutPermissionRef.current?.click()}
                                                            className={`h-11 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${formData.layoutPermissionDoc ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-primary/30'}`}
                                                        >
                                                            <input type="file" ref={layoutPermissionRef} className="hidden" onChange={(e) => handleFileChange(e, 'layoutPermissionDoc')} />
                                                            {formData.layoutPermissionDoc ? <CheckCircle size={18} /> : <UploadCloud size={18} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Building Permission No.</p>
                                                        <input
                                                            type="text"
                                                            value={formData.buildingPermissionNumber}
                                                            onChange={(e) => handleChange('buildingPermissionNumber', e.target.value)}
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold transition-all outline-none"
                                                            placeholder="No."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload Building Document</p>
                                                        <div
                                                            onClick={() => buildingPermissionRef.current?.click()}
                                                            className={`h-11 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${formData.buildingPermissionDoc ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-primary/30'}`}
                                                        >
                                                            <input type="file" ref={buildingPermissionRef} className="hidden" onChange={(e) => handleFileChange(e, 'buildingPermissionDoc')} />
                                                            {formData.buildingPermissionDoc ? <CheckCircle size={18} /> : <UploadCloud size={18} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">HMDA Approval No.</p>
                                                        <input
                                                            type="text"
                                                            value={formData.hmdaApprovalNumber}
                                                            onChange={(e) => handleChange('hmdaApprovalNumber', e.target.value)}
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold transition-all outline-none"
                                                            placeholder="No."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload HMDA Document</p>
                                                        <div
                                                            onClick={() => hmdaApprovalRef.current?.click()}
                                                            className={`h-11 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${formData.hmdaApprovalDoc ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-primary/30'}`}
                                                        >
                                                            <input type="file" ref={hmdaApprovalRef} className="hidden" onChange={(e) => handleFileChange(e, 'hmdaApprovalDoc')} />
                                                            {formData.hmdaApprovalDoc ? <CheckCircle size={18} /> : <UploadCloud size={18} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center h-full min-h-[120px]">
                                                <button
                                                    onClick={handleAddAdditionalApproval}
                                                    className="w-full h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3  border-primary/30 bg-slate-50 text-primary transition-all group"
                                                >
                                                    <div className="p-3  rounded-xl bg-primary text-white">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Add More Approval</span>
                                                </button>
                                            </div>

                                            {formData.additionalApprovals.map((approval, index) => (
                                                <div key={index} className="space-y-4 p-4 border-2 border-dashed border-slate-100 rounded-2xl relative group col-span-1 md:col-span-2 lg:col-span-1">
                                                    <button
                                                        onClick={() => handleDeleteAdditionalApproval(index)}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-rose-200 z-10"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Approval Title</p>
                                                        <input
                                                            type="text"
                                                            value={approval.title}
                                                            onChange={(e) => handleUpdateAdditionalApproval(index, 'title', e.target.value)}
                                                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold transition-all outline-none"
                                                            placeholder="e.g. Fire Safety, Environmental"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Approval Number</p>
                                                            <input
                                                                type="text"
                                                                value={approval.number}
                                                                onChange={(e) => handleUpdateAdditionalApproval(index, 'number', e.target.value)}
                                                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold transition-all outline-none"
                                                                placeholder="No."
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Upload Document</p>
                                                            <div
                                                                onClick={() => {
                                                                    const input = document.getElementById(`additional-doc-${index}`);
                                                                    input?.click();
                                                                }}
                                                                className={`h-11 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${approval.doc ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:border-primary/30'}`}
                                                            >
                                                                <input
                                                                    type="file"
                                                                    id={`additional-doc-${index}`}
                                                                    className="hidden"
                                                                    onChange={(e) => handleAdditionalApprovalFileChange(e, index)}
                                                                />
                                                                {approval.doc ? <CheckCircle size={18} /> : <UploadCloud size={18} />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Category Specifications */}
                        {/* SECTION: RESIDENTIAL (MULTI-UNIT) & STANDALONE */}
                        {/* Category Specifications */}
                        <section className={`transition-all duration-300 border-2 border-slate-100 rounded-2xl p-4 ${isSpecsExpanded ? 'bg-slate-50/50 border-primary/20 shadow-sm' : 'hover:border-slate-200'}`}>
                            <button
                                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                                className="flex items-center justify-between w-full group transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Layout className="text-blue-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                                        {isStandalone ? 'Villa / House Specifications' : isLand ? 'Land Specifications' : isCommercial ? 'Commercial Specifications' : 'Building Specifications'}
                                    </h3>
                                    {!isSpecsExpanded && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-2 bg-slate-100 px-2 py-0.5 rounded-full">Required</span>}
                                </div>
                                <div className={`p-1.5 rounded-lg border transition-all ${isSpecsExpanded ? 'bg-primary text-white border-primary rotate-180' : 'bg-white border-slate-200 text-slate-400 group-hover:border-primary/30 group-hover:text-primary'}`}>
                                    <ChevronDown size={14} />
                                </div>
                            </button>

                            {isSpecsExpanded && (
                                <div className="mt-8 animate-in fade-in slide-in-from-top-3 duration-500">
                                    {/* SECTION: RESIDENTIAL (MULTI-UNIT) & STANDALONE */}
                                    {(isResidential || isStandalone) && (
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
                                                        {['No', 'Yes'].map(option => (
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
                                    )}
                                    {/* SECTION: LAND / PLOTS */}
                                    {isLand && (
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
                                    )}

                                    {/* SECTION: COMMERCIAL */}
                                    {isCommercial && (
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
                                    )}
                                </div>
                            )}
                        </section>
                        {/* Footer Navigation */}
                        <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                            <button
                                onClick={() => setOpenStep(1)}
                                className="px-5 py-3 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <ChevronLeft size={14} /> Previous Step
                            </button>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSaveDraft}
                                    className="px-5 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <FileText size={16} /> Save as Draft
                                </button>
                                <button
                                    onClick={() => {
                                        setIsStep2Completed(true);
                                        setOpenStep(3);
                                    }}
                                    className="px-5 py-3 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3"
                                >
                                    Continue to Financials & Media <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: FINANCIALS & MEDIA */}
                {openStep === 3 && (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2 lg:col-span-1">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Price Unit</p>
                                        <div className="flex gap-2">
                                            {['Sft', 'Acre', 'SqYd'].map(unit => (
                                                <button
                                                    key={unit}
                                                    type="button"
                                                    onClick={() => handleNestedChange('priceDetails', 'priceUnit', unit)}
                                                    className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.priceDetails.priceUnit === unit ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 border-2 border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    {unit}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Price per {formData.priceDetails.priceUnit}</p>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px]">₹</span>
                                            <input
                                                type="text"
                                                value={
                                                    formData.priceDetails.priceUnit === 'Sft' ? formData.priceDetails.pricePerSft :
                                                        formData.priceDetails.priceUnit === 'Acre' ? formData.priceDetails.pricePerAcre :
                                                            formData.priceDetails.pricePerSqYard
                                                }
                                                onChange={(e) => {
                                                    const field = formData.priceDetails.priceUnit === 'Sft' ? 'pricePerSft' :
                                                        formData.priceDetails.priceUnit === 'Acre' ? 'pricePerAcre' :
                                                            'pricePerSqYard';
                                                    handleNestedChange('priceDetails', field, e.target.value);
                                                }}
                                                className="w-full pl-8 pr-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold outline-none transition-all"
                                                placeholder={`Price per ${formData.priceDetails.priceUnit}`}
                                            />
                                        </div>
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
                            <section className="pt-3">
                                <div className="flex items-center gap-2 mb-6">
                                    <Award className="text-emerald-500" size={18} />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Amenities</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {AMENITIES.map(amenity => {
                                        const isSelected = formData.amenities?.includes(amenity);
                                        const Icon = AMENITY_ICONS[amenity] || <Award size={16} />;

                                        return (
                                            <button
                                                key={amenity}
                                                onClick={() => {
                                                    const current = formData.amenities || [];
                                                    handleChange('amenities', isSelected ? current.filter(a => a !== amenity) : [...current, amenity]);
                                                }}
                                                className={`flex flex-row items-center justify-start gap-2 p-1.5 pr-3 rounded-full border transition-all duration-300 active:scale-95 ${isSelected
                                                    ? 'bg-primary/5 border-primary text-primary shadow-sm'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-full transition-colors duration-300 flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    {React.cloneElement(Icon, { size: 14 })}
                                                </div>
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-left leading-tight whitespace-nowrap">{amenity}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Media Section */}
                        <section className="pt-3">
                            <div className="flex items-center gap-2 mb-6">
                                <ImageIcon className="text-blue-500" size={18} />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Media Assets</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Poster Card */}
                                <div className="p-4 border-2 border-slate-100 rounded-2xl bg-white hover:border-slate-200 transition-all flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                                                <ImageIcon size={12} className="text-blue-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Main Poster</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">16:9</span>
                                    </div>
                                    <div
                                        onClick={() => posterRef.current?.click()}
                                        className="h-28 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group"
                                    >
                                        <input type="file" ref={posterRef} className="hidden" onChange={(e) => handleFileChange(e, 'poster', 'media')} />
                                        {formData.media.poster ? (
                                            <img src={formData.media.poster} className="w-full h-full object-cover" alt="Poster" />
                                        ) : (
                                            <>
                                                <Camera size={16} className="text-slate-400 mb-1" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Video Card */}
                                <div className="p-4 border-2 border-slate-100 rounded-2xl bg-white hover:border-slate-200 transition-all flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                                                <Video size={12} className="text-purple-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Property Video</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Max 20MB</span>
                                    </div>
                                    <div
                                        onClick={() => videoRef.current?.click()}
                                        className="h-28 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group"
                                    >
                                        <input type="file" ref={videoRef} className="hidden" accept="video/*" onChange={(e) => handleFileChange(e, 'video', 'media')} />
                                        {formData.media.video ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
                                                <Play size={20} />
                                            </div>
                                        ) : (
                                            <>
                                                <Play size={16} className="text-slate-400 mb-1" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Video Consent */}
                                <div
                                    onClick={() => handleNestedChange('media', 'videoConsent', !formData.media.videoConsent)}
                                    className="col-span-1 md:col-span-2 flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100 group w-fit"
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all ${formData.media.videoConsent ? 'bg-primary' : 'bg-slate-200 group-hover:bg-primary/20'}`}>
                                        <Check size={12} className={formData.media.videoConsent ? 'text-white' : 'text-transparent group-hover:text-primary'} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-600">
                                        I give permission to upload this video to the platform's YouTube Channel and all other Social Media platforms.
                                    </p>
                                </div>

                                {/* Gallery Card */}
                                <div className="p-4 border-2 border-slate-100 rounded-2xl bg-white hover:border-slate-200 transition-all flex flex-col gap-4 col-span-1 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                                                <ImageIcon size={12} className="text-blue-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Property Gallery (Min 5)</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">{formData.media.photos.length} Uploaded</span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {formData.media.photos.map((img, i) => (
                                            <div key={i} className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden relative group shrink-0 shadow-sm border border-slate-200">
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
                                            className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-300 hover:text-primary transition-all shrink-0 bg-slate-50/50"
                                        >
                                            <input type="file" ref={photosRef} className="hidden" multiple onChange={(e) => handleFileChange(e, 'photos', 'media', true)} />
                                            <Plus size={20} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* FINAL STEP: Summary & Submission */}
                        <div className="pt-3 border-t border-slate-100">
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
                                        onClick={() => setOpenStep(2)}
                                        className="flex-1 md:flex-none px-8 py-4 border bg-red-800 border-slate-800 text-white hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSaveDraft}
                                        className="flex-1 md:flex-none px-5 py-4 bg-slate-800 text-white border border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FileText size={16} /> Save Draft
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

            {/* Previous Project Entry Modal */}
            <Modal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                title={editingProjectIndex !== null ? "Edit Previous Project" : "Add Previous Project"}
                size="lg"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Project Name</p>
                            <input
                                type="text"
                                value={currentProject.name}
                                onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="e.g. Skyline Residency"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Location (City, State)</p>
                            <input
                                type="text"
                                value={currentProject.location}
                                onChange={(e) => setCurrentProject(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="e.g. Banjara Hills, Hyderabad"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Type of Project</p>
                            <select
                                value={currentProject.type}
                                onChange={(e) => setCurrentProject(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-800 focus:border-primary focus:bg-slate-50 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                {PROJECT_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Project Image</p>
                            <div
                                onClick={() => document.getElementById('projectImageInput').click()}
                                className="h-11 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-white hover:border-primary/50 transition-all relative overflow-hidden"
                            >
                                <input id="projectImageInput" type="file" className="hidden" accept="image/*" onChange={handleProjectImageChange} />
                                {currentProject.image ? (
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                        <CheckCircle size={14} /> Image Selected
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <ImageIcon size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Upload Project Image</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {currentProject.image && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50">
                            <img src={currentProject.image} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={() => setCurrentProject(prev => ({ ...prev, image: null }))}
                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                            onClick={() => setShowProjectModal(false)}
                            className="px-6 py-3 border-2 border-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveProject}
                            disabled={!currentProject.name || !currentProject.location}
                            className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                        >
                            {editingProjectIndex !== null ? "Update Project" : "Add Project"}
                        </button>
                    </div>
                </div>
            </Modal>

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
