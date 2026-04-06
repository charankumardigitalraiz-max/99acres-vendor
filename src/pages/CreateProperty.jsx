import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addProperty } from '../features/products/productsSlice';
import PropertyCreateForm from '../components/ui/PropertyCreateForm';
import { ChevronLeft, Building2 } from 'lucide-react';

export default function CreateProperty() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (data) => {
        dispatch(addProperty(data));
        navigate('/products');
    };

    const handleCancel = () => {
        navigate('/products');
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCancel}
                        className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-primary/30 hover:bg-slate-50 text-slate-500 hover:text-primary transition-all shadow-sm"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                            <span>Seller</span>
                            <span className="text-slate-200">/</span>
                            <span>Properties</span>
                            <span className="text-slate-200">/</span>
                            <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md tracking-normal">New Listing</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            Add Property Listing
                        </h2>
                    </div>
                </div>
                {/* <div className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-200">
                    <Building2 size={14} className="text-primary" /> Multi-Step Verification Mode
                </div> */}
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <PropertyCreateForm
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
}
