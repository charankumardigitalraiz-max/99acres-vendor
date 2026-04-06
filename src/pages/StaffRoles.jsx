import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Shield, Plus, Edit2, Trash2, CheckSquare, Square } from 'lucide-react';
import Modal from '../components/ui/Modal';
import DeleteModel from '../components/model/DeleteModel';
import { addRoles, updaterole, deleteRole } from '../features/staff/roleSlice';

const AVAILABLE_PERMISSIONS = [
  'Full Access', 'User Management', 'Financials', 'System Settings',
  'Content Approval', 'User Support', 'Review Moderation',
  'Subscription Management', 'Lead Tracking', 'Reports Access',
  'Ticket Handling', 'User Communication'
];

export default function StaffRoles() {
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.roles);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ id: null, name: '', members: 0, permissions: [] });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const handleAddRole = () => {
    setModalMode('add');
    setFormData({ id: null, name: '', members: 0, permissions: [] });
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    setModalMode('edit');
    setFormData({ ...role });
    setIsModalOpen(true);
  };

  const handleDeleteRole = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      dispatch(deleteRole({ id: roleToDelete.id }));
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleTogglePermission = (perm) => {
    setFormData(prev => {
      const isSelected = prev.permissions.includes(perm);
      if (isSelected) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== perm) };
      } else {
        return { ...prev, permissions: [...prev.permissions, perm] };
      }
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      dispatch(addRoles(formData));
    } else {
      dispatch(updaterole(formData));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
            <span className="text-primary">Staff Management</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Role Permissions</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Roles</h2>
        </div>
        <button onClick={handleAddRole} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95">
          <Plus size={16} />
          Add New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-[790px]:grid-cols-2 lg:grid-cols-2 gap-8">
        {roles.map((role) => {
          const displayPermissions = role.permissions.slice(0, 6);
          const hiddenCount = role.permissions.length - displayPermissions.length;

          return (
            <div key={role.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:border-primary/20 transition-all flex flex-col hover:shadow-xl hover:shadow-slate-200/40">
              <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Shield size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate tracking-tight">{role.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{role.members} Staff Members</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="btn-action btn-action-view"
                    title="Edit Role"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role)}
                    className="btn-action btn-action-reject"
                    title="Delete Role"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="px-6 py-5 flex-1 bg-white">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Permissions</p>
                <div className="flex flex-wrap gap-1.5">
                  {displayPermissions.map((perm, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      {perm}
                    </span>
                  ))}
                  {hiddenCount > 0 && (
                    <span className="px-2.5 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm">
                      +{hiddenCount} More
                    </span>
                  )}
                </div>
              </div>
              {/* <div className="px-6 py-3.5 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1.5">
                  Manage Access <Plus size={10} strokeWidth={3} />
                </button>
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest tabular-nums italic">Entity Level: Global</span>
              </div> */}
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Role' : 'Edit Role'} size="md">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="form-label">Role Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="e.g. Manager" />
          </div>
          <div>
            <label className="form-label mb-3">System-wide Permissions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-[300px] overflow-y-auto shadow-inner">
              {AVAILABLE_PERMISSIONS.map(perm => {
                const isSelected = formData.permissions.includes(perm);
                return (
                  <label key={perm} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-white border-primary/40 shadow-sm' : 'bg-transparent border-transparent hover:bg-white/50'
                    }`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => handleTogglePermission(perm)}
                    />
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white border border-slate-200'
                      }`}>
                      {isSelected && <CheckSquare size={12} />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {perm}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 bg-white rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Discard</button>
            <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95">
              {modalMode === 'add' ? 'Save Role' : 'Update Role'}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteModel
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteRole}
        itemType="role"
        itemName={roleToDelete?.name}
      />
    </div>
  );
}
