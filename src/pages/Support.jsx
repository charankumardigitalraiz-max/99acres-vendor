import { useNavigate } from 'react-router-dom';
import { supportTickets } from '../data/mockData';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { Search, Filter, MessageCircle, Clock, CheckCircle2, AlertCircle, Eye, Activity, Timer } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Select from '../components/ui/Select';
import { selectFilteredTickets, setStatusFilter, setCategoryFilter, setPriorityFilter } from '../features/support/supportSlice';

export default function Support() {
  const navigate = useNavigate();
  const tickets = useSelector(selectFilteredTickets);
  const dispatch = useDispatch();
  const { statusFilter, priorityFilter } = useSelector((state) => state.tickets);
  const stats = [
    { id: 1, label: 'Open Tickets', value: '12', change: '+2', trend: 'up', Icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 2, label: 'In Progress', value: '5', change: '-1', trend: 'down', Icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, label: 'Resolved Today', value: '18', change: '+4', trend: 'up', Icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 4, label: 'Avg Response Time', value: '2.4h', change: '-15%', trend: 'down', Icon: Timer, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'badge-red';
      case 'Medium': return 'badge-amber';
      case 'Low': return 'badge-blue';
      default: return 'badge-slate';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle size={14} className="text-blue-500" />;
      case 'In Progress': return <Clock size={14} className="text-amber-500" />;
      case 'Closed': return <CheckCircle2 size={14} className="text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            <span className="text-primary/80">Support</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>Tickets</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Support Overview</h2>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95">
          <MessageCircle size={14} />
          New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm group hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.Icon size={16} className={stat.color} />
              </div>
              <div className={`text-[10px] font-bold px-2.5 py-1 rounded-md border shadow-sm ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-500 bg-rose-50 border-rose-100'
                }`}>
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums leading-none tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search support tickets..."
              className="form-input pl-11"
            />
          </div>
          <div className="w-40">
            <Select
              value={priorityFilter}
              onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
              options={['All', 'High', 'Medium', 'Low']}
              placeholder="Priority"
            />
          </div>
          <div className="w-40">
            <Select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              options={['All', 'Open', 'In Progress', 'Closed']}
              placeholder="Status"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>User</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">#{ticket.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="max-w-[200px] text-sm font-bold text-slate-900 truncate tracking-tight group-hover:text-primary transition-colors" title={ticket.subject}>
                      {ticket.subject}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-600">{ticket.user}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant={ticket.status === 'Open' ? 'blue' : ticket.status === 'In Progress' ? 'amber' : 'green'}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums">{ticket.date}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => navigate(`/support/${ticket.id}`)}
                      className="btn-action btn-action-view"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing {tickets.length} of 24 tickets</p>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-not-allowed shadow-sm" disabled>Previous Page</button>
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}
