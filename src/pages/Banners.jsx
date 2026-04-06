import React, { useState } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, X, Image as ImageIcon, ExternalLink, Globe, Smartphone, Monitor, ChevronDown, Eye, Edit2, Calendar, Layout, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { bannersData } from '../data/mockData';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';

export default function Banners() {
    const [banners, setBanners] = useState(bannersData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [imageUploadMethod, setImageUploadMethod] = useState('url');

    const filteredBanners = banners.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.screen.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleToggleStatus = (id) => {
        setBanners(prev => prev.map(b =>
            b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b
        ));
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        <span className="text-primary/80">Management</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span>Banners</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Banner Management</h2>
                </div>
                <button
                    onClick={() => {
                        setSelectedBanner({ name: '', screen: 'Home Screen', status: 'Active', platform: 'Both', description: '', image: '' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95"
                >
                    <Plus size={16} />
                    Add New Banner
                </button>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or target screen..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        className="flex-1 md:flex-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 focus:outline-none cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active Only</option>
                        <option value="Inactive">Inactive/Draft</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBanners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-primary/20 transition-all group overflow-hidden flex flex-col">
                        {/* Preview Area */}
                        <div className="relative aspect-[21/9] bg-slate-100 overflow-hidden">
                            <img
                                src={banner.image}
                                alt={banner.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 right-4 z-10">
                                <Badge variant={banner.status === 'Active' ? 'green' : 'slate'} className="shadow-lg backdrop-blur-md bg-white/90">
                                    {banner.status}
                                </Badge>
                            </div>
                            <div className="absolute top-4 left-4 flex gap-2">
                                {(banner.platform === 'Web' || banner.platform === 'Both') && (
                                    <div className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-white/20 text-slate-600 transition-all hover:text-primary group/icon" title="Web Platform">
                                        <Monitor size={12} className="group-hover/icon:scale-110 transition-transform" />
                                    </div>
                                )}
                                {(banner.platform === 'Mobile' || banner.platform === 'Both') && (
                                    <div className="p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-white/20 text-slate-600 transition-all hover:text-primary group/icon" title="Mobile Platform">
                                        <Smartphone size={12} className="group-hover/icon:scale-110 transition-transform" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Banner Metadata */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-[8px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
                                    <Layout size={10} /> {banner.screen}
                                </div>
                                <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{banner.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 tabular-nums">ID: {banner.id}</p>
                            </div>

                            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-1 line-clamp-2">
                                {banner.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Calendar size={12} className="text-slate-300" /> {banner.date}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleToggleStatus(banner.id)}
                                        className={`btn-action ${banner.status === 'Active' ? 'btn-action-reject' : 'btn-action-approve'}`}
                                        title={banner.status === 'Active' ? 'Deactivate' : 'Activate'}
                                    >
                                        {banner.status === 'Active' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                    </button>
                                    <button
                                        className="btn-action btn-action-edit"
                                        onClick={() => {
                                            setSelectedBanner(banner);
                                            setIsModalOpen(true);
                                        }}
                                        title="Edit"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        className="btn-action btn-action-reject"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredBanners.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon size={48} className="mb-4 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">No banners found</p>
                    </div>
                )}
            </div>

            {/* Configuration Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedBanner?.id ? 'Edit Banner' : 'Add New Banner'}
                size="md"
            >
                <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="form-label">Banner Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={selectedBanner?.name || ''}
                                onChange={e => setSelectedBanner(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter banner name"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select
                                label="Visible on Screen"
                                value={selectedBanner?.screen || 'Home Screen'}
                                onChange={e => setSelectedBanner(prev => ({ ...prev, screen: e.target.value }))}
                                options={['Home Screen', 'Property Listings', 'User Dashboard', 'Premium Signup']}
                                placeholder={null}
                            />
                            <Select
                                label="Platform"
                                value={selectedBanner?.platform || 'Both'}
                                onChange={e => setSelectedBanner(prev => ({ ...prev, platform: e.target.value }))}
                                options={[
                                    { value: 'Web', label: 'Web Only' },
                                    { value: 'Mobile', label: 'Mobile Only' },
                                    { value: 'Both', label: 'Both (Web & Mobile)' }
                                ]}
                                placeholder={null}
                            />
                        </div>

                        <Select
                            label="Status"
                            value={selectedBanner?.status || 'Active'}
                            onChange={e => setSelectedBanner(prev => ({ ...prev, status: e.target.value }))}
                            options={['Active', 'Inactive']}
                            placeholder={null}
                        />

                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input min-h-[100px] resize-none"
                                value={selectedBanner?.description || ''}
                                onChange={e => setSelectedBanner(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter banner description"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="form-label !mb-0">Image Source</label>
                                <div className="flex bg-slate-100/80 rounded-lg p-0.5 gap-1">
                                    <button type="button" onClick={() => setImageUploadMethod('url')} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${imageUploadMethod === 'url' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}>Link</button>
                                    <button type="button" onClick={() => setImageUploadMethod('file')} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${imageUploadMethod === 'file' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}>Upload</button>
                                </div>
                            </div>
                            {imageUploadMethod === 'url' ? (
                                <div className="relative group">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="text"
                                        className="form-input pl-12"
                                        value={selectedBanner?.image || ''}
                                        onChange={e => setSelectedBanner(prev => ({ ...prev, image: e.target.value }))}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files[0]) {
                                            const url = URL.createObjectURL(e.target.files[0]);
                                            setSelectedBanner(prev => ({ ...prev, image: url }));
                                        }
                                    }}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:transition-all outline-none"
                                />
                            )}
                            {/* Preview */}
                            {selectedBanner?.image && (
                                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                                    <img src={selectedBanner.image} alt="Preview" className="h-40 w-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 bg-white rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">Cancel</button>
                        <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95">
                            {selectedBanner?.id ? 'Save Changes' : 'Add Banner'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div >
    );
}
