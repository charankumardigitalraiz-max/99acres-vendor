import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import { UserPlus, Mail, Edit2, Trash2, Shield, Calendar, Activity } from 'lucide-react';
import { addMember, updateMember, deleteMember, setLoading, setError } from '../features/staff/staffMember';
import Modal from '../components/ui/Modal';
import DeleteModel from '../components/model/DeleteModel';
// import { useSelector } from 'react-redux';

export default function StaffMembers() {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.staff.members);
  const roles = useSelector((state) => state.roles.roles);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ id: null, name: '', role: 'Moderator', email: '', status: 'Active', avatar: '' });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const handleAddMember = () => {
    setModalMode('add');
    setFormData({ id: null, name: '', role: 'Moderator', email: '', status: 'Active', avatar: '' });
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    setModalMode('edit');
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      dispatch(deleteMember({ id: memberToDelete.id }));
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase();
      dispatch(addMember({ ...formData, avatar: initials }));
    } else {
      dispatch(updateMember(formData));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span className="text-primary/80">Command Staff</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Personnel Registry</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Access Directory</h2>
        </div>
        <button onClick={handleAddMember} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95">
          <UserPlus size={16} />
          Authorize Staff
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Staff Member</th>
                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Joined Date</th>
                <th className="px-8 py-5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member) => (
                <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Avatar name={member.name} size="md" className="ring-4 ring-slate-50 shadow-sm" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{member.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest mt-1 uppercase">Hash: {member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 w-fit">
                      <Shield size={12} className="text-primary/60" />
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Mail size={12} className="text-slate-300" />
                      <span className="text-xs">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-400 font-bold tabular-nums">
                      <Calendar size={12} className="text-slate-200" />
                      <span className="text-[10px] uppercase tracking-widest">{member.joined}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="btn-action btn-action-edit"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member)}
                        className="btn-action btn-action-reject"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add Staff Member' : 'Edit Staff Member'} size="md">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Enter full name"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Role"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              options={roles.map(r => ({ value: r.name, label: r.name }))}
              placeholder={null}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Inactive']}
              placeholder={null}
            />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 bg-white rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95">
              {modalMode === 'add' ? 'Add Member' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      <DeleteModel
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteMember}
        itemType="staff member"
        itemName={memberToDelete?.name}
      />
    </div>
  );
}
