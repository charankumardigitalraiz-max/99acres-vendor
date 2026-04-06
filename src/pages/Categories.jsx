import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredCategories, setStatusFilter, addCategory, updateCategory, deleteCategory } from '../features/categories/categorySlice';
import { Plus, Edit2, Trash2, Eye, LayoutGrid, CheckCircle, XCircle } from 'lucide-react';
import Switch from "react-switch";
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import DeleteModel from '../components/model/DeleteModel';

export default function Categories() {
    const categories = useSelector(selectFilteredCategories);
    const { statusFilter, categories: allCategories } = useSelector(state => state.categories);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [formData, setFormData] = useState({ id: null, name: '', slug: '', description: '', image: '', status: 'Active' });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageUploadMethod, setImageUploadMethod] = useState('url'); // 'url' or 'file'

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ id: null, name: '', slug: '', description: '', image: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setModalMode('edit');
        setFormData(category);
        setIsModalOpen(true);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = (id) => {
        dispatch(deleteCategory(id));
        setIsDeleteModalOpen(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
        };

        if (modalMode === 'add') {
            dispatch(addCategory(finalData));
        } else {
            dispatch(updateCategory(finalData));
        }
        setIsModalOpen(false);
    };


    const toggleStatus = (id) => {
        const categoriesData = categories.find(c => c.id === id);
        const staus = { id, status: categories.find(c => c.id === id).status === 'Active' ? 'Inactive' : 'Active' };
        dispatch(updateCategory({ ...categoriesData, ...staus }))
        // dispatch()

    };

    const counts = {
        all: allCategories.length,
        active: allCategories.filter(c => c.status === 'Active').length,
        inactive: allCategories.filter(c => c.status === 'Inactive').length,
    };



    return (
        <div className="space-y-6 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">
                        <span>Admin</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-primary/80">Categories</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h2>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95">
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {/* Premium KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: 'Total Categories', value: counts.all, icon: LayoutGrid, color: 'slate' },
                    { label: 'Active Categories', value: counts.active, icon: CheckCircle, color: 'emerald' },
                    { label: 'Inactive Categories', value: counts.inactive, icon: XCircle, color: 'rose' },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm group hover:border-primary/30 transition-all cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 mb-4 group-hover:scale-110 transition-transform`}>
                            <s.icon size={16} className='text-primary' />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                        <p className="text-xl font-bold text-slate-900 tabular-nums leading-none">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-full sm:w-fit shadow-sm">
                {['All', 'Active', 'Inactive'].map(status => (
                    <button
                        key={status}
                        onClick={() => dispatch(setStatusFilter(status))}
                        className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === status
                            ? 'bg-white text-primary shadow-sm border border-slate-100'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group flex flex-col hover:border-primary/20 transition-all">
                        {/* Image Banner */}
                        <div className="relative h-44 overflow-hidden bg-slate-100 border-b border-slate-100">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            <div className="absolute top-4 right-4 z-10">
                                <Badge variant={category.status === 'Active' ? 'green' : 'slate'} className="shadow-lg backdrop-blur-md bg-white">
                                    {category.status}
                                </Badge>
                            </div>
                            <div className="absolute top-4 left-4 z-10">
                                <Switch
                                    checked={category.status === 'Active'}
                                    onChange={() => toggleStatus(category.id)}
                                    onColor="#22c55e"
                                    offColor="#94a3b8"
                                    onHandleColor="#fff"
                                    offHandleColor="#fff"
                                    handleDiameter={20}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    className="react-switch"
                                    id="normal-switch"
                                />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-1 shadow-sm">{category.name}</h2>
                                <p className="text-[9px] font-bold text-white/80 uppercase tracking-widest shadow-sm">/{category.slug}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6 flex-1 line-clamp-2">
                                {category.description}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                <button className="btn-action btn-action-view" title="View Properties">
                                    <Eye size={14} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEditModal(category)} className="btn-action btn-action-edit" title="Edit Category">
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(category)}
                                        className="btn-action btn-action-reject"
                                        title="Delete Category"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                        <LayoutGrid size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">No categories found</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1 max-w-sm">No categories match the current filter criteria.</p>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Category' : 'Edit Category'} size="md">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="form-label">Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="e.g. Penthouse" />
                        </div>
                        <div>
                            <label className="form-label">Slug</label>
                            <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="form-input" placeholder="Auto-generated if empty" />
                        </div>
                    </div>
                    <div>
                        <label className="form-label">Description</label>
                        <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input resize-none min-h-[100px]" placeholder="Category description..." />
                    </div>

                    {/* Image Upload Selector */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="form-label !mb-0">Image Source</label>
                            <div className="flex bg-slate-100/80 rounded-lg p-0.5 gap-1">
                                <button type="button" onClick={() => setImageUploadMethod('url')} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${imageUploadMethod === 'url' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}>Link</button>
                                <button type="button" onClick={() => setImageUploadMethod('file')} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${imageUploadMethod === 'file' ? 'bg-white shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}>Upload</button>
                            </div>
                        </div>
                        {imageUploadMethod === 'url' ? (
                            <input type="url" required value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="form-input" placeholder="https://..." />
                        ) : (
                            <input type="file" accept="image/*" onChange={e => { if (e.target.files[0]) setFormData({ ...formData, image: URL.createObjectURL(e.target.files[0]) }) }} className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary/5 file:text-primary hover:file:bg-primary/10 file:transition-all outline-none" />
                        )}
                        {/* Image Preview */}
                        {formData.image && (
                            <div className="mt-3">
                                <img src={formData.image} alt="Preview" className="h-20 w-32 object-cover rounded-xl border border-slate-200 shadow-sm" />
                            </div>
                        )}
                    </div>

                    <Select
                        label="Status"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        options={['Active', 'Inactive']}
                        placeholder={null}
                    />
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 flex-1 md:flex-none border border-border bg-white rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 flex-1 md:flex-none bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/30">
                            {modalMode === 'add' ? 'Create' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </Modal>




            <DeleteModel
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDelete(selectedCategory?.id)}
                itemType="Category"
                title="Delete Category"
                itemName={selectedCategory?.name}
            />
        </div>
    );
}
