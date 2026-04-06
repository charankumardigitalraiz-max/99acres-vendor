import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearch, setRoleFilter, setStatusFilter, setPage,
  updateUserStatus, selectFilteredUsers
} from '../features/users/usersSlice';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, UserX, UserCheck, MapPin, Phone, Mail, Activity, Calendar, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const roles = ['All', 'Buyer', 'Seller', 'Agent'];
const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

export default function Customers() {
  const dispatch = useDispatch();
  const { role } = useParams();
  const { searchQuery, roleFilter, statusFilter, currentPage, pageSize } = useSelector(s => s.users);
  const filtered = useSelector(selectFilteredUsers);
  const [viewUser, setViewUser] = useState(null);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const navigate = useNavigate();



  const usertypeBadge = (r) => {
    if (r === 'Agent') return 'bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm font-bold uppercase tracking-widest text-[9px]';
    if (r === 'Seller') return 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm font-bold uppercase tracking-widest text-[9px]';
    if (r === 'Buyer') return 'bg-violet-50 text-violet-600 border border-violet-100 shadow-sm font-bold uppercase tracking-widest text-[9px]';
    return 'bg-slate-50 text-slate-500 border border-slate-100 shadow-sm font-bold uppercase tracking-widest text-[9px]';
  };

  useEffect(() => {
    if (role) {
      const formattedRole = role.charAt(0).toUpperCase() + role.slice(1, -1);
      dispatch(setRoleFilter(formattedRole));
    } else {
      dispatch(setRoleFilter('All'));
    }
  }, [role, dispatch]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{role || 'Customers'}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{filtered.length} total active users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-100 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
          <Download size={13} /> Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="card card-body flex flex-wrap items-center gap-4 bg-slate-50/30 border-slate-100/50">
        {/* Search */}
        <div className="relative flex-1 min-w-48 group">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-transparent rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search by name, email or city..."
            value={searchQuery}
            onChange={e => dispatch(setSearch(e.target.value))}
          />
        </div>

        {/* Role Filter */}
        {/* <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-slate-400" />
          <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => dispatch(setRoleFilter(r))}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${roleFilter === r ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div> */}

        {/* Status Filter */}
        <select
          className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-transparent rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer uppercase tracking-widest"
          value={statusFilter}
          onChange={e => dispatch(setStatusFilter(e.target.value))}
        >
          {statuses.map(s => <option key={s}>{s.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Role</th>
                <th>Properties</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(user => (
                <tr key={user.id}>
                  <td className="text-slate-500">{user.id}</td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={user.avatar} size="sm" />
                      <span className="font-medium text-slate-800 text-xs">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-slate-500">{user.email}</td>
                  <td className="text-slate-500">{user.phone}</td>
                  <td>{user.city}</td>
                  <td>
                    <span className={`text-xs font-medium ${usertypeBadge(user.role)} px-2 py-0.5 rounded-full `}>{user.role}</span>
                  </td>
                  <td className="text-center font-medium">{user.properties}</td>
                  <td className="text-slate-500 text-xs">{user.joined}</td>
                  <td><Badge>{user.status}</Badge></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          //  handleView(user)
                          navigate(`/customerDetails/${user.id}`)
                        }
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="View"
                      >
                        <Eye size={13} />
                      </button>
                      {user.status !== 'Suspended' ? (
                        <button
                          onClick={() => dispatch(updateUserStatus({ id: user.id, status: 'Suspended' }))}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Suspend"
                        >
                          <UserX size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => dispatch(updateUserStatus({ id: user.id, status: 'Active' }))}
                          className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Activate"
                        >
                          <UserCheck size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-sm">No users found</td>
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
    </div>
  );
}
