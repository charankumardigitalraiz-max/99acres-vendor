import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearch, setRoleFilter, setStatusFilter, setPage,
  setSelectedUser, updateUserStatus, selectFilteredUsers
} from '../features/users/usersSlice';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, UserX, UserCheck, MapPin, Phone, Mail, Activity, Calendar, Building2, TrendingUp, Users as UsersIcon, XCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const roles = ['All', 'Buyer', 'Seller', 'Agent'];
const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

export default function Users() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState([]);
  const users = useSelector((state) => state.users.list)
  const { role } = useParams();
  const { searchQuery, roleFilter, statusFilter, currentPage, pageSize, selectedUser } = useSelector(s => s.users);
  const filtered = useSelector(selectFilteredUsers);
  const [viewUser, setViewUser] = useState(null);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handleView = (user) => setViewUser(user);
  const navigate = useNavigate();




  useEffect(() => {
    if (role) {
      // Capitalize first letter to match data (e.g., 'agent' -> 'Agent')
      const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
      dispatch(setRoleFilter(formattedRole));
    } else {
      dispatch(setRoleFilter('All'));
    }
  }, [role, dispatch]);

  const isSellerOrAgent = roleFilter === 'Seller' || roleFilter === 'Agent';

  const usertypeBadge = (role) => {
    if (role === 'Agent') return 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm';
    if (role === 'Seller') return 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm';
    if (role === 'Buyer') return 'bg-purple-50 text-purple-600 border border-purple-200 shadow-sm';
    return 'bg-slate-50 text-slate-600 border border-slate-200 shadow-sm';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">
            <span>Admin</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-primary/80">User Management</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{role ? role.toUpperCase() : 'ALL'} CUSTOMERS</h2>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:shadow-md transition-all active:scale-95 shadow-sm">
          <Download size={14} className="text-primary" /> Export Data
        </button>
      </div>

      {/* Premium KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: UsersIcon, color: 'slate' },
          { label: 'Active Users', value: users.filter(u => u.status === 'Active').length, icon: Activity, color: 'emerald' },
          { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'primary' },
          { label: 'Suspended Users', value: users.filter(u => u.status === 'Suspended').length, icon: UserX, iconColor: 'rose' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm group hover:border-primary/30 transition-all cursor-pointer">
            <div className={`w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-${s.iconColor ? s.iconColor + '-500' : 'slate-500'} mb-4 group-hover:scale-110 transition-transform`}>
              <s.icon size={16} className='text-primary' />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Modern Filter Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            placeholder="Search by name, email or city..."
            value={searchQuery}
            onChange={e => dispatch(setSearch(e.target.value))}
          />
        </div>

        <div className="flex items-center gap-4">
          {isSellerOrAgent && (
            <div className="w-40">
              <Select
                value={roleFilter}
                onChange={e => dispatch(setRoleFilter(e.target.value))}
                options={isSellerOrAgent ? ['Seller', 'Agent'] : ['All', 'Agent', 'Seller', 'Buyer']}
                placeholder="Filter Role"
              />
            </div>
          )}

          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={e => dispatch(setStatusFilter(e.target.value))}
              options={statuses}
              placeholder="Filter Status"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Intelligence Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Role</th>
                <th style={{ display: roleFilter === "Buyer" ? 'none' : 'table-cell' }}>Properties</th>
                <th>Joined</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(user => (
                <tr key={user.id}>
                  <td>
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">#{user.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar initials={user.avatar} size="sm" className="shadow-sm border border-white ring-1 ring-slate-100" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors leading-none">{user.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold tracking-tight mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Phone size={10} className="text-primary/50" />
                      <span className="text-[11px] font-bold text-slate-600">{user.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <MapPin size={10} className="text-primary/50" />
                      <span className="text-xs font-bold text-slate-600">{user.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border shadow-sm ${usertypeBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td
                    className="px-6 py-5 text-center"
                    style={{ display: roleFilter === "Buyer" ? 'none' : 'table-cell' }}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 shadow-inner">
                        {user.properties}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Properties</span>
                    </div>
                  </td>
                  <td>
                    <p className="text-[10px] font-bold text-slate-500 tabular-nums">{user.joined}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <Badge variant={user.status === 'Active' ? 'green' : user.status === 'Suspended' ? 'red' : 'amber'} className="text-[8px] font-bold uppercase tracking-widest px-3 py-1 shadow-sm">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/customers/details/${user.id}`)}
                        className="btn-action btn-action-view"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      {user.status !== 'Suspended' ? (
                        <button
                          onClick={() => dispatch(updateUserStatus({ id: user.id, status: 'Suspended' }))}
                          className="btn-action btn-action-reject"
                          title="Suspend User"
                        >
                          <XCircle size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => dispatch(updateUserStatus({ id: user.id, status: 'Active' }))}
                          className="btn-action btn-action-approve"
                          title="Activate User"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <UsersIcon size={32} className="mb-4 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest">No Users Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-slate-500">
            Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(setPage(currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => dispatch(setPage(p))}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${p === currentPage ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => dispatch(setPage(currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details" size="md">
        {viewUser && (
          <div className="space-y-6">
            {/* 1. Header Section */}
            <div className="flex items-start gap-4 pb-4 border-b border-border">
              <Avatar initials={viewUser.avatar} size="xl" />
              <div className="flex-1 mt-1">
                <p className="text-lg font-bold text-slate-800 leading-tight">{viewUser.name}</p>
                <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                  <Mail size={12} />
                  <p className="text-xs">{viewUser.email}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge>{viewUser.status}</Badge>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-border/60">
                    {viewUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-border/50 flex items-center justify-center text-slate-400 shadow-sm">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Joined Date</p>
                  <p className="text-sm font-semibold text-slate-800">{viewUser.joined}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-border/50 flex items-center justify-center text-slate-400 shadow-sm">
                  <Building2 size={14} />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Listed Properties</p>
                  <p className="text-sm font-semibold text-slate-800">{viewUser.properties}</p>
                </div>
              </div>
            </div>

            {/* 3. Contact Numbers */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2 border-b border-border pb-1.5 flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" /> Contact Numbers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Primary Mobile</p>
                  <p className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-border/40 inline-block w-full">{viewUser.phone}</p>
                </div>
                {viewUser.altPhone && (
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Alt Mobile</p>
                    <p className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-border/40 inline-block w-full">{viewUser.altPhone}</p>
                  </div>
                )}
                {viewUser.landline && (
                  <div className="flex flex-col gap-0.5 sm:col-span-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Landline</p>
                    <p className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-border/40 inline-block w-full sm:w-1/2">{viewUser.landline}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Complete Address */}
            {viewUser.address && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2 border-b border-border pb-1.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" /> Address Location
                </h4>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-border/60 mt-3">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-border/40 text-primary">
                      <MapPin size={12} />
                    </div>
                    <div className="space-y-1 mt-0.5">
                      <div className="flex gap-2 text-xs font-bold text-slate-700">
                        <span>{viewUser.address.city}</span>
                        <span className="text-slate-300">•</span>
                        <span>{viewUser.address.location}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{viewUser.address.fullAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. User Activity Timeline */}
            {viewUser.activity && viewUser.activity.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-border pb-1.5 flex items-center gap-1.5">
                  <Activity size={13} className="text-slate-400" /> Activity History
                </h4>
                <div className="space-y-4 px-2 max-h-40 overflow-y-auto">
                  {viewUser.activity.map((act, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 p-1.5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center z-10">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                        {index < viewUser.activity.length - 1 && <div className="w-px h-full bg-border -mt-1 -mb-3" />}
                      </div>
                      <div className="-mt-1 flex-1 pb-2">
                        <p className="text-[11px] font-bold text-slate-700">{act.action}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 shadow-sm">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex justify-end gap-2 pt-3 border-t border-border mt-2">
              <button onClick={() => setViewUser(null)} className="btn-secondary text-xs px-4">Cancel</button>
              <button className="btn-primary text-xs px-4 shadow-md">Message User</button>
            </div>
          </div>
        )}
      </Modal>
    </div >
  );
}
