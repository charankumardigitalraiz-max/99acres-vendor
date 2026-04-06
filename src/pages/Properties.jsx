import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearch, setTypeFilter, setStatusFilter, setCityFilter,
  setPage, setSelectedProperty, updatePropertyStatus, selectFilteredProperties
} from '../features/products/productsSlice';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, CheckCircle, XCircle, Building2, MapPin } from 'lucide-react';

const types = ['All', 'villas', 'home', 'plots', 'flats', 'commercial', 'independent house', 'Appartments', 'Lands', 'other'];
const statuses = ['All', 'Active', 'Pending', 'Rejected'];
const cities = ['All', 'Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Chennai'];

const typeColors = {
  villas: 'bg-emerald-50 text-emerald-600',
  home: 'bg-blue-50 text-blue-600',
  plots: 'bg-amber-50 text-amber-600',
  flats: 'bg-violet-50 text-violet-600',
  commercial: 'bg-rose-50 text-rose-600',
  'independent house': 'bg-indigo-50 text-indigo-600',
  Appartments: 'bg-sky-50 text-sky-600',
  Lands: 'bg-orange-50 text-orange-600',
  other: 'bg-slate-50 text-slate-600',
};

export default function Properties() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchQuery, typeFilter, statusFilter, cityFilter, currentPage, pageSize } = useSelector(s => s.products);
  const filtered = useSelector(selectFilteredProperties);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const counts = {
    all: filtered.length,
    active: filtered.filter(p => p.status === 'Active').length,
    pending: filtered.filter(p => p.status === 'Pending').length,
    rejected: filtered.filter(p => p.status === 'Rejected').length,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Properties</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Listings Management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-100 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm">
          <Download size={13} /> Export Listings
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Listings', value: counts.all, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
          { label: 'Active', value: counts.active, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Pending', value: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Rejected', value: counts.rejected, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-opacity-50 flex flex-col items-center justify-center shadow-sm`}>
            <p className={`text-2xl font-black ${s.color} tracking-tight`}>{s.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card card-body flex flex-wrap gap-4 items-center bg-slate-50/30 border-slate-100/50">
        <div className="relative flex-1 min-w-48 group">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-transparent rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            placeholder="Search property or uploader..."
            value={searchQuery}
            onChange={e => dispatch(setSearch(e.target.value))}
          />
        </div>

        <div className="flex flex-wrap bg-white border border-slate-100 rounded-xl p-1 gap-1 w-full xl:w-auto shadow-sm">
          {types.map(t => (
            <button
              key={t}
              onClick={() => dispatch(setTypeFilter(t))}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] rounded-lg font-bold uppercase tracking-wider transition-all whitespace-nowrap ${typeFilter === t ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2.5 text-[10px] font-bold text-slate-600 bg-white border border-transparent shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer uppercase tracking-widest"
            value={statusFilter}
            onChange={e => dispatch(setStatusFilter(e.target.value))}
          >
            {statuses.map(s => <option key={s}>{s.toUpperCase()}</option>)}
          </select>

          <select
            className="px-4 py-2.5 text-[10px] font-bold text-slate-600 bg-white border border-transparent shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer uppercase tracking-widest"
            value={cityFilter}
            onChange={e => dispatch(setCityFilter(e.target.value))}
          >
            {cities.map(c => <option key={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>City</th>
                <th>Area</th>
                <th>Price</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(prop => (
                <tr key={prop.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Building2 size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-xs leading-tight">{prop.title}</p>
                        {prop.bedrooms && <p className="text-2xs text-slate-400">{prop.bedrooms} BHK</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-opacity-30 ${typeColors[prop.type] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {prop.type}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <MapPin size={11} className="text-slate-400" />
                      <span className="text-xs">{prop.city}</span>
                    </div>
                  </td>
                  <td className="text-slate-500 text-xs">{prop.area}</td>
                  <td className="font-semibold text-slate-800 text-xs">{prop.price}</td>
                  <td className="text-slate-600 text-xs">{prop.uploadedBy}</td>
                  <td className="text-slate-400 text-xs">{prop.date}</td>
                  <td><Badge>{prop.status}</Badge></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/property/${prop.id}`)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="View Details"
                      >
                        <Eye size={13} />
                      </button>
                      {prop.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => dispatch(updatePropertyStatus({ id: prop.id, status: 'Active' }))}
                            className="p-1.5 rounded-md hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={13} />
                          </button>
                          <button
                            onClick={() => dispatch(updatePropertyStatus({ id: prop.id, status: 'Rejected' }))}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400 text-sm">
                    No properties found
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
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-30 transition-colors"
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
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
